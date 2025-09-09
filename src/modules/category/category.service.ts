import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/core/config/prisma/prisma.service';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService, private uploadService: UploadService) { }
  async create(createCategoryDto: CreateCategoryDto, categoryImageUrl: string) {
    const existsName = await this.prisma.category.findUnique({ where: { name: createCategoryDto.name } })
    if (existsName) throw new ConflictException('this category already exists')

    if (!categoryImageUrl) throw new NotFoundException('category image is required')
    const imageUrl = await this.uploadService.uploadImageBase64(categoryImageUrl)
    const createCategory = await this.prisma.category.create({
      data: {
        name: createCategoryDto.name,
        isActive: createCategoryDto.isActive,
        imageUrl
      }
    })
    return {
      success: true,
      data: createCategory
    }
  }

  async findAll() {
    const allCategory = await this.prisma.category.findMany()
    if (!allCategory) throw new NotFoundException('category empty')

    return {
      success: true,
      data: allCategory
    }
  }

  async findOne(id: number) {
    const existsCategory = await this.prisma.category.findUnique({ where: { id } })
    if (!existsCategory) throw new NotFoundException('this category not found!')

    return {
      success: true,
      data: existsCategory
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto, categoryImageUrl?: string) {
    const existsCategory = await this.prisma.category.findUnique({ where: { id } })
    if (!existsCategory) throw new NotFoundException('this category not found!')

    const existsName = await this.prisma.category.findUnique({ where: { name: updateCategoryDto.name } })
    if (existsName) throw new ConflictException('this category already exists!')

    if (categoryImageUrl) {
      const imageUrl = await this.uploadService.uploadImageBase64(categoryImageUrl)
      const updated = await this.prisma.category.update({
        where: { id },
        data: {
          name: updateCategoryDto.name,
          isActive: updateCategoryDto.isActive,
          imageUrl
        }
      })
      return {
        success: true,
        data: updated
      }
    }
    const updated = await this.prisma.category.update({
      where: { id },
      data: {
        name: updateCategoryDto.name,
        isActive: updateCategoryDto.isActive
      }
    })
    return {
      success: true,
      data: updated
    }
  }

  async remove(id: number) {
    const existsCategory = await this.prisma.category.findUnique({ where: { id } })
    if (!existsCategory) throw new NotFoundException('this category not found!')

    await this.prisma.category.delete({ where: { id } })
    return {
      success: true,
      message: "successfully deleted"
    }
  }
  async findOneByName(name: string) {
    const existsName = await this.prisma.category.findUnique({ where: { name } })
    if (!existsName) throw new NotFoundException('this category not found!')
    return {
      success: true, data: existsName
    }

  }
}
