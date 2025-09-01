import { Module } from '@nestjs/common';
import { BotModulesService } from './bot-modules.service';
import { BotModulesController } from './bot-modules.controller';
import { PrismaModule } from 'src/core/config/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [BotModulesController],
  providers: [BotModulesService],
})
export class BotModulesModule { }
