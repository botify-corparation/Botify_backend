import { IsEmail, IsOptional, IsString, IsBoolean, IsPhoneNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
    @ApiPropertyOptional({
        example: 'Tuxtasinboyev Omadbek',
        description: 'Foydalanuvchining toliq ismi',
    })
    @IsOptional()
    @IsString()
    fullName?: string;

    @ApiPropertyOptional({
        example: 'omadbektuxtasinboyev06@gmail.com',
        description: 'Foydalanuvchi email manzili',
    })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional({
        example: '+998908330183',
        description: 'Foydalanuvchi telefon raqami',
    })
    @IsOptional()
    @IsPhoneNumber()
    phone?: string;

    @ApiPropertyOptional({
        example: true,
        description: 'Foydalanuvchi aktivmi yoki yoq',
    })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
