import { AppDataSource } from '../config/db.js';
import { RewardItem } from '../entities/RewardItem.js';
import { MoreThan } from 'typeorm';

export class RewardStageService {
  // 检查是否应该解锁第二阶段
  // 当第一阶段所有商品库存都为0时，解锁第二阶段
  static async checkAndUnlockStage2(userId: string): Promise<{
    stage2Unlocked: boolean;
    message?: string;
  }> {
    try {
      const rewardItemRepo = AppDataSource.getRepository(RewardItem);
      
      // 检查第一阶段是否有剩余库存
      const stage1ItemsWithStock = await rewardItemRepo.count({
        where: {
          userId,
          stage: 1,
          stock: MoreThan(0)
        }
      });
      
      console.log('[RewardStage] 第一阶段库存检查结果:', stage1ItemsWithStock);
      
      // 如果第一阶段还有库存，第二阶段不解锁
      if (stage1ItemsWithStock > 0) {
        console.log('[RewardStage] 第一阶段仍有库存，第二阶段不解锁');
        return {
          stage2Unlocked: false,
          message: '第一阶段商品尚未兑换完毕'
        };
      }
      
      // 检查第二阶段是否有商品
      const stage2ItemsCount = await rewardItemRepo.count({
        where: { stage: 2, userId }
      });
      
      console.log('[RewardStage] 第二阶段商品数量:', stage2ItemsCount);
      
      if (stage2ItemsCount === 0) {
        console.log('[RewardStage] 第二阶段无商品，不解锁');
        return {
          stage2Unlocked: false,
          message: '第二阶段暂无商品'
        };
      }
      
      console.log('[RewardStage] 第二阶段解锁条件满足！');
      return {
        stage2Unlocked: true,
        message: '第二阶段已解锁'
      };
      
    } catch (error) {
      console.error('[RewardStage] 检查阶段解锁时发生错误:', error);
      return {
        stage2Unlocked: false,
        message: '检查阶段状态失败'
      };
    }
  }
  
  // 获取用户当前可访问的阶段
  static async getUserAvailableStages(userId: string): Promise<{
    availableStages: number[];
    currentMaxStage: number;
    stage2Unlocked: boolean;
  }> {
    try {
      const stage2Status = await this.checkAndUnlockStage2(userId);
      
      const availableStages = [1];
      let currentMaxStage = 1;
      
      if (stage2Status.stage2Unlocked) {
        availableStages.push(2);
        currentMaxStage = 2;
      }
      
      return {
        availableStages,
        currentMaxStage,
        stage2Unlocked: stage2Status.stage2Unlocked
      };
      
    } catch (error) {
      console.error('[RewardStage] 获取用户可访问阶段时发生错误:', error);
      return {
        availableStages: [1],
        currentMaxStage: 1,
        stage2Unlocked: false
      };
    }
  }
  
  // 新增：个人维度统计（保持注释不动）
  static async getUserStageStats(userId: string): Promise<{
    stage1: {
      totalItems: number;
      availableItems: number;
      soldOutItems: number;
    };
    stage2: {
      totalItems: number;
      availableItems: number;
      soldOutItems: number;
    };
    stage2Unlocked: boolean;
  }> {
    try {
      const repo = AppDataSource.getRepository(RewardItem);
      
      // 第一阶段统计（个人）
      const [stage1Total, stage1Available, stage1SoldOut] = await Promise.all([
        repo.count({ where: { userId, stage: 1 } }),
        repo.count({ where: { userId, stage: 1, stock: MoreThan(0) } }),
        repo.count({ where: { userId, stage: 1, stock: 0 } })
      ]);
      
      // 第二阶段统计（个人）
      const [stage2Total, stage2Available, stage2SoldOut] = await Promise.all([
        repo.count({ where: { userId, stage: 2 } }),
        repo.count({ where: { userId, stage: 2, stock: MoreThan(0) } }),
        repo.count({ where: { userId, stage: 2, stock: 0 } })
      ]);
      
      const stage2Status = await this.checkAndUnlockStage2(userId);
      
      return {
        stage1: {
          totalItems: stage1Total,
          availableItems: stage1Available,
          soldOutItems: stage1SoldOut
        },
        stage2: {
          totalItems: stage2Total,
          availableItems: stage2Available,
          soldOutItems: stage2SoldOut
        },
        stage2Unlocked: stage2Status.stage2Unlocked
      };
    } catch (error) {
      console.error('[RewardStage] 获取阶段统计时发生错误:', error);
      return {
        stage1: { totalItems: 0, availableItems: 0, soldOutItems: 0 },
        stage2: { totalItems: 0, availableItems: 0, soldOutItems: 0 },
        stage2Unlocked: false
      };
    }
  }
  
//   // 重置库存
//   static async resetItemStock(itemId: string, newStock: number): Promise<boolean> {
//     try {
//       const rewardItemRepo = AppDataSource.getRepository(RewardItem);
//       const result = await rewardItemRepo.update(
//         { id: itemId },
//         { stock: newStock }
//       );
//       return (result.affected ?? 0) > 0;
//     } catch (error) {
//       console.error('[RewardStage] 重置库存时发生错误:', error);
//       return false;
//     }
//   }
}