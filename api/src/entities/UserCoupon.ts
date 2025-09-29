import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class UserCoupon {
  @PrimaryGeneratedColumn('uuid')
  id: string; // 主键

  @Column({ type: 'uuid' })
  userId: string; // 用户ID

  @Column({ type: 'varchar', length: 50 })
  couponType: string; // 券类型：如 "满29减4"

  @Column({ type: 'int' })
  discountAmount: number; // 优惠金额（分）

  @Column({ type: 'int' })
  minimumAmount: number; // 最低消费金额（分）

  @Column({ type: 'varchar', length: 20, default: 'unused' })
  status: string; // 状态：unused(未使用)、used(已使用)、expired(已过期)

  @Column({ type: 'datetime', nullable: true })
  usedAt: Date; // 使用时间

  @Column({ type: 'datetime' })
  expiryDate: Date; // 到期时间

  @Column({ type: 'varchar', length: 20 })
  source: string; // 获取来源：signin(签到)、exchange(积分兑换)

  @Column({ type: 'varchar', nullable: true })
  relatedId: string; // 关联ID（签到记录ID或兑换记录ID）

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date; // 创建时间

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date; // 更新时间
}