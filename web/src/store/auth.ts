import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, PointsAccount } from '@/types';
import { authService } from '@/services/auth';

interface AuthState {
  user: User | null;
  pointsAccount: PointsAccount | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  
  // Actions
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  updatePointsAccount: (account: PointsAccount) => void;
  setLoading: (loading: boolean) => void;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (authenticated: boolean) => void;
  checkAuth: () => Promise<void>;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      pointsAccount: null,
      token: null,
      isAuthenticated: false,
      loading: true, // 初始化时设置为true，避免闪烁

      login: (token: string, user: User) => {
        authService.setToken(token);
        set({
          user,
          token,
          isAuthenticated: true,
          loading: false, // 登录完成后设置loading为false
        });
      },

      logout: () => {
        authService.logout();
        set({
          user: null,
          pointsAccount: null,
          token: null,
          isAuthenticated: false,
        });
      },

      updateUser: (user: User) => {
        set({ user });
      },

      updatePointsAccount: (account: PointsAccount) => {
        set({ pointsAccount: account });
      },

      setLoading: (loading: boolean) => {
        set({ loading });
      },

      setUser: (user: User | null) => {
        set({ user });
      },

      setIsAuthenticated: (authenticated: boolean) => {
        set({ isAuthenticated: authenticated });
      },

      checkAuth: async () => {
        const token = authService.getToken();
        if (!token) {
          set({ isAuthenticated: false });
          return;
        }

        try {
          set({ loading: true });
          const response = await authService.getProfile();
          if (response.success && response.data) {
            set({
              user: response.data,
              token,
              isAuthenticated: true,
            });
          } else {
            authService.logout();
            set({ isAuthenticated: false });
          }
        } catch (error) {
          authService.logout();
          set({ isAuthenticated: false });
        } finally {
          set({ loading: false });
        }
      },

      initialize: () => {
        console.log('Auth store initialize 开始');
        const token = authService.getToken();
        console.log('从localStorage获取token:', token ? `${token.substring(0, 10)}...` : 'null');
        
        const newState = {
          isAuthenticated: !!token,
          token,
          loading: false // 重要：初始化完成后设置loading为false
        };
        
        console.log('Auth store 设置新状态:', newState);
        set(newState);
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // 恢复状态后设置loading为false，避免无限加载
        if (state) {
          state.loading = false;
        }
      },
    }
  )
);