import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
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

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  imageAssetIds?: string[];
}

export class UpdateSpokenLanguageRequest extends PartialType(
  CreateSpokenLanguageRequest,
) {}
