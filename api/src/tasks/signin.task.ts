import cron from 'node-cron';
import { buildWeekConfig } from '../services/signin-config.service';
import { rebuildRewardItem } from '../services/reward-list.service';
import { AppDataSource } from '../config/db';
import { User } from '../entities/User';

export function startResetConfigTask(): void {
  cron.schedule(
    '0 0 * * 1', // 每周一 00:00
    async () => {
      try {
        const cfg = await buildWeekConfig();
        console.log('[Cron] 新签到配置已生成', cfg.id);

        const userRepo = AppDataSource.getRepository(User);
        const users = await userRepo.find({ select: ['id'] }); // 只拿 id，省内存
        console.log(`[Cron] 开始重置 ${users.length} 名用户的兑换列表`);

        // 串行处理，防止一次性把连接池打满
        for (const u of users) {
          await rebuildRewardItem(u.id);
        }

        console.log('[Cron] 全部用户兑换列表已重置完成');
      } catch (err) {
        console.error('[Cron] 签到配置或兑换列表重置失败', err);
      }
    },
    {
      timezone: 'Asia/Shanghai',
    }
  );
}