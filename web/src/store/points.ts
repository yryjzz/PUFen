import { create } from 'zustand';
import { SignInConfig, PointsAccount } from '@/types';

interface PointsState {
  pointsAccount: PointsAccount | null;
  weeklyConfig: SignInConfig | null;
  signInStatus: {
    todaySignedIn: boolean;
    continuousDays: number;
    weekStatus: Array<{
      date: string;
      signed: boolean;
      points: number;
      isToday: boolean;
    }>;
  } | null;
  loading: boolean;
  
  // Actions
  setPointsAccount: (account: PointsAccount) => void;
  setWeeklyConfig: (config: SignInConfig) => void;
  setSignInStatus: (status: {
    todaySignedIn: boolean;
    continuousDays: number;
    weekStatus: Array<{
      date: string;
      signed: boolean;
      points: number;
      isToday: boolean;
    }>;
  }) => void;
  setLoading: (loading: boolean) => void;
  updateBalance: (amount: number) => void;
}

export const usePointsStore = create<PointsState>((set, get) => ({
  pointsAccount: null,
  weeklyConfig: null,
  signInStatus: null,
  loading: false,

  setPointsAccount: (account: PointsAccount) => {
    set({ pointsAccount: account });
  },

  setWeeklyConfig: (config: SignInConfig) => {
    set({ weeklyConfig: config });
  },

  setSignInStatus: (status) => {
    set({ signInStatus: status });
  },

  setLoading: (loading: boolean) => {
    set({ loading });
  },

  updateBalance: (amount: number) => {
    const { pointsAccount } = get();
    if (pointsAccount) {
      set({
        pointsAccount: {
          ...pointsAccount,
          balance: pointsAccount.balance + amount,
          totalEarned: amount > 0 ? pointsAccount.totalEarned + amount : pointsAccount.totalEarned,
          totalUsed: amount < 0 ? pointsAccount.totalUsed + Math.abs(amount) : pointsAccount.totalUsed,
        },
      });
    }
  },
}));