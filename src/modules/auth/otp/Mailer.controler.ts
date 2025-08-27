import { Body, Controller, Post } from "@nestjs/common";
import { RegisterAuthDto } from "../dto/create-auth.dto";
import { SendMailDto } from "../dto/sendToEmail";
import { MailesService } from "./Mailer.service";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Email yuborish')
@Controller('sent-email')
export class MailesController {
    constructor(private mailseService: MailesService) { }

    @Post()
    @ApiOperation({ summary: 'Emailga OTP kod yuborish', description: 'Foydalanuvchining email manziliga 6 xonali tasdiqlash kodi yuboriladi.' })
    @ApiBody({ type: SendMailDto })
    @ApiResponse({ status: 400, description: 'Yuborishda xatolik yuz berdi.' })
    async sentEmail(@Body() payload: SendMailDto) {
        return await this.mailseService.sendToEmailOtpCode(payload);
    }
    @Post('verify')
    @ApiOperation({ summary: 'Emailga OTP kod tasdiqlash', description: 'Foydalanuvchining email manziliga yuborilgan 6 xonali tasdiqlash kodi tasdiqlanadi.' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', example: 'test@example.com' },
                otp: { type: 'string', example: '123456' }
            },
            required: ['email', 'otp']

        }
    })
    @ApiResponse({ status: 400, description: 'Yuborishda xatolik yuz berdi.' })
    async verifyEmail(@Body() body: { email: string; otp: string }) {
        return await this.mailseService.verifyOtp(body.email, body.an
        otp);
    }
}
