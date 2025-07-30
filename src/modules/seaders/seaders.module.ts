import { Module } from '@nestjs/common';
import { SeedersService } from './seaders.service';
import { PrismaModule } from 'src/core/config/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [SeedersService],
})
export class SeadersModule { }
