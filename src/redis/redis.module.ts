import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { createClient } from 'redis';

@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      async useFactory() {
        const client = createClient({
          socket: {
            host: 'localhost',
            port: 6379,
          },
        });

        await client.connect();
        return client;
      },
    },
    {
      provide: 'REDIS_MODULE',
      useFactory(services) {
        console.log(services, ' ---REDIS_MODULE--- ;');
        return 'common'
      },
    },
  ],
  exports: [RedisService, 'REDIS_MODULE'],
})
export class RedisModule {}
