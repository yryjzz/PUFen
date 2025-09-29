import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, Empty, message } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { rewardService } from '@/services/reward';
import { apiClient } from '@/services/api';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
`;

const Header = styled.div`
  padding: 44px 20px 20px;
  color: white;
  position: relative;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const BackButton = styled.button`
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

const Title = styled.h1`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: white;
  flex: 1;
`;

const Content = styled.div`
  background: white;
  border-radius: 16px 16px 0 0;
  margin-top: 20px;
  min-height: calc(100vh - 120px);
  padding: 0;
`;

const StyledTabs = styled(Tabs)`
  background: white;
  
  .ant-tabs-nav {
    margin: 0;
    padding: 0 20px;
  }
  
  .ant-tabs-tab {
    color: #666;
    font-weight: 500;
    
    &.ant-tabs-tab-active {
      color: #4CAF50;
    }
  }
  
  .ant-tabs-ink-bar {
    background: #4CAF50;
  }
  
  .ant-tabs-content-holder {
    padding: 0;
  }
`;

const TabContent = styled.div`
  padding: 20px;
  min-height: calc(100vh - 200px);
`;

const DateFilter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
  color: #666;
  font-size: 14px;
`;

const RecordItem = styled.div`
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  
  .record-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }
  
  .record-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }
  
  .points-change {
    font-size: 16px;
    font-weight: 600;
    
    &.positive {
      color: #4CAF50;
    }
    
    &.negative {
      color: #f44336;
    }
  }
  
  .record-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    color: #666;
  }
  
  .record-time {
    font-size: 12px;
    color: #999;
  }
  
  .record-balance {
    font-size: 12px;
    color: #999;
  }
`;

const LoadMoreButton = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
  cursor: pointer;
  
  &:hover {
    color: #4CAF50;
  }
