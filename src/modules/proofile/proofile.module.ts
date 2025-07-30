import { Module } from '@nestjs/common';
import { ProofileService } from './proofile.service';
import { ProofileController } from './proofile.controller';
import { PrismaModule } from 'src/core/config/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[PrismaModule,JwtModule],
  controllers: [ProofileController],
  providers: [ProofileService],
})
export class ProofileModule {}
