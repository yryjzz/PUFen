import fastify from 'fastify';
import cors from '@fastify/cors';
import { authRoutes } from './controllers/auth.controller.js';
import { pointsRoutes } from './controllers/points.controller.js';
import { signinRoutes } from './controllers/signin.controller.js';
import { recordsRoutes } from './controllers/records.controller.js';
import { rewardRoutes } from './controllers/reward.controller.js';
import { teamRoutes } from './controllers/team.controller.js';
import { couponRoutes } from './controllers/coupon.controller.js';

const app = fastify({ logger: true });

// 注册 CORS 插件
app.register(cors, {
    origin: process.env.CORS_ORIGIN || true, // 从环境变量读取允许的域名，默认允许所有
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
});

app.get('/health', async (_, reply) => {
    reply.send({ status: 'ok', time: new Date() });
});

app.register(async function apiPlugin(f) {
    await f.register(authRoutes);
    await f.register(pointsRoutes);
    await f.register(signinRoutes);
    await f.register(recordsRoutes);
    await f.register(rewardRoutes);
    await f.register(teamRoutes);
    await f.register(couponRoutes);
}, { prefix: '/api' });

export default app;