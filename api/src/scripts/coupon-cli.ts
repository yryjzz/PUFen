// src/scripts/coupon-cli.ts
import { AppDataSource } from '../config/db.js';
import { RewardItem } from '../entities/RewardItem.js';

/** 插入优惠券 */
async function insertCoupon(
  name: string, 
  desc: string, 
  points: number, 
  couponType: string, 
  couponValue: number, 
  condition: number, 
  stock: number, 
  stage: 1 | 2
) {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(RewardItem);
  
  const item = repo.create({
    name,
    description: desc,
    pointsCost: points,
    couponType,
    couponValue,
    conditionAmount: condition,
    stock,
    stage,
    isLimited: stock > 0,
    validityDays: 7, // 添加有效期天数
    // createdAt: new Date(),
    // updatedAt: new Date(),
  });
  
  await repo.save(item);
  console.log('[CLI] 已插入：', item.id, item.name);
  await AppDataSource.destroy();
}

/** 清空所有优惠券 */
async function clearCoupons() {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(RewardItem);
  await repo.clear();
  console.log('[CLI] 已清空所有优惠券');
  await AppDataSource.destroy();
}

/** 列出所有优惠券 */
async function listCoupons() {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(RewardItem);
  const list = await repo.find({
    order: { createdAt: 'DESC' },
  });
  console.table(list);
  await AppDataSource.destroy();
}

/** CLI 入口 */
async function main() {
  const [cmd, ...args] = process.argv.slice(2);
  
  switch (cmd) {
    case 'add':
      // 修正：couponType 参数应该是类型名称，不是优惠券名称
      await insertCoupon(args[0], args[1], Number(args[2]), args[3], Number(args[4]), Number(args[5]), Number(args[6]), Number(args[7]) as 1 | 2);
      break;
      
    case 'clear':
      await clearCoupons();
      break;
      
    case 'list':
      await listCoupons();
      break;
      
    default:
      console.log('用法：');
      console.log('  npm run coupon:add <name> <desc> <pointsCost> <couponType> <couponValue> <conditionAmount> <stock> <stage(1|2)>');
      console.log('  npm run coupon:clear');
      console.log('  npm run coupon:list');
  }
}

main().catch(console.error);