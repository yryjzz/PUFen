import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Team {
    @PrimaryGeneratedColumn('uuid')
    id: string; // ID主键

    @Column({ type: 'varchar' })
    captainId: string; // 队长ID

    @Column({ length: 50, type: 'varchar' })
    name: string; // 团队名称，最大长度50字符

    @Column({ length: 10, type: 'varchar', unique: true, nullable: true })
    inviteCode?: string; // 邀请码，唯一

    @Column({ type: 'datetime' })
    startTime: Date; // 团队创建/开始时间

    @Column({ type: 'datetime' })
    endTime: Date; // 团队结束时间（开始时间+3小时）

    @Column({ type: 'int', default: 100 })
    totalPoints: number; // 团队总积分池，固定100分

    @Column('varchar', { 
        length: 20,
        default: 'active'
    })
    status: 'active' | 'completed' | 'expired'; // 团队状态

    @CreateDateColumn({ type: 'datetime' })
    createdAt: Date; // 团队创建时间

    @Column({ type: 'int', nullable: true }) 
    memberCount?: number; // 返回用
}