import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBotModelDto } from './dto/create-bot-module.dto';
import { UpdateBotModuleDto } from './dto/update-bot-module.dto';
import { PrismaService } from 'src/core/config/prisma/prisma.service';

@Injectable()
export class BotModulesService {
  constructor(private prisma: PrismaService) { }
  async create(createBotModuleDto: CreateBotModelDto) {
    const existsCategory = await this.prisma.category.findUnique({ where: { id: createBotModuleDto.categoryId } })
    if (!existsCategory) throw new NotFoundException('this category not found!')

    const createBotmodel = await this.prisma.botModel.create({
      data: {
        name: createBotModuleDto.name,
        categoryId: createBotModuleDto.categoryId
      }
    })
    return {
      success: true,
      data: createBotmodel
    }
  }

  async findAll() {
    const result = await this.prisma.botModel.findMany({ select: { id: true, name: true, category: { select: { id: true, name: true } }, _count: true } })
    return {
      success: true,
      data: result
    }
  }

  async findOneById(id: number) {
    const existsBotModel = await this.prisma.botModel.findUnique({ where: { id } })
    if (!existsBotModel) throw new NotFoundException('this bot not found')

    return {
      success: true,
      data: existsBotModel
    }
  }
  async findOneByName(name: string) {
    const existsBotModel = await this.prisma.botModel.findUnique({ where: { name } })
    if (!existsBotModel) throw new NotFoundException('this bot not found')

    return {
      success: true,
      data: existsBotModel
    }

  }

  async update(id: number, updateBotModuleDto: UpdateBotModuleDto) {
    const existsBotModel = await this.prisma.botModel.findUnique({ where: { id } })
    if (!existsBotModel) throw new NotFoundException('this bot not found')

    const existsName = await this.prisma.botModel.findUnique({ where: { name: updateBotModuleDto.name } })
    if (existsName) throw new ConflictException('this name already exist')

    const updatedBotModel = await this.prisma.botModel.update({
      where: { id },
      data: {
        categoryId: updateBotModuleDto.categoryId,
        name: updateBotModuleDto.name
      }
    })
    return {
      success: true,
      data: updatedBotModel
    }

  }

  async remove(id: number) {
    const existsBotModel = await this.prisma.botModel.findUnique({ where: { id } })
    if (!existsBotModel) throw new NotFoundException('this bot not found')

    await this.prisma.botModel.delete({ where: { id } })

    return {
      success: true,
      message: 'successfully deleted'
    }
  }
}
