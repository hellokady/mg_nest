import { Injectable, Inject } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;

  @Inject('REDIS_MODULE')
  private module: string;

  async getList(key: string) {
    return this.redisClient.lRange(`${this.module}:${key}`, 0, -1);
  }

  async setList(key: string, list: string[], ttl?: number) {
    for (let i = 0; i < list.length; i++) {
      await this.redisClient.lPush(`${this.module}:${key}`, list[i]);
    }
    if (ttl) {
      await this.redisClient.expire(`${this.module}:${key}`, ttl);
    }
  }

  async get(key: string) {
    return await this.redisClient.get(`${this.module}:${key}`);
  }

  async set(key: string, value: any, ttl?: number) {
    await this.redisClient.set(`${this.module}:${key}`, value);
    if (ttl) {
      await this.redisClient.expire(`${this.module}:${key}`, ttl);
    }
  }
}
