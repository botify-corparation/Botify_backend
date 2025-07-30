import {
    IsEmail,
    IsEnum,
    IsOptional,
    IsPhoneNumber,
    IsString,
    MinLength,
} from 'class-validator';
import { UserRole } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAdminDto {
    @ApiProperty({ example: 'Omadbek Tuxtasinboyev' })
    @IsString()
    fullName: string;

    @ApiProperty({ example: 'omadbek@example.com' })
    @IsEmail()
    email: string;

    @ApiPropertyOptional({ example: '+998901234567' })
    phone: string;

    @ApiProperty({ example: 'Omadbek007' })
    @IsString()
    password: string;

    @ApiPropertyOptional({ enum: UserRole, default: UserRole.ADMIN })
    @IsEnum(UserRole)
    role: UserRole = UserRole.ADMIN;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    isActive?: boolean;
}
