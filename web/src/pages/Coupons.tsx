import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message, Tabs, Modal } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { SafeArea } from '../components/mobile';
import { setPageTitle } from '../utils/mobile';
import { couponService, CategorizedCoupons, UserCoupon } from '../services/coupon';

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
  padding: 20px 0;
`;

const StyledTabs = styled(Tabs)`
  .ant-tabs-nav {
    padding: 0 20px;
    margin-bottom: 16px;
  }
  
  .ant-tabs-tab {
    font-weight: 500;
  }
  
  .ant-tabs-content {
    padding: 0 20px;
  }
`;

const CouponItem = styled.div<{ status: string }>`
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  
  ${props => {
    if (props.status === 'unused') {
      return `
        border-left: 4px solid #4CAF50;
      `;
    } else if (props.status === 'used') {
      return `
        border-left: 4px solid #999;
        opacity: 0.7;
      `;
    } else {
      return `
        border-left: 4px solid #ff4757;
        opacity: 0.6;
      `;
    }
  }}
`;

const CouponTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
`;

const CouponDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const DiscountAmount = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #ff4757;
`;

const MinimumAmount = styled.div`
  font-size: 12px;
  color: #666;
`;

const CouponMeta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #999;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
  
  ${props => {
    if (props.status === 'unused') {
      return `
        background: #e8f5e8;
        color: #4CAF50;
      `;
    } else if (props.status === 'used') {
      return `
        background: #f5f5f5;
        color: #999;
      `;
    } else {
      return `
        background: #ffe6e6;
        color: #ff4757;
      `;
    }
  }}
`;

const CouponActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
  justify-content: flex-end;
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => {
    if (props.variant === 'primary') {
      return `
        background: #4CAF50;
        color: white;
        
        &:hover {
          background: #45a049;
          transform: translateY(-1px);
        }
      `;
    } else {
      return `
        background: #f5f5f5;
        color: #666;
        
        &:hover {
          background: #e8e8e8;
        }
      `;
    }
  }}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #999;
  
  .icon {
    font-size: 64px;
    margin-bottom: 16px;
    opacity: 0.3;
  }
  
  .text {
    font-size: 14px;
  }
`;

const Coupons: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [coupons, setCoupons] = useState<CategorizedCoupons>({
    unused: [],
    used: [],
    expired: []
  });

  useEffect(() => {
    setPageTitle('我的券');
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const response = await couponService.getMyCoupons();
      if (response.success) {
        setCoupons(response.data);
      }
    } catch (error) {
      message.error('加载券信息失败');
    } finally {
      setLoading(false);
    }
  };

  const handleUseCoupon = async (coupon: UserCoupon) => {
    try {
      const response = await couponService.useCoupon(coupon.id);
      if (response.success) {
        message.success('优惠券使用成功！');
        // 重新加载优惠券列表
        loadCoupons();
      } else {
        message.error(response.message || '使用失败');
      }
    } catch (error) {
      message.error('使用优惠券失败');
      console.error('Use coupon error:', error);
    }
  };

  const handleCopyCouponInfo = async (coupon: UserCoupon) => {
    const couponInfo = `🎟️ 优惠券信息\n类型：${coupon.couponType}\n优惠金额：¥${formatAmount(coupon.discountAmount)}\n使用门槛：满¥${formatAmount(coupon.minimumAmount)}可用\n到期时间：${formatDate(coupon.expiryDate)}`;
    
    try {
      await navigator.clipboard.writeText(couponInfo);
      message.success('优惠券信息已复制');
    } catch (err) {
      console.error('复制失败:', err);
      message.error('复制失败');
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  const formatAmount = (amount: number) => {
    return (amount / 100).toFixed(0);
  };

  const renderCouponList = (couponList: UserCoupon[], status: string) => {
    if (loading) {
      return (
        <EmptyState>
          <div className="icon">⏳</div>
          <div className="text">加载中...</div>
        </EmptyState>
      );
    }
    
    if (couponList.length === 0) {
      return (
        <EmptyState>
          <div className="icon">🎫</div>
          <div className="text">暂无{status === 'unused' ? '可用' : status === 'used' ? '已使用' : '已过期'}的券</div>
        </EmptyState>
      );
    }

    return couponList.map((coupon) => {
      // 检查是否即将过期（午12小时内）
      const expiryDate = new Date(coupon.expiryDate);
      const now = new Date();
      const hoursUntilExpiry = (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60);
      const isExpiringSoon = hoursUntilExpiry > 0 && hoursUntilExpiry <= 12;
      
      return (
        <CouponItem key={coupon.id} status={status}>
          <CouponTitle>{coupon.couponType}</CouponTitle>
          <CouponDetails>
            <DiscountAmount>¥{formatAmount(coupon.discountAmount)}</DiscountAmount>
            <MinimumAmount>满¥{formatAmount(coupon.minimumAmount)}可用</MinimumAmount>
          </CouponDetails>
          <CouponMeta>
            <span style={{ color: isExpiringSoon ? '#ff4757' : '#999' }}>
              到期时间: {formatDate(coupon.expiryDate)}
              {isExpiringSoon && ' (即将过期)'}
            </span>
            <StatusBadge status={status}>
              {status === 'unused' ? '未使用' : status === 'used' ? '已使用' : '已过期'}
            </StatusBadge>
          </CouponMeta>
          {coupon.usedAt && (
            <CouponMeta>
              <span>使用时间: {formatDate(coupon.usedAt)}</span>
            </CouponMeta>
          )}
          
          {/* 操作按钮 */}
          <CouponActions>
            <ActionButton 
              variant="secondary" 
              onClick={() => handleCopyCouponInfo(coupon)}
            >
              复制信息
            </ActionButton>
            
            {status === 'unused' && (
              <ActionButton 
                variant="primary" 
                onClick={() => {
                  Modal.confirm({
                    title: '确认使用优惠券？',
                    content: `即将使用「${coupon.couponType}」优惠券，使用后不可撤回。`,
                    onOk: () => handleUseCoupon(coupon),
                    okText: '确认使用',
                    cancelText: '取消'
                  });
                }}
              >
                使用优惠券
              </ActionButton>
            )}
          </CouponActions>
        </CouponItem>
      );
    });
  };

  const tabItems = [
    {
      key: 'unused',
      label: `可用 (${coupons.unused.length})`,
      children: renderCouponList(coupons.unused, 'unused'),
    },
    {
      key: 'used',
      label: `已使用 (${coupons.used.length})`,
      children: renderCouponList(coupons.used, 'used'),
    },
    {
      key: 'expired',
      label: `已过期 (${coupons.expired.length})`,
      children: renderCouponList(coupons.expired, 'expired'),
    },
  ];

  return (
    <SafeArea>
      <Container>
        <Header>
          <BackButton onClick={() => navigate('/')}>
            <LeftOutlined />
          </BackButton>
          
          <Title>我的券</Title>
          
          <div style={{ width: 32 }} />
        </Header>

        <ContentCard>
          <StyledTabs 
            items={tabItems}
            defaultActiveKey="unused"
          />
        </ContentCard>
      </Container>
    </SafeArea>
  );
};

export default Coupons;