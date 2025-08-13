import {
  Controller,
  Post,
  Query,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ControlerBotService } from './controler-bot.service';
import { Request } from 'express';
import { GuardsService } from 'src/common/guards/guards.service';
import { RoleGuard } from 'src/common/role/role.service';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('Controller Bot')
@ApiBearerAuth()
@Controller('controler-bot')
export class ControlerBotController {
  constructor(private readonly controlerBotService: ControlerBotService) { }

  @UseGuards(GuardsService, RoleGuard)
  @Post('start')
  @ApiOperation({ summary: 'Observer botni ishga tushirish (params orqali)' })
  @ApiQuery({ name: 'token', required: true, type: String })
  @ApiQuery({ name: 'name', required: true, type: String, example:'Nazoratchi bot' })
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

    await this.controlerBotService.sendTokenToBotService(
      token,
      name,
      userId,
    );

    return { success: true, message: 'Bot started successfully' };
  }
}
