import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailesModule } from './modules/auth/otp/Mailer.module';
import { CommonModule } from './common/common.module';
import { SeadersModule } from './modules/seaders/seaders.module';
import { UsersModule } from './modules/users/users.module';
import { UploadModule } from './modules/upload/upload.module';
import { ProofileModule } from './modules/proofile/proofile.module';
import { CategoryModule } from './modules/category/category.module';
import { PaymentPlanModule } from './modules/payment-plan/payment-plan.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { CommentsModule } from './modules/comments/comments.module';
import { RatingModule } from './modules/rating/rating.module';
import { ControlerBotModule } from './modules/controler-bot/controler-bot.module';

@Module({
  imports: [CoreModule, ConfigModule.forRoot({
    isGlobal: true
  }), MailesModule, AuthModule, CommonModule, SeadersModule, UsersModule, UploadModule, ProofileModule, CategoryModule, PaymentPlanModule, PaymentsModule, FavoritesModule, CommentsModule, RatingModule, ControlerBotModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
