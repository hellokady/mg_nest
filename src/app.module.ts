import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { JwtModule } from './jwt/jwt.module';
import { LoginGuard } from './common/guards/login.guard';
import { PermissionGuard } from './common/guards/permission.guard';
import { RoleService } from './role/role.service';

@Module({
  imports: [DbModule, UserModule, RoleModule, PermissionModule, JwtModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: LoginGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard
    }
  ],
})
export class AppModule {}
