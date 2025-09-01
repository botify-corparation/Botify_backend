import { PartialType } from '@nestjs/mapped-types';
import { RegisterAuthDto } from './create-auth.dto';
import { ApiExtraModels } from '@nestjs/swagger';

@ApiExtraModels(RegisterAuthDto)
export class UpdateAuthDto extends PartialType(RegisterAuthDto) { }
