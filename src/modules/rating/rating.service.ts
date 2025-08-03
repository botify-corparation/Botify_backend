import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { PrismaService } from 'src/core/config/prisma/prisma.service';

@Injectable()
export class RatingService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateRatingDto, userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const bot = await this.prisma.userBot.findUnique({ where: { id: dto.userBotId } });
    if (!bot) throw new NotFoundException('Bot not found');

    const paid = await this.prisma.payment.findFirst({
      where: {
        userId,
        userBotId: dto.userBotId,
        status: 'SUCCESS',
      },
    });
    if (!paid) {
      throw new ForbiddenException('You have not purchased this bot, so you cannot rate it.');
    }

    const alreadyRated = await this.prisma.rating.findUnique({
      where: {
        userId_userBotId: {
          userId,
          userBotId: dto.userBotId,
        },
      },
    });
    if (alreadyRated) {
      throw new ConflictException('You have already rated this bot.');
    }

    const result = await this.prisma.rating.create({
      data: {
        userId,
        userBotId: dto.userBotId,
        rating: dto.rating,
      },
    });

    return {
      success: true,
      message: 'Rating submitted successfully',
      data: result,
    };
  }

  async findByBot(botId: number) {
    const bot = await this.prisma.userBot.findUnique({ where: { id: botId } });
    if (!bot) throw new NotFoundException('Bot not found');

    const ratings = await this.prisma.rating.findMany({
      where: { userBotId: botId },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      message: 'Ratings for this bot retrieved successfully',
      data: ratings,
    };
  }

  async findByUser(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const ratings = await this.prisma.rating.findMany({
      where: { userId },
      include: { userBot: true },
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      message: 'User ratings retrieved successfully',
      data: ratings,
    };
  }

  async findOne(id: number) {
    const rating = await this.prisma.rating.findUnique({
      where: { id },
      include: { user: true, userBot: true },
    });
    if (!rating) throw new NotFoundException('Rating not found');

    return {
      success: true,
      message: 'Rating retrieved successfully',
      data: rating,
    };
  }

  async update(id: number, dto: UpdateRatingDto, userId: number) {
    const rating = await this.prisma.rating.findUnique({ where: { id } });
    if (!rating) throw new NotFoundException('Rating not found');

    if (rating.userId !== userId) {
      throw new ForbiddenException('You can only update your own rating');
    }

    const updated = await this.prisma.rating.update({
      where: { id },
      data: { rating: dto.rating },
    });

    return {
      success: true,
      message: 'Rating updated successfully',
      data: updated,
    };
  }

  async remove(id: number, userId: number) {
    const rating = await this.prisma.rating.findUnique({ where: { id } });
    if (!rating) throw new NotFoundException('Rating not found');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    if (rating.userId !== userId && user.role !== 'ADMIN') {
      throw new ForbiddenException('You do not have permission to delete this rating');
    }

    await this.prisma.rating.delete({ where: { id } });

    return {
      success: true,
      message: 'Rating deleted successfully',
    };
  }
}
