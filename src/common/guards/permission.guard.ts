import {
  Injectable,
  Inject,
  CanActivate,
  ExecutionContext,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { RoleService } from 'src/role/role.service';
import { META_DATA_KEYS } from '../decorators/custom.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject(RoleService)
  private roleService: RoleService;

  @Inject(Reflector)
  private reflector: Reflector;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const permissionsByInterface = this.reflector.getAllAndOverride(
      META_DATA_KEYS.RequirePermission,
      [context.getClass(), context.getHandler()],
    );

    if (!request.user || !permissionsByInterface) {
      return true;
    }

    const roles = await this.roleService.findRoleByIds(
      request.user.roles.map((item) => item.id),
    );
    const permissionsByRole = roles.reduce((prev, next) => {
      const perimssions = next.permissions;
      prev.push(...perimssions.map((item) => item.name));
      return prev;
    }, []);

    if (Array.isArray(permissionsByInterface)) {
      const pass = permissionsByInterface.some((permission) =>
        permissionsByRole.includes(permission),
      );
      console.log(pass, permissionsByInterface, permissionsByRole);
      if (!pass) {
        throw new UnauthorizedException('对不起，你没有该接口的访问权限');
      }
    } else {
      throw new InternalServerErrorException('权限守卫异常');
    }

    return true;
  }
}
