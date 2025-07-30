import { IsBoolean, IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { BotStatus } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProfileDto {

  @ApiPropertyOptional({ description: 'Status', enum: BotStatus, example: BotStatus.PENDING })
  @IsOptional()
  @IsEnum(BotStatus)
  status?: BotStatus;

  @ApiPropertyOptional({ description: 'Faollik holati', example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Tekshiruv vaqti', example: '2025-07-30T12:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  checkedAt?: string;

  @ApiPropertyOptional({ description: 'Qabul qilingan sana', example: '2025-07-30T10:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  receivedAt?: string;

  @ApiPropertyOptional({ description: 'Kategoriya ID', example: 2 })
  @IsOptional()
  @IsInt()
  categoryId?: number;
}
