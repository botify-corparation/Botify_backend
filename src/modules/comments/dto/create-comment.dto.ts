import { IsInt, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
    @ApiProperty({
        example: 5,
        description: 'Izoh yozilayotgan UserBot ID raqami',
    })
    @IsInt()
    userBotId: number;

    @ApiProperty({
        example: 'Juda yaxshi bot!',
        description: 'Izoh matni (kamida 2ta harf)',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    text: string;
}
