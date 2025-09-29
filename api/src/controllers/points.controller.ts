import { FastifyPluginAsync } from "fastify";
import { AppDataSource } from "../config/db";
import { PointsAccount } from "../entities/PointsAccount";
import { authHook } from "../middleware/auth.hook";

export const pointsRoutes: FastifyPluginAsync = async (fastify) => {
    fastify.addHook('preHandler', authHook);
    fastify.get('/points/account', async (req, reply) => {
        const userId = req.user!.id; // req.user由authMiddleware注入
        
        const accountRepo = AppDataSource.getRepository(PointsAccount);
        const account = accountRepo.findOneBy({ userId });

        if (!account) {
            return reply.status(404).send({ success: false, message: '积分账户不存在' });
        }

        reply.send({
            success: true,
            message: '获取成功',
            data: {
                id: (await account).id,
                userId: (await account).userId,
                balance: (await account).balance,
                totalEarned: (await account).totalEarned,
                totalUsed: (await account).totalUsed
            }
        });
    });
};