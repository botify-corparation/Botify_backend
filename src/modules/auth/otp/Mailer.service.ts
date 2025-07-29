import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SendMailDto } from '../dto/sendToEmail';
import { RedisService } from 'src/core/config/redis/redis.service';
import { generateHtml, generateOTP } from 'src/common/utilis/helper';

@Injectable()
export class MailesService {
    constructor(private redisService: RedisService) { }

    private transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    async sendOtp(to: string, otpCode: string): Promise<void> {
        await this.transporter.sendMail({
            from: `"Botify" <${process.env.MAIL_USER}>`,
            to,
            subject: '🔐 Botify - Tasdiqlash kodi (OTP)',
            html: generateHtml(Number(otpCode)),
        });
    }

    async sendToEmailOtpCode(payload: SendMailDto) {
        const { email } = payload;
        const otp = generateOTP()
        await this.sendOtp(email, otp);

        await this.redisService.set(`otp:${email}`, otp, 60 * 60);

        return {
            success: true,
            message: 'OTP code was sent to email and saved in Redis.',
        };
    }

}
