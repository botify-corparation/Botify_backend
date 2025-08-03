import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFavoriteDto {
    @ApiProperty({ example: 12, description: 'UserBot ID (botni ID raqami)' })
    @IsNotEmpty()
    @IsInt()
    userBotId: number;
}
