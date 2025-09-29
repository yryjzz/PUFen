import * as cron from 'node-cron';
import { AppDataSource } from '../config/db.js';
import { CouponExpiryService } from '../services/coupon-expiry.service.js';

export class CouponExpiryTask {
  private static isRunning = false;

  static start(): void {
    console.log('[CouponExpiryTask] 启动优惠券过期处理定时任务');

    // 每小时检查一次过期优惠券
    cron.schedule('0 * * * *', async () => {
      if (this.isRunning) {
        console.log('[CouponExpiryTask] 上一个任务仍在运行中，跳过本次执行');
        return;
      }

      this.isRunning = true;
      console.log('[CouponExpiryTask] 开始处理过期优惠券...');
      
      try {
        // 确保数据库连接已初始化
        if (!AppDataSource.isInitialized) {
          console.log('[CouponExpiryTask] 数据库未初始化，跳过任务');
          return;
        }

        // 处理过期优惠券
        await CouponExpiryService.processExpiredCoupons();
        
        // 获取统计信息
        const stats = await CouponExpiryService.getCouponStats();
        console.log('[CouponExpiryTask] 优惠券统计:', stats);

      } catch (error) {
        console.error('[CouponExpiryTask] 处理过期优惠券时发生错误:', error);
      } finally {
        this.isRunning = false;
        console.log('[CouponExpiryTask] 过期优惠券处理完成');
      }
    });

    // 每天凌晨2点清理过期超过30天的优惠券记录
    cron.schedule('0 2 * * *', async () => {
      if (this.isRunning) {
        console.log('[CouponExpiryTask] 清理任务跳过，主任务正在运行');
        return;
      }

      console.log('[CouponExpiryTask] 开始清理过期优惠券记录...');
      
      try {
        if (!AppDataSource.isInitialized) {
          console.log('[CouponExpiryTask] 数据库未初始化，跳过清理任务');
          return;
        }

        await CouponExpiryService.cleanupOldExpiredCoupons();
        console.log('[CouponExpiryTask] 过期优惠券记录清理完成');
        
      } catch (error) {
        console.error('[CouponExpiryTask] 清理过期优惠券记录时发生错误:', error);
      }
    });

    // 启动时立即执行一次
    setTimeout(async () => {
      console.log('[CouponExpiryTask] 启动时执行一次过期检查...');
      try {
        if (AppDataSource.isInitialized) {
          await CouponExpiryService.processExpiredCoupons();
          const stats = await CouponExpiryService.getCouponStats();
          console.log('[CouponExpiryTask] 启动时优惠券统计:', stats);
        }
      } catch (error) {
        console.error('[CouponExpiryTask] 启动时处理过期优惠券失败:', error);
      }
    }, 5000); // 等待5秒确保数据库连接已建立
  }

  static stop(): void {
    console.log('[CouponExpiryTask] 停止优惠券过期处理定时任务');
    cron.getTasks().forEach((task) => {
      task.stop();
    });
  }

  // 手动触发过期检查
  static async runOnce(): Promise<void> {
    if (this.isRunning) {
      console.log('[CouponExpiryTask] 任务正在运行中，请稍后再试');
      return;
    }

    this.isRunning = true;
    console.log('[CouponExpiryTask] 手动执行过期检查...');
    
    try {
      await CouponExpiryService.processExpiredCoupons();
      const stats = await CouponExpiryService.getCouponStats();
      console.log('[CouponExpiryTask] 手动执行结果:', stats);
    } catch (error) {
      console.error('[CouponExpiryTask] 手动执行失败:', error);
    } finally {
      this.isRunning = false;
    }
  }
}