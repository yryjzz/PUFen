// 为用户增加积分的脚本
import { AppDataSource } from '../config/db.js';
import { User } from '../entities/User.js';
import { PointsAccount } from '../entities/PointsAccount.js';
import { PointsTransaction } from '../entities/PointsTransaction.js';

async function addPointsToUser() {
  await AppDataSource.initialize();
  
  try {
    const username = '35marblue';
    const pointsToAdd = 10;
    
    // 查找用户
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { username } });
    
    if (!user) {
      console.log('用户不存在:', username);
      return;
    }
    
    console.log('找到用户:', user.id, user.username);
    
    // 查找积分账户
    const accountRepo = AppDataSource.getRepository(PointsAccount);
    let account = await accountRepo.findOne({ where: { userId: user.id } });
    let balanceBefore = 0;
    
    if (!account) {
      console.log('用户积分账户不存在，创建新账户');
      const newAccount = accountRepo.create({
        userId: user.id,
        balance: pointsToAdd,
        totalEarned: pointsToAdd,
        totalUsed: 0
      });
      account = await accountRepo.save(newAccount);
      balanceBefore = 0;
    } else {
      console.log('当前积分:', account.balance);
      balanceBefore = account.balance;
      // 更新积分
      account.balance += pointsToAdd;
      account.totalEarned += pointsToAdd;
      await accountRepo.save(account);
      console.log('新积分:', account.balance);
    }
    
    // 创建积分流水记录
    const transactionRepo = AppDataSource.getRepository(PointsTransaction);
    const transaction = transactionRepo.create({
      userId: user.id,
      accountId: account.id,
      amount: pointsToAdd,
      type: 'earn',
      source: 'signin', // 使用允许的source值
      relatedId: user.id, // 使用用户ID作为关联ID
      description: '管理员添加积分',
      balanceBefore: balanceBefore,
      balanceAfter: account.balance
    });
    
    await transactionRepo.save(transaction);
    console.log('积分流水记录创建完成:', transaction.id);
    
    console.log(`成功为用户 ${username} 增加 ${pointsToAdd} 积分`);
    
  } catch (error) {
    console.error('增加积分失败:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

addPointsToUser().catch(console.error);