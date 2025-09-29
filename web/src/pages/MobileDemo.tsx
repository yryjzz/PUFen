import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Card, Button, message, Badge } from 'antd';
import { 
  MobileOutlined, 
  WifiOutlined, 
  BellOutlined, 
  ShareAltOutlined,
  HeartOutlined,
  ExperimentOutlined,
  LeftOutlined
} from '@ant-design/icons';
import { getDeviceInfo, vibrate, copyToClipboard } from '../utils/mobile';
import { universalShare } from '../utils/share';

const DemoContainer = styled.div`
  padding: 20px;
  max-width: 400px;
  margin: 0 auto;
  background: #f5f5f5;
  min-height: 100vh;
`;

const BackButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
`;

const DemoCard = styled(Card)`
  margin-bottom: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  
  .ant-card-head {
    border-bottom: 1px solid #f0f0f0;
    
    .ant-card-head-title {
      font-size: 16px;
      font-weight: 600;
    }
  }
`;

const FeatureButton = styled(Button)`
  width: 100%;
  height: 48px;
  margin-bottom: 12px;
  border-radius: 8px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &.touch-active {
    transform: scale(0.95);
    background: #1890ff;
    color: white;
  }
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
  
  .label {
    color: #666;
    font-size: 14px;
  }
  
  .value {
    color: #333;
    font-size: 14px;
    font-weight: 500;
  }
`;

const StatusBadge = styled(Badge)`
  .ant-badge-status-dot {
    width: 8px;
    height: 8px;
  }
