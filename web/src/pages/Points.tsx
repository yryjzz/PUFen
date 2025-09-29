import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import {
  UnorderedListOutlined,
  QuestionCircleOutlined,
  UserOutlined,
  GiftOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import { usePointsStore } from '@/store/points';
import { pointsService } from '@/services/points';
import { rewardService } from '@/services/reward';
import { RewardItem } from '@/types';
import { PullToRefresh, SafeArea } from '../components/mobile';
import { setPageTitle, vibrate } from '../utils/mobile';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
  position: relative;
`;

const Header = styled.div`
  padding: 44px 20px 20px;
  color: white;
  position: relative;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 16px;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  cursor: pointer;
  font-size: 16px;
  border-radius: 50%;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  cursor: pointer;
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 12px;
  min-width: 44px;
  
  .label {
    margin-left: 2px;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  cursor: pointer;
  user-select: none;
  
  &:active {
    opacity: 0.7;
  }
`;

const PointsSection = styled.div`
  text-align: center;
  padding: 20px;
  position: relative;
`;

const PointsPig = styled.div`
  width: 160px;
  height: 160px;
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
  border-radius: 50%;
  margin: 0 auto 20px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::before {
    content: '';
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 10px;
    background: #8B4513;
    border-radius: 5px;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 30px;
    left: 35px;
    width: 25px;
    height: 20px;
    background: #ff9a9e;
    border-radius: 0 0 25px 25px;
    transform: rotate(-30deg);
  }
`;

const PointsAmount = styled.div`
  font-size: 64px;
  font-weight: bold;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const RemainderText = styled.div`
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  margin-bottom: 8px;
`;

const ContentCard = styled.div`
  background: white;
  border-radius: 16px 16px 0 0;
  margin-top: 20px;
  min-height: calc(100vh - 300px);
  padding: 20px;
`;

const SignInCalendar = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const DayItem = styled.div<{ isSignedIn?: boolean; isToday?: boolean; isPast?: boolean; hasBonus?: boolean; isFuture?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 44px;
  
  .day-label {
    font-size: 12px;
    color: #666;
    margin-bottom: 8px;
  }
  
  .points-badge {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 600;
    position: relative;
    cursor: ${props => (props.isFuture || (props.isToday && props.isSignedIn)) ? 'default' : 'pointer'};
    transition: all 0.2s ease;
    
    .check-icon {
      font-size: 18px;
      line-height: 1;
    }
    
    .points-text {
      font-size: 9px;
      line-height: 1;
      margin-top: 2px;
      opacity: 0.8;
    }
    
    ${props => {
      if (props.isSignedIn) {
        return `
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(79, 172, 254, 0.3);
          border: 2px solid #fff;
        `;
      } else if (props.isToday && !props.isSignedIn) {
        return `
          background: linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
          border: 2px solid #fff;
          animation: pulse 2s infinite;
          &:hover {
            transform: scale(1.05);
          }
          
          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.4);
            }
            70% {
              box-shadow: 0 0 0 8px rgba(255, 107, 107, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(255, 107, 107, 0);
            }
          }
        `;
      } else if (props.isFuture) {
        return `
          background: #f5f5f5;
          color: #ccc;
          border: 2px dashed #ddd;
          cursor: not-allowed;
        `;
      } else if (props.isPast) {
        return `
          background: #f0f0f0;
          color: #999;
          border: 2px dashed #ddd;
          opacity: 0.7;
        `;
      } else {
        return `
          background: #f0f0f0;
          color: #999;
          border: 2px dashed #ddd;
        `;
      }
    }}
    
    ${props => props.hasBonus && `
      &::after {
        content: '🎁';
        position: absolute;
        top: -6px;
        right: -6px;
        background: #ff4757;
        font-size: 8px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid white;
      }
    `}
  }
  
  .future-text, .past-text {
    font-size: 10px;
    color: #ccc;
    margin-top: 4px;
  }
  
  .past-text {
    color: #999;
  }
`;

const InviteSection = styled.div`
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  border-radius: 24px;
  padding: 16px;
  color: white;
  text-align: center;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 20px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(79, 172, 254, 0.4);
  }
`;

const ExchangeSection = styled.div`
  margin-top: 20px;
  
  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: #4CAF50;
    text-align: center;
    margin-bottom: 20px;
    position: relative;
    
    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      width: 60px;
      height: 1px;
      background: #4CAF50;
    }
    
    &::before {
      left: 50px;
    }
    
    &::after {
      right: 50px;
    }
  }
