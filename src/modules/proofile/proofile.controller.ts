import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProofileService } from './proofile.service';
import { CreateProfileDto } from './dto/create-proofile.dto';
import { UpdateProfileDto } from './dto/update-proofile.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { GuardsService } from 'src/common/guards/guards.service';
import { RoleGuard } from 'src/common/role/role.service';
import { BotStatus } from '@prisma/client';
import { roles } from 'src/common/role/role.decorator';

@ApiTags('User Profile')
@ApiBearerAuth()
@UseGuards(GuardsService, RoleGuard)
@Controller('profiles')
export class ProofileController {
  constructor(private readonly proofileService: ProofileService) { }

  @roles('ADMIN')
  @Get()
  @ApiOperation({ summary: 'Barcha foydalanuvchi profillari (admin)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'status', enum: BotStatus, required: false })
  @ApiQuery({ name: 'isActive', required: false, example: 'true | false' })
  @ApiQuery({ name: 'search', required: false, example: 'omadbek' })
  @ApiResponse({ status: 200, description: 'Barcha profillar qaytdi' })
  async getProfiles(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('status') status?: BotStatus,
    @Query('isActive') isActive?: string,
    @Query('search') search?: string,
  ) {
    const parsedPage = parseInt(page as any) || 1;
    const parsedLimit = parseInt(limit as any) || 10;
    const parsedIsActive =
      isActive === 'true' ? true : isActive === 'false' ? false : undefined;

    return this.proofileService.getAllProfiles(
      parsedPage,
      parsedLimit,
      status,
      parsedIsActive,
      search,
    );
  }

  @Get('me')
  @ApiOperation({ summary: 'Tizimga kirgan foydalanuvchining profilini olish' })
  @ApiResponse({ status: 200, description: 'Foydalanuvchi profili qaytdi' })
  async getMyProfile(@Req() req) {
    const userId = req.user.id;
    return this.proofileService.getProfileMe(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Tizimga kirgan foydalanuvchiga profil yaratish' })
  @ApiBody({ type: CreateProfileDto })
  @ApiResponse({ status: 201, description: 'Profil yaratildi' })
  async createProfile(@Req() req, @Body() dto: CreateProfileDto) {
    const userId = req.user.id;
    return this.proofileService.createUserProfile(userId, dto);
  }

  @Patch()
  @ApiOperation({ summary: 'Tizimga kirgan foydalanuvchining profilini yangilash' })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({ status: 200, description: 'Profil yangilandi' })
  async updateProfile(@Req() req, @Body() dto: UpdateProfileDto) {
    const userId = req.user.id;
    return this.proofileService.updateProfile(userId, dto);
  }

  @Delete()
  @ApiOperation({ summary: 'Tizimga kirgan foydalanuvchining profilini o‘chirish' })
  @ApiResponse({ status: 200, description: 'Profil o‘chirildi' })
  async deleteProfile(@Req() req) {
    const userId = req.user.id;
    return this.proofileService.deleteProfile(userId);
  }

  @roles('ADMIN')
  @Get(':id')
  @ApiOperation({ summary: 'Profil ID orqali olish (admin)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Profil topildi' })
  async getProfileById(@Param('id') id: number) {
    return this.proofileService.getProfileById(+id);
  }
}
