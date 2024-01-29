import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    NestJwtModule.register({
      global: true,
      secret: 'kady',
      signOptions: {
        expiresIn: '7d',
      },
    }),
  ],
})
export class JwtModule {}
