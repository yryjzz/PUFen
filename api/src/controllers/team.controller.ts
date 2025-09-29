// team.controller.ts
import { FastifyPluginAsync } from "fastify";
import { authHook } from "../middleware/auth.hook";
import { AppDataSource } from "../config/db";
import { Team } from "../entities/Team";
import { TeamMember } from "../entities/TeamMember";
import { TeamRecord } from "../entities/TeamRecord";
import { User } from "../entities/User";
import { PointsAccount } from "../entities/PointsAccount";
import { PointsTransaction } from "../entities/PointsTransaction";

export const teamRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('preHandler', authHook);
    
  // 工具
    
  // 邀请码
  const generateInviteCode = (): string =>
    Math.random().toString(36).substring(2, 8).toUpperCase();
  // 积分
  const addPointsToUser = async (
    userId: string,
    points: number,
    desc: string,
    relatedId: string
  ) => {
    const paRepo = AppDataSource.getRepository(PointsAccount);
    const ptRepo = AppDataSource.getRepository(PointsTransaction);

    let account = await paRepo.findOneBy({ userId });
    if (!account) {
      account = paRepo.create({ userId, balance: 0, totalEarned: 0, totalUsed: 0 });
    }
    const before = account.balance;
    account.balance += points;
    account.totalEarned += points;
    await paRepo.save(account);

    const tran = ptRepo.create({
      userId,
      accountId: account.id,
      amount: points,
      type: 'earn',
      source: 'team',
      relatedId,
      description: desc,
      balanceBefore: before,
      balanceAfter: account.balance,
    });
    await ptRepo.save(tran);
    return account.balance;
  };

  // 组队记录
  const createTeamRecord = async (team: Team, members: TeamMember[]) => {
    const repo = AppDataSource.getRepository(TeamRecord);
    const records = members.map(m =>
      repo.create({
        userId: m.userId,
        teamId: team.id,
        teamName: team.name,
        role: m.role,
        pointsEarned: m.pointsEarned,
        isNewUser: m.isNewUser,
        status: team.status,
        memberCount: members.length,
        completedAt: new Date(),
      })
    );
    await repo.save(records);
    return records;
  };

  // 积分发放
  const distributePointsIfFull = async (teamId: string) => {
    const memberRepo = AppDataSource.getRepository(TeamMember);
    const teamRepo = AppDataSource.getRepository(Team);
    const userRepo = AppDataSource.getRepository(User);

    const members = await memberRepo.findBy({ teamId });
    if (members.length !== 3) return; // 未满

    const team = await teamRepo.findOneByOrFail({ id: teamId });

    // 统计新用户数量
    const newUserCount = members.filter(m => m.isNewUser).length;
    
    // 队长
    const captain = members.find(m => m.role === 'captain')!;
    let captainPoints = 50; // 基础分
    if (captain.isNewUser) captainPoints += 10; // 自己是新用户加10分
    // 每邀请一个新用户加10分（排除自己）
    const invitedNewUsers = newUserCount - (captain.isNewUser ? 1 : 0);
    captainPoints += invitedNewUsers * 10;
    
    // 更新队长的pointsEarned - 使用正确的条件
    captain.pointsEarned = captainPoints;
    await memberRepo.save(captain);
    await addPointsToUser(captain.userId, captainPoints, `团队「${team.name}」人满结算（队长）`, team.id);
    if (captain.isNewUser) await userRepo.update(captain.userId, { isNewUser: false });

    // 队员
    for (const m of members.filter(m => m.role === 'member')) {
      let pts = 25; // 基础分
      if (m.isNewUser) pts += 10; // 自己是新用户加10分
      
      // 更新队员的pointsEarned - 使用正确的条件
      m.pointsEarned = pts;
      await memberRepo.save(m);
      await addPointsToUser(m.userId, pts, `团队「${team.name}」人满结算（队员）`, team.id);
      if (m.isNewUser) await userRepo.update(m.userId, { isNewUser: false });
    }

    team.status = 'completed';
    await teamRepo.save(team);
    
    // 直接使用更新后的members数据，不需要重新查询
    const updatedMembers = await memberRepo.findBy({ teamId });
    await createTeamRecord(team, updatedMembers);
    // await createTeamRecord(team, members);
  };

  // 路由

  // 创建团队
  fastify.post('/teams', async (req, reply) => {
    try {
      const userId = req.user!.id;
      const { name } = req.body as { name: string };
      const teamRepo = AppDataSource.getRepository(Team);
      const memberRepo = AppDataSource.getRepository(TeamMember);

      // 检查团队名称是否已存在
      const existingTeam = await teamRepo.findOne({ 
        where: [
          { name, status: 'active' }, 
          { name, status: 'expired' }
        ]
      });
      if (existingTeam) {
        return reply.status(400).send({ success: false, message: '团队名称已存在，请使用其他名称' });
      }

      const existing = await memberRepo
        .createQueryBuilder('m')
        .leftJoin('m.team', 't')
        .where('m.userId = :userId', { userId })
        .andWhere('t.status = :st', { st: 'active' })
        .andWhere('t.endTime > :now', { now: new Date() })
        .getOne();
      if (existing) return reply.status(400).send({ success: false, message: '您已在活跃队伍中' });

      const now = new Date();
      const endTime = new Date(now.getTime() + 3 * 60 * 60 * 1000);
      const team = teamRepo.create({
        captainId: userId,
        name,
        inviteCode: generateInviteCode(),
        startTime: now,
        endTime,
        totalPoints: 100,
        status: 'active',
        createdAt: now,
      });
      await teamRepo.save(team);

      const captain = memberRepo.create({
        teamId: team.id,
        userId,
        role: 'captain',
        isNewUser: req.user!.isNewUser || false,
        pointsEarned: 0, // 先不发
        joinedAt: now,
      });
      await memberRepo.save(captain);

      return reply.status(201).send({
        success: true,
        data: {
          team: { ...team, memberCount: 1, remainingTime: Math.max(0, Math.floor((endTime.getTime() - Date.now()) / 1000)) },
          pointsEarned: 0,
        },
      });
    } catch (error) {
      console.error('创建团队错误:', error);
      return reply.status(500).send({ success: false, message: '创建团队失败，请稍后重试' });
    }
  });

  // 邀请码加入队伍
  fastify.post('/teams/join-by-code', async (req, reply) => {
    try {
      const userId = req.user!.id;
      const isNewUser = req.user!.isNewUser || false;
      const { inviteCode } = req.body as { inviteCode: string };
      const teamRepo = AppDataSource.getRepository(Team);
      const memberRepo = AppDataSource.getRepository(TeamMember);

      const team = await teamRepo.findOneBy({ inviteCode, status: 'active' });
      if (!team) return reply.status(400).send({ success: false, message: '邀请码无效或团队已过期' });
      if (team.endTime.getTime() < Date.now()) {
        team.status = 'expired';
        await teamRepo.save(team);
        return reply.status(400).send({ success: false, message: '团队已过期' });
      }

      const exist = await memberRepo.findOneBy({ userId, teamId: team.id });
      if (exist) return reply.status(400).send({ success: false, message: '您已在团队中' });

      const other = await memberRepo
        .createQueryBuilder('m')
        .leftJoin('m.team', 't')
        .where('m.userId = :userId', { userId })
        .andWhere('t.status = :st', { st: 'active' })
        .andWhere('t.endTime > :now', { now: new Date() })
        .getOne();
      if (other) return reply.status(400).send({ success: false, message: '您已在其他活跃队伍中' });

      const count = await memberRepo.count({ where: { teamId: team.id } });
      if (count >= 3) return reply.status(400).send({ success: false, message: '团队已满员' });

      const member = memberRepo.create({
        teamId: team.id,
        userId,
        role: 'member',
        isNewUser,
        pointsEarned: 0,
        joinedAt: new Date(),
      });
      await memberRepo.save(member);

      const newCount = count + 1;
      if (newCount === 3) await distributePointsIfFull(team.id);

      return reply.send({
        success: true,
        message: `成功加入团队「${team.name}」`,
        data: {
          pointsEarned: 0,
          captainBonus: 0,
          teamInfo: {
            id: team.id,
            name: team.name,
            inviteCode: team.inviteCode,
            captainId: team.captainId,
            memberCount: newCount,
            maxMembers: 3,
            totalPoints: team.totalPoints,
            status: team.status,
            startTime: team.startTime,
            endTime: team.endTime,
            remainingTime: Math.max(0, Math.floor((team.endTime.getTime() - Date.now()) / 1000)),
          },
        },
      });
    } catch (error) {
      console.error('加入队伍错误:', error);
      return reply.status(500).send({ success: false, message: '加入队伍失败，请稍后重试' });
    }
  });

  // 队长解散队伍
  fastify.delete('/teams', async (req, reply) => {
    try {
      const userId = req.user!.id;
      const memberRepo = AppDataSource.getRepository(TeamMember);
      const teamRepo = AppDataSource.getRepository(Team);

      const captain = await memberRepo.findOne({ where: { userId, role: 'captain' }, relations: ['team'] });
      if (!captain || !captain.team) return reply.status(403).send({ success: false, message: '您不是队长' });

      const team = captain.team;
      
      // 检查队伍状态，如果已完成积分分发则不能解散
      if (team.status === 'completed') {
        return reply.status(400).send({ success: false, message: '队伍已完成积分分发，无法解散' });
      }

      await memberRepo.delete({ teamId: team.id });
      await teamRepo.remove(team);

      return reply.send({ success: true, message: '队伍已解散' });
    } catch (error) {
      console.error('解散队伍错误:', error);
      return reply.status(500).send({ success: false, message: '解散队伍失败，请稍后重试' });
    }
  });

  // 队员退出队伍
  fastify.delete('/teams/leave', async (req, reply) => {
    try {
      const userId = req.user!.id;
      const memberRepo = AppDataSource.getRepository(TeamMember);
      const teamRepo = AppDataSource.getRepository(Team);

      const member = await memberRepo.findOne({ where: { userId }, relations: ['team'] });
      if (!member || !member.team) return reply.status(400).send({ success: false, message: '您不在任何活跃队伍中' });
      if (member.role === 'captain') return reply.status(400).send({ success: false, message: '队长请使用解散队伍功能' });

      const team = member.team;
      
      // 检查队伍状态，如果已完成积分分发则不能退出
      if (team.status === 'completed') {
        return reply.status(400).send({ success: false, message: '队伍已完成积分分发，无法退出' });
      }

      await memberRepo.remove(member);
      return reply.send({ success: true, message: '已退出队伍' });
    } catch (error) {
      console.error('退出队伍错误:', error);
      return reply.status(500).send({ success: false, message: '退出队伍失败，请稍后重试' });
    }
  });

  // 刷新邀请码
  fastify.put('/teams/refresh-invite-code', async (req, reply) => {
    try {
      const userId = req.user!.id;
      const memberRepo = AppDataSource.getRepository(TeamMember);
      const teamRepo = AppDataSource.getRepository(Team);

      const captain = await memberRepo.findOne({
        where: { userId, role: 'captain' },
        relations: ['team'],
        order: { team: { endTime: 'DESC' } },
      });
      if (!captain || !captain.team) {
        return reply.status(404).send({ success: false, message: '您没有队伍或不是队长' });
      }

      const team = captain.team;
      const now = new Date();
      
      // 检查队伍状态
      if (team.status === 'completed') {
        return reply.status(400).send({ success: false, message: '队伍已完成，无法刷新邀请码' });
      }
      
      if (team.status === 'active' && team.endTime.getTime() > now.getTime()) {
        const count = await memberRepo.count({ where: { teamId: team.id } });
        if (count < 3) {
          const remainingMinutes = Math.ceil((team.endTime.getTime() - now.getTime()) / (60 * 1000));
          const remainingHours = Math.floor(remainingMinutes / 60);
          const mins = remainingMinutes % 60;
          const timeStr = remainingHours > 0 ? `${remainingHours}小时${mins}分钟` : `${mins}分钟`;
          return reply.status(400).send({ 
            success: false, 
            message: `队伍未满员且还有${timeStr}有效期，请等待队员加入或时间到期后再刷新` 
          });
        }
        // 如果满员了，触发积分分发
        if (count === 3) {
          await distributePointsIfFull(team.id);
          // 重新查询team状态，因为distributePointsIfFull会将状态设为completed
          const updatedTeam = await teamRepo.findOneByOrFail({ id: team.id });
          if (updatedTeam.status === 'completed') {
            return reply.status(400).send({ success: false, message: '队伍已完成，无法刷新邀请码' });
          }
        }
      }

      // 生成新的邀请码和时间
      const newCode = generateInviteCode();
      const newEnd = new Date(now.getTime() + 3 * 60 * 60 * 1000);
      team.status = 'active';
      team.inviteCode = newCode;
      team.endTime = newEnd;
      team.startTime = now; // 重新设置开始时间
      await teamRepo.save(team);

      return reply.send({
        success: true,
        data: {
          teamName: team.name,
          newInviteCode: newCode,
          newEndTime: newEnd,
          remainingTime: Math.max(0, Math.floor((newEnd.getTime() - Date.now()) / 1000)),
          message: '邀请码已刷新，有效期重新计算为3小时',
        },
      });
    } catch (error) {
      console.error('刷新邀请码错误:', error);
      return reply.status(500).send({ success: false, message: '刷新邀请码失败，请稍后重试' });
    }
  });

  fastify.get('/teams/my-active', async (req, reply) => {
    const userId = req.user!.id;
    const memberRepo = AppDataSource.getRepository(TeamMember);
    const teamRepo = AppDataSource.getRepository(Team);

    const member = await memberRepo
      .createQueryBuilder('m')
      .leftJoinAndSelect('m.team', 't')
      .where('m.userId = :userId', { userId })
      .andWhere('t.status = :st', { st: 'active' })
      .andWhere('t.endTime > :now', { now: new Date() })
      .getOne();
    if (!member || !member.team) return reply.send({ success: true, data: null, message: '暂无活跃团队' });

    const team = member.team;
    const all = await memberRepo
      .createQueryBuilder('m')
      .leftJoinAndSelect('m.user', 'u')
      .where('m.teamId = :tid', { tid: team.id })
      .orderBy('m.joinedAt', 'ASC')
      .getMany();

    const remaining = Math.max(0, Math.floor((team.endTime.getTime() - Date.now()) / 1000));

    let needUpdate = false;
    if (team.status === 'active') {
      if (remaining === 0) {
        team.status = 'expired';
        needUpdate = true;
      } else if (all.length >= 3) {
        team.status = 'completed';
        needUpdate = true;
      }
      if (needUpdate) await teamRepo.save(team);
    }

    return reply.send({
      success: true,
      data: {
        team: { ...team, memberCount: all.length, remainingTime: remaining },
        myRole: member.role,
        myPoints: member.pointsEarned,
        members: all.map(m => ({
          id: m.id,
          userId: m.userId,
          username: m.user?.username || '未知用户',
          role: m.role,
          pointsEarned: m.pointsEarned,
          isNewUser: m.isNewUser,
          joinedAt: m.joinedAt,
        })),
      },
    });
  });
}