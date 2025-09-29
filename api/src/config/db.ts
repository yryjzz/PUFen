import { DataSource } from 'typeorm';
import { User } from '../entities/User.js';
import { PointsAccount } from '../entities/PointsAccount.js';
import { SignInConfig } from '../entities/SignInConfig.js';
import { SignInRecord } from '../entities/SignInRecord.js';
import { Team } from '../entities/Team.js';
import { TeamMember } from '../entities/TeamMember.js';
import { TeamRecord } from '../entities/TeamRecord.js';
import { RewardItem } from '../entities/RewardItem.js';
import { RewardRecord } from '../entities/RewardRecord.js';
import { PointsTransaction } from '../entities/PointsTransaction.js';
import { UserCoupon } from '../entities/UserCoupon.js';

export const AppDataSource = new DataSource({
    type: 'sqlite',
    database: process.env.NODE_ENV === 'production' 
        ? '/app/pufen.db'      // Render 持久目录
        : 'src/database/dev.db',    // 本地照旧
    synchronize: true,            // 上线前需关闭
    logging: false,
    entities: [
        User,
        PointsAccount,
        SignInConfig,
        SignInRecord,
        Team,
        TeamMember,
        TeamRecord,
        RewardItem,
        RewardRecord,
        PointsTransaction,
        UserCoupon
    ],
});