`;

const Records: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('points');
  const [pointsRecords, setPointsRecords] = useState<any[]>([]);
  const [teamRecords, setTeamRecords] = useState<any[]>([]);
  const [exchangeRecords, setExchangeRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    if (loading) return; // 防止重复加载
    
    try {
      setLoading(true);
      
      switch (activeTab) {
        case 'points':
          const pointsRes = await apiClient.get('/records/points', {
            params: { page: 1, limit: 20 }
          });
          if (pointsRes.success && pointsRes.data) {
            setPointsRecords(pointsRes.data.records);
          }
          break;
          
        case 'team':
          const teamRes = await apiClient.get('/records/team', {
            params: { page: 1, limit: 20 }
          });
          if (teamRes.success && teamRes.data) {
            setTeamRecords(teamRes.data.records || teamRes.data);
          }
          break;
          
        case 'exchange':
          const exchangeRes = await rewardService.getExchangeRecords({
            page: 1,
            limit: 20
          });
          if (exchangeRes.success && exchangeRes.data) {
            setExchangeRecords(exchangeRes.data.records);
          }
          break;
      }
    } catch (error) {
      message.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  const renderPointsRecord = (record: any) => {
    // 检查是否为团队相关的积分记录
    const isTeamRelated = record.source === 'team' || record.description?.includes('团队');
    
    // 解析积分组成（仅针对团队积分）
    const parseTeamPoints = (description: string, amount: number) => {
      if (!isTeamRelated) return null;
      
      const isCaptain = description.includes('队长');
      const basePoints = isCaptain ? 50 : 25;
      const bonusPoints = Math.max(0, amount - basePoints);
      
      let bonusDescription = [];
      
      if (bonusPoints > 0) {
        if (isCaptain) {
          // 对于队长，需要智能分析积分组成
          let remainingBonus = bonusPoints;
          
          // 假设队长自己不是新用户，优先判断邀请新用户奖励
          if (remainingBonus >= 20) {
            bonusDescription.push('邀请2个新用户奖励20分');
            remainingBonus -= 20;
          } else if (remainingBonus >= 10) {
            // 可能是邀请1个新用户，或者自己是新用户
            // 这里简化处理，根据总积分判断
            if (remainingBonus === 10) {
              bonusDescription.push('新用户相关奖励10分');
            } else {
              bonusDescription.push('邀请1个新用户奖励10分');
            }
            remainingBonus = 0;
          }
          
          // 如果还有剩余积分，说明队长自己也是新用户
          if (remainingBonus >= 10) {
            bonusDescription.unshift('自己新用户奖励10分');
          }
        } else {
          // 对于队员，只有自己的新用户奖励
          if (bonusPoints >= 10) {
            bonusDescription.push('新用户奖励10分');
          }
        }
      }
      
      return {
        basePoints,
        bonusPoints,
        bonusDescription,
        role: isCaptain ? '队长' : '队员'
      };
    };
    
    const pointsBreakdown = parseTeamPoints(record.description, record.amount);
    
    return (
      <RecordItem key={record.id}>
        <div className="record-header">
          <div className="record-title">{record.description}</div>
          <div className={`points-change ${record.amount > 0 ? 'positive' : 'negative'}`}>
            {record.amount > 0 ? '+' : ''}{record.amount}积分
          </div>
        </div>
        {pointsBreakdown && (
          <div style={{
            fontSize: '12px',
            color: '#666',
            marginTop: '4px',
            paddingLeft: '12px',
            borderLeft: '2px solid #4CAF50',
            backgroundColor: '#f8f9fa',
            padding: '6px 12px',
            borderRadius: '4px'
          }}>
            {pointsBreakdown.role}基础{pointsBreakdown.basePoints}分
            {pointsBreakdown.bonusDescription.length > 0 && (
              <span>，{pointsBreakdown.bonusDescription.join('，')}</span>
            )}
          </div>
        )}
        <div className="record-details">
          <div className="record-time">
            {dayjs(record.createdAt).format('MM/DD HH:mm')}
          </div>
          <div className="record-balance">
            剩余{record.balanceAfter}
          </div>
        </div>
      </RecordItem>
    );
  };

  const renderTeamRecord = (record: any) => {
    // 直接使用后端计算的积分，不再前端重复计算
    const displayPoints = record.pointsEarned || 0;
    
    // 根据积分计算基础分和奖励分的展示（仅用于UI展示）
    const getPointsDisplay = (role: string, totalPoints: number, isNewUser: boolean) => {
      const basePoints = role === 'captain' ? 50 : 25;
      const bonusPoints = totalPoints - basePoints;
      
      let bonusDescription = [];
      if (isNewUser) {
        bonusDescription.push('新用户奖励10分');
      }
      
      if (role === 'captain' && bonusPoints > (isNewUser ? 10 : 0)) {
        const inviteBonus = bonusPoints - (isNewUser ? 10 : 0);
        if (inviteBonus === 10) {
          bonusDescription.push('邀请1个新用户奖励10分');
        } else if (inviteBonus === 20) {
          bonusDescription.push('邀请2个新用户奖励20分');
        } else if (inviteBonus > 0) {
          bonusDescription.push(`邀请新用户奖励${inviteBonus}分`);
        }
      }
      
      return {
        basePoints,
        bonusPoints,
        bonusDescription,
        role: role === 'captain' ? '队长' : '队员'
      };
    };

    const pointsInfo = getPointsDisplay(record.role, displayPoints, record.isNewUser);

    return (
      <RecordItem key={record.id}>
        <div className="record-header">
          <div className="record-title">
            团队：{record.teamName || record.team?.name || '未知团队'} ({pointsInfo.role})
          </div>
          <div className="points-change positive">
            +{displayPoints}积分
          </div>
        </div>
        {/* 积分组成详情 */}
        <div style={{
          fontSize: '12px',
          color: '#666',
          marginTop: '4px',
          paddingLeft: '12px',
          borderLeft: '2px solid #4CAF50',
          backgroundColor: '#f8f9fa',
          padding: '6px 12px',
          borderRadius: '4px'
        }}>
          {pointsInfo.role}基础{pointsInfo.basePoints}分
          {pointsInfo.bonusDescription.length > 0 && (
            <span>，{pointsInfo.bonusDescription.join('，')}</span>
          )}
          {pointsInfo.bonusPoints > 0 && (
            <span>，共{pointsInfo.bonusPoints}分</span>
          )}
        </div>
        <div className="record-details">
          <div className="record-time">
            {dayjs(record.completedAt).format('MM/DD HH:mm')}
          </div>
          <div className="record-balance">
            {pointsInfo.role}奖励
          </div>
        </div>
      </RecordItem>
    );
  };

  const renderExchangeRecord = (record: any) => (
    <RecordItem key={record.id}>
      <div className="record-header">
        <div className="record-title">
          兑换：{record.rewardItemInfo?.name || record.rewardItem?.name || '未知商品'}
        </div>
        <div className="points-change negative">
          -{record.pointsCost}积分
        </div>
      </div>
      <div className="record-details">
        <div className="record-time">
          {dayjs(record.createdAt).format('MM/DD HH:mm')}
        </div>
        <div className="record-balance">
          {record.status === 'completed' ? '已完成' : 
           record.status === 'active' ? '已生效' : 
           record.status === 'cancelled' ? '已取消' : '待处理'}
        </div>
      </div>
      {record.couponCode && (
        <div style={{ 
          marginTop: '8px', 
          fontSize: '12px', 
          color: '#4CAF50',
          backgroundColor: '#f1f8e9',
          padding: '4px 8px',
          borderRadius: '4px'
        }}>
          券码：{record.couponCode}
        </div>
      )}
    </RecordItem>
  );

  const tabItems = [
    {
      key: 'points',
      label: '积分记录',
      children: (
        <TabContent>
          <DateFilter>
            <span>2025/09 ▼</span>
          </DateFilter>
          
          {pointsRecords.length > 0 ? (
            <>
              {pointsRecords.map(renderPointsRecord)}
              <LoadMoreButton>上拉加载更多</LoadMoreButton>
            </>
          ) : (
            <Empty description="暂无积分记录" />
          )}
        </TabContent>
      ),
    },
    {
      key: 'team',
      label: '组队记录',
      children: (
        <TabContent>
          {teamRecords.length > 0 ? (
            <>
              {teamRecords.map(renderTeamRecord)}
              <LoadMoreButton>上拉加载更多</LoadMoreButton>
            </>
          ) : (
            <Empty description="暂无组队记录" />
          )}
        </TabContent>
      ),
    },
    {
      key: 'exchange',
      label: '兑换记录',
      children: (
        <TabContent>
          {exchangeRecords.length > 0 ? (
            <>
              {exchangeRecords.map(renderExchangeRecord)}
              <LoadMoreButton>上拉加载更多</LoadMoreButton>
            </>
          ) : (
            <Empty description="暂无兑换记录" />
          )}
        </TabContent>
      ),
    },
  ];

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <LeftOutlined />
        </BackButton>
        <Title>记录</Title>
        <div style={{ width: '36px' }}></div>
      </Header>

      <Content>
        <StyledTabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
        />
      </Content>
    </Container>
  );
};

export default Records;