import { apiClient } from './api';

export interface UserCoupon {
  id: string;
  userId: string;
  couponType: string;
  discountAmount: number;
  minimumAmount: number;
  status: 'unused' | 'used' | 'expired';
  usedAt?: string;
  expiryDate: string;
  source: string;
  relatedId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CouponStats {
  total: number;
  unused: number;
  used: number;
  expired: number;
}

export interface CategorizedCoupons {
  unused: UserCoupon[];
  used: UserCoupon[];
  expired: UserCoupon[];
}

export const couponService = {
  // 获取用户的所有券
  async getMyCoupons(): Promise<{
    success: boolean;
    data: CategorizedCoupons;
  }> {
    return apiClient.get('/coupons/my');
  },

  // 使用券
  async useCoupon(couponId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    return apiClient.post(`/coupons/${couponId}/use`);
  },

  // 获取券统计
  async getCouponStats(): Promise<{
    success: boolean;
    data: CouponStats;
  }> {
    return apiClient.get('/coupons/stats');
  },
};