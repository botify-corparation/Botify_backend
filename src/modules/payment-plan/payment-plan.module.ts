import { Module } from '@nestjs/common';
import { PaymentPlanService } from './payment-plan.service';
import { PaymentPlanController } from './payment-plan.controller';
import { PrismaModule } from 'src/core/config/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [PaymentPlanController],
  providers: [PaymentPlanService],
})
export class PaymentPlanModule { }
