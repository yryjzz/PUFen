import { apiClient } from './api';
import {
  RewardItem,
  RewardRecord,
  ExchangeRequest,
  ExchangeResponse,
  ApiResponse,
  PaginatedResponse,
} from '@/types';

export const rewardService = {
  // 获取可兑换商品列表
  async getRewardItems(params?: {
    stage?: number;
    isLimited?: boolean;
  }): Promise<ApiResponse<{
    items: RewardItem[];
    stage2Unlocked: boolean;
    availableStages: number[];
    stageStats: {
      stage1: {
        totalItems: number;
        availableItems: number;
        soldOutItems: number;
      };
      stage2: {
        totalItems: number;
        availableItems: number;
        soldOutItems: number;
      };
      stage2Unlocked: boolean;
    };
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>> {
    return apiClient.get('/rewards', { params });
  },

  // 兑换商品
  async exchangeReward(data: ExchangeRequest): Promise<ExchangeResponse> {
    return apiClient.post('/rewards/exchange', data);
  },

  // 获取兑换记录
  async getExchangeRecords(params?: {
    page?: number;
    limit?: number;
    status?: 'pending' | 'completed' | 'cancelled';
  }): Promise<PaginatedResponse<RewardRecord & { rewardItem: RewardItem }>> {
    return apiClient.get('/records/exchange', { params });
  },

  // 获取优惠券详情
  async getCouponDetail(couponCode: string): Promise<ApiResponse<{
    couponCode: string;
    couponType: string;
    couponValue: number;
    conditionAmount: number;
    status: string;
    expiryDate: string;
  }>> {
    return apiClient.get(`/coupons/${couponCode}`);
  },
};