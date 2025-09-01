import { Module } from '@nestjs/common';
import { ShazamBotService } from './shazam-bot.service';
import { ShazamBotController } from './shazam-bot.controller';
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
        queue: 'observer_bot_queues',
        queueOptions: {
          durable: false,
        },
      },
    },
  ]), PrismaModule, JwtModule],
  providers: [ShazamBotService],
  controllers: [ShazamBotController]
})
export class ShazamBotModule { }
