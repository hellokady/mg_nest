import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { Permission } from './permission/entities/permission.entity';
import { Role } from './role/entities/role.entity';

@Injectable()
export class AppService {
  @InjectEntityManager()
  private entityManager: EntityManager;

  async init() {
    const roles = await this.entityManager.find(Role)
    const permissions  = await this.entityManager.find(Permission)

    if (roles.length > 0 || permissions.length > 0) {
      return;
    }

    const adminRole = new Role();
    adminRole.name = '管理员';
    const normalRole = new Role();
    normalRole.name = '普通用户';

    const createPermissionByAdmin = new Permission();
    createPermissionByAdmin.name = '管理员-新增权限';
    const readPermissionByAdmin = new Permission();
    readPermissionByAdmin.name = '管理员-读取权限';
    const updatePermissionByAdmin = new Permission();
    updatePermissionByAdmin.name = '管理员-更新权限';
    const deletePermissionByAdmin = new Permission();
    deletePermissionByAdmin.name = '管理员-删除权限';
    const createPermissionByNormal = new Permission();
    createPermissionByNormal.name = '普通用户-新增权限';
    const readPermissionByNormal = new Permission();
    readPermissionByNormal.name = '普通用户-读取权限';
    const updatePermissionByNormal = new Permission();
    updatePermissionByNormal.name = '普通用户-更新权限';
    const deletePermissionByNormal = new Permission();
    deletePermissionByNormal.name = '普通用户-删除权限';

    adminRole.permissions = [
      createPermissionByAdmin,
      readPermissionByAdmin,
      updatePermissionByAdmin,
      deletePermissionByAdmin,
      createPermissionByNormal,
      readPermissionByNormal,
      updatePermissionByNormal,
      deletePermissionByNormal,
    ];

    normalRole.permissions = [
      createPermissionByNormal,
      readPermissionByNormal,
      updatePermissionByNormal,
      deletePermissionByNormal,
    ];

    await this.entityManager.save(Permission, [
      createPermissionByAdmin,
      readPermissionByAdmin,
      updatePermissionByAdmin,
      deletePermissionByAdmin,
      createPermissionByNormal,
      readPermissionByNormal,
      updatePermissionByNormal,
      deletePermissionByNormal,
    ]);
    await this.entityManager.save(Role, [adminRole, normalRole]);
  }

  getHello(): string {
    return 'Hello World';
  }
}
