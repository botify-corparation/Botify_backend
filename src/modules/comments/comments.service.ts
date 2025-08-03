import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/core/config/prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) { }

  async create(createCommentDto: CreateCommentDto, userId: number) {
    const existsUser = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!existsUser) throw new NotFoundException('User not found');

    const existsBot = await this.prisma.userBot.findUnique({
      where: { id: createCommentDto.userBotId },
    });
    if (!existsBot) throw new NotFoundException('Bot not found');

    const paid = await this.prisma.payment.findFirst({
      where: {
        userId,
        userBotId: createCommentDto.userBotId,
        status: 'SUCCESS',
      },
    });
    if (!paid) {
      throw new ForbiddenException('You have not purchased this bot, so you cannot comment.');
    }

    const result = await this.prisma.comment.create({
      data: {
        userId,
        userBotId: createCommentDto.userBotId,
        text: createCommentDto.text,
      },
    });

    return {
      success: true,
      message: 'Comment created successfully',
      data: result,
    };
  }

  async findAll() {
    const allComments = await this.prisma.comment.findMany({
      select: {
        id: true,
        text: true,
        user: {
          select: {
            id: true,
            fullName: true,
            avatar: true,
            email: true,
            profile: {
              select: {
                id: true,
                status: true,
                isActive: true,
                receivedAt: true,
              },
            },
          },
        },
        userBot: {
          select: {
            id: true,
            expiresAt: true,
            Rating: { select: { id: true, rating: true } },
            category: { select: { id: true, name: true } },
            botModel: { select: { id: true, name: true } },
          },
        },
      },
    });

    return {
      success: true,
      message: 'All comments fetched successfully',
      data: allComments,
    };
  }

  async findOne(id: number) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: { user: true, userBot: true },
    });
    if (!comment) throw new NotFoundException('Comment not found');

    return {
      success: true,
      message: 'Comment retrieved successfully',
      data: comment,
    };
  }

  async findByBot(botId: number) {
    const bot = await this.prisma.userBot.findUnique({ where: { id: botId } });
    if (!bot) throw new NotFoundException('Bot not found');

    const comments = await this.prisma.comment.findMany({
      where: { userBotId: botId },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      message: 'Comments for this bot retrieved successfully',
      data: comments,
    };
  }

  async findByUser(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const comments = await this.prisma.comment.findMany({
      where: { userId },
      include: { userBot: true },
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      message: 'User comments retrieved successfully',
      data: comments,
    };
  }

  async update(id: number, dto: UpdateCommentDto, userId: number) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) throw new NotFoundException('Comment not found');

    if (comment.userId !== userId) {
      throw new ForbiddenException('You can only update your own comment');
    }

    const updated = await this.prisma.comment.update({
      where: { id },
      data: { text: dto.text },
    });

    return {
      success: true,
      message: 'Comment updated successfully',
      data: updated,
    };
  }

  async remove(id: number, userId: number) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) throw new NotFoundException('Comment not found');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    if (comment.userId !== userId && user.role  !== 'ADMIN') {
      throw new ForbiddenException('You do not have permission to delete this comment');
    }

    await this.prisma.comment.delete({ where: { id } });

    return {
      success: true,
      message: 'Comment deleted successfully',
    };
  }
  async removeAll() {
    await this.prisma.comment.deleteMany();
    return {
      success: true,
      message: 'All comments deleted successfully',
    };
  }

}
