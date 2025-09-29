import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { PointsAccount } from '../entities/PointsAccount';
import { SignInConfig } from '../entities/SignInConfig';
import { SignInRecord } from '../entities/SignInRecord';
import { Team } from '../entities/Team';
import { TeamMember } from '../entities/TeamMember';
import { TeamRecord } from '../entities/TeamRecord';
import { RewardItem } from '../entities/RewardItem';
import { RewardRecord } from '../entities/RewardRecord';
import { PointsTransaction } from '../entities/PointsTransaction';
import { UserCoupon } from '../entities/UserCoupon';

export const AppDataSource = new DataSource({
    type: 'sqlite',
    database: process.env.NODE_ENV === 'production' 
        ? '/var/data/pufen.db'      // Render 持久目录
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