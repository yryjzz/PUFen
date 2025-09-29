// 用户相关类型
export interface User {
  id: string;
  username: string;
  nickname?: string;
  phone: string;
  points?: number;
  isNewUser: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  phone: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: User;
  token: string;
}

// 积分账户相关类型
export interface PointsAccount {
  id: string;
  userId: string;
  balance: number;
  totalEarned: number;
  totalUsed: number;
  createdAt: string;
  updatedAt: string;
}

// 签到相关类型
export interface SignInConfig {
  id: string;
  weekStartDate: string;
  basePoints: number;
  day1Multiplier: number;
  day2Multiplier: number;
  day3Multiplier: number;
  day4Multiplier: number;
  day5Multiplier: number;
  day6Multiplier: number;
  day7Multiplier: number;
  bonusDay: number;
  bonusCoupon: string;
  createdAt: string;
}

export interface SignInRecord {
  id: string;
  userId: string;
  configId: string;
  signInDate: string;
  pointsEarned: number;
  isMakeUp: boolean;
  makeUpCost?: number | string;
  createdAt: string;
}

export interface SignInResponse {
  success: boolean;
  message: string;
  data: {
    pointsEarned: number;
    continuousDays: number;
    hasBonus: boolean;
    bonusCoupon?: string;
  };
}

// 组队相关类型
export interface Team {
  id: string;
  captainId: string;
  name: string;
  inviteCode: string;
  startTime: string;
  endTime: string;
  totalPoints: number;
  status: 'active' | 'completed' | 'expired';
  createdAt: string;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: 'captain' | 'member';
  isNewUser: boolean;
  pointsEarned: number;
  joinedAt: string;
}

export interface CreateTeamRequest {
  name: string;
}

// 兑换相关类型
export interface RewardItem {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  couponType: string;
  couponValue: number;
  conditionAmount: number;
  stock: number;
  stage: number;
  isLimited: boolean;
  createdAt: string;
  // 新增的状态属性
  isUnlocked?: boolean;      // 是否已解锁
  hasStock?: boolean;        // 是否有库存
  canExchange?: boolean;     // 是否可以兑换
  lockReason?: string | null; // 锁定原因
  available?: boolean;       // 保持向后兼容
  soldOut?: boolean;         // 保持向后兼容
}

export interface RewardRecord {
  id: string;
  userId: string;
  rewardItemId: string;
  pointsCost: number;
  couponCode: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface ExchangeRequest {
  rewardItemId: string;
}

export interface ExchangeResponse {
  success: boolean;
  message: string;
  data: {
    couponCode: string;
    pointsCost: number;
    newBalance: number;
    stage2Unlocked: boolean;
    stageUnlockMessage?: string;
    itemSoldOut: boolean;
    newStageUnlocked?: boolean; // 保持向后兼容
  };
}

// 积分流水类型
export interface PointsTransaction {
  id: string;
  userId: string;
  accountId: string;
  amount: number;
  type: 'earn' | 'use' | 'expire';
  source: 'signin' | 'team' | 'reward' | 'makeup' | 'order';
  relatedId: string;
  description: string;
  balanceBefore: number;
  balanceAfter: number;
  createdAt: string;
}

// 通用API响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  code?: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    records: T[];
    total: number;
    page: number;
    limit: number;
  };
}

// 分页参数
export interface PaginationParams {
  page?: number;
  limit?: number;
}