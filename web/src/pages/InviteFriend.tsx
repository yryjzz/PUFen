import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { message, Modal } from 'antd';
import { 
  LeftOutlined, 
  ShareAltOutlined, 
  TeamOutlined, 
  CopyOutlined, 
  UserAddOutlined, 
  ReloadOutlined,
  CrownOutlined,
  GiftOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { SafeArea } from '../components/mobile';
import { setPageTitle, share } from '../utils/mobile';
import { teamService } from '../services/team';

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
  border-radius: 20px 20px 0 0;
  min-height: calc(100vh - 84px);
  padding: 0;
  margin-top: 20px;
  box-shadow: 0 -2px 20px rgba(0, 0, 0, 0.1);
`;

const WelcomeSection = styled.div`
  text-align: center;
  padding: 24px 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 20px 20px 0 0;
  
  .welcome-title {
    font-size: 24px;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 8px;
  }
  
  .welcome-subtitle {
    font-size: 16px;
    color: #7f8c8d;
    margin-bottom: 0;
  }
`;

const MainContent = styled.div`
  padding: 20px;
`;

const TeamCard = styled.div`
  background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
  color: white;
  position: relative;
  box-shadow: 0 8px 32px rgba(76, 175, 80, 0.3);
  
  .team-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
  }
  
  .team-info {
    flex: 1;
  }
  
  .team-name {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .team-id {
    font-size: 14px;
    opacity: 0.8;
    margin-bottom: 12px;
  }
  
  .team-stats {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 16px;
    margin-bottom: 16px;
  }
  
  .stat-item {
    text-align: center;
  }
  
  .stat-value {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 4px;
  }
  
  .stat-label {
    font-size: 12px;
    opacity: 0.8;
  }
  
  .refresh-btn {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: rotate(90deg);
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
  
  .time-remaining {
    text-align: center;
    font-size: 14px;
    opacity: 0.8;
    background: rgba(255, 255, 255, 0.1);
    padding: 8px 12px;
    border-radius: 8px;
  }
`;

const MembersSection = styled.div`
  margin-bottom: 24px;
  
  .section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 18px;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 16px;
    
    .anticon {
      color: #4CAF50;
    }
  }
`;

const MemberCard = styled.div<{ isCaptain?: boolean }>`
  background: ${props => props.isCaptain 
    ? 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)' 
    : '#f8f9fa'};
  border: 1px solid ${props => props.isCaptain ? '#ffb74d' : '#e9ecef'};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .member-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .member-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    position: relative;
    
    ${props => props.isCaptain && `
      background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
    `}
  }
  
  .crown-icon {
    position: absolute;
    top: -8px;
    right: -8px;
    color: #f39c12;
    font-size: 16px;
  }
  
  .member-details {
    .member-name {
      font-size: 16px;
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    
    .member-role {
      font-size: 14px;
      color: #7f8c8d;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    
    .new-badge {
      background: #e74c3c;
      color: white;
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 8px;
      margin-left: 8px;
    }
  }
  
  .member-points {
    text-align: right;
    
    .points-value {
      font-size: 18px;
      font-weight: 700;
      color: #4CAF50;
      margin-bottom: 4px;
    }
    
    .points-label {
      font-size: 12px;
      color: #7f8c8d;
    }
  }
`;

const InviteCodeCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  text-align: center;
  color: white;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
  
  .invite-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 16px;
    opacity: 0.9;
  }
  
  .invite-code {
    font-size: 32px;
    font-weight: 700;
    letter-spacing: 4px;
    margin-bottom: 8px;
    font-family: 'Courier New', monospace;
    background: rgba(255, 255, 255, 0.1);
    padding: 12px 20px;
    border-radius: 12px;
    border: 2px dashed rgba(255, 255, 255, 0.3);
  }
  
  .invite-tip {
    font-size: 14px;
    opacity: 0.8;
    margin-bottom: 20px;
  }
  
  .invite-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  
  .invite-btn {
    height: 40px;
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.2);
    color: white;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;

const RulesSection = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  
  .rules-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 16px;
    
    .anticon {
      color: #f39c12;
    }
  }
  
  .rules-list {
    list-style: none;
    padding: 0;
    margin: 0;
    
    li {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 12px;
      font-size: 14px;
      color: #495057;
      line-height: 1.5;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .rule-icon {
        color: #4CAF50;
        margin-top: 2px;
        flex-shrink: 0;
      }
    }
  }
`;

const CreateTeamSection = styled.div`
  text-align: center;
  padding: 40px 20px;
  
  .create-icon {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    color: white;
    font-size: 36px;
  }
  
  .create-title {
    font-size: 20px;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 8px;
  }
  
  .create-subtitle {
    font-size: 14px;
    color: #7f8c8d;
    margin-bottom: 24px;
  }
  
  .create-form {
    max-width: 300px;
    margin: 0 auto;
  }
  
  .team-name-input {
    width: 100%;
    height: 48px;
    border: 2px solid #e9ecef;
    border-radius: 12px;
    padding: 0 16px;
    font-size: 16px;
    margin-bottom: 16px;
    transition: border-color 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: #4CAF50;
    }
    
    &::placeholder {
      color: #adb5bd;
    }
  }
  
  .create-btn {
    width: 100%;
    height: 48px;
    background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
    border: none;
    border-radius: 12px;
    color: white;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(76, 175, 80, 0.4);
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
  }
`;

const JoinSection = styled.div`
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e9ecef;

  .section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 16px;

    .anticon {
      color: #4CAF50;
    }
  }

  .input-group {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;

    input {
      flex: 1;
      height: 48px;
      border: 2px solid #e9ecef;
      border-radius: 12px;
      padding: 0 16px;
      font-size: 16px;
      text-transform: uppercase;
      letter-spacing: 2px;
      text-align: center;
      transition: border-color 0.3s ease;

      &:focus {
        outline: none;
        border-color: #4CAF50;
      }

      &::placeholder {
        color: #adb5bd;
        text-transform: none;
        letter-spacing: normal;
      }
    }

    button {
      width: 80px;
      height: 48px;
      background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
      border: none;
      border-radius: 12px;
      color: white;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(76, 175, 80, 0.4);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }
    }
  }

  .input-tip {
    font-size: 13px;
    color: #7f8c8d;
    text-align: center;
    line-height: 1.5;
    
    .highlight {
      color: #e74c3c;
      font-weight: 600;
    }
  }
`;

const TeamActionsSection = styled.div`
  margin-bottom: 24px;
  
  .actions-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 16px;
    
    .anticon {
      color: #e74c3c;
    }
  }
  
  .action-button {
    width: 100%;
    height: 48px;
    background: #dc3545;
    border: none;
    border-radius: 12px;
    color: white;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    
    &:hover {
      background: #c82333;
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(220, 53, 69, 0.3);
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
      background: #dc3545;
    }
    
    &.captain {
      background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
      
      &:hover {
        background: linear-gradient(135deg, #e67e22 0%, #d35400 100%);
      }
      
      &:disabled {
        background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
      }
    }
  }
  
  .action-tip {
    margin-top: 12px;
    font-size: 14px;
    color: #7f8c8d;
    text-align: center;
    line-height: 1.5;
    
    .warning {
      color: #e74c3c;
      font-weight: 600;
    }
  }
`;

export default function InviteFriend() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [inviteCode, setInviteCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [hasTeam, setHasTeam] = useState(false);
  const [loading, setLoading] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamInfo, setTeamInfo] = useState({
    name: '我的团队',
    memberCount: 1,
    totalPoints: 50,
    remainingTime: 0,
    members: [] as any[],
    myRole: 'member' as 'captain' | 'member'
  });

  // 加载团队信息
  const loadTeamInfo = async () => {
    try {
      setLoading(true);
      const response = await teamService.getMyActiveTeam();
      
      if (response.success && response.data) {
        const { team, members, myRole } = response.data;
        setTeamInfo({
          name: team.name,
          memberCount: team.memberCount,
          totalPoints: members.reduce((sum, member) => sum + member.pointsEarned, 0),
          remainingTime: team.remainingTime,
          members: members,
          myRole: myRole
        });
        setInviteCode(team.inviteCode);
        setHasTeam(true);
      } else {
        setHasTeam(false);
      }
    } catch (error: any) {
      console.error('加载团队信息失败:', error);
      // 只有真正的网络错误才提示用户
      if (error?.message && !error.message.includes('暂无')) {
        message.error('网络连接失败，请检查网络');
      }
      setHasTeam(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPageTitle('邀请好友');
    
    // 检查URL参数中的邀请码
    const code = searchParams.get('code');
    if (code) {
      setInputCode(code);
      handleJoinTeam(code);
    }
    
    // 加载用户的团队信息
    loadTeamInfo();
  }, [searchParams]);

  const handleRefreshInviteCode = async () => {
    try {
      setLoading(true);
      const response = await teamService.refreshInviteCode();
      
      if (response.success && response.data) {
        setInviteCode(response.data.newInviteCode);
        message.success('邀请码已刷新，团队有效期重新计时3小时！');
        // 重新加载团队信息以获取最新状态
        await loadTeamInfo();
      } else {
        message.error(response.message || '刷新失败');
      }
    } catch (error: any) {
      console.error('刷新邀请码失败:', error);
      
      // 处理不同类型的错误
      if (error?.message && typeof error.message === 'string') {
        // 后端返回的错误信息
        message.error(error.message);
      } else if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('Network Error')) {
        message.error('网络连接失败，请检查网络');
      } else if (error?.code === 'ECONNABORTED' || (typeof error === 'object' && error.toString().includes('timeout'))) {
        message.error('请求超时，请稍后重试');
      } else {
        message.error('刷新邀请码失败，请稍后重试');
      }
    } finally {
      setLoading(false);
    }
  };

  // 创建团队
  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      message.error('请输入团队名称');
      return;
    }
    
    try {
      setLoading(true);
      const response = await teamService.createTeam({ name: teamName.trim() });
      
      if (response.success && response.data) {
        message.success(`团队「${response.data.team.name}」创建成功！`);
        // 重新加载团队信息
        await loadTeamInfo();
        setTeamName('');
      } else {
        message.error(response.message || '创建失败');
      }
    } catch (error: any) {
      console.error('创建团队失败:', error);
      
      // 处理不同类型的错误
      if (error?.message && typeof error.message === 'string') {
        // 后端返回的错误信息
        message.error(error.message);
      } else if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('Network Error')) {
        message.error('网络连接失败，请检查网络');
      } else if (error?.code === 'ECONNABORTED' || (typeof error === 'object' && error.toString().includes('timeout'))) {
        message.error('请求超时，请稍后重试');
      } else {
        message.error('创建团队失败，请稍后重试');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTeam = async (code: string) => {
    if (!code.trim()) {
      message.error('请输入邀请码');
      return;
    }
    
    try {
      setLoading(true);
      const response = await teamService.joinTeamByCode(code);
      
      if (response.success && response.data) {
        message.success(`成功加入团队「${response.data.teamInfo?.name || ''}」！`);
        // 重新加载团队信息
        await loadTeamInfo();
        setInputCode('');
      } else {
        message.error(response.message || '加入失败');
      }
    } catch (error: any) {
      console.error('加入团队失败:', error);
      
      // 处理不同类型的错误
      if (error?.message && typeof error.message === 'string') {
        // 后端返回的错误信息
        message.error(error.message);
      } else if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('Network Error')) {
        message.error('网络连接失败，请检查网络');
      } else if (error?.code === 'ECONNABORTED' || (typeof error === 'object' && error.toString().includes('timeout'))) {
        message.error('请求超时，请稍后重试');
      } else {
        message.error('加入团队失败，请稍后重试');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      const shareText = `🎉 邀请你加入我的团队「${teamInfo.name}」，一起瓜分积分！\n\n邀请码：${inviteCode}\n\n快来参与吧！`;
      
      await share({
        title: '团队邀请',
        text: shareText,
        url: `${window.location.origin}/invite?code=${inviteCode}`
      });
    } catch (err) {
      console.error('分享失败:', err);
      // 如果分享API不可用，复制到剪贴板
      try {
        const fallbackText = `🎉 邀请你加入我的团队「${teamInfo.name}」，一起瓜分积分！\n\n邀请码：${inviteCode}\n\n${window.location.origin}/invite?code=${inviteCode}`;
        await navigator.clipboard.writeText(fallbackText);
        message.success('邀请链接已复制到剪贴板');
      } catch (clipErr) {
        message.error('分享失败');
      }
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      message.success('邀请码已复制');
    } catch (err) {
      console.error('复制失败:', err);
      message.error('复制失败');
    }
  };

  // 格式化剩余时间
  const formatRemainingTime = (seconds: number) => {
    if (seconds <= 0) return '已过期';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}小时${minutes}分钟`;
  };

  // 队长解散队伍
  const handleDissolveTeam = async () => {
    // 使用 Ant Design 的模态对话框
    Modal.confirm({
      title: '解散队伍',
      content: (
        <div>
          <p>确定要解散团队「{teamInfo.name}」吗？</p>
          <p style={{ color: '#ff4d4f', fontSize: '14px', marginBottom: 0 }}>
            注意：已满员的团队无法解散！
          </p>
        </div>
      ),
      icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
      okText: '确定解散',
      cancelText: '取消',
      okType: 'danger',
      onOk: async () => {
        try {
          setLoading(true);
          const response = await teamService.dissolveTeam();
          
          if (response.success) {
            message.success('团队已解散');
            // 重新加载页面状态
            await loadTeamInfo();
          } else {
            message.error(response.message || '解散失败');
          }
        } catch (error: any) {
          console.error('解散团队失败:', error);
          
          // 处理不同类型的错误
          if (error?.message && typeof error.message === 'string') {
            // 后端返回的错误信息
            message.error(error.message);
          } else if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('Network Error')) {
            message.error('网络连接失败，请检查网络');
          } else if (error?.code === 'ECONNABORTED' || (typeof error === 'object' && error.toString().includes('timeout'))) {
            message.error('请求超时，请稍后重试');
          } else {
            message.error('解散团队失败，请稍后重试');
          }
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // 队员退出队伍
  const handleLeaveTeam = async () => {
    // 使用 Ant Design 的模态对话框
    Modal.confirm({
      title: '退出队伍',
      content: (
        <div>
          <p>确定要退出团队「{teamInfo.name}」吗？</p>
          <p style={{ color: '#ff4d4f', fontSize: '14px', marginBottom: 0 }}>
            注意：已满员的团队无法退出！
          </p>
        </div>
      ),
      icon: <ExclamationCircleOutlined style={{ color: '#ff7a45' }} />,
      okText: '确定退出',
      cancelText: '取消',
      okType: 'primary',
      onOk: async () => {
        try {
          setLoading(true);
          const response = await teamService.leaveTeam();
          
          if (response.success) {
            message.success('已退出团队');
            // 重新加载页面状态
            await loadTeamInfo();
          } else {
            message.error(response.message || '退出失败');
          }
        } catch (error: any) {
          console.error('退出团队失败:', error);
          
          // 处理不同类型的错误
          if (error?.message && typeof error.message === 'string') {
            // 后端返回的错误信息
            message.error(error.message);
          } else if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('Network Error')) {
            message.error('网络连接失败，请检查网络');
          } else if (error?.code === 'ECONNABORTED' || (typeof error === 'object' && error.toString().includes('timeout'))) {
            message.error('请求超时，请稍后重试');
          } else {
            message.error('退出团队失败，请稍后重试');
          }
        } finally {
          setLoading(false);
        }
      }
    });
  };

  return (
    <Container>
      <SafeArea>
        <Header>
          <BackButton onClick={() => navigate(-1)}>
            <LeftOutlined />
          </BackButton>
          <Title>团队协作</Title>
          <div style={{ width: '36px' }} />
        </Header>

        <ContentCard>
          <WelcomeSection>
            <div className="welcome-title">🎉 团队积分大作战</div>
            <div className="welcome-subtitle">
              {hasTeam ? '管理您的团队，邀请好友一起赚积分！' : '创建或加入团队，开启协作之旅！'}
            </div>
          </WelcomeSection>

          <MainContent>
            {!hasTeam ? (
              // 没有团队时显示创建团队选项
              <>
                <CreateTeamSection>
                  <div className="create-icon">
                    <TeamOutlined />
                  </div>
                  <div className="create-title">创建我的团队</div>
                  <div className="create-subtitle">成为队长，邀请好友一起赚积分</div>
                  <div className="create-form">
                    <input
                      type="text"
                      className="team-name-input"
                      placeholder="输入团队名称（最多20字符）"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      maxLength={20}
                    />
                    <button 
                      className="create-btn"
                      onClick={handleCreateTeam}
                      disabled={!teamName.trim() || loading}
                    >
                      {loading ? '创建中...' : '创建团队'}
                    </button>
                  </div>
                </CreateTeamSection>

                <RulesSection>
                  <div className="rules-title">
                    <InfoCircleOutlined />
                    团队积分规则
                  </div>
                  <ul className="rules-list">
                    <li>
                      <CheckCircleOutlined className="rule-icon" />
                      每个团队最多3人，队长获得50分，成员各获得25分
                    </li>
                    <li>
                      <CheckCircleOutlined className="rule-icon" />
                      邀请新用户额外奖励：新用户+10分，队长+10分
                    </li>
                    <li>
                      <CheckCircleOutlined className="rule-icon" />
                      团队有效期3小时，队长可随时刷新邀请码
                    </li>
                    <li>
                      <CheckCircleOutlined className="rule-icon" />
                      每个用户只能加入一个活跃团队
                    </li>
                  </ul>
                </RulesSection>
              </>
            ) : (
              // 有团队时显示团队信息
              <>
                <TeamCard>
                  <button 
                    className="refresh-btn" 
                    onClick={handleRefreshInviteCode}
                    disabled={loading}
                  >
                    <ReloadOutlined />
                  </button>
                  
                  <div className="team-header">
                    <div className="team-info">
                      <div className="team-name">
                        <TeamOutlined />
                        {teamInfo.name}
                      </div>
                      <div className="team-id">团队ID: {inviteCode}</div>
                    </div>
                  </div>

                  <div className="team-stats">
                    <div className="stat-item">
                      <div className="stat-value">{teamInfo.memberCount}</div>
                      <div className="stat-label">成员数量</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value">{teamInfo.totalPoints}</div>
                      <div className="stat-label">总积分</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value">{3 - teamInfo.memberCount}</div>
                      <div className="stat-label">剩余名额</div>
                    </div>
                  </div>

                  <div className="time-remaining">
                    剩余时间：{formatRemainingTime(teamInfo.remainingTime)}
                  </div>
                </TeamCard>

                {/* 成员列表 */}
                <MembersSection>
                  <div className="section-title">
                    <TeamOutlined />
                    团队成员 ({teamInfo.memberCount}/3)
                  </div>
                  {teamInfo.members.map((member) => (
                    <MemberCard key={member.id} isCaptain={member.role === 'captain'}>
                      <div className="member-info">
                        <div className="member-avatar">
                          {member.role === 'captain' && (
                            <CrownOutlined className="crown-icon" />
                          )}
                          {member.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="member-details">
                          <div className="member-name">
                            {member.username}
                            {member.isNewUser && <span className="new-badge">新用户</span>}
                          </div>
                          <div className="member-role">
                            {member.role === 'captain' ? (
                              <>
                                <CrownOutlined style={{ color: '#f39c12' }} />
                                队长
                              </>
                            ) : (
                              '队员'
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="member-points">
                        {teamInfo.memberCount >= 3 ? (
                          <>
                            <div className="points-value">+{member.pointsEarned}</div>
                            <div className="points-label">积分</div>
                          </>
                        ) : (
                          <div className="points-label" style={{ fontSize: '12px', color: '#999' }}>
                            满员后结算
                          </div>
                        )}
                      </div>
                    </MemberCard>
                  ))}
                </MembersSection>

                {/* 团队操作 */}
                <TeamActionsSection>
                  <div className="actions-title">
                    <ExclamationCircleOutlined />
                    团队操作
                  </div>
                  <button 
                    className={`action-button ${teamInfo.myRole === 'captain' ? 'captain' : ''}`}
                    onClick={teamInfo.myRole === 'captain' ? handleDissolveTeam : handleLeaveTeam}
                    disabled={loading || teamInfo.memberCount >= 3}
                  >
                    {loading ? (
                      <>
                        <ReloadOutlined spin />
                        {teamInfo.myRole === 'captain' ? '解散中...' : '退出中...'}
                      </>
                    ) : teamInfo.myRole === 'captain' ? (
                      <>
                        <CrownOutlined />
                        解散团队
                      </>
                    ) : (
                      <>
                        <ExclamationCircleOutlined />
                        退出团队
                      </>
                    )}
                  </button>
                  <div className="action-tip">
                    {teamInfo.memberCount >= 3 ? (
                      <span className="warning">团队已满员，无法{teamInfo.myRole === 'captain' ? '解散' : '退出'}</span>
                    ) : (
                      `${teamInfo.myRole === 'captain' ? '解散后团队将被删除，所有成员将离开' : '退出后需要重新加入其他团队'}`
                    )}
                  </div>
                </TeamActionsSection>

                {/* 邀请码分享 */}
                <InviteCodeCard>
                  <div className="invite-title">
                    <ShareAltOutlined /> 我的邀请码
                  </div>
                  <div className="invite-code">{inviteCode}</div>
                  <div className="invite-tip">分享此码邀请好友加入团队</div>
                  <div className="invite-actions">
                    <button className="invite-btn" onClick={handleShare}>
                      <ShareAltOutlined />
                      分享
                    </button>
                    <button className="invite-btn" onClick={handleCopyCode}>
                      <CopyOutlined />
                      复制
                    </button>
                  </div>
                </InviteCodeCard>

                {/* 积分规则说明 */}
                <RulesSection>
                  <div className="rules-title">
                    <GiftOutlined />
                    积分奖励详情
                  </div>
                  <ul className="rules-list">
                    <li>
                      <CheckCircleOutlined className="rule-icon" />
                      队长基础奖励：50积分
                    </li>
                    <li>
                      <CheckCircleOutlined className="rule-icon" />
                      队员基础奖励：25积分
                    </li>
                    <li>
                      <CheckCircleOutlined className="rule-icon" />
                      邀请新用户：新用户+10分，队长+10分
                    </li>
                    <li>
                      <CheckCircleOutlined className="rule-icon" />
                      积分可用于兑换丰厚奖品
                    </li>
                  </ul>
                </RulesSection>
              </>
            )}

            {/* 加入其他团队 */}
            <JoinSection>
              <div className="section-title">
                <UserAddOutlined />
                加入其他团队
              </div>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="输入 6 位邀请码"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  maxLength={6}
                />
                <button 
                  onClick={() => handleJoinTeam(inputCode)}
                  disabled={!inputCode.trim() || loading}
                >
                  加入
                </button>
              </div>
              <div className="input-tip">
                输入好友的邀请码即可加入他们的团队<br/>
                <span className="highlight">每个人只能加入一个团队</span>
              </div>
            </JoinSection>
          </MainContent>
        </ContentCard>
      </SafeArea>
    </Container>
  );
}