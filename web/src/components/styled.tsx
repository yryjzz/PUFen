import styled from 'styled-components';

// 主容器样式
export const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0;
  margin: 0;
`;

// 页面容器
export const PageContainer = styled.div`
  max-width: 375px;
  margin: 0 auto;
  min-height: 100vh;
  background: #f5f5f5;
  position: relative;
  overflow-x: hidden;
`;

// 头部样式
export const Header = styled.div<{ bgColor?: string }>`
  background: ${props => props.bgColor || 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'};
  padding: 44px 20px 20px;
  color: white;
  position: relative;
`;

// 返回按钮
export const BackButton = styled.div`
  position: absolute;
  left: 20px;
  top: 50px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

// 标题
export const Title = styled.h1`
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  margin: 0;
  padding: 8px 60px 0;
`;

// 卡片容器
export const Card = styled.div<{ padding?: string; margin?: string; radius?: string }>`
  background: white;
  border-radius: ${props => props.radius || '16px'};
  padding: ${props => props.padding || '20px'};
  margin: ${props => props.margin || '16px'};
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  position: relative;
`;

// 积分显示组件
export const PointsDisplay = styled.div`
  text-align: center;
  padding: 40px 20px;
  position: relative;
`;

export const PointsPig = styled.div`
  width: 120px;
  height: 120px;
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
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 8px;
    background: #8B4513;
    border-radius: 4px;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 20px;
    left: 25px;
    width: 20px;
    height: 15px;
    background: #ff9a9e;
    border-radius: 0 0 20px 20px;
    transform: rotate(-30deg);
  }
`;

export const PointsAmount = styled.div`
  font-size: 48px;
  font-weight: bold;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

// 签到日历样式
export const SignInCalendar = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  margin: 20px 0;
`;

export const DayItem = styled.div<{ isSignedIn?: boolean; isToday?: boolean; hasBonus?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 44px;
  position: relative;
  
  .day-number {
    font-size: 12px;
    color: #666;
    margin-bottom: 8px;
  }
  
  .points-badge {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 600;
    position: relative;
    
    ${props => {
      if (props.isSignedIn) {
        return `
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          color: white;
        `;
      } else if (props.isToday) {
        return `
          background: #ff6b6b;
          color: white;
        `;
      } else {
        return `
          background: #f0f0f0;
          color: #999;
        `;
      }
    }}
    
    ${props => props.hasBonus && `
      &::after {
        content: '券';
        position: absolute;
        top: -4px;
        right: -4px;
        background: #ff4757;
        color: white;
        font-size: 8px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `}
  }
`;

// 按钮样式
export const Button = styled.button<{ 
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
}>`
  border: none;
  border-radius: 24px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  ${props => {
    switch (props.size) {
      case 'small':
        return 'padding: 8px 16px; font-size: 12px;';
      case 'large':
        return 'padding: 16px 32px; font-size: 16px;';
      default:
        return 'padding: 12px 24px; font-size: 14px;';
    }
  }}
  
  ${props => props.fullWidth && 'width: 100%;'}
  
  ${props => {
    if (props.disabled) {
      return `
        background: #ccc;
        color: #666;
        cursor: not-allowed;
      `;
    }
    
    switch (props.variant) {
      case 'secondary':
        return `
          background: #f8f9fa;
          color: #495057;
          border: 1px solid #dee2e6;
          
          &:hover {
            background: #e9ecef;
          }
        `;
      case 'danger':
        return `
          background: #dc3545;
          color: white;
          
          &:hover {
            background: #c82333;
          }
        `;
      default:
        return `
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          color: white;
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(79, 172, 254, 0.4);
          }
        `;
    }
  }}
`;

// 底部导航
export const BottomNav = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 375px;
  background: white;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-around;
  padding: 8px 0 20px;
  z-index: 1000;
`;

export const NavItem = styled.div<{ active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  .icon {
    font-size: 20px;
    margin-bottom: 4px;
    color: ${props => props.active ? '#4facfe' : '#999'};
  }
  
  .label {
    font-size: 10px;
    color: ${props => props.active ? '#4facfe' : '#999'};
  }
`;

// 加载动画
export const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #4facfe;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// 空状态
export const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #999;
  
  .icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.5;
  }
  
  .message {
    font-size: 14px;
    line-height: 1.5;
  }
`;