import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { GuardsService } from 'src/common/guards/guards.service';
import { RoleGuard } from 'src/common/role/role.service';
import { roles } from 'src/common/role/role.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Payments')
@ApiBearerAuth()
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }


  @UseGuards(GuardsService, RoleGuard)
  @roles(UserRole.USER)
  @Get('me/history')
  @ApiOperation({ summary: 'Foydalanuvchining bot to‘lovlari tarixi' })
  @ApiResponse({ status: 200, description: 'To‘lovlar ro‘yxati' })
  getMyPayments(@Req() req: Request) {
    const userId = req['user'].id;
    return this.paymentsService.getMePaymentHistory(userId);
  }


  @UseGuards(GuardsService, RoleGuard)
  @roles(UserRole.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create a payment (admin)' })
  @ApiResponse({ status: 201, description: 'Payment created successfully' })
  create(@Body() createPaymentDto: CreatePaymentDto, @Req() req: Request) {
    const userId = req['user'].id;
    return this.paymentsService.create({ ...createPaymentDto, userId });
  }


  @UseGuards(GuardsService, RoleGuard)
  @roles(UserRole.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Get all payment history (admin)' })
  @ApiResponse({ status: 200, description: 'List of all payments' })
  findAll() {
    return this.paymentsService.findAll();
  }

  @UseGuards(GuardsService, RoleGuard)
  @roles(UserRole.ADMIN)
  @Get(':id')
  @ApiOperation({ summary: 'Get a payment by ID (admin)' })
  @ApiResponse({ status: 200, description: 'Single payment details' })
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(+id);
  }




}
