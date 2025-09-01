import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/config/prisma/prisma.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateFavoriteDto, userId: number) {
    const bot = await this.prisma.userBot.findUnique({
      where: { id: dto.userBotId },
    });

    if (!bot) throw new NotFoundException('Bot not found');

    const alreadyExists = await this.prisma.favorite.findUnique({
      where: {
        userId_userBotId: {
          userId,
          userBotId: dto.userBotId,
        },
      },
    });

    if (alreadyExists) {
      throw new ForbiddenException('Bot is already in your favorites');
    }

    const favorite = await this.prisma.favorite.create({
      data: {
        userId,
        userBotId: dto.userBotId,
      },
    });

    return {
      success: true,
      message: 'Bot added to favorites successfully',
      data: favorite,
    };
  }

  async findAll() {
    const favorites = await this.prisma.favorite.findMany({
      include: {
        user: {
          select: { id: true, fullName: true, email: true },
        },
        userBot: {
          select: {
            id: true,
            botToken: true,
            status: true,
            expiresAt: true,
            category: { select: { id: true, name: true } },
            Rating: true,
          },
        },
      },
    });

    return {
      success: true,
      message: 'All favorites retrieved successfully',
      data: favorites,
    };
  }

  async findByUser(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      include: {
        userBot: {
          select: {
            id: true,
            botToken: true,
            status: true,
            expiresAt: true,
            category: { select: { id: true, name: true } },
            Rating: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      message: 'User favorites retrieved successfully',
      data: favorites,
    };
  }

  async remove(userId: number, botId: number) {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        userId_userBotId: {
          userId,
          userBotId: botId,
        },
      },
    });

    if (!favorite) {
      throw new NotFoundException('Favorite not found');
    }

    await this.prisma.favorite.delete({
      where: {
        userId_userBotId: {
          userId,
          userBotId: botId,
        },
      },
    });

    return {
      success: true,
      message: 'Bot removed from favorites',
    };
  }
}
