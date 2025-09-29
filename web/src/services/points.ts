import { apiClient } from './api';
import {
  PointsAccount,
  SignInResponse,
  SignInConfig,
  ApiResponse,
  PaginatedResponse,
} from '@/types';

export const pointsService = {
  // 获取积分账户信息
  async getPointsAccount(): Promise<ApiResponse<PointsAccount>> {
    return apiClient.get('/points/account');
  },

  // 获取本周签到配置
  async getWeeklyConfig(): Promise<ApiResponse<SignInConfig>> {
    return apiClient.get('/signin/config');
  },

  // 获取签到状态
  async getSignInStatus(): Promise<ApiResponse<{
    todaySignedIn: boolean;
    continuousDays: number;
    weekStatus: Array<{
      date: string;
      signed: boolean;
      points: number;
      isToday: boolean;
    }>;
  }>> {
    return apiClient.get('/signin/status');
  },

  // 每日签到
  async signIn(): Promise<SignInResponse> {
    return apiClient.post('/signin');
  },

  // 获取积分流水记录
  async getPointsTransactions(params?: {
    page?: number;
    limit?: number;
    type?: 'earn' | 'use' | 'expire';
  }): Promise<PaginatedResponse<any>> {
    return apiClient.get('/records/points', { params });
  },
};