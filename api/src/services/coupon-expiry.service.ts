import { AppDataSource } from '../config/db.js';
import { UserCoupon } from '../entities/UserCoupon.js';
import { LessThan } from 'typeorm';

export class CouponExpiryService {

  // 处理过期的优惠券
  static async processExpiredCoupons(): Promise<void> {
    try {
      const userCouponRepo = AppDataSource.getRepository(UserCoupon);
      
      // 查找所有未使用但已过期的优惠券
      const expiredCoupons = await userCouponRepo.find({
        where: {
          status: 'unused',
          expiryDate: LessThan(new Date())
        }
      });

      if (expiredCoupons.length > 0) {
        // 批量更新为过期状态
        await userCouponRepo.update(
          {
            status: 'unused',
            expiryDate: LessThan(new Date())
          },
          {
            status: 'expired',
            updatedAt: new Date()
          }
        );
        expiredCoupons.forEach(coupon => {
        });
      }
    } catch (error) {
      console.error('[CouponExpiry] 处理过期优惠券时发生错误:', error);
    }
  }

  //获取即将过期的优惠券统计（24小时内过期） 
  static async getExpiringSoonStats(): Promise<{
    count: number;
    coupons: UserCoupon[];
  }> {
    try {
      const userCouponRepo = AppDataSource.getRepository(UserCoupon);
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const expiringSoon = await userCouponRepo.find({
        where: {
          status: 'unused',
          expiryDate: LessThan(tomorrow)
        },
        relations: [] // 不需要关联其他表
      });

      return {
        count: expiringSoon.length,
        coupons: expiringSoon
      };
    } catch (error) {
      console.error('[CouponExpiry] 获取即将过期优惠券统计时发生错误:', error);
      return { count: 0, coupons: [] };
    }
  }


  // 清理长时间过期优惠券（删除过期超过30天的优惠券记录）
  static async cleanupOldExpiredCoupons(): Promise<void> {
    try {
      const userCouponRepo = AppDataSource.getRepository(UserCoupon);
      
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const result = await userCouponRepo.delete({
        status: 'expired',
        updatedAt: LessThan(thirtyDaysAgo)
      });

      if (result.affected && result.affected > 0) {
        console.log(`[CouponExpiry] 清理了 ${result.affected} 条过期超过30天的优惠券记录`);
      }
    } catch (error) {
      console.error('[CouponExpiry] 清理过期优惠券时发生错误:', error);
    }
  }

  // 获取优惠券统计信息
  static async getCouponStats(): Promise<{
    total: number;
    unused: number;
    used: number;
    expired: number;
    expiringSoon: number;
  }> {
    try {
      const userCouponRepo = AppDataSource.getRepository(UserCoupon);
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const [total, unused, used, expired, expiringSoon] = await Promise.all([
        userCouponRepo.count(),
        userCouponRepo.count({ where: { status: 'unused' } }),
        userCouponRepo.count({ where: { status: 'used' } }),
        userCouponRepo.count({ where: { status: 'expired' } }),
        userCouponRepo.count({ 
          where: { 
            status: 'unused',
            expiryDate: LessThan(tomorrow)
          } 
        })
      ]);

      return {
        total,
        unused,
        used,
        expired,
        expiringSoon
      };
    } catch (error) {
      console.error('[CouponExpiry] 获取优惠券统计时发生错误:', error);
      return {
        total: 0,
        unused: 0,
        used: 0,
        expired: 0,
        expiringSoon: 0
      };
    }
  }
}