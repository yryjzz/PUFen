import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class SignInConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string; // 主键

  @Column({ type: 'datetime' })
  weekStartDate: Date; // 本周一的日期

  @Column({ type: 'int', default: 10 })
  basePoints: number; // 基础积分值，固定10分

  @Column({ type: 'float', default: 1.0 })
  day1Multiplier: number; // 周一积分倍数，默认1.0（10分）

  @Column({ type: 'float' })
  day2Multiplier: number; // 周二积分倍数，随机1.0或1.5

  @Column({ type: 'float' })
  day3Multiplier: number; // 周三积分倍数，随机1.0或1.5

  @Column({ type: 'float' })
  day4Multiplier: number; // 周四积分倍数，随机1.0或1.5

  @Column({ type: 'float' })
  day5Multiplier: number; // 周五积分倍数，随机1.0或1.5

  @Column({ type: 'float', default: 0.6 })
  day6Multiplier: number; // 周六积分倍数，固定0.6（6分）

  @Column({ type: 'float', default: 2.0 })
  day7Multiplier: number; // 周日积分倍数，固定2.0（20分）

  @Column({ type: 'int' })
  bonusDay: number; // 连续签到奖励日（3-5中随机一天）

  @Column({ type: 'varchar' })
  bonusCoupon: string; // 连续签到奖励的优惠券类型

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date; // 配置创建时间
}