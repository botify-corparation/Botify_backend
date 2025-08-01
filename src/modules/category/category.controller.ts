import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
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
} from '@nestjs/swagger';
import { GuardsService } from 'src/common/guards/guards.service';
import { RoleGuard } from 'src/common/role/role.service';
import { roles } from 'src/common/role/role.decorator';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(GuardsService, RoleGuard)
  @roles('ADMIN')
  @Post('create')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({ status: 201, description: 'Category successfully created' })
  @ApiResponse({ status: 409, description: 'Category with this name already exists' })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
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
  @Patch('updated/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a category' })
  @ApiParam({ name: 'id', type: Number, description: 'Category ID' })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({ status: 200, description: 'Category successfully updated' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 409, description: 'Category name already exists' })
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(+id, updateCategoryDto);
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
