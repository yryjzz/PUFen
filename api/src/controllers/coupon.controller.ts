import { FastifyPluginAsync } from 'fastify';
import { AppDataSource } from '../config/db';
import { UserCoupon } from '../entities/UserCoupon';
import { authHook } from '../middleware/auth.hook';

export const couponRoutes: FastifyPluginAsync = async (fastify) => {
  // 获取用户拥有的所有券
  fastify.get(
    '/coupons/my',
    {
      preHandler: authHook
    },
    async (req, reply) => {
      const userId = req.user!.id;

      const coupons = await AppDataSource.getRepository(UserCoupon).find({
        where: { userId },
        order: { createdAt: 'DESC' }
      });

      // 按状态分类
      const categorizedCoupons = {
        unused: coupons.filter(c => c.status === 'unused' && new Date(c.expiryDate) > new Date()),
        used: coupons.filter(c => c.status === 'used'),
        expired: coupons.filter(c => c.status === 'expired' || (c.status === 'unused' && new Date(c.expiryDate) <= new Date()))
      };

      reply.send({
        success: true,
        data: categorizedCoupons
      });
    }
  );

  // 使用券
  fastify.post(
    '/coupons/:couponId/use',
    {
      preHandler: authHook
    },
    async (req, reply) => {
      const userId = req.user!.id;
      const { couponId } = req.params as { couponId: string };

      const couponRepo = AppDataSource.getRepository(UserCoupon);
      const coupon = await couponRepo.findOneBy({ id: couponId, userId });

      if (!coupon) {
        return reply.status(404).send({
          success: false,
          message: '券不存在'
        });
      }

      if (coupon.status !== 'unused') {
        return reply.status(400).send({
          success: false,
          message: '券已使用或已过期'
        });
      }

      if (new Date(coupon.expiryDate) <= new Date()) {
        await couponRepo.update({ id: couponId }, { status: 'expired' });
        return reply.status(400).send({
          success: false,
          message: '券已过期'
        });
      }

      // 更新券状态为已使用
      await couponRepo.update(
        { id: couponId },
        { 
          status: 'used',
          usedAt: new Date()
        }
      );

      reply.send({
        success: true,
        message: '券使用成功'
      });
    }
  );

  // 获取券统计信息
  fastify.get(
    '/coupons/stats',
    {
      preHandler: authHook
    },
    async (req, reply) => {
      const userId = req.user!.id;

      const [total, unused, used, expired] = await Promise.all([
        AppDataSource.getRepository(UserCoupon).count({ where: { userId } }),
        AppDataSource.getRepository(UserCoupon).count({ 
          where: { 
            userId, 
            status: 'unused'
          } 
        }),
        AppDataSource.getRepository(UserCoupon).count({ 
          where: { 
            userId, 
            status: 'used'
          } 
        }),
        AppDataSource.getRepository(UserCoupon).count({ 
          where: { 
            userId, 
            status: 'expired'
          } 
        })
      ]);

      reply.send({
        success: true,
        data: {
          total,
          unused,
          used,
          expired
        }
      });
    }
  );
};