`;

const MobileDemo: React.FC = () => {
  const navigate = useNavigate();
  const [deviceInfo] = useState(() => getDeviceInfo());
  const [networkStatus, setNetworkStatus] = useState<any>({});
  const [touchCount, setTouchCount] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // 监听网络状态
    const updateNetworkStatus = () => {
      const connection = (navigator as any).connection || (navigator as any).mozConnection;
      setNetworkStatus({
        online: navigator.onLine,
        effectiveType: connection?.effectiveType || '未知',
        downlink: connection?.downlink || 0,
        rtt: connection?.rtt || 0,
      });
      setIsOnline(navigator.onLine);
    };

    updateNetworkStatus();
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
    };
  }, []);

  const handleVibrationTest = () => {
    if ('vibrate' in navigator) {
      vibrate([100, 50, 100, 50, 200]);
      message.success('振动测试：短-短-长');
    } else {
      message.warning('当前环境不支持振动API');
    }
  };

  const handleShareTest = async () => {
    try {
      await universalShare({
        title: 'PUFen H5移动端应用',
        desc: '体验完整的H5移动端功能',
        link: window.location.href,
        imgUrl: '/icon-192x192.png'
      });
    } catch (error) {
      message.error('分享失败');
    }
  };

  const handleCopyTest = async () => {
    const success = await copyToClipboard('这是一段测试文本 - PUFen H5应用');
    if (success) {
      message.success('文本已复制到剪贴板');
    } else {
      message.error('复制失败');
    }
  };

  const handleTouchTest = () => {
    setTouchCount(prev => prev + 1);
    vibrate(50);
    message.info(`触摸次数: ${touchCount + 1}`);
  };

  const handleNotificationTest = () => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('PUFen通知测试', {
          body: '这是一条测试通知消息',
          icon: '/icon-192x192.png',
          badge: '/icon-192x192.png'
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('PUFen通知测试', {
              body: '通知权限已获取',
              icon: '/icon-192x192.png'
            });
          }
        });
      } else {
        message.warning('通知权限被拒绝');
      }
    } else {
      message.warning('当前环境不支持通知API');
    }
  };

  const handleFullscreenTest = () => {
    if (document.fullscreenEnabled) {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().then(() => {
          message.success('已进入全屏模式');
        }).catch(() => {
          message.error('全屏请求失败');
        });
      } else {
        document.exitFullscreen().then(() => {
          message.success('已退出全屏模式');
        });
      }
    } else {
      message.warning('当前环境不支持全屏API');
    }
  };

  return (
    <DemoContainer>
      <BackButton 
        icon={<LeftOutlined />} 
        onClick={() => navigate('/')}
        size="large"
        style={{ backgroundColor: '#f0f0f0', border: 'none' }}
      >
        返回主页
      </BackButton>
      
      <h1 style={{ textAlign: 'center', marginBottom: 24, color: '#333' }}>
        📱 H5移动端功能演示
      </h1>

      {/* 设备信息 */}
      <DemoCard 
        title={
          <span>
            <MobileOutlined /> 设备信息
          </span>
        }
      >
        <InfoItem>
          <span className="label">设备类型</span>
          <span className="value">
            {deviceInfo.isMobile ? '移动设备' : '桌面设备'}
          </span>
        </InfoItem>
        <InfoItem>
          <span className="label">操作系统</span>
          <span className="value">
            {deviceInfo.isIOS ? 'iOS' : deviceInfo.isAndroid ? 'Android' : '其他'}
          </span>
        </InfoItem>
        <InfoItem>
          <span className="label">浏览器环境</span>
          <span className="value">
            {deviceInfo.isWechat ? '微信' : 
             deviceInfo.isQQ ? 'QQ' : 
             deviceInfo.isAlipay ? '支付宝' : '标准浏览器'}
          </span>
        </InfoItem>
        <InfoItem>
          <span className="label">屏幕尺寸</span>
          <span className="value">{window.innerWidth}×{window.innerHeight}</span>
        </InfoItem>
        <InfoItem>
          <span className="label">像素比</span>
          <span className="value">{window.devicePixelRatio}x</span>
        </InfoItem>
      </DemoCard>

      {/* 网络状态 */}
      <DemoCard 
        title={
          <span>
            <WifiOutlined /> 网络状态
          </span>
        }
      >
        <InfoItem>
          <span className="label">连接状态</span>
          <StatusBadge 
            status={isOnline ? 'success' : 'error'} 
            text={isOnline ? '在线' : '离线'} 
          />
        </InfoItem>
        <InfoItem>
          <span className="label">网络类型</span>
          <span className="value">{networkStatus.effectiveType}</span>
        </InfoItem>
        <InfoItem>
          <span className="label">下载速度</span>
          <span className="value">
            {networkStatus.downlink ? `${networkStatus.downlink}Mbps` : '未知'}
          </span>
        </InfoItem>
        <InfoItem>
          <span className="label">延迟</span>
          <span className="value">
            {networkStatus.rtt ? `${networkStatus.rtt}ms` : '未知'}
          </span>
        </InfoItem>
      </DemoCard>

      {/* 交互功能测试 */}
      <DemoCard 
        title={
          <span>
            <ExperimentOutlined /> 功能测试
          </span>
        }
      >
        <FeatureButton 
          type="primary" 
          icon={<HeartOutlined />}
          onClick={handleVibrationTest}
        >
          振动反馈测试
        </FeatureButton>

        <FeatureButton 
          icon={<ShareAltOutlined />}
          onClick={handleShareTest}
        >
          分享功能测试
        </FeatureButton>

        <FeatureButton 
          icon={<span>👆</span>}
          onClick={handleTouchTest}
          onTouchStart={(e) => {
            e.currentTarget.classList.add('touch-active');
          }}
          onTouchEnd={(e) => {
            setTimeout(() => {
              e.currentTarget.classList.remove('touch-active');
            }, 150);
          }}
        >
          触摸反馈测试 ({touchCount})
        </FeatureButton>

        <FeatureButton 
          icon={<BellOutlined />}
          onClick={handleNotificationTest}
        >
          通知权限测试
        </FeatureButton>

        <FeatureButton 
          onClick={handleCopyTest}
        >
          📋 剪贴板测试
        </FeatureButton>

        <FeatureButton 
          onClick={handleFullscreenTest}
        >
          🔳 全屏模式测试
        </FeatureButton>
      </DemoCard>

      {/* 使用说明 */}
      <DemoCard title="💡 使用说明">
        <div style={{ fontSize: 14, lineHeight: 1.6, color: '#666' }}>
          <p><strong>电脑端测试说明：</strong></p>
          <ul style={{ paddingLeft: 20, margin: '8px 0' }}>
            <li>按 <kbd>F12</kbd> 打开开发者工具</li>
            <li>点击设备模拟图标 📱</li>
            <li>选择iPhone、Android等设备</li>
            <li>按 <kbd>Ctrl+Shift+M</kbd> 显示工具栏</li>
          </ul>
          
          <p><strong>移动端特性：</strong></p>
          <ul style={{ paddingLeft: 20, margin: '8px 0' }}>
            <li>触摸反馈和振动</li>
            <li>原生分享功能</li>
            <li>设备信息检测</li>
            <li>网络状态监控</li>
            <li>通知权限管理</li>
          </ul>
        </div>
      </DemoCard>
    </DemoContainer>
  );
};

export default MobileDemo;