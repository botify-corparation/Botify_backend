import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailesModule } from './modules/auth/otp/Mailer.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [CoreModule, ConfigModule.forRoot({
    isGlobal: true
  }), MailesModule, AuthModule, CommonModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
