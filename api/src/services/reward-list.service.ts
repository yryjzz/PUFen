import { AppDataSource } from "../config/db";
import { RewardItem } from "../entities/RewardItem";

const WEEK_COUPONS = [
  { name: '满29减4',  desc: '满29元减4元，有效期7天', points: 5,  couponType: '满减券', couponValue: 4,  condition: 29, stock: 1, stage: 1 as const },
  { name: '满49减6',  desc: '满49元减6元，有效期7天', points: 10, couponType: '满减券', couponValue: 6,  condition: 49, stock: 1, stage: 1 as const },
  { name: '满69减10', desc: '满69元减10元，有效期7天', points: 15, couponType: '满减券', couponValue: 10, condition: 69, stock: 1, stage: 1 as const },
  { name: '满19减3',  desc: '满19元减3元，有效期7天', points: 5,  couponType: '满减券', couponValue: 3,  condition: 19, stock: 1, stage: 2 as const },
  { name: '满39减5',  desc: '满39元减5元，有效期7天', points: 10, couponType: '满减券', couponValue: 5,  condition: 39, stock: 1, stage: 2 as const },
  { name: '满99减20', desc: '满99元减20元，有效期7天', points: 15, couponType: '满减券', couponValue: 20, condition: 99, stock: 1, stage: 2 as const },
];

export async function rebuildRewardItem(userId: string): Promise<RewardItem[]> {
  const repo = AppDataSource.getRepository(RewardItem);

  // 清除该用户的现有奖励物品
  await repo.delete({ userId });
  
  const entities = WEEK_COUPONS.map(c =>
    repo.create({
      userId,
      name: c.name,
      description: c.desc,
      pointsCost: c.points,
      couponType: c.couponType,
      couponValue: c.couponValue,
      conditionAmount: c.condition,
      stock: c.stock,
      stage: c.stage,
      isLimited: c.stock > 0,
      validityDays: 7,
    })
  );

  await repo.save(entities);

  return entities;
}