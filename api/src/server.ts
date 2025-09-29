import 'reflect-metadata';
import app from './app';
import { startResetConfigTask } from './tasks/signin.task';
import { AppDataSource } from './config/db';
import { buildWeekConfig } from './services/signin-config.service';
import { CouponExpiryTask } from './tasks/coupon-expiry.task';
import dotenv from 'dotenv';
import { mkdir } from 'fs/promises';

dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env' });

const port = Number(process.env.PORT) || 3001;

const start = async () => {
  try {
    if (process.env.NODE_ENV === 'production') {
      await mkdir('/var/data', { recursive: true });
    }
    await AppDataSource.initialize();
    console.log('数据库连接成功');
    await buildWeekConfig();
  } catch (err) {
    console.error('数据库连接失败', err);
    process.exit(1);
  }
};

start();
startResetConfigTask();
CouponExpiryTask.start();

app.listen({ port, host: '0.0.0.0' }, (err) => {
  if (err) throw err;
  console.log(`Server running on ${port}`);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down...');
  await AppDataSource.destroy();
  process.exit(0);
});