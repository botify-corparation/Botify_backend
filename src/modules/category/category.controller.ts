import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { GuardsService } from 'src/common/guards/guards.service';
import { RoleGuard } from 'src/common/role/role.service';
import { roles } from 'src/common/role/role.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { readFileSync } from 'fs';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }


  @UseGuards(GuardsService, RoleGuard)
  @roles('ADMIN')
  @Post('create')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new category with image upload' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Luxury' },
        isActive: { type: 'boolean', example: true },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Category image file',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Category successfully created' })
  @ApiResponse({ status: 409, description: 'Category with this name already exists' })
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    const base64Image = file.buffer.toString('base64');

    return this.categoryService.create(createCategoryDto, base64Image);
  }




  @Get('getAll')
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'List of all categories' })
  findAll() {
    return this.categoryService.findAll();
  }

  @Get('by-id/:id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Category ID' })
  @ApiResponse({ status: 200, description: 'Category found' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Get('by-name/:name')
  @ApiOperation({ summary: 'Get category by name' })
  @ApiParam({ name: 'name', type: String, description: 'Category name' })
  @ApiResponse({ status: 200, description: 'Category found' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  findOneByName(@Param('name') name: string) {
    return this.categoryService.findOneByName(name);
  }

  @UseGuards(GuardsService, RoleGuard)
  @roles('ADMIN')
  @Patch('update/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a category with optional image upload' })
  @ApiParam({ name: 'id', type: Number, description: 'Category ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Updated Category' },
        isActive: { type: 'boolean', example: true },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Optional category image file',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Category successfully updated' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 409, description: 'Category name already exists' })
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let base64Image: string | undefined;

    if (file) {
      base64Image = file.buffer.toString('base64');
    }

    return this.categoryService.update(+id, updateCategoryDto, base64Image);
  }

  @UseGuards(GuardsService, RoleGuard)
  @roles('ADMIN')
  @Delete('deleted/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a category by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Category ID' })
  @ApiResponse({ status: 200, description: 'Category successfully deleted' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
