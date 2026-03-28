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
  ValidateNested,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { TechnologyRelationByTechnologyIdRequest } from '../shared/content-relations.request';

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

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TechnologyRelationByTechnologyIdRequest)
  technologyRelations?: TechnologyRelationByTechnologyIdRequest[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  projectIds?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  customerIds?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  jobIds?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  linkIds?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  imageAssetIds?: string[];
}

export class UpdateExperienceRequest extends PartialType(
  CreateExperienceRequest,
) {}
