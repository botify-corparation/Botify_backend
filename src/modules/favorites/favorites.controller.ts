import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { GuardsService } from 'src/common/guards/guards.service';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { roles } from 'src/common/role/role.decorator';
import { RoleGuard } from 'src/common/role/role.service';

@ApiTags('Favorites')
@ApiBearerAuth()
@UseGuards(GuardsService, RoleGuard)
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) { }

  @Post()
  @ApiOperation({ summary: 'Add a bot to favorites (authenticated user)' })
  async create(@Body() dto: CreateFavoriteDto, @Req() req: any) {
    const userId = req.user.id;
    return this.favoritesService.create(dto, userId);
  }

  @roles('ADMIN')
  @Get()
  @ApiOperation({ summary: 'Get all favorites (admin only)' })
  async findAll() {
    return this.favoritesService.findAll();
  }

  @Get('user')
  @ApiOperation({ summary: 'Get authenticated user\'s favorite bots' })
  async findByUser(@Req() req: any) {
    const userId = req.user.id;
    return this.favoritesService.findByUser(userId);
  }

  @Delete(':botId')
  @ApiOperation({ summary: 'Remove a bot from favorites (authenticated user)' })
  async remove(@Param('botId', ParseIntPipe) botId: number, @Req() req: any) {
    const userId = req.user.id;
    return this.favoritesService.remove(userId, botId);
  }
}
