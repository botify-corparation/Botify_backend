import { IsEmail, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SendMailDto {
    @ApiProperty({
        example: 'user@gmail.com',
        description: 'Foydalanuvchining elektron pochtasi',
    })
    @IsEmail()
    @IsString()
    email: string;
}