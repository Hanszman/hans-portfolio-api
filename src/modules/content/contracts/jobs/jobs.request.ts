import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { IsContentImageAssetIdArray } from '../shared/content-image-asset-validation';
import { IsContentEndDateOnOrAfterStartDate } from '../shared/content-date-range-validation';

export class CreateJobRequest {
  @IsString()
  @IsNotEmpty()
  slug!: string;

  @IsString()
  @IsNotEmpty()
  namePt!: string;

  @IsString()
  @IsNotEmpty()
  nameEn!: string;

  @IsString()
  @IsNotEmpty()
  nameEs!: string;

  @IsString()
  @IsNotEmpty()
  summaryPt!: string;

  @IsString()
  @IsNotEmpty()
  summaryEn!: string;

  @IsString()
  @IsNotEmpty()
  summaryEs!: string;

  @IsDateString()
  startDate!: string;

  @IsOptional()
  @IsDateString()
  @IsContentEndDateOnOrAfterStartDate()
  endDate?: string;

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
  @IsContentImageAssetIdArray()
  imageAssetIds?: string[];
}

export class UpdateJobRequest extends PartialType(CreateJobRequest) {}
