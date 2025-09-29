import { apiClient } from './api';
import {
  Team,
  TeamMember,
  CreateTeamRequest,
  ApiResponse,
  PaginatedResponse,
} from '@/types';

export const teamService = {
  // 创建团队
  async createTeam(data: CreateTeamRequest): Promise<ApiResponse<{
    team: Team;
    member: TeamMember;
    pointsEarned: number;
  }>> {
    return apiClient.post('/teams', data);
  },

  // 加入团队
  async joinTeam(teamId: string): Promise<ApiResponse<{
    pointsEarned: number;
    teamInfo: Team;
    memberInfo: TeamMember;
  }>> {
    return apiClient.post(`/teams/${teamId}/join`);
  },

  // 通过邀请码加入团队
  async joinTeamByCode(inviteCode: string): Promise<ApiResponse<{
    pointsEarned: number;
    teamInfo: Team;
    memberInfo: TeamMember;
  }>> {
    return apiClient.post('/teams/join-by-code', { inviteCode });
  },

  // 获取我的活跃团队
  async getMyActiveTeam(): Promise<ApiResponse<{
    team: Team & { memberCount: number; remainingTime: number };
    myRole: 'captain' | 'member';
    members: Array<{
      id: string;
      username: string;
      role: 'captain' | 'member';
      pointsEarned: number;
      isNewUser: boolean;
      joinedAt: string;
    }>;
  } | null>> {
    return apiClient.get('/teams/my-active');
  },

  // 获取我的团队记录
  async getMyTeams(params?: {
    page?: number;
    limit?: number;
    status?: 'active' | 'completed' | 'expired';
  }): Promise<PaginatedResponse<TeamMember & { team: Team }>> {
    return apiClient.get('/teams/my', { params });
  },

  // 获取团队详情
  async getTeamDetail(teamId: string): Promise<ApiResponse<{
    team: Team;
    members: (TeamMember & { user: { username: string; phone: string } })[];
  }>> {
    return apiClient.get(`/teams/${teamId}`);
  },

  // 刷新邀请码
  async refreshInviteCode(): Promise<ApiResponse<{
    teamName: string;
    newInviteCode: string;
    newEndTime: Date;
    remainingTime: number;
    message: string;
  }>> {
    return apiClient.put('/teams/refresh-invite-code');
  },

  // 获取可加入的团队列表
  async getAvailableTeams(params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Team & { memberCount: number; captainName: string }>> {
    return apiClient.get('/teams/available', { params });
  },

  // 队长解散队伍
  async dissolveTeam(): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete('/teams');
  },

  // 队员退出队伍
  async leaveTeam(): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete('/teams/leave');
  },

  // 修正队伍状态（开发用）
  async fixTeamStatus(): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post('/teams/fix-status');
  },

  // 修复TeamRecord积分显示（开发用）
  async fixTeamRecords(): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post('/teams/fix-team-records');
  },
};