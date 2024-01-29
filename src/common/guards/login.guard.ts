import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

import { Role } from 'src/role/entities/role.entity';
import { META_DATA_KEYS } from '../decorators/custom.decorator';

interface TokenWithUser {
  id: number;
  roles: Pick<Role, 'id'>[];
}

declare module 'express' {
  interface Request {
    user: TokenWithUser;
  }
}

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(Reflector)
  private reflector: Reflector;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    // 取出目标路由的metaData来判断是否需要登录
    const requireLogin = this.reflector.getAllAndOverride(
      META_DATA_KEYS.RequireLogin,
      [context.getClass(), context.getHandler()],
    );

    if (!requireLogin) {
      return true;
    }

    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('用户未登录');
    }

    try {
      const token = authorization.split(' ')[1];
      const data: Record<'user', TokenWithUser> = this.jwtService.verify(token);

      request.user = data.user;

      return true;
    } catch (error) {
      throw new UnauthorizedException('token失效，请重新登录');
    }
  }
}
