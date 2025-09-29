import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class SignInRecord {
    @PrimaryGeneratedColumn('uuid')
    id: string; // ID 主键

    @Column({ type: 'varchar' })
    userId: string; // 关联的用户ID

    @Column({ type: 'varchar' })
    configId: string; // 关联的签到配置ID

    @Column({ type: 'datetime' })
    signInDate: Date; // 签到日期

    @Column({ type: 'int' })
    pointsEarned: number; // 本次签到所获积分

    @CreateDateColumn({ type: 'datetime' })
    createdAt: Date; // 签到时间
}