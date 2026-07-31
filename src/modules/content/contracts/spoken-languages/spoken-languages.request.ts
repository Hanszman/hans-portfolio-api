import { Type } from 'class-transformer';
import {
  IsArray,
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
import { IsContentImageAssetIdArray } from '../shared/content-image-asset-validation';

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

  @IsString()
  @IsNotEmpty()
  nameEs!: string;

  @IsEnum(SpokenLanguageProficiency)
  /* c8 ignore next */
  proficiency!: SpokenLanguageProficiency;

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
  @IsContentImageAssetIdArray()
  imageAssetIds?: string[];
}

export class UpdateSpokenLanguageRequest extends PartialType(
  CreateSpokenLanguageRequest,
) {}
