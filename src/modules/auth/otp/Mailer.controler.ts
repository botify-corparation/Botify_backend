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
}
