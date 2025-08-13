import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/config/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { RedisService } from 'src/core/config/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private redisService: RedisService,
  ) { }

  async signJwt(user: {
    id: number;
    email: string;
    role: string;
    agent: string;
    sessionId: number;
  }): Promise<string> {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      agent: user.agent,
      sessionId: user.sessionId,
    };
    return this.jwtService.signAsync(payload);
  }


  async validateOAuthLogin(
    profile: any,
    accessToken: string,
    userAgent: string,
    ipAddress: string,
  ) {
    const { id: googleId, name, emails, photos } = profile;
    const email = emails?.[0]?.value;

    let user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          fullName: `${name?.givenName} ${name?.familyName}`,
          avatar: photos?.[0]?.value,
          phone: '',
          password: null,
          role: 'USER',
          isActive: true,
        },
      });

      await this.prisma.userProfile.create({
        data: {
          isActive: true,
          userId: user.id,
        },
      });

      await this.prisma.userSession.create({
        data: {
          userId: user.id,
          userAgent,
          ipAddress,
          location: null,
          isValid: true,
        },
      });
    }

    await this.prisma.oAuthAccount.upsert({
      where: {
        provider_providerUserId: {
          provider: 'google',
          providerUserId: googleId,
        },
      },
      update: {
        accessToken,
      },
      create: {
        userId: user.id,
        provider: 'google',
        providerUserId: googleId,
        accessToken,
      },
    });

    const session = await this.prisma.userSession.create({
      data: {
        userId: user.id,
        userAgent,
        ipAddress,
        location: null,
        isValid: true,
      },
    });

    const token = await this.signJwt({
      id: user.id,
      role: user.role,
      email: user.email,
      agent: session.userAgent,
      sessionId: session.id,
    });


    const { password, ...safeUser } = user;

    return {
      message: !user ? 'Google registration successful' : 'Google login successful',
      access_token: token,
      data: safeUser,
    };
  }

  async register(payload: RegisterAuthDto, userAgent: string, ipAddress: string) {
    const { email, fullName, password, phone, otp } = payload;

    const existingUser = await this.prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const existOtp = await this.redisService.get(`otp:${email}`);
    if (!existOtp || existOtp !== otp) {
      throw new ConflictException('Invalid or expired OTP code');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        email,
        fullName,
        password: hashedPassword,
        phone,
        role: 'USER',
        isActive: true,
      },
    });

    await this.prisma.userProfile.create({
      data: {
        isActive: true,
        userId: user.id,
      },
    });

    const session = await this.prisma.userSession.create({
      data: {
        userId: user.id,
        userAgent,
        ipAddress,
        location: null,
        isValid: true,
      },
    });

    const token = await this.signJwt({
      id: user.id,
      role: user.role,
      email: user.email,
      agent: session.userAgent,
      sessionId: session.id,
    });



    const { password: _, ...safeUser } = user;
    return {
      message: 'User successfully registered and session created',
      data: safeUser,
      access_token: token,
    };
  }

  async login(payload: LoginAuthDto, userAgent: string, ipAddress: string) {
    const { email, password } = payload;

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password!);
    if (!isPasswordValid) {
      throw new ConflictException('Invalid email or password');
    }

    const session = await this.prisma.userSession.create({
      data: {
        userId: user.id,
        userAgent,
        ipAddress,
        location: null,
        isValid: true,
      },
    });

    const token = await this.signJwt({
      id: user.id,
      role: user.role,
      email: user.email,
      agent: session.userAgent,
      sessionId: session.id,
    });
        
    const { password: _, ...safeUser } = user;

    return {
      message: 'Login successful',
      access_token: token,
      data: safeUser,
    };
  }
}
