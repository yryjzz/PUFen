import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { LeftOutlined } from '@ant-design/icons';

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

const ContentCard = styled.div`
  background: white;
  border-radius: 16px 16px 0 0;
  margin-top: 20px;
  min-height: calc(100vh - 120px);
  padding: 24px;
`;

const RuleSection = styled.div`
  margin-bottom: 32px;
  
  .section-title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .section-content {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 16px;
    line-height: 1.6;
    color: #666;
    font-size: 14px;
  }
`;

const PointsTable = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 16px;
  margin: 16px 0;
  
  .table-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #e0e0e0;
    
    &:last-child {
      border-bottom: none;
    }
    
    .day {
      font-weight: 500;
      color: #333;
      font-size: 14px;
    }
    
    .points {
      color: #4CAF50;
      font-weight: 600;
      font-size: 14px;
    }
  }
`;

const TeamCard = styled.div`
  background: linear-gradient(135deg, #FF9800 0%, #FF5722 100%);
  border-radius: 12px;
  padding: 20px;
  margin: 16px 0;
  color: white;
  
  .team-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 12px;
    text-align: center;
  }
  
  .team-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    font-size: 14px;
  }
  
  .team-bonus {
    text-align: center;
    margin-top: 12px;
    padding: 8px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    font-size: 12px;
  }
`;

const HighlightBox = styled.div`
  background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
  color: white;
  border-radius: 12px;
  padding: 16px;
  margin: 16px 0;
  text-align: center;
  
  .title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  
  .content {
    font-size: 14px;
    opacity: 0.9;
  }
`;

const WarningBox = styled.div`
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 12px;
  margin: 16px 0;
  
  .warning-title {
    color: #856404;
    font-weight: 600;
    margin-bottom: 8px;
    font-size: 14px;
  }
  
  .warning-content {
    color: #856404;
    font-size: 13px;
    line-height: 1.5;
    
    li {
      margin-bottom: 4px;
    }
  }
`;

const Rules: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <LeftOutlined />
        </BackButton>
        
        <Title>积分规则</Title>
        
        <div style={{ width: '36px' }} />
      </Header>

      <ContentCard>
        <RuleSection>
          <div className="section-title">
            🐷 关于PU分积分系统
          </div>
          <div className="section-content">
            PU分是一个有趣的积分签到系统，以可爱的小猪存钱罐为主题。通过每日签到获取积分，积分可以兑换各种优惠券，让您的购物更加实惠！
          </div>
        </RuleSection>

        <RuleSection>
          <div className="section-title">
            📅 每日签到规则
          </div>
          <div className="section-content">
            每天都可以进行签到获取积分，不同的星期获得的积分倍数不同：
          </div>
          
          <PointsTable>
            <div className="table-row">
              <span className="day">周一</span>
              <span className="points">10积分 (基础)</span>
            </div>
            <div className="table-row">
              <span className="day">周二-周五</span>
              <span className="points">10或15积分 (随机)</span>
            </div>
            <div className="table-row">
              <span className="day">周六</span>
              <span className="points">6积分 (休息日)</span>
            </div>
            <div className="table-row">
              <span className="day">周日</span>
              <span className="points">20积分 (双倍奖励)</span>
            </div>
          </PointsTable>
        </RuleSection>

        <RuleSection>
          <div className="section-title">
            👥 团队瓜分系统
          </div>
          <div className="section-content">
            创建或加入团队，与队友一起瓜分100积分奖励！
          </div>
          
          <TeamCard>
            <div className="team-title">🎯 团队积分分配</div>
            <div className="team-info">
              <span>队长奖励：</span>
              <span>50积分</span>
            </div>
            <div className="team-info">
              <span>队员奖励：</span>
              <span>25积分/人</span>
            </div>
            <div className="team-info">
              <span>团队规模：</span>
              <span>3人 (1队长+2队员)</span>
            </div>
            <div className="team-bonus">
              💡 新用户加入团队时，双方都额外获得10积分奖励
            </div>
          </TeamCard>
        </RuleSection>

        <RuleSection>
          <div className="section-title">
            🎁 连续签到奖励
          </div>
          <div className="section-content">
            连续签到3-5天（随机）后，您将获得额外的优惠券奖励！
          </div>
          
          <HighlightBox>
            <div className="title">🎫 奖励优惠券</div>
            <div className="content">满29减4优惠券 - 连续签到奖励</div>
          </HighlightBox>
        </RuleSection>

        <RuleSection>
          <div className="section-title">
            🛒 积分兑换商城
          </div>
          <div className="section-content">
            使用积分兑换各种优惠券，每个用户都有专属的兑换列表：
          </div>
          
          <HighlightBox>
            <div className="title">🎪 个性化商城</div>
            <div className="content">每位用户的可兑换商品都是独一无二的，快去积分页面查看专属奖励吧！</div>
          </HighlightBox>
        </RuleSection>

        <RuleSection>
          <div className="section-title">
            📋 团队管理规则
          </div>
          <div className="section-content">
            关于团队创建和管理的详细规则：
          </div>
          
          <WarningBox>
            <div className="warning-title">⚡ 团队规则</div>
            <div className="warning-content">
              <ul style={{ paddingLeft: '16px', margin: 0 }}>
                <li>每个用户只能参与一个团队</li>
                <li>团队邀请码有效期3小时</li>
                <li>队长可以随时刷新邀请码</li>
                <li>团队满员后自动完成并分配积分</li>
                <li>团队名称可以自定义</li>
              </ul>
            </div>
          </WarningBox>
        </RuleSection>

        <RuleSection>
          <div className="section-title">
            ⚠️ 重要提醒
          </div>
          <div className="section-content">
            • 每天只能签到一次<br/>
            • 团队积分在满员时自动分配<br/>
            • 积分记录和团队记录可在"记录"页面查看<br/>
            • 兑换的优惠券会显示券码<br/>
            • 系统每周一会自动生成新的签到配置
          </div>
        </RuleSection>

        <div style={{ textAlign: 'center', padding: '20px 0', color: '#999', fontSize: '14px' }}>
          🐷 让每一天的签到都充满乐趣！
        </div>
      </ContentCard>
    </Container>
  );
};

export default Rules;