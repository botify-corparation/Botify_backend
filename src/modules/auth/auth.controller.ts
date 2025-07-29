import {
  Controller,
  Get,
  Req,
  UseGuards,
  UnauthorizedException,
  Post,
  Body,
  Headers,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login.dto';
import { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Auth') // Swagger guruh nomi
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google orqali autentifikatsiya boshlash' })
  @ApiResponse({ status: 200, description: 'Google auth ga yo‘naltiriladi' })
  async googleAuth() { }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google orqali muvaffaqiyatli qaytish' })
  @ApiResponse({ status: 200, description: 'Google orqali login bo‘ldi' })
  @ApiResponse({ status: 401, description: 'Google auth xatoligi' })
  async googleAuthRedirect(@Req() req) {
    try {
      const { profile, accessToken, refreshToken } = req.user;

      const userAgent = req.headers['user-agent'] || 'unknown';
      const ip =
        req.headers['x-forwarded-for'] ||
        req.socket.remoteAddress ||
        'unknown';

      return await this.authService.validateOAuthLogin(
        profile,
        accessToken,
        refreshToken,
        userAgent,
        ip.toString()
      );
    } catch (err) {
      console.error('Google auth error:', err);
      throw new UnauthorizedException('Google auth failed');
    }
  }

  @Post('register')
  @ApiOperation({ summary: 'Ro‘yxatdan o‘tish (OTP bilan)', description: 'Foydalanuvchini OTP orqali ro‘yxatdan o‘tkazadi' })
  @ApiBody({ type: RegisterAuthDto })
  @ApiResponse({ status: 201, description: '✅ Foydalanuvchi muvaffaqiyatli yaratildi' })
  @ApiResponse({ status: 400, description: '❌ Ro‘yxatdan o‘tishda xatolik (masalan: foydalanuvchi allaqachon mavjud)' })
  async register(
    @Body() dto: RegisterAuthDto,
    @Req() req: Request,
  ) {
    const userAgent = req.headers['user-agent'] || 'unknown';
    const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';

    return this.authService.register(dto, userAgent, ipAddress);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login qilish (Email va Parol orqali)' })
  @ApiBody({ type: LoginAuthDto })
  @ApiResponse({ status: 200, description: '✅ Muvaffaqiyatli login, access_token qaytariladi' })
  @ApiResponse({ status: 401, description: '❌ Login xato: noto‘g‘ri email yoki parol' })
  async login(
    @Body() payload: LoginAuthDto,
    @Req() req: Request,
  ) {
    const userAgent = req.headers['user-agent']?.toString() || 'unknown';
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';

    return this.authService.login(payload, userAgent, ip);
  }
}
