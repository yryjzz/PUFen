import { FastifyPluginAsync } from 'fastify';
import { AppDataSource } from '../config/db';
import { User } from '../entities/User';
import { PointsAccount } from '../entities/PointsAccount';
import { hashPassword } from '../utils/password';
import { signToken } from '../utils/jwt';
import { loginBodyDto, registerBodyDto } from '../dto/auth.dto';
import { authHook } from '../middleware/auth.hook';
import bcrypt from 'bcrypt';
import { rebuildRewardItem } from '../services/reward-list.service';

export const authRoutes: FastifyPluginAsync = async (fastify) => {
  // fastify.addHook('preHandler', authHook);
  fastify.post(
    '/auth/register',
    {
      schema: {
        body: registerBodyDto,
      },
    },
    async (req, reply) => {
      const { username, phone, password } = req.body as {
        username: string;
        phone: string;
        password: string;
      };

      const userRepo = AppDataSource.getRepository(User);
      const exist = await userRepo.findOneBy({ phone });
      if (exist) {
        return reply.status(409).send({ success: false, message: '手机号已存在' });
      }

      const hashed = await hashPassword(password);

      const user = userRepo.create({ username, phone, password: hashed });
      await userRepo.save(user);

      // 自动创建积分账户
      const accountRepo = AppDataSource.getRepository(PointsAccount);
      const account = accountRepo.create({ userId: user.id });
      await accountRepo.save(account);

      // 为新用户分配6种优惠券各1张
      try {
        await rebuildRewardItem(user.id);
        console.log(`[NewUser] 新用户 ${user.username} 注册成功，已分配初始优惠券`);
      } catch (error) {
        console.error(`[NewUser] 为用户 ${user.username} 分配优惠券失败:`, error);
        // 不影响注册流程，只记录错误
      }

      const token = signToken({ userId: user.id });

      reply.status(201).send({
        success: true,
        message: '注册成功',
        data: {
          id: user.id,
          username: user.username,
          phone: user.phone,
          isNewUser: user.isNewUser,
          createdAt: user.createdAt,
        },
        token,
      });
    }
  );

  fastify.post(
    '/auth/login',
    {
      schema: {
        body: loginBodyDto,
      }
    },
    async (req, reply) => {
      const { phone, password } = req.body as {
        phone: string,
        password: string,
      };

      const userRepo = AppDataSource.getRepository(User);
      const user = await userRepo.findOneBy({ phone });
      if (!user) {
        return reply.status(401).send({ success: false, message: '用户名或密码错误' });
      }
      
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return reply.status(401).send({ success: false, message: '用户名或密码错误' });
      }

      const token = signToken({ userId: user.id });

      reply.send({
        success: true,
        message: '登录成功',
        data: {
          id: user.id,
          username: user.username,
          phone: user.phone,
          isNewUser: user.isNewUser,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        token,
      });
    }
  );

  fastify.get(
    '/auth/profile',
    {
      preHandler: authHook
    },
    async (req, reply) => {
      const user = req.user!;
      reply.send({
        success: true,
        message: '获取用户信息成功',
        data: {
          id: user.id,
          username: user.username,
          phone: user.phone,
          isNewUser: user.isNewUser,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        }
      });
    }
  );
};