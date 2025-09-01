import { BadRequestException, Controller, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ShazamBotService } from './shazam-bot.service';
import { GuardsService } from 'src/common/guards/guards.service';
import { RoleGuard } from 'src/common/role/role.service';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('shazam-bot')
export class ShazamBotController {
    constructor(private shazamService: ShazamBotService) { }

    @ApiBearerAuth()
    @UseGuards(GuardsService, RoleGuard)
    @Post('start')
    @ApiOperation({ summary: 'Observer botni ishga tushirish (params orqali)' })
    @ApiQuery({ name: 'token', required: true, type: String })
    @ApiQuery({ name: 'name', required: true, type: String, example: 'shazam bot' })
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

        await this.shazamService.sendTokenToBotService(
            token,
            name,
            userId,
        );

        return { success: true, message: 'Bot started successfully' };
    }
}
