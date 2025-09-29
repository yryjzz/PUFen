import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class PointsTransaction {
    @PrimaryGeneratedColumn('uuid')
    id: string; // 流水ID，主键

    @Column({ type: 'varchar' })
    userId: string; // 关联的用户ID

    @Column({ type: 'varchar' })
    accountId: string; // 关联的积分账户ID

    @Column({ type: 'int' })
    amount: number; // 积分变动数量（正数为收入，负数为支出）

    @Column('varchar', { 
        length: 20 
    })
    type: 'earn' | 'use' | 'expire'; // 积分变动类型

    @Column('varchar', { 
        length: 20
    })
    source: 'signin' | 'team' | 'reward' | 'makeup' | 'order'; // 积分来源/去向

    @Column({ type: 'varchar' })
    relatedId: string; // 关联的业务记录ID

    @Column({ type: 'varchar' })
    description: string; // 流水描述，如"周一签到"、"补签消耗"

    @Column({ type: 'int' })
    balanceBefore: number; // 变动前积分余额

    @Column({ type: 'int' })
    balanceAfter: number; // 变动后积分余额

    @CreateDateColumn({ type: 'datetime' })
    createdAt: Date; // 流水创建时间
}