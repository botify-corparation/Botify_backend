import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards
} from '@nestjs/common';
import { BotModulesService } from './bot-modules.service';
import { CreateBotModelDto } from './dto/create-bot-module.dto';
import { UpdateBotModuleDto } from './dto/update-bot-module.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { GuardsService } from 'src/common/guards/guards.service';
import { RoleGuard } from 'src/common/role/role.service';
import { roles } from 'src/common/role/role.decorator';

@ApiTags('Bot Modules')
@Controller('bot-modules')
export class BotModulesController {
  constructor(private readonly botModulesService: BotModulesService) { }

  @ApiBearerAuth()
  @UseGuards(GuardsService, RoleGuard)
  @roles('ADMIN')
  @Post()
  @ApiOperation({ summary: 'Yangi bot modeli yaratish' })
  @ApiResponse({ status: 201, description: 'Bot modeli muvaffaqiyatli yaratildi.' })
  @ApiResponse({ status: 404, description: 'Kategoriya topilmadi.' })
  create(@Body() CreateBotModelDto: CreateBotModelDto) {
    return this.botModulesService.create(CreateBotModelDto);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha bot modellari ro‘yxatini olish' })
  @ApiResponse({ status: 200, description: 'Bot modellari ro‘yxati' })
  findAll() {
    return this.botModulesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'ID orqali bitta bot modelini olish' })
  @ApiParam({ name: 'id', type: Number, description: 'Bot model ID' })
  @ApiResponse({ status: 200, description: 'Topilgan bot modeli' })
  @ApiResponse({ status: 404, description: 'Bot topilmadi' })
  findOne(@Param('id') id: string) {
    return this.botModulesService.findOneById(+id);
  }

  @ApiBearerAuth()
  @UseGuards(GuardsService, RoleGuard)
  @roles('ADMIN')
  @Patch(':id')
  @ApiOperation({ summary: 'Bot modelini yangilash' })
  @ApiParam({ name: 'id', type: Number, description: 'Bot model ID' })
  @ApiResponse({ status: 200, description: 'Bot modeli muvaffaqiyatli yangilandi' })
  @ApiResponse({ status: 404, description: 'Bot topilmadi' })
  @ApiResponse({ status: 409, description: 'Bunday nom allaqachon mavjud' })
  update(@Param('id') id: string, @Body() updateBotModuleDto: UpdateBotModuleDto) {
    return this.botModulesService.update(+id, updateBotModuleDto);
  }
  @ApiBearerAuth()
  @UseGuards(GuardsService, RoleGuard)
  @roles('ADMIN')
  @Delete(':id')
  @ApiOperation({ summary: 'Bot modelini o‘chirish' })
  @ApiParam({ name: 'id', type: Number, description: 'Bot model ID' })
  @ApiResponse({ status: 200, description: 'Bot modeli o‘chirildi' })
  @ApiResponse({ status: 404, description: 'Bot topilmadi' })
  remove(@Param('id') id: string) {
    return this.botModulesService.remove(+id);
  }
}
