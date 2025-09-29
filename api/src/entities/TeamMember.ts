import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Team } from './Team';
import { User } from './User';

@Entity()
export class TeamMember {
    @PrimaryGeneratedColumn('uuid')
    id: string; // ID主键

    @Column({ type: 'varchar' })
    teamId: string; // 关联的团队ID

    @Column({ type: 'varchar' })
    userId: string; // 关联的用户ID

    @ManyToOne(() => Team)
    @JoinColumn({ name: 'teamId' })
    team!: Team

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user!: User

    @Column('varchar', { 
        length: 20
    })
    role: 'captain' | 'member'; // 成员角色：队长或队员

    @Column({ type: 'boolean' })
    isNewUser: boolean; // 加入时是否为新用户

    @Column({ type: 'int' })
    pointsEarned: number; // 该成员获得的积分数

    @Column({ type: 'datetime' })
    joinedAt: Date; // 加入团队的时间
}