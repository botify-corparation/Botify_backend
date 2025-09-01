import {
  Controller,
  Get,
  Query,
  Param,
  Patch,
  Body,
  Req,
  Post,
  UseGuards,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResetPasswordDto } from './dto/reset-pasword.dto';
import { BotStatus, UserRole } from '@prisma/client';
import {
  ApiTags,
  ApiQuery,
  ApiParam,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { GuardsService } from 'src/common/guards/guards.service';
import { RoleGuard } from 'src/common/role/role.service';
import { Request } from 'express';
import { roles } from 'src/common/role/role.decorator';
import { CreateAdminDto } from './dto/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @UseGuards(GuardsService, RoleGuard)
  @roles('ADMIN')
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Foydalanuvchilar royxati (admin)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 8 })
  @ApiQuery({ name: 'status', enum: BotStatus, required: false })
  @ApiQuery({ name: 'isActive', required: false, example: 'true | false' })
  @ApiQuery({ name: 'role', enum: UserRole, required: false })
  @ApiQuery({ name: 'search', required: false, example: 'omadbek' })
  @ApiResponse({ status: 200, description: 'Foydalanuvchilar royxati' })
  async getAllUsers(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('status') status?: BotStatus,
    @Query('isActive') isActive?: string,
    @Query('role') role?: UserRole,
    @Query('search') search?: string,
  ) {
    const parsedPage = parseInt(page as any) || 1;
    const parsedLimit = parseInt(limit as any) || 8;
    const parsedIsActive =
      isActive === 'true' ? true : isActive === 'false' ? false : undefined;

    return this.usersService.getAllUser(
      parsedPage,
      parsedLimit,
      status,
      parsedIsActive,
      role,
      search,
    );
  }
  @UseGuards(GuardsService, RoleGuard)
  @roles('ADMIN')
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'ID orqali foydalanuvchini olish' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Foydalanuvchi topildi' })
  async getUserById(@Param('id') id: number) {
    return this.usersService.getUserById(+id);
  }


  @UseGuards(GuardsService, RoleGuard)
  @Get('/me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tizimga kirgan foydalanuvchini olish' })
  @ApiResponse({ status: 200, description: 'ME malumotlari' })
  async getMe(@Req() req) {
    const userId = req.user.id;
    return this.usersService.getMe(userId);
  }

  @UseGuards(GuardsService, RoleGuard)
  @Patch('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Foydalanuvchi o‘z profilini tahrirlash' })
  @ApiBody({
    type: UpdateUserDto
  })

  @ApiResponse({ status: 200, description: 'Foydalanuvchi yangilandi' })
  async updateMe(@Req() req, @Body() payload: UpdateUserDto) {
    const userId = req.user.id;
    return this.usersService.updateUser(userId, payload,);
  }


  @UseGuards(GuardsService, RoleGuard)
  @Post('reset-password')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Parolni yangilash' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: 200, description: 'Parol yangilandi' })
  async resetPassword(@Body() dto: ResetPasswordDto, @Req() req) {
    const userId = req.user.id;
    return this.usersService.resetPassword(dto, userId);
  }

  @Post('admin')
  @UseGuards(GuardsService, RoleGuard)
  @roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Yangi admin yaratish (faqat superadmin)' })
  @ApiBody({ type: CreateAdminDto })
  @ApiResponse({ status: 201, description: 'Admin muvaffaqiyatli yaratildi' })
  async createAdmin(@Body() payload: CreateAdminDto) {
    return this.usersService.createAdmin(payload);
  }

  @Delete(':id')
  @UseGuards(GuardsService, RoleGuard)
  @roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Foydalanuvchini o‘chirish (admin)' })
  @ApiParam({ name: 'id', type: Number, description: 'Foydalanuvchi IDsi' })
  @ApiResponse({ status: 200, description: 'Foydalanuvchi muvaffaqiyatli o‘chirildi' })
  async deleteUser(@Param('id') id: number) {
    return this.usersService.deleteUser(+id);
  }
}
