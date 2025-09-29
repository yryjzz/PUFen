// 插入测试用户优惠券的脚本
import { AppDataSource } from '../config/db.js';
import { UserCoupon } from '../entities/UserCoupon.js';
import { RewardRecord } from '../entities/RewardRecord.js';
import { RewardItem } from '../entities/RewardItem.js';

async function insertTestUserCoupons() {
  await AppDataSource.initialize();
  
  try {
    // 获取兑换记录
    const rewardRecords = await AppDataSource.getRepository(RewardRecord)
      .createQueryBuilder('rr')
      .leftJoinAndSelect('rr.rewardItem', 'item')
      .getMany();
    
    console.log('找到兑换记录:', rewardRecords.length);
    
    const userCouponRepo = AppDataSource.getRepository(UserCoupon);
    
    for (const record of rewardRecords) {
      if (!record.rewardItem) continue;
      
      // 检查是否已存在对应的用户优惠券
      const existingCoupon = await userCouponRepo.findOne({
        where: { relatedId: record.id }
      });
      
      if (existingCoupon) {
        console.log('用户优惠券已存在，跳过:', record.id);
        continue;
      }
      
      // 创建用户优惠券
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + (record.rewardItem.validityDays || 7));
      
      const userCoupon = userCouponRepo.create({
        userId: record.userId,
        couponType: record.rewardItem.couponType,
        discountAmount: record.rewardItem.couponValue * 100, // 转换为分
        minimumAmount: record.rewardItem.conditionAmount * 100, // 转换为分
        status: record.status === 'active' ? 'unused' : 'used', // 根据记录状态设置
        expiryDate,
        source: 'exchange',
        relatedId: record.id
      });
      
      await userCouponRepo.save(userCoupon);
      console.log('插入用户优惠券:', userCoupon.id, userCoupon.couponType);
    }
    
    // 插入一些额外的测试优惠券
    const testUserId = '47b7b7db-16df-4b49-931a-3eff23e57a70'; // 使用现有用户ID
    
    // 添加一个已使用的优惠券
    const usedCoupon = userCouponRepo.create({
      userId: testUserId,
      couponType: '满59减8',
      discountAmount: 800, // 8元，转换为分
      minimumAmount: 5900, // 59元，转换为分
      status: 'used',
      usedAt: new Date('2025-09-25'),
      expiryDate: new Date('2025-10-05'),
      source: 'signin',
      relatedId: null
    });
    
    // 添加一个即将过期的优惠券
    const expiringSoon = userCouponRepo.create({
      userId: testUserId,
      couponType: '满89减15',
      discountAmount: 1500, // 15元，转换为分
      minimumAmount: 8900, // 89元，转换为分
      status: 'unused',
      expiryDate: new Date('2025-09-30'), // 2天后过期
      source: 'signin',
      relatedId: null
    });
    
    // 添加一个已过期的优惠券
    const expiredCoupon = userCouponRepo.create({
      userId: testUserId,
      couponType: '满39减5',
      discountAmount: 500, // 5元，转换为分
      minimumAmount: 3900, // 39元，转换为分
      status: 'expired',
      expiryDate: new Date('2025-09-20'), // 已过期
      source: 'exchange',
      relatedId: null
    });
    
    await userCouponRepo.save([usedCoupon, expiringSoon, expiredCoupon]);
    console.log('插入额外测试优惠券完成');
    
    // 查看最终结果
    const allCoupons = await userCouponRepo.find({
      where: { userId: testUserId },
      order: { createdAt: 'DESC' }
    });
    
    console.log('\n用户优惠券统计:');
    console.log('总数:', allCoupons.length);
    console.log('未使用:', allCoupons.filter(c => c.status === 'unused' && new Date(c.expiryDate) > new Date()).length);
    console.log('已使用:', allCoupons.filter(c => c.status === 'used').length);
    console.log('已过期:', allCoupons.filter(c => c.status === 'expired' || (c.status === 'unused' && new Date(c.expiryDate) <= new Date())).length);
    
  } catch (error) {
    console.error('插入失败:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

insertTestUserCoupons().catch(console.error);