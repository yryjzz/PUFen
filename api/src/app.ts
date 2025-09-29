import fastify from 'fastify';
import { authRoutes } from './controllers/auth.controller';
import { pointsRoutes } from './controllers/points.controller';
import { signinRoutes } from './controllers/signin.controller';
import { recordsRoutes } from './controllers/records.controller';
import { rewardRoutes } from './controllers/reward.controller';
import { teamRoutes } from './controllers/team.controller';
import { couponRoutes } from './controllers/coupon.controller';
const app = fastify({ logger: true });

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