import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Permission } from 'src/permission/entities/permission.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 40,
    comment: '角色名称',
    unique: true
  })
  name: string;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;

  @ManyToMany(() => Permission)
  @JoinTable({
    name: 'role_permission_relation'
  })
  permissions: Permission[];
}
