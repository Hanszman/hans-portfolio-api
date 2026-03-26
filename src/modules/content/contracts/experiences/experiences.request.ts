import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateExperienceRequest {
  @IsString()
  @IsNotEmpty()
  slug!: string;

  @IsString()
  @IsNotEmpty()
  companyName!: string;

  @IsString()
  @IsNotEmpty()
  titlePt!: string;

  @IsString()
  @IsNotEmpty()
  titleEn!: string;

  @IsString()
  @IsNotEmpty()
  summaryPt!: string;

  @IsString()
  @IsNotEmpty()
  summaryEn!: string;

  @IsString()
  @IsNotEmpty()
  descriptionPt!: string;

  @IsString()
  @IsNotEmpty()
  descriptionEn!: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsDateString()
  startDate!: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  isCurrent?: boolean;

  @IsOptional()
  @IsBoolean()
  highlight?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

export class UpdateExperienceRequest extends PartialType(
  CreateExperienceRequest,
) {}
