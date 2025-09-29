import { SignInConfig } from "../entities/SignInConfig";
import { AppDataSource } from "../config/db";
// 周一自动随机生成本周签到配置
export async function buildWeekConfig(): Promise<SignInConfig> {
    const repo = AppDataSource.getRepository(SignInConfig);

    // 周一00:00
    const monday = new Date();
    monday.setHours(0, 0, 0, 0);
    const day = monday.getDay();
    const diff = monday.getDate() - day + ( day === 0 ? -6 : 1);
    monday.setDate(diff);

    const random150 = () => (Math.random() < 0.5 ? 1.0 : 1.5);
    //[3, 6)
    const bonusDay = Math.floor(Math.random() * 3) + 3;

    const cfg = repo.create({
        weekStartDate: monday,
        basePoints: 10,
        day1Multiplier: 1.0,
        day2Multiplier: random150(),
        day3Multiplier: random150(),
        day4Multiplier: random150(),
        day5Multiplier: random150(),
        day6Multiplier: 0.6,
        day7Multiplier: 2.0,
        bonusDay,
        bonusCoupon: '满29减4',
    });

    return repo.save(cfg);
}