#!/usr/bin/env tsx
import 'reflect-metadata';
import { AppDataSource } from '../config/db';
import { User } from '../entities/User';
import { Not, In } from 'typeorm';

const cmd = process.argv[2];
const arg = process.argv[3];

async function main() {
  await AppDataSource.initialize();
  const userRepo = AppDataSource.getRepository(User);

  if (cmd === 'list') {
    const list = await userRepo.find({ select: ['username'] });
    console.log('当前用户：');
    list.forEach(u => console.log(' - ' + u.username));
  } else if (cmd === 'del' && arg) {
    const res = await userRepo.delete({ username: arg });
    console.log(`✅ 已删除 ${res.affected} 人`);
  } else if (cmd === 'keep' && arg) {
    const keepList = arg.split(',').map(s => s.trim());
    const res = await userRepo.delete({ username: Not(In(keepList)) });
    console.log(`✅ 保留 ${keepList.length} 人，已删除 ${res.affected} 人`);
  } else {
    console.log(`
用法：
  npm run run:ts src/scripts/userCli.ts list
  npm run run:ts src/scripts/userCli.ts del 用户名
  npm run run:ts src/scripts/userCli.ts keep 名1,名2
`);
  }

  await AppDataSource.destroy();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});