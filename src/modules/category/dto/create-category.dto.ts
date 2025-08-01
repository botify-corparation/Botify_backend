import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Education',
    description: 'Name of the category (must be unique)',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Category active status (optional)',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
