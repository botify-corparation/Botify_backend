import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { PaymentPlanService } from './payment-plan.service';
import { CreatePaymentPlanDto } from './dto/create-payment-plan.dto';
import { UpdatePaymentPlanDto } from './dto/update-payment-plan.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { Request } from 'express';
import { GuardsService } from 'src/common/guards/guards.service';
import { RoleGuard } from 'src/common/role/role.service';
import { roles } from 'src/common/role/role.decorator';

@ApiTags('Payment Plans')
@ApiBearerAuth()
@UseGuards(GuardsService, RoleGuard)
@Controller('payment-plans')
export class PaymentPlanController {
  constructor(private readonly paymentPlanService: PaymentPlanService) { }

  @roles('ADMIN')
  @Post()
  @ApiOperation({ summary: 'Create a payment plan (Admin)' })
  @ApiResponse({ status: 201, description: 'Payment plan created successfully' })
  async create(@Body() dto: CreatePaymentPlanDto, @Req() req: Request) {
    const userId = req['user'].id;
    return this.paymentPlanService.create(dto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all payment plans (public)' })
  @ApiResponse({ status: 200, description: 'List of all active/inactive payment plans' })
  async findAll() {
    return this.paymentPlanService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment plan by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Payment plan found' })
  @ApiResponse({ status: 404, description: 'Payment plan not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.paymentPlanService.findOne(id);
  }

  @Get('by-name/:name')
  @ApiOperation({ summary: 'Find payment plans by name' })
  @ApiParam({ name: 'name', type: String })
  @ApiResponse({ status: 200, description: 'Matching payment plans' })
  @ApiResponse({ status: 404, description: 'No plans found for this name' })
  async findOneByName(@Param('name') name: string) {
    return this.paymentPlanService.findOneByName(name);
  }

  @roles('ADMIN')
  @Patch(':id')
  @ApiOperation({ summary: 'Update a payment plan (Admin)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Payment plan updated successfully' })
  @ApiResponse({ status: 404, description: 'Payment plan or user not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePaymentPlanDto,
    @Req() req: Request,
  ) {
    const userId = req['user'].id;
    return this.paymentPlanService.update(id, dto, userId);
  }

  @roles('ADMIN')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a payment plan (Admin)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Payment plan deleted successfully' })
  @ApiResponse({ status: 404, description: 'Payment plan not found' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.paymentPlanService.remove(id);
  }
}
