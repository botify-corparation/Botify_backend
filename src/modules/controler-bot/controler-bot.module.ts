import { Module } from '@nestjs/common';
import { ControlerBotService } from './controler-bot.service';
import { ControlerBotController } from './controler-bot.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaModule } from 'src/core/config/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'BOT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqps://fhrzlrdw:hDfPFXgmeA3RbotR3urp0T3Dp2x8u7NY@kebnekaise.lmq.cloudamqp.com/fhrzlrdw'], 
          queue: 'observer_bot_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),PrismaModule,JwtModule
  ],
  controllers: [ControlerBotController],
  providers: [ControlerBotService],
})
export class ControlerBotModule { }
