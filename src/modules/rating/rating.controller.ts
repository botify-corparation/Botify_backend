import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GuardsService } from 'src/common/guards/guards.service';
import { roles } from 'src/common/role/role.decorator';
import { RoleGuard } from 'src/common/role/role.service';

@ApiTags('Ratings')
@ApiBearerAuth()
@UseGuards(GuardsService, RoleGuard)
@Controller('ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post()
  @ApiOperation({ summary: 'Rate a bot (1–5 stars)' })
  async create(@Body() dto: CreateRatingDto, @Req() req: any) {
    const userId = req['user'].id;
    return this.ratingService.create(dto, userId);
  }

  @Get('bot/:botId')
  @ApiOperation({ summary: 'Get all ratings for a specific bot' })
  async findByBot(@Param('botId', ParseIntPipe) botId: number) {
    return this.ratingService.findByBot(botId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all ratings made by a user' })
  async findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.ratingService.findByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific rating by ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ratingService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update your own rating' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRatingDto,
    @Req() req: any,
  ) {
    const userId = req['user'].id;
    return this.ratingService.update(id, dto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete your rating (or admin)' })
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const userId = req['user'].id;
    return this.ratingService.remove(id, userId);
  }
}
