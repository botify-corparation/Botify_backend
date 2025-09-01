import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { GuardsService } from 'src/common/guards/guards.service';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { roles } from 'src/common/role/role.decorator';
import { RoleGuard } from 'src/common/role/role.service';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) { }

  @ApiBearerAuth()
  @UseGuards(GuardsService, RoleGuard)
  @Post()
  @ApiOperation({ summary: 'Create a comment' })
  async create(@Body() dto: CreateCommentDto, @Req() req: any) {
    const userId = req['user'].id;
    return this.commentsService.create(dto, userId);
  }

  @ApiBearerAuth()
  @UseGuards(GuardsService, RoleGuard)
  @roles('ADMIN')
  @Get()
  @ApiOperation({ summary: 'Get all comments (admin only)' })
  async findAll() {
    return this.commentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a comment by ID (public)' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.findOne(id);
  }

  @Get('bot/:botId')
  @ApiOperation({ summary: 'Get comments by bot ID (public)' })
  async findByBot(@Param('botId', ParseIntPipe) botId: number) {
    return this.commentsService.findByBot(botId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get comments by user ID (public)' })
  async findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.commentsService.findByUser(userId);
  }

  @ApiBearerAuth()
  @UseGuards(GuardsService, RoleGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Update a comment (only owner)' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCommentDto,
    @Req() req: any,
  ) {
    const userId = req['user'].id;
    return this.commentsService.update(id, dto, userId);
  }

  @ApiBearerAuth()
  @UseGuards(GuardsService, RoleGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a comment (only owner or admin)' })
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const userId = req['user'].id;
    return this.commentsService.remove(id, userId);
  }
  @Delete()
  @ApiBearerAuth()
  @UseGuards(GuardsService, RoleGuard)
  @roles('ADMIN')
  @ApiOperation({ summary: 'Delete all comments (admin only)' })
  async removeAll() {
    return this.commentsService.removeAll();
  }

}
