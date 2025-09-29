import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './User';
import { Team } from './Team';

@Entity('team_records')
export class TeamRecord {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar')
    userId: string;

    @Column('varchar')
    teamId: string;

    @Column('varchar')
    teamName: string;

    @Column('varchar')
    role: 'captain' | 'member';

    @Column('int')
    pointsEarned: number;

    @Column('boolean', { default: false })
    isNewUser: boolean;

    @Column('varchar')
    status: 'active' | 'completed' | 'expired';

    @Column('int', { default: 1 })
    memberCount: number;

    @CreateDateColumn()
    createdAt: Date;

    @Column('datetime')
    completedAt: Date;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Team)
    @JoinColumn({ name: 'teamId' })
    team: Team;
}