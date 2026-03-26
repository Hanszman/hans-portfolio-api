import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { SpokenLanguageProficiency } from '@prisma/client';
import { PartialType } from '@nestjs/swagger';

export class CreateSpokenLanguageRequest {
  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsString()
  @IsNotEmpty()
  namePt!: string;

  @IsString()
  @IsNotEmpty()
  nameEn!: string;

  @IsEnum(SpokenLanguageProficiency)
  proficiency!: SpokenLanguageProficiency;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsBoolean()
  highlight?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder?: number;
}

export class UpdateSpokenLanguageRequest extends PartialType(
  CreateSpokenLanguageRequest,
) {}