`;

const CouponGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
`;

const CouponItem = styled.div<{ isLocked?: boolean; stage?: number }>`
  background: ${props => {
    if (props.isLocked) {
      return 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)';
    }
    if (props.stage === 2) {
      return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
    return 'linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%)';
  }};
  border: none;
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  position: relative;
  box-shadow: ${props => props.isLocked 
    ? '0 4px 12px rgba(0, 0, 0, 0.1)' 
    : '0 8px 24px rgba(255, 107, 107, 0.3)'};
  transition: all 0.3s ease;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: ${props => props.isLocked 
      ? 'none' 
      : 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)'};
    animation: ${props => props.isLocked ? 'none' : 'shimmer 3s ease-in-out infinite'};
  }
  
  @keyframes shimmer {
    0%, 100% { transform: scale(0.8) rotate(0deg); opacity: 0.3; }
    50% { transform: scale(1.2) rotate(180deg); opacity: 0.6; }
  }
  
  &:hover {
    transform: ${props => props.isLocked ? 'none' : 'translateY(-4px)'};
    box-shadow: ${props => props.isLocked 
      ? '0 4px 12px rgba(0, 0, 0, 0.1)' 
      : '0 12px 32px rgba(255, 107, 107, 0.4)'};
  }
  
  .amount {
    font-size: 32px;
    font-weight: 900;
    color: ${props => props.isLocked ? '#999' : 'white'};
    margin-bottom: 12px;
    text-shadow: ${props => props.isLocked ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.3)'};
    position: relative;
    z-index: 1;
  }
  
  .condition {
    background: ${props => {
      if (props.isLocked) return 'rgba(0, 0, 0, 0.1)';
      return 'rgba(255, 255, 255, 0.2)';
    }};
    color: ${props => props.isLocked ? '#666' : 'white'};
    font-size: 14px;
    font-weight: 600;
    padding: 8px 16px;
    border-radius: 20px;
    margin-bottom: 16px;
    backdrop-filter: blur(4px);
    border: 1px solid ${props => props.isLocked ? 'transparent' : 'rgba(255, 255, 255, 0.3)'};
    position: relative;
    z-index: 1;
  }
  
  .title {
    font-size: 16px;
    font-weight: 600;
    color: ${props => props.isLocked ? '#999' : 'white'};
    margin-bottom: 12px;
    position: relative;
    z-index: 1;
  }
  
  .points {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    color: ${props => props.isLocked ? '#999' : 'rgba(255, 255, 255, 0.9)'};
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 16px;
    position: relative;
    z-index: 1;
  }
  
  .lock-overlay {
    position: absolute;
    top: 12px;
    right: 12px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 10px;
    font-weight: 600;
    z-index: 2;
    backdrop-filter: blur(4px);
  }
  
  .exchange-btn {
    background: ${props => props.isLocked 
      ? '#ccc' 
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)'};
    color: ${props => props.isLocked ? '#666' : 'white'};
    border: 2px solid ${props => props.isLocked ? 'transparent' : 'rgba(255, 255, 255, 0.3)'};
    border-radius: 20px;
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 600;
    cursor: ${props => props.isLocked ? 'not-allowed' : 'pointer'};
    transition: all 0.3s ease;
    backdrop-filter: blur(4px);
    position: relative;
    z-index: 1;
    
    &:hover {
      background: ${props => props.isLocked 
        ? '#ccc' 
        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.2) 100%)'};
      transform: ${props => props.isLocked ? 'none' : 'scale(1.05)'};
    }
    
    &:disabled {
      background: #ccc;
      cursor: not-allowed;
      opacity: 0.6;
    }
  }
  
  .stage-badge {
    position: absolute;
    top: 12px;
    left: 12px;
    background: linear-gradient(135deg, #ffd700 0%, #ffb347 100%);
    color: #8b4513;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 10px;
    font-weight: 700;
    z-index: 2;
    box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
  }
  
  .stock-warning {
    position: absolute;
    bottom: 12px;
    left: 12px;
    background: rgba(255, 152, 0, 0.9);
    color: white;
    padding: 2px 6px;
    border-radius: 8px;
    font-size: 10px;
    font-weight: 600;
    z-index: 2;
  }
`;

