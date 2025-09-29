import fastify, { FastifyPluginAsync } from "fastify";
import { AppDataSource } from "../config/db";
import { authHook } from "../middleware/auth.hook";
import { PointsAccount } from "../entities/PointsAccount";
import { PointsTransaction } from "../entities/PointsTransaction";
import { RewardItem } from "../entities/RewardItem";
import { RewardRecord } from "../entities/RewardRecord";
import { TeamRecord } from "../entities/TeamRecord";

export const recordsRoutes: FastifyPluginAsync = async (fastify) => {
    fastify.get(
        '/records/points',
        {
            preHandler: authHook
        },
        async (req, reply) => {
            const userId = req.user!.id;
            const { type, page = 1, limit = 20 } = req.query as { 
                type?: 'earn' | 'use' | 'expire'; 
                page?: number; 
                limit?: number 
            };
            const pageNum = Number(page);
            const limitNum = Number(limit);

            const repo = AppDataSource.getRepository(PointsTransaction);
            const result  = repo.createQueryBuilder('tx')
                .where('tx.userId = :userId', {userId})
                .orderBy('tx.createdAt', 'DESC')
                .skip((page - 1) * limit)
                .take(limit);

            // 如果有查询条件
            if (type) result.andWhere('tx.type = :type', { type });

            const [records, total] = await result.getManyAndCount();

            if (records.length === 0) {
                return reply.send({
                success: true,
                data: {
                    records: [],
                    pagination: { page, limit, total: 0, totalPages: 0 },
                    message: '暂无交易记录',
                },
                });
            }

            reply.send({
                success: true,
                data: {
                    records: records.map(tx => ({
                        id: tx.id,
                        amount: tx.amount,
                        type: tx.type,
                        source: tx.source,
                        description: tx.description,
                        balanceBefore: tx.balanceBefore,
                        balanceAfter: tx.balanceAfter,
                        createdAt: tx.createdAt
                    })),
                    pagination: {
                        page: pageNum,
                        limit: limitNum,
                        total,
                        totalPages: Math.ceil(total / limit)
                    }
                }
            });
        }
    );
    fastify.get(
        '/records/exchange',
        {
            preHandler: authHook
        },
        async (req, reply) => {
            const userId = req.user!.id;
            const { status, page = 1, limit = 20 } = req.query as {
                status?: 'pending' | 'completed' | 'cancelled';
                page?: number;
                limit?: number;
            };
            const pageNum = Number(page);
            const limitNum = Number(limit);

            const repo = AppDataSource.getRepository(RewardRecord);
            const result = repo.createQueryBuilder('rr') // reward record
                .leftJoinAndSelect('rr.rewardItem', 'item')
                .where('rr.userId = :userId', { userId })
                .orderBy('rr.createdAt', 'DESC')
                .skip((page - 1) * limit)
                .take(limit)

            if (status) result.andWhere('rr.status = :status', {status});

            const [records, total] = await result.getManyAndCount();
            if (records.length === 0) {
                return reply.send({
                success: true,
                data: {
                    records: [],
                    pagination: { page: pageNum + 1, limit: limitNum + 1, total: 0, totalPages: 1 },
                    message: '暂无兑换记录',
                },
                });
            }
            reply.send({
                success: true,
                data: {
                    records: records.map(rr => ({
                        id: rr.id,
                        rewardItemInfo: {
                            name: rr.rewardItem.name,
                            pointsCost: rr.rewardItem.pointsCost,
                        },
                        pointsCost: rr.pointsCost,
                        couponCode: rr.couponCode,
                        status: rr.status,
                        createdAt: rr.createdAt,

                    })),
                    pagination: {
                        page: pageNum,
                        limit: limitNum,
                        total,
                        totalPages: Math.ceil(total / limit),
                    }
                }
            });
        }
    );

    // 组队记录
    fastify.get(
        '/records/team',
        {
            preHandler: authHook
        },
        async (req, reply) => {
            const userId = req.user!.id;
            const { status, page = 1, limit = 20 } = req.query as {
                status?: 'active' | 'completed' | 'expired';
                page?: number;
                limit?: number;
            };
            const pageNum = Number(page);
            const limitNum = Number(limit);

            const repo = AppDataSource.getRepository(TeamRecord);
            const result = repo.createQueryBuilder('tr')
                .where('tr.userId = :userId', { userId })
                .orderBy('tr.completedAt', 'DESC')
                .skip((pageNum - 1) * limitNum)
                .take(limitNum);

            if (status) result.andWhere('tr.status = :status', { status });

            const [records, total] = await result.getManyAndCount();
            
            if (records.length === 0) {
                return reply.send({
                    success: true,
                    data: {
                        records: [],
                        pagination: { page: pageNum, limit: limitNum, total: 0, totalPages: 0 },
                    },
                    message: '暂无团队记录'
                });
            }

            return reply.send({
                success: true,
                data: {
                    records: records.map(record => ({
                        id: record.id,
                        teamId: record.teamId,
                        teamName: record.teamName,
                        role: record.role,
                        pointsEarned: record.pointsEarned,
                        isNewUser: record.isNewUser,
                        status: record.status,
                        memberCount: record.memberCount,
                        createdAt: record.createdAt,
                        completedAt: record.completedAt
                    })),
                    pagination: {
                        page: pageNum,
                        limit: limitNum,
                        total,
                        totalPages: Math.ceil(total / limitNum),
                    }
                }
            });
        }
    );
}