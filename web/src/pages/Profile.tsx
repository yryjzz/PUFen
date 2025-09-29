import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { LeftOutlined, UserOutlined } from '@ant-design/icons';
import { SafeArea } from '../components/mobile';
import { setPageTitle } from '../utils/mobile';
import { useAuthStore } from '../store/auth';
import { usePointsStore } from '../store/points';

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
`;

const ContentCard = styled.div`
  background: white;
  border-radius: 16px 16px 0 0;
  margin-top: 20px;
  min-height: calc(100vh - 120px);
`;

const ProfileHeader = styled.div`
  padding: 24px;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  color: white;
  font-size: 32px;
`;

const UserName = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 8px;
  color: #333;
`;

const UserMeta = styled.div`
  color: #666;
  font-size: 14px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: 20px;
  gap: 16px;
  border-bottom: 1px solid #f0f0f0;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 16px 8px;
  background: #f8f9fa;
  border-radius: 12px;
  
  .number {
    font-size: 24px;
    font-weight: bold;
    color: #4CAF50;
    margin-bottom: 4px;
  }
  
  .label {
    font-size: 12px;
    color: #666;
  }
`;

const LogoutButton = styled.button`
  width: calc(100% - 40px);
  margin: 20px;
  padding: 14px;
  background: #ff4757;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  
  &:active {
    background: #ff3742;
  }
`;

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { pointsAccount } = usePointsStore();

  React.useEffect(() => {
    setPageTitle('个人中心');
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // 格式化加入时间
  const formatJoinDate = (dateStr: string | undefined) => {
    if (!dateStr) return '未知';
    
    try {
      const date = new Date(dateStr);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}年${month}月${day}日`;
    } catch (error) {
      return '未知';
    }
  };

  return (
    <SafeArea>
      <Container>
        <Header>
          <BackButton onClick={() => navigate('/')}>
            <LeftOutlined />
          </BackButton>
          
          <Title>个人中心</Title>
          
          <div style={{ width: 32 }} />
        </Header>

        <ContentCard>
          <ProfileHeader>
            <Avatar>
              <UserOutlined />
            </Avatar>
            <UserName>{user?.nickname || user?.username || '用户'}</UserName>
            <UserMeta>
              手机号: {user?.phone || '未设置'}
            </UserMeta>
            <UserMeta>
              加入于 {formatJoinDate(user?.createdAt)}
            </UserMeta>
          </ProfileHeader>

          <StatsGrid>
            <StatItem>
              <div className="number">{pointsAccount?.balance || 0}</div>
              <div className="label">当前积分</div>
            </StatItem>
            <StatItem>
              <div className="number">{pointsAccount?.totalEarned || 0}</div>
              <div className="label">累计获得</div>
            </StatItem>
            <StatItem>
              <div className="number">{pointsAccount?.totalUsed || 0}</div>
              <div className="label">累计使用</div>
            </StatItem>
          </StatsGrid>

          <LogoutButton onClick={handleLogout}>
            退出登录
          </LogoutButton>

          <div style={{ textAlign: 'center', padding: '20px 0', color: '#999', fontSize: '12px' }}>
            PU分积分系统 v1.0.0
          </div>
        </ContentCard>
      </Container>
    </SafeArea>
  );
};

export default Profile;