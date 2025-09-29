import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class PointsAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string; // 主键

  @Column({ type: 'varchar' })
  userId: string; // 关联的用户ID，与User表一对一关系

  @Column({ type: 'int', default: 0 })
  balance: number; // 当前可用积分余额，默认0

  @Column({ type: 'int', default: 0 })
  totalEarned: number; // 累计获得积分总额

  @Column({ type: 'int', default: 0 })
  totalUsed: number; // 累计使用积分总额

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date; // 账户创建时间

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date; // 账户最后更新时间
}