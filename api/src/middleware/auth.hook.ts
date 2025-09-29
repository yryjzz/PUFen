import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/db';
import { User } from '../entities/User';

export async function authHook(request: FastifyRequest, reply: FastifyReply): Promise<void> {

  const authHeader = request.headers.authorization;
  if (!authHeader) return reply.status(401).send({ success: false, message: '未提供token' });

  const token = authHeader.replace('Bearer ', '');
  if (!token) return reply.status(401).send({ success: false, message: 'token格式错误' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret') as { userId: string };
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ id: decoded.userId });
    if (!user) return reply.status(401).send({ success: false, message: '用户不存在' });

    request.user = user;
  } catch (err) {
    return reply.status(401).send({ success: false, message: 'token无效或已过期' });
  }
}