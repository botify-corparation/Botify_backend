import { Module } from '@nestjs/common';
import { MainBotService } from './main_bot.service';
import { MainBotController } from './main_bot.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaModule } from 'src/core/config/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [ClientsModule.register([
    {
      name: 'BOT_SERVICE',
      transport: Transport.RMQ,
      options: {
        urls: ['amqps://fhrzlrdw:hDfPFXgmeA3RbotR3urp0T3Dp2x8u7NY@kebnekaise.lmq.cloudamqp.com/fhrzlrdw'],
        queue: 'course_saller_bot',
        queueOptions: {
          durable: false
        }
      }
    }
  ]), PrismaModule, JwtModule],
  providers: [MainBotService],
  controllers: [MainBotController]
})
export class MainBotModule { }
