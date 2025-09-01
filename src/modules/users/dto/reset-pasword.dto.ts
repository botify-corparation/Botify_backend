import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
    @ApiProperty({
        example: 'OldPassword123!',
        description: 'Userning joriy (eski) paroli',
    })
    @IsString()
    oldPassword: string;

    @ApiProperty({
        example: 'NewPassword456!',
        description: 'Yangi parol',
    })
    @IsString()
    newPassword: string;
}
