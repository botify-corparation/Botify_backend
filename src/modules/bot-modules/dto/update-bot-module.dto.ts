import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateBotModelDto } from './create-bot-module.dto';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateBotModuleDto extends PartialType(CreateBotModelDto) {
    @ApiPropertyOptional({
        description: 'Bot modelining nomi',
        example: 'AI ChatBot v2',
    })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({
        description: 'Bot modeli tegishli bo‘ladigan kategoriya ID’si',
        example: 4,
    })
    @IsInt()
    @IsOptional()
    categoryId?: number;
}
