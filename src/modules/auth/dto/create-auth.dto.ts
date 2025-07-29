import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    Length,
    Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterAuthDto {
    @ApiProperty({
        example: 'Ali Valiyev',
        description: 'Foydalanuvchining to‘liq ismi',
    })
    @IsNotEmpty({ message: 'Toliq ism majburiy' })
    @IsString()
    fullName: string;

    @ApiProperty({
        example: 'ali@gmail.com',
        description: 'Foydalanuvchining elektron pochtasi',
    })
    @IsNotEmpty({ message: 'Email majburiy' })
    @IsEmail({}, { message: 'Notogri email format' })
    email: string;

    @ApiProperty({
        example: '+998901234567',
        description: 'Foydalanuvchining telefon raqami (+998 bilan)',
    })
    @IsNotEmpty({ message: 'Telefon raqam majburiy' })
    @Matches(/^(\+998)?[0-9]{9}$/, {
        message: 'Telefon raqam +998 bilan yoki 9 xonali bolishi kerak',
    })
    phone: string;

    @ApiProperty({
        example: 'strongPassword123',
        description: 'Foydalanuvchining paroli (kamida 6 ta belgi)',
    })
    @IsNotEmpty({ message: 'Parol majburiy' })
    @Length(6, 32, { message: 'Parol 6 dan 32 belgigacha bolishi kerak' })
    password: string;

    @ApiProperty({
        example: '123456',
        description: 'Elektron pochtaga yuborilgan 6 xonali tasdiqlash kodi',
    })
    @IsString()
    otp: string;
}
