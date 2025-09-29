import { FastifyPluginAsync } from "fastify";
import { authHook } from "../middleware/auth.hook";
import { AppDataSource } from "../config/db";
import { RewardItem } from "../entities/RewardItem";
import { PointsAccount } from "../entities/PointsAccount";
import { PointsTransaction } from "../entities/PointsTransaction";
import { RewardRecord } from "../entities/RewardRecord";
import { UserCoupon } from "../entities/UserCoupon";
import { RewardStageService } from "../services/reward-stage.service";

export const rewardRoutes: FastifyPluginAsync = async (fastify) => {
    fastify.get(
        '/rewards',
        {
            preHandler: authHook
        },
        async (req, reply) => {
            const userId = req.user!.id;
            const { page = 1, limit = 20 } = req.query as {
                page?: number,
                limit?: number
            };
            const pageNum = Number(page);
            const limitNum = Number(limit);

            // 获取当前用户可兑换商品列表
            const repo = AppDataSource.getRepository(RewardItem);
            const [items, total] = await repo.findAndCount({
                where: { userId }, 
                order: { stage: 'ASC', pointsCost: 'ASC' },
                skip: (pageNum - 1) * limitNum,
                take: limitNum
            });

            // 阶段解锁状态
            const stageStatus = await RewardStageService.getUserAvailableStages(userId);
            const stageStats = await RewardStageService.getUserStageStats(userId);

            // 为每个商品添加可兑换状态和锁定信息
            const itemsWithStatus = items.map(item => {
                const isUnlocked = stageStatus.availableStages.includes(item.stage);
                const hasStock = item.stock > 0;
                const canExchange = isUnlocked && hasStock;
                
                let lockReason = null;
                if (!isUnlocked) {
                    lockReason = `需要完成第${item.stage - 1}阶段所有兑换`;
                } else if (!hasStock) {
                    lockReason = '库存不足';
                }

                return {
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    pointsCost: item.pointsCost,
                    couponType: item.couponType,
                    couponValue: item.couponValue,
                    conditionAmount: item.conditionAmount,
                    stock: item.stock,
                    stage: item.stage,
                    isLimited: item.isLimited,
                    isUnlocked,
                    hasStock,
                    canExchange,
                    lockReason,
                    available: canExchange, // 保持向后兼容
                    soldOut: !hasStock      // 保持向后兼容
                };
            });

            reply.send({
                success: true,
                data: {
                    items: itemsWithStatus,
                    stage2Unlocked: stageStatus.stage2Unlocked,
                    availableStages: stageStatus.availableStages,
                    stageStats,
                    pagination: {
                        page: pageNum,
                        limit: limitNum,
                        total,
                        totalPages: Math.ceil(total / limitNum)
                    }
                }
            });
        }
    );

    fastify.post(
        '/rewards/exchange',
        {
            preHandler: authHook
        },
        async (req, reply) => {
            const userId = req.user!.id;
            const { rewardItemId } = req.body as { rewardItemId: string };
            
            // 商品是否存在
            const itemRepo = AppDataSource.getRepository(RewardItem);
            const item = await itemRepo.findOneBy({ id: rewardItemId });
            if (!item || item.stock <= 0) {
                return reply.status(404).send({
                    success: false,
                    message: '商品不存在或告罄'
                });
            }
            
            // 获取积分账户
            const accountRepo = AppDataSource.getRepository(PointsAccount);
            const account = await accountRepo.findOneBy({ userId });
            if (!account) {
                return reply.status(404).send({
                    success: false,
                    message: '积分账户不存在'
                });
            }
            
            if (account.balance < item.pointsCost) {
                return reply.status(400).send({
                    success: false,
                    message: '积分不足'
                });
            }
            
            // 成功兑换 -> 扣积分，加流水
            const balanceBefore = account.balance;
            account.balance -= item.pointsCost;
            account.totalUsed += item.pointsCost;
            await accountRepo.save(account);

            await AppDataSource.getRepository(PointsTransaction).save(
                AppDataSource.getRepository(PointsTransaction).create({
                    userId,
                    accountId: account.id,
                    amount: -item.pointsCost,
                    type: 'use',
                    source: 'reward',
                    relatedId: item.id,
                    description: `${item.pointsCost} 积分兑换 ${item.name}`,
                    balanceBefore,
                    balanceAfter: account.balance,
                })
            );

            //扣库存
            const affected = await itemRepo.decrement({ id: rewardItemId }, 'stock', 1);
            if (affected.affected === 0) {
                return reply.status(409).send({
                    success: false,
                    message: '库存不足，请重试'
                });
            }
            
            // 优惠券couponCode生成
            const couponCode = 'CODE' + Math.random().toString(36).substr(2, 8).toUpperCase();

            // 写兑换记录
            const recordRepo = AppDataSource.getRepository(RewardRecord);
            const record = recordRepo.create({
                userId,
                rewardItemId: item.id,
                pointsCost: item.pointsCost,
                couponCode,
                status: 'active',
            });
            await recordRepo.save(record);

            // 创建用户优惠券记录
            const userCouponRepo = AppDataSource.getRepository(UserCoupon);
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + (item.validityDays || 7)); // 默认7天有效期
            
            const userCoupon = userCouponRepo.create({
                userId,
                couponType: item.couponType,
                discountAmount: item.couponValue * 100, // 转换为分
                minimumAmount: item.conditionAmount * 100, // 转换为分  
                status: 'unused',
                expiryDate,
                source: 'exchange',
                relatedId: record.id
            });
            await userCouponRepo.save(userCoupon);

            // 检查是否需要解锁第二阶段
            console.log('[Debug] 兑换成功，检查阶段解锁状态...');
            const stageStatus = await RewardStageService.checkAndUnlockStage2(userId);
            const updatedStageInfo = await RewardStageService.getUserAvailableStages(userId);
            
            console.log('[Debug] 阶段状态检查结果:', {
                stage2Unlocked: updatedStageInfo.stage2Unlocked,
                stageUnlockMessage: stageStatus.message,
                availableStages: updatedStageInfo.availableStages
            });

            reply.send({
                success: true,
                data: {
                    couponCode,
                    pointsCost: item.pointsCost,
                    newBalance: account.balance,
                    stage2Unlocked: updatedStageInfo.stage2Unlocked,
                    stageUnlockMessage: stageStatus.message,
                    itemSoldOut: item.stock - 1 === 0 // 告知前端该商品是否售完
                },
            });
        });

    fastify.get(
        '/coupons/:couponCode',
        async (req, reply) => {
            const { couponCode } = req.params as {
                couponCode: string
            };

            const record = await AppDataSource.getRepository(RewardRecord)
                .createQueryBuilder('rr')
                .leftJoinAndSelect('rr.rewardItem', 'item')
                .where('rr.couponCode = :code', { code: couponCode })
                .getOne();

            if (!record) {
                return reply.status(404).send({
                    success: false,
                    message: '优惠券不存在'
                });
            }

            reply.send({
                success: true,
                data: {
                    couponCode: record.couponCode,
                    couponType: record.rewardItem.couponType,
                    coupinValue: record.rewardItem.couponValue,
                    conditionAmount: record.rewardItem.conditionAmount,
                    status: record.status,
                    exporyDate: new Date(Date.now() + 7 * 24 * 60 * 1000).toISOString(),
                }
            });
        }
    );
}