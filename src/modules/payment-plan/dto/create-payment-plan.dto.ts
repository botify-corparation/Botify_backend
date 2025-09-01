import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDecimal, IsInt, IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreatePaymentPlanDto {
    @ApiProperty({
        example: 'Premium 1 Month',
        description: 'Name of the payment plan',
    })
    @IsString()
    name: string;

    @ApiProperty({
        example: 25000.00,
        description: 'Payment amount (decimal)',
    })
    @IsInt()
    amount: number;
    @ApiProperty({
        example: 30,
        description: 'Duration of the plan in days',
    })
    @IsInt()
    duration: number;

    @ApiPropertyOptional({
        example: true,
        description: 'Is the plan active?',
        default: true,
    })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiPropertyOptional({
        example: 1,
        description: 'Optional user ID who created this plan (e.g. an admin)',
    })
    @IsOptional()
    @IsInt()
    userId?: number;

    @ApiPropertyOptional({
        example: 1,
        description: 'categoryId who created this plan (e.g. an admin)',
    })
    @IsInt()
    categoryId: number;
}
