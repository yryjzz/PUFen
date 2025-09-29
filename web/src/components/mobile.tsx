import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getDeviceInfo } from '../utils/mobile';

// 移动端下拉刷新组件
interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  threshold?: number;
  disabled?: boolean;
}

const PullContainer = styled.div`
  position: relative;
  overflow-y: auto;
  height: 100%;
  -webkit-overflow-scrolling: touch;
`;

const PullIndicator = styled.div<{ visible: boolean; distance: number }>`
  position: absolute;
  top: -60px;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  color: #666;
  font-size: 14px;
  transform: translateY(${props => props.visible ? props.distance : 0}px);
  transition: transform 0.3s ease;
  z-index: 1000;
`;

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children,
  threshold = 60,
  disabled = false
}) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [startY, setStartY] = useState(0);

  useEffect(() => {
    if (disabled) return;

    const container = document.querySelector('.pull-container') as HTMLElement;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (container.scrollTop === 0) {
        setStartY(e.touches[0].clientY);
        setIsPulling(true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling || isRefreshing) return;

      const currentY = e.touches[0].clientY;
      const distance = Math.max(0, currentY - startY);
      
      if (distance > 0 && container.scrollTop === 0) {
        e.preventDefault();
        setPullDistance(Math.min(distance * 0.5, threshold * 1.5));
      }
    };

    const handleTouchEnd = async () => {
      if (!isPulling || isRefreshing) return;
      
      setIsPulling(false);
      
      if (pullDistance >= threshold) {
        setIsRefreshing(true);
        try {
          await onRefresh();
        } finally {
          setIsRefreshing(false);
          setPullDistance(0);
        }
      } else {
        setPullDistance(0);
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [disabled, isPulling, isRefreshing, pullDistance, threshold, onRefresh, startY]);

  return (
    <PullContainer className="pull-container">
      <PullIndicator visible={isPulling || isRefreshing} distance={pullDistance}>
        {isRefreshing ? '刷新中...' : pullDistance >= threshold ? '松开刷新' : '下拉刷新'}
      </PullIndicator>
      {children}
    </PullContainer>
  );
};

// 移动端底部安全区域
const SafeAreaBottom = styled.div`
  height: env(safe-area-inset-bottom);
  min-height: 20px;
  background: inherit;
`;

export const SafeArea: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    {children}
    <SafeAreaBottom />
</>
);

// 移动端导航栏
interface MobileNavBarProps {
  title: string;
  onBack?: () => void;
  rightContent?: React.ReactNode;
  fixed?: boolean;
}

const NavBarContainer = styled.div<{ fixed: boolean }>`
  display: flex;
  align-items: center;
  height: 44px;
  padding: 0 16px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  position: ${props => props.fixed ? 'fixed' : 'relative'};
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding-top: env(safe-area-inset-top);
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  cursor: pointer;
  color: #333;
  
  &:before {
    content: '‹';
    font-size: 24px;
    font-weight: bold;
  }
`;

const NavTitle = styled.h1`
  flex: 1;
  text-align: center;
  font-size: 17px;
  font-weight: 600;
  color: #333;
  margin: 0;
  padding: 0 16px;
`;

const NavRight = styled.div`
  min-width: 32px;
  display: flex;
  justify-content: flex-end;
`;

export const MobileNavBar: React.FC<MobileNavBarProps> = ({
  title,
  onBack,
  rightContent,
  fixed = true
}) => (
  <NavBarContainer fixed={fixed}>
    {onBack ? <BackButton onClick={onBack} /> : <div style={{ width: 32 }} />}
    <NavTitle>{title}</NavTitle>
    <NavRight>{rightContent}</NavRight>
  </NavBarContainer>
);

// 移动端底部标签栏
interface TabBarItem {
  key: string;
  title: string;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
}

interface MobileTabBarProps {
  items: TabBarItem[];
  activeKey: string;
  onChange: (key: string) => void;
  fixed?: boolean;
}

const TabBarContainer = styled.div<{ fixed: boolean }>`
  display: flex;
  background: #fff;
  border-top: 1px solid #f0f0f0;
  position: ${props => props.fixed ? 'fixed' : 'relative'};
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding-bottom: env(safe-area-inset-bottom);
`;

const TabItem = styled.div<{ active: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px 4px 6px;
  cursor: pointer;
  color: ${props => props.active ? '#ff6b6b' : '#999'};
  
  .tab-icon {
    font-size: 20px;
    margin-bottom: 2px;
  }
  
  .tab-title {
    font-size: 11px;
    line-height: 1;
  }
`;

export const MobileTabBar: React.FC<MobileTabBarProps> = ({
  items,
  activeKey,
  onChange,
  fixed = true
}) => (
  <TabBarContainer fixed={fixed}>
    {items.map(item => (
      <TabItem
        key={item.key}
        active={item.key === activeKey}
        onClick={() => onChange(item.key)}
      >
        <div className="tab-icon">
          {item.key === activeKey && item.activeIcon ? item.activeIcon : item.icon}
        </div>
        <div className="tab-title">{item.title}</div>
      </TabItem>
    ))}
  </TabBarContainer>
);

// 移动端弹出层
interface MobileModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  closable?: boolean;
  maskClosable?: boolean;
}

const ModalMask = styled.div<{ visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  display: ${props => props.visible ? 'flex' : 'none'};
  align-items: flex-end;
  justify-content: center;
`;

const ModalContainer = styled.div<{ visible: boolean }>`
  background: #fff;
  border-radius: 16px 16px 0 0;
  max-height: 80vh;
  width: 100%;
  overflow: hidden;
  transform: translateY(${props => props.visible ? '0' : '100%'});
  transition: transform 0.3s ease;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
`;

const ModalTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const CloseButton = styled.button`
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  cursor: pointer;
  color: #999;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:before {
    content: '×';
  }
`;

const ModalContent = styled.div`
  padding: 20px;
  max-height: calc(80vh - 80px);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

export const MobileModal: React.FC<MobileModalProps> = ({
  visible,
  onClose,
  title,
  children,
  closable = true,
  maskClosable = true
}) => {
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [visible]);

  const handleMaskClick = (e: React.MouseEvent) => {
    if (maskClosable && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalMask visible={visible} onClick={handleMaskClick}>
      <ModalContainer visible={visible}>
        {(title || closable) && (
          <ModalHeader>
            <ModalTitle>{title || ''}</ModalTitle>
            {closable && <CloseButton onClick={onClose} />}
          </ModalHeader>
        )}
        <ModalContent>{children}</ModalContent>
      </ModalContainer>
    </ModalMask>
  );
};

// 设备信息展示组件
export const DeviceInfo: React.FC = () => {
  const [deviceInfo] = useState(getDeviceInfo());
  
  return (
    <div style={{ padding: 16, fontSize: 12, color: '#999' }}>
      <div>设备: {deviceInfo.isMobile ? '移动设备' : '桌面设备'}</div>
      <div>系统: {deviceInfo.isIOS ? 'iOS' : deviceInfo.isAndroid ? 'Android' : '其他'}</div>
      <div>环境: {
        deviceInfo.isWechat ? '微信' :
        deviceInfo.isQQ ? 'QQ' :
        deviceInfo.isWeibo ? '微博' :
        deviceInfo.isAlipay ? '支付宝' : '浏览器'
      }</div>
    </div>
  );
};