import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Permission } from 'src/permission/entities/permission.entity';
import { Role } from 'src/role/entities/role.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'zhaokaidi1997',
      database: 'login_test',
      synchronize: true,
      logging: true, // 开启sql语句日志
      entities: [User, Role, Permission],
      poolSize: 10,
      connectorPackage: 'mysql2',
      extra: {
        authPlugin: 'sha256_password',
      },
    }),
  ],
})
export class DbModule {}
