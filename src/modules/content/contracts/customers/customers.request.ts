import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Min,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { CONTENT_IDENTIFIER_PATTERN } from '../content-contracts.constants';

export class CreateCustomerRequest {
  @IsString()
  @IsNotEmpty()
  slug!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  summaryPt!: string;

  @IsString()
  @IsNotEmpty()
  summaryEn!: string;

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
  experienceIds?: string[];

  @IsOptional()
  @IsArray()
  @Matches(CONTENT_IDENTIFIER_PATTERN, {
    each: true,
    message: 'each value in imageAssetIds must be a UUID',
  })
  imageAssetIds?: string[];
}

export class UpdateCustomerRequest extends PartialType(CreateCustomerRequest) {}
