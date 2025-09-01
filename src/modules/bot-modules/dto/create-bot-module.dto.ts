import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateBotModelDto {
    @ApiProperty({
        description: 'Bot modeli nomi',
        example: 'Telegram E-Commerce Bot',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'Bot modeliga tegishli kategoriya ID',
        example: 1,
    })
    @IsInt()
    categoryId: number;

}
