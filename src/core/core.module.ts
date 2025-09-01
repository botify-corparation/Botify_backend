import { Module } from '@nestjs/common';
import { PrismaModule } from './config/prisma/prisma.module';
import { RedisModule } from './config/redis/redis.module';

@Module({
  imports: [PrismaModule, RedisModule]
})
export class CoreModule {}
