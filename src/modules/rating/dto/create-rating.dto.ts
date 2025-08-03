import { IsInt, IsNotEmpty, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRatingDto {
    @ApiProperty({ example: 12, description: 'UserBot ID' })
    @IsNotEmpty()
    @IsInt()
    userBotId: number;

    @ApiProperty({ example: 5, description: 'Rating value (1 to 5)' })
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    @Max(5)
    rating: number;
}
