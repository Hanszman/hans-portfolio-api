import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';
import { SpokenLanguageProficiency } from '@prisma/client';
import { PartialType } from '@nestjs/swagger';
import { CONTENT_IDENTIFIER_PATTERN } from '../content-contracts.constants';

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
  @IsBoolean()
  highlight?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @IsOptional()
  @IsArray()
  @Matches(CONTENT_IDENTIFIER_PATTERN, {
    each: true,
    message: 'each value in imageAssetIds must be a UUID',
  })
  imageAssetIds?: string[];
}

export class UpdateSpokenLanguageRequest extends PartialType(
  CreateSpokenLanguageRequest,
) {}
