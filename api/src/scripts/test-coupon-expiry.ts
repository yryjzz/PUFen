// 测试优惠券过期功能
import { AppDataSource } from '../config/db.js';
import { CouponExpiryService } from '../services/coupon-expiry.service.js';
import { UserCoupon } from '../entities/UserCoupon.js';

async function testCouponExpiry() {
  await AppDataSource.initialize();
  
  try {
    console.log('=== 优惠券过期功能测试 ===\n');
    
    // 1. 获取当前优惠券统计
    console.log('1. 当前优惠券统计:');
    const statsBefore = await CouponExpiryService.getCouponStats();
    console.log(statsBefore);
    console.log('');
    
    // 2. 创建一些测试过期优惠券
    console.log('2. 创建测试过期优惠券:');
    const userCouponRepo = AppDataSource.getRepository(UserCoupon);
    
    const testUserId = '47b7b7db-16df-4b49-931a-3eff23e57a70'; // 使用现有用户ID
    
    // 创建一个已经过期的优惠券
    const expiredCoupon = userCouponRepo.create({
      userId: testUserId,
      couponType: '满99减20（测试过期）',
      discountAmount: 2000, // 20元
      minimumAmount: 9900, // 99元
      status: 'unused',
      expiryDate: new Date('2025-09-27'), // 昨天过期
      source: 'exchange',
      relatedId: null
    });
    
    // 创建一个即将过期的优惠券（1小时后过期）
    const expiringSoonDate = new Date();
    expiringSoonDate.setHours(expiringSoonDate.getHours() + 1);
    
    const expiringSoonCoupon = userCouponRepo.create({
      userId: testUserId,
      couponType: '满59减8（测试即将过期）',
      discountAmount: 800, // 8元
      minimumAmount: 5900, // 59元
      status: 'unused',
      expiryDate: expiringSoonDate,
      source: 'signin',
      relatedId: null
    });
    
    await userCouponRepo.save([expiredCoupon, expiringSoonCoupon]);
    console.log('已创建测试优惠券');
    console.log(`- 过期优惠券 ID: ${expiredCoupon.id}`);
    console.log(`- 即将过期优惠券 ID: ${expiringSoonCoupon.id}`);
    console.log('');
    
    // 3. 执行过期检查
    console.log('3. 执行过期检查:');
    await CouponExpiryService.processExpiredCoupons();
    console.log('');
    
    // 4. 检查即将过期的优惠券
    console.log('4. 即将过期优惠券统计:');
    const expiringSoonStats = await CouponExpiryService.getExpiringSoonStats();
    console.log(`即将过期数量: ${expiringSoonStats.count}`);
    expiringSoonStats.coupons.forEach(coupon => {
      console.log(`  - ${coupon.couponType}, 过期时间: ${coupon.expiryDate}`);
    });
    console.log('');
    
    // 5. 获取处理后的优惠券统计
    console.log('5. 处理后优惠券统计:');
    const statsAfter = await CouponExpiryService.getCouponStats();
    console.log(statsAfter);
    console.log('');
    
    // 6. 验证过期优惠券状态
    console.log('6. 验证测试优惠券状态:');
    const updatedExpiredCoupon = await userCouponRepo.findOne({
      where: { id: expiredCoupon.id }
    });
    console.log(`过期优惠券状态: ${updatedExpiredCoupon?.status}`);
    
    const updatedExpiringSoonCoupon = await userCouponRepo.findOne({
      where: { id: expiringSoonCoupon.id }
    });
    console.log(`即将过期优惠券状态: ${updatedExpiringSoonCoupon?.status}`);
    console.log('');
    
    console.log('=== 测试完成 ===');
    
  } catch (error) {
    console.error('测试失败:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

testCouponExpiry().catch(console.error);