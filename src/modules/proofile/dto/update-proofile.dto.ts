import { IsBoolean, IsDateString, IsEnum, IsInt, IsOptional } from 'class-validator';
import { BotStatus } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
    @ApiPropertyOptional({ description: 'Status', enum: BotStatus, example: BotStatus.ACTIVE })
    @IsOptional()
    @IsEnum(BotStatus)
    status?: BotStatus;

    @ApiPropertyOptional({ description: 'Faollik holati', example: true })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiPropertyOptional({ description: 'Qabul qilingan sana (ISO formatda)', example: '2025-07-30T10:00:00.000Z' })
    @IsOptional()
    @IsDateString()
    receivedAt?: string;

    @ApiPropertyOptional({ description: 'Tekshiruv vaqti (ISO formatda)', example: '2025-07-30T12:00:00.000Z' })
    @IsOptional()
    @IsDateString()
    checkedAt?: string;

    @ApiPropertyOptional({ description: 'Kategoriya ID', example: 3 })
    @IsOptional()
    @IsInt()
    categoryId?: number;
}
