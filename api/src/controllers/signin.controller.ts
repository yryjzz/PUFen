import fastify, { FastifyPluginAsync } from "fastify";
import { AppDataSource } from "../config/db";
import { SignInConfig } from "../entities/SignInConfig";
import { SignInRecord } from "../entities/SignInRecord";
import { PointsAccount } from '../entities/PointsAccount';
import { PointsTransaction } from '../entities/PointsTransaction';
import { UserCoupon } from '../entities/UserCoupon';
import { authHook } from "../middleware/auth.hook";

export const signinRoutes: FastifyPluginAsync = async (fastify) => {
    fastify.get(
        '/signin/config',
        {
            preHandler: authHook
        },
        async (req, reply) => {
            const cfg = await AppDataSource.getRepository(SignInConfig).findOne({
                where: {},
                order: { createdAt: 'DESC'}
            });

            if (!cfg) return reply.status(404).send({
                success: false,
                message: '暂无配置'
            });

            reply.send({
                success: true,
                data: cfg
            });
        }
    );
    fastify.get(
        '/signin/status',
        {
            preHandler: authHook
        },
        async (req, reply) => {
            // config
            const userId = req.user!.id;

            const now = new Date();
            now.setHours(0, 0, 0, 0);

            const day = now.getDay();
            const diff = day === 0 ? -6 : 1 - day;
            
            const monday = new Date(now);
            monday.setDate(now.getDate() + diff);
            const sunday = new Date(monday);
            sunday.setDate(monday.getDate() + 6);

            // todaySigned
            const todaySigned = !!(await 
                AppDataSource.getRepository(SignInRecord).findOneBy({
                    userId,
                    signInDate: now
                }));

            // continuousDays
            let continuous = 0;
            let check = new Date(now);
            
            // 如果今天已签到，先加1
            if (todaySigned) {
                continuous = 1;
            }
            
            // 向前检查连续签到
            check.setDate(check.getDate() - 1);
            while (true) {
                const hit = await 
                    AppDataSource.getRepository(SignInRecord).findOneBy({
                        userId,
                        signInDate: check
                    });
                if (!hit) break;
                continuous++;
                check.setDate(check.getDate() - 1);    
            }

            // weekStatus
            const weekStatus = [];
            for (let i = 0; i < 7; i++) {
                const d = new Date(monday);
                d.setDate(monday.getDate() + i);
                const record = await
                    AppDataSource.getRepository(SignInRecord).findOneBy({
                        userId,
                        signInDate: d,
                    });
                const isToday = d.toDateString() === now.toDateString();
                weekStatus.push({
                    date: d.toISOString().slice(0, 10),
                    signed: !!record,
                    points: record?.pointsEarned || 0,
                    isToday,
                });
            }

            reply.send({
                success: true,
                data: {
                    todaySignedIn: todaySigned,
                    continuousDays: continuous,
                    weekStatus,
                }
            });
        }
    );
    fastify.post(
        '/signin',
        {
            preHandler: authHook
        },
        async (req, reply) => {
            // config
            const userId = req.user!.id;
            const today = new Date();

            console.log('当前用户ID:', req.user?.id);
            
            // 已签过
            today.setHours(0, 0, 0, 0);
            const exist = await AppDataSource.getRepository(SignInRecord).findOneBy({
                userId,
                signInDate: today
            });
            if (exist) return reply.status(400).send({
                success: false,
                message: '今日已签到'
            });

            // 获得本周签到配置
            const cfg = await AppDataSource.getRepository(SignInConfig).findOne({
                where: {},
                order: { createdAt: 'DESC' }
            });
            if (!cfg) return reply.status(404).send({
                success: false,
                message: '暂无配置'
            });

            // 计算积分
            const dayKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
            const todayKey = dayKeys[today.getDay()-1];
            
            // 修复周日NaN问题（multipiler = 0)
            const dayOfWeek = today.getDay(); // 0=周日, 1=周一...
            const dayNumber = dayOfWeek === 0 ? 7 : dayOfWeek; // 转换为 1-7
            const multiplier = (cfg as any)[`day${dayNumber}Multiplier`];
            
            // 避免 NaN
            if (typeof multiplier !== 'number' || isNaN(multiplier)) {
                return reply.status(500).send({
                    success: false,
                    message: '签到配置错误，请联系管理员'
                });
            }
            
            const pointsEarned = Math.floor(cfg.basePoints * multiplier);

            let hasBonus = false;
            let bonusCoupon: string | null = null;

            // 计算连续签到天数（包括今天）
            let continuous = 1;
            let check = new Date(today);
            check.setDate(check.getDate() - 1);
            while (true) {
                const hit = await 
                    AppDataSource.getRepository(SignInRecord).findOneBy({
                        userId,
                        signInDate: check
                    });
                if (!hit) break;
                continuous++;
                check.setDate(check.getDate() - 1);    
            }
            
            // 检查是否达到奖励天数
            if (continuous >= cfg.bonusDay) {
                hasBonus = true;
                bonusCoupon = cfg.bonusCoupon;
            }

            // 写记录
            const record = AppDataSource.getRepository(SignInRecord).create({
                userId,
                configId: cfg.id,
                signInDate: today,
                pointsEarned,
            });
            await AppDataSource.getRepository(SignInRecord).save(record);

            // 加积分
            const accountRepo = AppDataSource.getRepository(PointsAccount);
            const account = await accountRepo.findOneBy({ userId });
            if (!account) throw new Error('积分账户不存在');

            const balanceBefore = account.balance;
            account.balance += pointsEarned;
            account.totalEarned += pointsEarned;
            await accountRepo.save(account);
            
            // 加流水
            const txRepo = AppDataSource.getRepository(PointsTransaction);
            await txRepo.save(
                txRepo.create({
                    userId,
                    accountId: (await account).id,
                    amount: pointsEarned,
                    type: 'earn',
                    source: 'signin',
                    relatedId: record.id,
                    description: `${cfg.basePoints}×${multiplier} 签到`,
                    balanceBefore,
                    balanceAfter: (await account).balance
                })
            );
            
            // 发放连续签到奖励券
            if (hasBonus && bonusCoupon) {
                // 解析券信息（例如：满29减4）
                const couponMatch = bonusCoupon.match(/满(\d+)减(\d+)/);
                if (couponMatch) {
                    const minimumAmount = parseInt(couponMatch[1]) * 100; // 转换为分
                    const discountAmount = parseInt(couponMatch[2]) * 100; // 转换为分
                    
                    // 设置券的有效期
                    const expiryDate = new Date();
                    expiryDate.setDate(expiryDate.getDate() + 7);
                    
                    const couponRepo = AppDataSource.getRepository(UserCoupon);
                    await couponRepo.save(
                        couponRepo.create({
                            userId,
                            couponType: bonusCoupon,
                            discountAmount,
                            minimumAmount,
                            status: 'unused',
                            expiryDate,
                            source: 'signin',
                            relatedId: record.id
                        })
                    );
                }
            }

            reply.send({
                success: true,
                data: {
                    pointsEarned,
                    continuousDays: continuous,
                    hasBonus,
                    bonusCoupon,
                },
            });
        }
    );
};