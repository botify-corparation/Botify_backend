import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './strateges/strateges.google';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/core/config/prisma/prisma.module';
import { RedisModule } from 'src/core/config/redis/redis.module';

@Module({
  imports: [PassportModule.register({ session: true }),
  JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '1d' },
  }),
  PrismaModule,
  RedisModule,
  JwtModule
],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy],
})
export class AuthModule { }