const Points: React.FC = () => {
  const navigate = useNavigate();
  const { pointsAccount, weeklyConfig, signInStatus } = usePointsStore();
  const [loading, setLoading] = useState(false);
  const [rewardItems, setRewardItems] = useState<RewardItem[]>([]);
  const [rewardsLoading, setRewardsLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState(1);
  const [stage2Unlocked, setStage2Unlocked] = useState(false);

  useEffect(() => {
    loadData();
    setPageTitle('PUFen');
  }, []);

  const loadData = async () => {
    if (loading) return; // 防止重复加载
    
    try {
      setLoading(true);
      
      // 并行加载数据
      const [accountRes, configRes, statusRes] = await Promise.all([
        pointsService.getPointsAccount(),
        pointsService.getWeeklyConfig(),
        pointsService.getSignInStatus(),
      ]);

      if (accountRes.success && accountRes.data) {
        usePointsStore.getState().setPointsAccount(accountRes.data);
      }

      if (configRes.success && configRes.data) {
        usePointsStore.getState().setWeeklyConfig(configRes.data);
      }

      if (statusRes.success && statusRes.data) {
        usePointsStore.getState().setSignInStatus(statusRes.data);
      }
      
      // 加载rewards数据
      await loadRewards();
    } catch (error: any) {
      console.error('加载数据失败:', error);
      // 只有真正的网络错误才提示用户
      if (error?.message && !error.message.includes('暂无')) {
        message.error('网络连接失败，请检查网络后重试');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadRewards = async () => {
    try {
      setRewardsLoading(true);
      const response = await rewardService.getRewardItems();
      if (response.success && response.data) {
        // API返回的数据结构: { items: [], stage2Unlocked: boolean, availableStages: [], stageStats: {} }
        const items = response.data.items || [];
        const availableStages = response.data.availableStages || [1];
        const currentMaxStage = Math.max(...availableStages);
        
        setRewardItems(items);
        setCurrentStage(currentMaxStage);
        setStage2Unlocked(response.data.stage2Unlocked || false);
        
        console.log('奖品数据加载成功:', {
          itemsCount: items.length,
          currentStage: currentMaxStage,
          stage2Unlocked: response.data.stage2Unlocked,
          availableStages: response.data.availableStages
        });
      } else if (response.message && !response.message.includes('暂无')) {
        // 只有真正的错误才显示错误消息，暂无记录不显示
        console.warn('加载奖励商品:', response.message);
      }
    } catch (error: any) {
      console.error('加载商品列表失败:', error);
      // 只有网络错误或其他真正的错误才提示用户
      if (error?.code !== 'NO_DATA') {
        message.error('网络错误，请稍后重试');
      }
    } finally {
      setRewardsLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (signInStatus?.todaySignedIn) {
      message.info('今日已签到');
      return;
    }

    try {
      setLoading(true);
      
      // 正常签到
      const response = await pointsService.signIn();
      
      if (response.success) {
        vibrate([100, 50, 100]); // 成功振动反馈
        message.success(`签到成功！获得${response.data.pointsEarned}积分`);
        if (response.data.hasBonus) {
          vibrate([150, 50, 150, 50, 150]); // 奖励振动反馈
          message.success(`连续签到奖励：${response.data.bonusCoupon}`);
        }
        loadData();
      }
    } catch (error: any) {
      message.error(error?.message || '签到失败');
    } finally {
      setLoading(false);
    }
  };

  const handleExchange = async (rewardItem: RewardItem) => {
    if (!pointsAccount) {
      message.error('请先登录');
      return;
    }

    if (pointsAccount.balance < rewardItem.pointsCost) {
      message.error('积分不足，无法兑换');
      return;
    }

    if (rewardItem.stock <= 0) {
      message.error('商品库存不足');
      return;
    }

    try {
      setLoading(true);
      const response = await rewardService.exchangeReward({
        rewardItemId: rewardItem.id
      });

      if (response.success) {
        message.success(`兑换成功！优惠券码：${response.data.couponCode}`);
        
        // 检查是否有新阶段解锁信息
        if (response.data.stage2Unlocked !== undefined) {
          const wasUnlocked = stage2Unlocked;
          setStage2Unlocked(response.data.stage2Unlocked);
          
          // 只有从未解锁到解锁时才显示解锁提示
          if (!wasUnlocked && response.data.stage2Unlocked) {
            message.info('🎉 恭喜！第二阶段已解锁！');
          }
        }
        
        // 重新加载数据以获取最新状态
        console.log('兑换成功，重新加载数据...');
        await loadData();
        await loadRewards();
        console.log('数据重新加载完成');
      }
    } catch (error: any) {
      message.error(error?.message || '兑换失败');
    } finally {
      setLoading(false);
    }
  };

  const renderDayItem = (dayIndex: number) => {
    const dayLabels = ['第1天', '第2天', '第3天', '第4天', '第5天', '第6天', '第7天'];
    
    if (!signInStatus?.weekStatus) {
      return null;
    }
    
    const dayStatus = signInStatus.weekStatus[dayIndex];
    if (!dayStatus) return null;
    
    const isSignedIn = dayStatus.signed;
    const points = dayStatus.points;
    
    // 修正时区偏移问题的新逻辑
    // 获取本地时区的今天日期字符串
    const today = new Date();
    const todayString = today.getFullYear() + '-' + 
      String(today.getMonth() + 1).padStart(2, '0') + '-' + 
      String(today.getDate()).padStart(2, '0');
    
    // 找到后端标记为isToday的项，计算偏移量
    let dateOffset = 0;
    const todayItem = signInStatus.weekStatus.find(item => item.isToday);
    if (todayItem && todayItem.date !== todayString) {
      const backendTodayDate = new Date(todayItem.date);
      const actualTodayDate = new Date(todayString);
      dateOffset = Math.round((actualTodayDate.getTime() - backendTodayDate.getTime()) / (1000 * 60 * 60 * 24));
    }
    
    // 修正当前项的日期
    const originalDate = new Date(dayStatus.date);
    const correctedDate = new Date(originalDate);
    correctedDate.setDate(correctedDate.getDate() + dateOffset);
    const itemDateString = correctedDate.getFullYear() + '-' + 
      String(correctedDate.getMonth() + 1).padStart(2, '0') + '-' + 
      String(correctedDate.getDate()).padStart(2, '0');
    
    const isFuture = itemDateString > todayString;
    const isToday = itemDateString === todayString;
    const isPast = itemDateString < todayString;
    
    // 调试信息
    if (dayIndex <= 1) {
      console.log(`第${dayIndex + 1}天日期判断:`, {
        original: dayStatus.date,
        dateOffset,
        corrected: itemDateString,
        todayString,
        backendIsToday: dayStatus.isToday,
        isToday,
        isFuture,
        isPast
      });
    }
    
    // 从配置中获取当天的积分倍数
    const multiplierKey = `day${dayIndex + 1}Multiplier` as keyof typeof weeklyConfig;
    const multiplier = (weeklyConfig?.[multiplierKey] as unknown as number) || 1;
    const expectedPoints = Math.round((weeklyConfig?.basePoints || 10) * multiplier);
    
    const hasBonus = weeklyConfig?.bonusDay === (dayIndex + 1);

    const handleClick = () => {
      if (isFuture) {
        message.info('未来日期无法签到');
        return;
      }
      
      if (isToday) {
        if (isSignedIn) {
          message.info('今日已签到');
        } else {
          handleSignIn();
        }
        return;
      }
      
      if (isPast) {
        if (isSignedIn) {
          message.info('该日期已签到');
        } else {
          message.info('无法补签过去日期');
        }
        return;
      }
    };

    return (
      <DayItem
        key={dayIndex}
        isToday={isToday}
        isPast={isPast}
        isSignedIn={isSignedIn}
        hasBonus={hasBonus}
        isFuture={isFuture}
        onClick={handleClick}
      >
        <div className="day-label">{dayLabels[dayIndex]}</div>
        <div className="points-badge">
          {isSignedIn ? (
            <>
              <div className="check-icon">✓</div>
              <div className="points-text">+{points}</div>
            </>
          ) : isFuture ? (
            <div style={{fontSize: '11px', color: '#ccc'}}>+{expectedPoints}</div>
          ) : isToday ? (
            <div style={{fontSize: '11px', fontWeight: 'bold', color: 'inherit'}}>+{expectedPoints}</div>
          ) : isPast ? (
            <div style={{fontSize: '11px', color: '#999', opacity: '0.6'}}>+{expectedPoints}</div>
          ) : (
            <div style={{fontSize: '11px', fontWeight: 'bold'}}>+{expectedPoints}</div>
          )}
        </div>
        
        {/* 状态提示文本 */}
        {isFuture && <div className="future-text">未来</div>}
        {isPast && !isSignedIn && <div className="past-text">过去</div>}
      </DayItem>
    );
  };

  // 计算礼包提示信息 - 重新设计逻辑
  const getBonusReminder = () => {
    if (!weeklyConfig || !signInStatus) {
      return '签到可获取积分奖励';
    }
    
    const bonusDay = weeklyConfig.bonusDay; // 奖励在周几 (1=周一, 7=周日)
    const weekStatus = signInStatus.weekStatus;
    
    // 获取今天是周几 (1=周一, 7=周日)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayDayOfWeek = today.getDay() === 0 ? 7 : today.getDay();
    
    // 检查从周一到奖励日之前是否有漏签
    const checkMissedDaysBeforeBonus = () => {
      for (let i = 0; i < Math.min(bonusDay - 1, weekStatus.length); i++) {
        const dayStatus = weekStatus[i];
        const dayDate = new Date(dayStatus.date);
        dayDate.setHours(0, 0, 0, 0);
        
        // 只检查已经过去的日期，如果这一天已经过去了但是没有签到，就是漏签
        // 注意：要确保这一天确实已经过去（小于今天），而不是今天或未来
        if (dayDate < today && !dayStatus.signed) {
          return true;
        }
      }
      return false;
    };
    
    // 检查是否已经获得本周奖励（达到奖励日并且没有断签）
    const hasReceivedBonus = () => {
      if (todayDayOfWeek < bonusDay) {
        return false; // 还没到奖励日
      }
      
      // 检查从周一到奖励日是否连续签到
      for (let i = 0; i < bonusDay && i < weekStatus.length; i++) {
        if (!weekStatus[i].signed) {
          return false;
        }
      }
      return true;
    };
    
    const hasMissedDays = checkMissedDaysBeforeBonus();
    const receivedBonus = hasReceivedBonus();
    
    if (todayDayOfWeek < bonusDay) {
      // 还没到奖励日
      if (hasMissedDays) {
        return `本周未能获取连续签到奖励`;
      } else {
        // 计算还需要签到几天
        let signedDays = 0;
        // 只计算到今天为止（包括今天）已经签到的天数
        for (let i = 0; i <= todayDayOfWeek - 1 && i < weekStatus.length; i++) {
          const dayStatus = weekStatus[i];
          const dayDate = new Date(dayStatus.date);
          dayDate.setHours(0, 0, 0, 0);
          
          // 只计算今天及之前已经签到的天数
          if (dayDate <= today && dayStatus.signed) {
            signedDays++;
          }
        }
        const daysLeft = bonusDay - signedDays;
        if (daysLeft <= 0) {
          return `已满足条件，可获${weeklyConfig.bonusCoupon}奖励！`;
        } else {
          return `再签${daysLeft}天可获${weeklyConfig.bonusCoupon}`;
        }
      }
    } else if (todayDayOfWeek === bonusDay) {
      // 今天就是奖励日
      if (receivedBonus) {
        return `今日可获${weeklyConfig.bonusCoupon}奖励！`;
      } else {
        return `本周未能获得连续签到奖励`;
      }
    } else {
      // 已经过了奖励日
      if (receivedBonus) {
        return `已获得${weeklyConfig.bonusCoupon}奖励！`;
      } else {
        return `本周未能获得连续签到奖励`;
      }
    }
  };

  const handleTitleLongPress = () => {
    navigate('/profile');
  };

  return (
    <SafeArea>
      <PullToRefresh onRefresh={loadData}>
        <Container>
          <Header>
            <HeaderTop>
              <UserButton onClick={() => navigate('/profile')}>
                <UserOutlined />
              </UserButton>
              
              <Title 
                onTouchStart={() => {
                  let pressTimer = setTimeout(() => {
                    vibrate(100);
                    handleTitleLongPress();
                  }, 800);
                  
                  const clearTimer = () => {
                    clearTimeout(pressTimer);
                    document.removeEventListener('touchend', clearTimer);
                    document.removeEventListener('touchmove', clearTimer);
                  };
                  
                  document.addEventListener('touchend', clearTimer);
                  document.addEventListener('touchmove', clearTimer);
                }}
              >
                我的积分
              </Title>
              
              <ActionButtons>
                <ActionButton onClick={() => navigate('/records')}>
                  <UnorderedListOutlined />
                  <span className="label">记录</span>
                </ActionButton>
                
                <ActionButton onClick={() => navigate('/coupons')}>
                  <GiftOutlined />
                  <span className="label">券</span>
                </ActionButton>
                
                <ActionButton onClick={() => navigate('/rules')}>
                  <QuestionCircleOutlined />
                  <span className="label">规则</span>
                </ActionButton>
              </ActionButtons>
            </HeaderTop>
          </Header>

          <PointsSection>
            <PointsPig>
              <PointsAmount>{pointsAccount?.balance || 0}</PointsAmount>
            </PointsPig>
            
            <RemainderText>{getBonusReminder()}</RemainderText>
          </PointsSection>

      <ContentCard>
        <SignInCalendar>
          {Array.from({ length: 7 }, (_, i) => renderDayItem(i))}
        </SignInCalendar>

        <InviteSection onClick={() => navigate('/invite')}>
          邀请好友瓜分100积分
        </InviteSection>

        <ExchangeSection>
          <div className="section-title">积分兑换区</div>
          
          {/* 阶段提示 */}
          <div style={{ 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', 
            color: 'white', 
            padding: '12px 16px', 
            borderRadius: '8px', 
            marginBottom: '16px',
            fontSize: '13px',
            textAlign: 'center'
          }}>
            {currentStage === 1 && !stage2Unlocked && (
              <>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>🎯 第一阶段商品</div>
                <div style={{ opacity: 0.9 }}>兑换完第一阶段全部商品解锁更多好礼！</div>
              </>
            )}
            {currentStage === 1 && stage2Unlocked && (
              <>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>🎉 恭喜解锁第二阶段！</div>
                <div style={{ opacity: 0.9 }}>更多精彩商品等你来兑换</div>
              </>
            )}
            {currentStage === 2 && (
              <>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>⭐ 第二阶段商品</div>
                <div style={{ opacity: 0.9 }}>更高价值的商品等你兑换</div>
              </>
            )}
          </div>
          
          <CouponGrid>
            {rewardsLoading ? (
              <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                加载中...
              </div>
            ) : rewardItems.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                暂无可兑换商品
              </div>
            ) : (
              rewardItems.map((item) => {
                const userPoints = pointsAccount?.balance || 0;
                const isOutOfStock = item.stock <= 0;
                const isInsufficientPoints = userPoints < item.pointsCost;
                // 使用后端返回的锁定状态，这是最准确的判断
                const isLocked = item.isUnlocked === false;
                // 使用后端返回的可兑换状态
                const canExchange = item.canExchange === true && !loading;
                
                let buttonText = '兑换';
                let buttonColor = 'transparent';
                
                if (loading) {
                  buttonText = '兑换中...';
                } else if (isLocked) {
                  buttonText = '🔒 未解锁';
                  buttonColor = '#ccc';
                } else if (isOutOfStock) {
                  buttonText = '已兑完';
                  buttonColor = '#ccc';
                } else if (isInsufficientPoints) {
                  buttonText = '积分不够';
                  buttonColor = 'rgba(255, 255, 255, 0.1)';
                }

                // 调试信息 - 可以在生产环境中删除
                if (item.stage === 2) {
                  console.log(`第二阶段商品调试:`, {
                    name: item.name,
                    isUnlocked: item.isUnlocked,
                    canExchange: item.canExchange,
                    hasStock: item.hasStock,
                    stock: item.stock,
                    lockReason: item.lockReason,
                    stage2Unlocked: stage2Unlocked,
                    currentStage: currentStage
                  });
                }

                return (
                  <CouponItem key={item.id} isLocked={isLocked} stage={item.stage}>
                    {/* 阶段徽章 */}
                    {item.stage === 2 && (
                      <div className="stage-badge">
                        ⭐ 第二阶段
                      </div>
                    )}
                    
                    {/* 锁定标识 */}
                    {isLocked && (
                      <div className="lock-overlay">
                        🔒 锁定
                      </div>
                    )}
                    
                    {/* 库存警告 */}
                    {!isLocked && item.stock <= 10 && item.stock > 0 && (
                      <div className="stock-warning">
                        仅剩{item.stock}件
                      </div>
                    )}
                    
                    <div className="amount">¥{item.couponValue}</div>
                    <div className="condition">满{item.conditionAmount}元可用</div>
                    <div className="title">{item.name}</div>
                    <div className="points">
                      <span>🪙 {item.pointsCost}积分</span>
                    </div>
                    <button 
                      className="exchange-btn"
                      onClick={() => canExchange ? handleExchange(item) : null}
                      disabled={!canExchange}
                      style={{
                        background: buttonColor !== 'transparent' ? buttonColor : undefined,
                      }}
                    >
                      {buttonText}
                    </button>
                    
                    {/* 锁定原因提示 */}
                    {isLocked && item.lockReason && (
                      <div style={{ 
                        fontSize: '10px', 
                        color: 'rgba(255, 255, 255, 0.7)', 
                        marginTop: '8px', 
                        fontWeight: '500',
                        background: 'rgba(0, 0, 0, 0.2)',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        position: 'relative',
                        zIndex: 1
                      }}>
                        {item.lockReason}
                      </div>
                    )}
                  </CouponItem>
                );
              })
            )}
          </CouponGrid>
        </ExchangeSection>
      </ContentCard>
    </Container>
    </PullToRefresh>
    </SafeArea>
  );
};

export default Points;