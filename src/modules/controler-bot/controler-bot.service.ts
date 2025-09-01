import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UserRole } from '@prisma/client';
import { PrismaService } from 'src/core/config/prisma/prisma.service';

@Injectable()
export class ControlerBotService {
  constructor(
    @Inject('BOT_SERVICE') private readonly botClient: ClientProxy,
    private prisma: PrismaService
  ) { }

  async sendTokenToBotService(token: string, name: string, userId: number) {
    const botName = name.toLowerCase().trim()
    const existsName = await this.prisma.botModel.findUnique({ where: { name: name } })
    if (!existsName) throw new NotFoundException('this name not found!')

    const existsUser = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!existsUser) throw new NotFoundException('user not found')

    if (existsUser.role !== UserRole.ADMIN) {
      const existsToken = await this.prisma.userBot.findUnique({ where: { botToken: token } })
      if (existsToken) throw new ConflictException('this token already exist')
      const existsPayment = await this.prisma.payment.findMany({ where: { userId } })
      if (!existsPayment) throw new NotFoundException('this user won\'t sell still bot')
      const creatUserBot = await this.prisma.userBot.create({
        data: {
          botToken: token,
          categoryId: existsName.categoryId,
          userId,
          botModelId: existsName.id,
          isActive: true,
        }
      })
    }
    const existsToken = await this.prisma.userBot.findUnique({ where: { botToken: token } })
    if (existsToken) throw new ConflictException('this token already exist')

    const creatUserBot = await this.prisma.userBot.create({
      data: {
        botToken: token,
        categoryId: existsName.categoryId,
        userId,
        botModelId: existsName.id,
        isActive: true,
      }
    })
    this.botClient.emit('start_observer_bot', { token, userId, });
  }
}
