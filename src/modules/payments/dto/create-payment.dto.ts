import { ApiProperty } from '@nestjs/swagger';
import {
    IsDate,
    IsEnum,
    IsInt,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';
import { PaymentStatus, PaymentGateway } from '@prisma/client';

export class CreatePaymentDto {
    @ApiProperty({ example: 1, description: 'User ID' })
    @IsInt()
    userId: number;

    @ApiProperty({ example: 2, description: 'UserBot ID' })
    @IsInt()
    userBotId: number;

    @ApiProperty({ example: 3, description: 'Payment plan ID' })
    @IsInt()
    planId: number;



    @ApiProperty({
        example: 'MANUAL-20250731-001',
        description: 'Unique transaction identifier',
    })
    @IsString()
    transactionId: string;

    @ApiProperty({
        example: '2025-07-31T12:00:00Z',
        description: 'Payment date (if paid)',
        required: false,
    })
    @IsOptional()
    @IsDate()
    paidAt?: Date;

    @ApiProperty({
        example: '2025-08-30T12:00:00Z',
        description: 'Expiration date of the payment',
    })
    @IsDate()
    expiresAt: Date;

    @ApiProperty({
        example: 'SUCCESS',
        enum: PaymentStatus,
        description: 'Payment status',
        default: PaymentStatus.PENDING,
    })
    @IsEnum(PaymentStatus)
    status: PaymentStatus;

    @ApiProperty({
        example: '2025-07-31T12:05:00Z',
        description: 'Date when payment was verified',
        required: false,
    })
    @IsOptional()
    @IsDate()
    verifiedAt?: Date;
}


