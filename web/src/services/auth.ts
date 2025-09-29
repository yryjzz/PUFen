import { apiClient } from './api';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  ApiResponse,
} from '@/types';

export const authService = {
  // 用户注册
  async register(data: RegisterRequest): Promise<AuthResponse> {
    return apiClient.post('/auth/register', data);
  },

  // 用户登录
  async login(data: LoginRequest): Promise<AuthResponse> {
    return apiClient.post('/auth/login', data);
  },

  // 获取用户信息
  async getProfile(): Promise<ApiResponse<User>> {
    return apiClient.get('/auth/profile');
  },

  // 登出
  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  },

  // 获取token
  getToken(): string | null {
    return localStorage.getItem('token');
  },

  // 设置token
  setToken(token: string) {
    localStorage.setItem('token', token);
  },

  // 检查是否已登录
  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};