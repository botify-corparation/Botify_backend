import { IsNotEmpty, IsString, IsNumber, IsEnum, IsDateString, IsOptional } from 'class-validator';
import { PaymentStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
    @ApiProperty()
    @IsNumber()
    userId: number;

    @ApiProperty()
    @IsNumber()
    userBotId: number;

    @ApiProperty()
    @IsNumber()
    planId: number;

    @ApiProperty()
    @IsString()
    transactionId: string;


    @ApiProperty({ enum: PaymentStatus })
    @IsEnum(PaymentStatus)
    status: PaymentStatus;

    @ApiProperty({ required: false })
    @IsDateString()
    @IsOptional()
    paidAt?: string;

    @ApiProperty({ required: false })
    @IsDateString()
    @IsOptional()
    verifiedAt?: string;
}
