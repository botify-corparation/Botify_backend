import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentPlanDto } from './dto/create-payment-plan.dto';
import { UpdatePaymentPlanDto } from './dto/update-payment-plan.dto';
import { PrismaService } from 'src/core/config/prisma/prisma.service';

@Injectable()
export class PaymentPlanService {
  constructor(private prisma: PrismaService) { }
  async create(createPaymentPlanDto: CreatePaymentPlanDto, userId: number) {
    const existsUser = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!existsUser) throw new NotFoundException('user not found!')
    const existsCategory = await this.prisma.category.findUnique({ where: { id: createPaymentPlanDto.categoryId } })
    if (!existsCategory) throw new NotFoundException('category not found!')
    const createPaymentPlan = await this.prisma.paymentPlan.create({
      data: {
        amount: createPaymentPlanDto.amount,
        duration: createPaymentPlanDto.duration,
        name: createPaymentPlanDto.name,
        userId,
        isActive: createPaymentPlanDto.isActive,
        categoryId: createPaymentPlanDto.categoryId
      }
    })
    return {
      success: true,
      data: createPaymentPlan
    }
  }

  async findAll() {
    const allPaymentPlan = await this.prisma.paymentPlan.findMany({ select: { id: true, name: true, amount: true, duration: true, isActive: true } })
    if (!allPaymentPlan) throw new NotFoundException('this plan not found')

    return {
      success: true,
      data: allPaymentPlan
    }
  }

  async findOne(id: number) {
    const existsPaymentPlan = await this.prisma.paymentPlan.findUnique({ where: { id }, select: { id: true, name: true, amount: true, duration: true, isActive: true } })
    if (!existsPaymentPlan) throw new NotFoundException('this paymentPlan not found!')

    return {
      success: true,
      data: existsPaymentPlan
    }
  }
  async findOneByName(name: string) {
    const existsPaymentPlan = await this.prisma.paymentPlan.findMany({ where: { name }, select: { id: true, name: true, amount: true, duration: true, isActive: true } })
    if (!existsPaymentPlan) throw new NotFoundException('this paymentPlan not found!')

    return {
      success: true,
      data: existsPaymentPlan
    }
  }

  async update(id: number, updatePaymentPlanDto: UpdatePaymentPlanDto, userId: number) {
    const existsPaymentPlan = await this.prisma.paymentPlan.findUnique({ where: { id }, select: { id: true, name: true, amount: true, duration: true, isActive: true } })
    if (!existsPaymentPlan) throw new NotFoundException('this paymentPlan not found!')

    const existsUser = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!existsUser) throw new NotFoundException('user not found!')

    const existCategory = await this.prisma.category.findUnique({ where: { id: updatePaymentPlanDto.categoryId } })
    if (!existCategory) throw new NotFoundException('category not found!')
    const updated = await this.prisma.paymentPlan.update({
      where: { id }, data: {
        amount: updatePaymentPlanDto.amount,
        duration: updatePaymentPlanDto.duration,
        isActive: updatePaymentPlanDto.isActive,
        name: updatePaymentPlanDto.name,
        userId,
        categoryId: updatePaymentPlanDto.categoryId
      }
    })
    return {
      success: true,
      data: updated
    }
  }

  async remove(id: number) {
    const existsPaymentPlan = await this.prisma.paymentPlan.findUnique({ where: { id }, select: { id: true, name: true, amount: true, duration: true, isActive: true } })
    if (!existsPaymentPlan) throw new NotFoundException('this paymentPlan not found!')

    await this.prisma.paymentPlan.delete({ where: { id } })
    return {
      success: true,
      message: 'successfully deleted!'
    }
  }
}
