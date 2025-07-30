import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-proofile.dto';
import { UpdateProfileDto } from './dto/update-proofile.dto';
import { PrismaService } from 'src/core/config/prisma/prisma.service';
import { BotStatus } from '@prisma/client';

@Injectable()
export class ProofileService {
  constructor(private prisma: PrismaService) { }
  async getAllProfiles(
    page = 1,
    limit = 10,
    status?: BotStatus,
    isActive?: boolean,
    search?: string
  ) {
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) where.status = status;
    if (isActive !== undefined) where.isActive = isActive;

    if (search) {
      where.OR = [
        {
          user: {
            fullName: { contains: search, mode: 'insensitive' },
          },
        },
        {
          user: {
            email: { contains: search, mode: 'insensitive' },
          },
        },
      ];
    }

    const [profiles, total] = await this.prisma.$transaction([
      this.prisma.userProfile.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phone: true,
              role: true,
              isActive: true,
              createdAt: true,
            },
          },
          Category: {
            select: {
              id: true,
              name: true,
              botUsername: true,
              isActive: true,
            },
          },
        },
      }),
      this.prisma.userProfile.count({ where }),
    ]);

    return {
      data: profiles,
      total,
      page,
      limit,
    };
  }
  async getProfileById(id: number) {
    const profile = await this.prisma.userProfile.findUnique({
      where: { id },
      include: {
        Category: { select: { id: true, name: true, isActive: true, expiresAt: true, startedAt: true, userBots: true } },
        user: { select: { id: true, fullName: true, avatar: true, email: true, payments: true } }
      }
    })

    if (!profile) throw new NotFoundException('user\'s profile not found!')
    return {
      success: true,
      data: profile
    }
  }
  async getProfileMe(userId: number) {
    const existingUser = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!existingUser) throw new NotFoundException('user not found')

    const existsProfile = await this.prisma.userProfile.findUnique({
      where: { userId },
      include: {
        Category: { select: { id: true, name: true, isActive: true, expiresAt: true, startedAt: true, userBots: true } },
        user: { select: { id: true, fullName: true, avatar: true, email: true, payments: true } }
      }
    })
    if (!existsProfile) throw new NotFoundException('this profile not found!')

    return {
      success: true,
      data: existsProfile
    }
  }
  async updateProfile(userId: number, payload: UpdateProfileDto) {
    const existingUser = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!existingUser) throw new NotFoundException('user not found')

    const existsCategory = await this.prisma.category.findUnique({ where: { id: payload.categoryId } })
    if (!existsCategory) throw new NotFoundException('this category not found')

    const updateProfile = await this.prisma.userProfile.update({
      where: { userId },
      data: {
        status: payload.status,
        categoryId: payload.categoryId,
        checkedAt: payload.checkedAt,
        isActive: payload.isActive,
        receivedAt: payload.receivedAt,
        userId: userId
      }
    })
    return {
      success: true,
      data: updateProfile
    }

  }
  async deleteProfile(userId: number) {
    const existingUser = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!existingUser) throw new NotFoundException('user not found')

    await this.prisma.userProfile.delete({ where: { id: userId } })
    return {
      success: true,
      message: 'successfully deleted'
    }
  }
  async createUserProfile(userId: number, payload: CreateProfileDto) {
    const existingUser = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!existingUser) throw new NotFoundException('user not found')

    const existsCategory = await this.prisma.category.findUnique({ where: { id: payload.categoryId } })
    if (!existsCategory) throw new NotFoundException('this category not found')

    const createProfile = await this.prisma.userProfile.create({
      data: {
        categoryId: payload.categoryId,
        userId: userId,
        checkedAt: payload.checkedAt,
        isActive: payload.isActive,
        receivedAt: payload.receivedAt,
        status: payload.status
      }
    })
    return {
      success: true,
      data: createProfile
    }
  }
}
