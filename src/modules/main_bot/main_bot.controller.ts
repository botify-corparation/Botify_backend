import { BadRequestException, Controller, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { GuardsService } from 'src/common/guards/guards.service';
import { RoleGuard } from 'src/common/role/role.service';
import { MainBotService } from './main_bot.service';

@Controller('main-bot')
export class MainBotController {
    constructor(private readonly mainBotService: MainBotService) { }
    @UseGuards(GuardsService, RoleGuard)
    @ApiBearerAuth()
    @Post('start')
    @ApiOperation({ summary: 'Course sotuvchi  botni ishga tushirish (params orqali)' })
    @ApiQuery({ name: 'token', required: true, type: String })
    @ApiQuery({ name: 'name', required: true, type: String, example: 'course_saller bot' })
    @ApiResponse({ status: 201, description: 'Bot started successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    async startBot(
        @Req() req: Request,
        @Query('token') token: string,
        @Query('name') name: string,
    ) {
        const userId = req['user'].id;

        if (!token || !name) {
            throw new BadRequestException('token, name required');
        }

        if (!userId) {
            throw new BadRequestException('User ID not found in token');
        }

        await this.mainBotService.sendTokenToBotService(
            token,
            name,
            userId,
        );

        return { success: true, message: 'Bot started successfully' };
    }
}
