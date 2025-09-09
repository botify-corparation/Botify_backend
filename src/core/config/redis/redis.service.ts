import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
    private redis_client: Redis;
    private logs = new Logger(RedisService.name);

    constructor(private readonly configService: ConfigService) {

        this.redis_client = new Redis({
            host: this.configService.get<string>('REDIS_HOST'),
            port: this.configService.get<number>('REDIS_PORT'),
        });

        this.redis_client.on('connect', () => {
            this.logs.log('✅ Redis ulandi');
        });

        this.redis_client.on('error', (err) => {
            this.logs.error('❌ Redisda xatolik:', err);
        });
    }

    async set(key: string, code: string, ttlSeconds: number) {
        return this.redis_client.set(key, code, 'EX', ttlSeconds);
    }

    async get(key: string) {
        return this.redis_client.get(key);
    }

    async delete(key: string) {
        return this.redis_client.del(key);
    }
}
