import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PrismaService } from 'src/core/config/prisma/prisma.service';
import * as dayjs from 'dayjs';
import { PaymentGateway } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) { }
  async create(createPaymentDto: CreatePaymentDto) {
    const existsUser = await this.prisma.user.findUnique({ where: { id: createPaymentDto.userId } })
    if (!existsUser) throw new NotFoundException('user not found')

    const existsUserBotId = await this.prisma.userBot.findUnique({ where: { id: createPaymentDto.userBotId } })
    if (!existsUserBotId) throw new NotFoundException('user\'s bot not found')

    const existsPlan = await this.prisma.paymentPlan.findUnique({ where: { id: createPaymentDto.planId } })
    if (!existsPlan) throw new NotFoundException('this PaymentPlanId not found')

    const paidAt = new Date();
    const expiresAt = dayjs(paidAt).add(existsPlan.duration, 'day').toDate();

    const createPayment = await this.prisma.payment.create({
      data: {
        amount: existsPlan.amount,
        expiresAt,
        transactionId: createPaymentDto.transactionId,
        paidAt: createPaymentDto.paidAt,
        paymentGateway: PaymentGateway.CASH,
        planId: createPaymentDto.planId,
        userId: createPaymentDto.userId,
        userBotId: createPaymentDto.userBotId,
        status: createPaymentDto.status,
        verifiedAt: createPaymentDto.verifiedAt
      }
    })
    return {
      success: true,
      data: createPayment
    }
  }

  async findAll() {
    const allPaymentHistory = await this.prisma.payment.findMany({
      select: {
        id: true,
        amount: true,
        status: true,
        expiresAt: true,
        paymentGateway: true,
        user: {
          select: {
            id: true,
            fullName: true,
            avatar: true,
            email: true,
            isActive: true,
            phone: true,
          }
        },
        plan: {
          select: {
            id: true,
            name: true,
            amount: true,
            duration: true,
            isActive: true,

          }
        },
        bot: {
          select: {
            id: true,
            status: true,
            category: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }

      }
    })
    if (allPaymentHistory.length === 0) throw new NotFoundException('paymen history empty')
    return {
      success: true,
      data: allPaymentHistory
    }
  }

  async findOne(id: number) {
    const onePaymentHistory = await this.prisma.payment.findUnique({
      where: { id },
      select: {
        id: true,
        amount: true,
        status: true,
        expiresAt: true,
        paymentGateway: true,
        user: {
          select: {
            id: true,
            fullName: true,
            avatar: true,
            email: true,
            isActive: true,
            phone: true,
          }
        },
        plan: {
          select: {
            id: true,
            name: true,
            amount: true,
            duration: true,
            isActive: true,

          }
        },
        bot: {
          select: {
            id: true,
            status: true,
            category: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }

      }
    })
    if (!onePaymentHistory) throw new NotFoundException('paymen history empty')
    return {
      success: true,
      data: onePaymentHistory
    }
  }
  async getMePaymentHistory(userId: number) {
    const existingUser = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!existingUser) throw new NotFoundException('user not found!')

    const onePaymentHistory = await this.prisma.payment.findMany({
      where: { userId },
      select: {
        id: true,
        amount: true,
        status: true,
        expiresAt: true,
        paymentGateway: true,
        user: {
          select: {
            id: true,
            fullName: true,
            avatar: true,
            email: true,
            isActive: true,
            phone: true,
          }
        },
        plan: {
          select: {
            id: true,
            name: true,
            amount: true,
            duration: true,
            isActive: true,

          }
        },
        bot: {
          select: {
            id: true,
            status: true,
            category: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }

      }
    })
    if (onePaymentHistory.length === 0) throw new NotFoundException('paymen history empty')
    return {
      success: true,
      data: onePaymentHistory
    }
  }
  async remove(id: number) {
    const existsPayment = await this.prisma.payment.findUnique({ where: { id } })
    if (!existsPayment) throw new NotFoundException('payment not found!')
    await this.prisma.payment.delete({ where: { id } })
    return {
      success: true,
      message: "successfully deleted"
    }
  }
}
