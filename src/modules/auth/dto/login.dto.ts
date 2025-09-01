import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginAuthDto {
    @ApiProperty({
        example: 'ali@gmail.com',
        description: 'Foydalanuvchining ro‘yxatdan o‘tgan elektron pochtasi',
    })
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email: string;

    @ApiProperty({
        example: 'StrongPassword123',
        description: 'Foydalanuvchining paroli',
    })
    @IsNotEmpty()
    @IsString()
    password: string;
}
