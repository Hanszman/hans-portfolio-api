import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { DegreeType } from '@prisma/client';
import { PartialType } from '@nestjs/swagger';

export class CreateFormationRequest {
  @IsString()
  @IsNotEmpty()
  slug!: string;

  @IsString()
  @IsNotEmpty()
  institution!: string;

  @IsString()
  @IsNotEmpty()
  titlePt!: string;

  @IsString()
  @IsNotEmpty()
  titleEn!: string;

  @IsEnum(DegreeType)
  degreeType!: DegreeType;

  @IsString()
  @IsNotEmpty()
  summaryPt!: string;

  @IsString()
  @IsNotEmpty()
  summaryEn!: string;

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

export class UpdateFormationRequest extends PartialType(
  CreateFormationRequest,
) {}
