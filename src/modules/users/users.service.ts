import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/core/config/prisma/prisma.service';
import { BotStatus, UserRole } from '@prisma/client';
import { count } from 'console';
import { ResetPasswordDto } from './dto/reset-pasword.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }
  async getAllUser(
    page: number = 1,
    limit: number = 8,
    status?: BotStatus,
    isActive?: boolean,
    role?: UserRole,
    search?: string
  ) {
    const where: any = {
      role: UserRole.USER

    };

    if (status) where.profile = { status };
    if (isActive !== undefined) where.isActive = isActive;
    if (role) where.role = role;
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          fullName: true,
          avatar: true,
          email: true,
          phone: true,
          isActive: true,
          role: true,
          createdAt: true,
          profile: {
            select: {
              status: true,
              isActive: true,
            }
          },
          userBots: {
            select: {
              id: true,
              status: true,
              isActive: true,
              expiresAt: true,
              category: {
                select: { name: true }
              }
            }
          }
        }
      }),
      this.prisma.user.count({ where })
    ]);

    return { data: users, count: total, page, limit };
  }

  async getUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        isActive: true,
        role: true,
        createdAt: true,
        profile: {
          select: {
            id: true,
            status: true,
            isActive: true,
            checkedAt: true,
            receivedAt: true,
          }
        },
        plans: {
          select: {
            id: true,
            name: true,
            amount: true,
            duration: true,
            isActive: true,
          }
        },
        payments: {
          select: {
            id: true,
            amount: true,
            status: true,
            paidAt: true,
            expiresAt: true,
            paymentGateway: true,
          }
        },
        userBots: {
          select: {
            id: true,
            botToken: false,
            status: true,
            isActive: true,
            expiresAt: true,
            category: {
              select: {
                id: true,
                name: true,
                botUsername: true,
              }
            }
          }
        }
      }
    });

    if (!user) {
      throw new NotFoundException('User topilmadi');
    }

    return { data: user };
  }

  async getMe(userId: number) {
    const me = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        avatar: true,
        isActive: true,
        role: true,
        createdAt: true,
        profile: {
          select: {
            status: true,
            isActive: true
          }
        }
      }
    });

    if (!me) throw new NotFoundException('User topilmadi');

    return { data: me };
  }
  async updateUser(userId: number, payload: UpdateUserDto) {
    const existsUser = await this.prisma.user.findUnique({
      where: { id: userId }
    })
    if (!existsUser) throw new NotFoundException('user not found!')
    if (existsUser.email !== payload.email) throw new ConflictException('this email already exist')
    const updateUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        email: payload.email,
        fullName: payload.fullName,
        isActive: payload.isActive,
        phone: payload.phone,
      }
    })
    const { password, ...safeUser } = updateUser
    return {
      data: safeUser
    }

  }
  async resetPassword(payload: ResetPasswordDto, userId: number) {

    const checkPassword = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!checkPassword) throw new NotFoundException('user not found')

    const isMatch = await bcrypt.compare(payload.oldPassword, checkPassword.password!);
    if (!isMatch) throw new ConflictException("the password isn't match");

    const isMatch2 = await bcrypt.compare(payload.newPassword, checkPassword.password!);
    if (isMatch2) throw new ConflictException("this password used last time");

    const existsUser = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!existsUser) throw new NotFoundException('user not found')
    await this.prisma.user.update({ where: { id: userId }, data: { password: payload.newPassword } })
    return {
      success: true,
      message: "successfully updated!"
    }
  }
  async createAdmin(payload: CreateAdminDto) {
    const existsUser = await this.prisma.user.findUnique({ where: { email: payload.email } })
    if (existsUser) throw new ConflictException('admin already exists!')

    const hashedPassword = await bcrypt.hash(payload.password, 10)
    const createAdmin = await this.prisma.user.create({
      data: {
        fullName: payload.fullName,
        email: payload.email,
        phone: payload.phone,
        isActive: payload.isActive,
        role: payload.role,
        password: hashedPassword
      }
    })
    const { password, ...safeUser } = createAdmin
    return {
      message: 'successfully created!',
      data: safeUser
    }
  }
  async deleteUser(id: number) {
    const existingUser = await this.prisma.user.findUnique({ where: { id } })
    if (!existingUser) throw new NotFoundException('user not found!')

    await this.prisma.user.delete({ where: { id } })
    return {
      message: 'successfully deleted!'
    }
  }
}
