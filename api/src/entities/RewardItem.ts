import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class RewardItem {
    @PrimaryGeneratedColumn('uuid')
    id: string; // 商品ID，主键

    @Column({ type: 'varchar', nullable: true })
    userId?: string; // 所属用户ID，关联到具体用户

    @Column({ type: 'varchar', length: 100 })
    name: string; // 商品名称，如"满29减4优惠券"

    @Column({ type: 'text' })
    description: string; // 商品详细描述

    @Column({ type: 'int' })
    pointsCost: number; // 兑换所需积分（5/10/15/20/25/30）

    @Column({ type: 'varchar' })
    couponType: string; // 优惠券类型，如"满29减4"

    @Column({ type: 'int' })
    couponValue: number; // 优惠券实际优惠金额

    @Column({ type: 'int' })
    conditionAmount: number; // 满减条件金额（如29元）

    @Column({ type: 'int' })
    stock: number; // 库存数量

    @Column({ type: 'int' })
    stage: number; // 所属阶段（1/2）
    
    @Column({ type: 'int', default: 7 })
    validityDays: number; // 有效期

    @Column({ type: 'boolean', default: true })
    isLimited: boolean;

    @CreateDateColumn({ type: 'datetime' })
    createdAt: Date; // 商品创建时间
}