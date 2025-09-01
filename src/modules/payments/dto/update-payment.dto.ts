import { IsEnum, IsOptional, IsDateString } from 'class-validator';
import { PaymentStatus } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePaymentDto {
    @ApiPropertyOptional({ enum: PaymentStatus })
    @IsEnum(PaymentStatus)
    @IsOptional()
    status?: PaymentStatus;

    @ApiPropertyOptional()
    @IsDateString()
    @IsOptional()
    verifiedAt?: string;
}
