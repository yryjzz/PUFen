import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string; // 主键

  @Column({ type: 'varchar', length: 50 })
  username: string; // 用户昵称

  @Column({ type: 'varchar', length: 20, unique: true })
  phone: string; // 电话号码

  @Column({ type: 'varchar' })
  password: string; // 密码，用bcrypt加密

  @Column({ type: 'boolean', default: true })
  isNewUser: boolean; // 新用户标识

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date; // 创建时间

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date; // 更新时间
}

