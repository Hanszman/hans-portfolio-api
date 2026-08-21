import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import {
  ProjectContext,
  ProjectEnvironment,
  ProjectStatus,
} from '@prisma/client';
import { PartialType } from '@nestjs/swagger';
import { IsContentEndDateOnOrAfterStartDate } from '../shared/content-date-range-validation';
import { IsContentImageAssetIdArray } from '../shared/content-image-asset-validation';
import { TechnologyRelationByTechnologyIdRequest } from '../shared/content-relations.request';

export class CreateProjectRequest {
  @IsString()
  @IsNotEmpty()
  slug!: string;

  @IsString()
  @IsNotEmpty()
  titlePt!: string;

  @IsString()
  @IsNotEmpty()
  titleEn!: string;

  @IsString()
  @IsNotEmpty()
  titleEs!: string;

  @IsString()
  @IsNotEmpty()
  summaryPt!: string;

  @IsString()
  @IsNotEmpty()
  summaryEn!: string;

  @IsString()
  @IsNotEmpty()
  summaryEs!: string;

  @IsString()
  @IsNotEmpty()
  descriptionPt!: string;

  @IsString()
  @IsNotEmpty()
  descriptionEn!: string;

  @IsString()
  @IsNotEmpty()
  descriptionEs!: string;

  @IsEnum(ProjectContext)
  /* c8 ignore next */
  context!: ProjectContext;

  @IsEnum(ProjectStatus)
  /* c8 ignore next */
  status!: ProjectStatus;

  @IsEnum(ProjectEnvironment)
  /* c8 ignore next */
  environment!: ProjectEnvironment;

  @IsOptional()
  @IsBoolean()
  highlight?: boolean;

  @IsDateString()
  startDate!: string;

  @IsOptional()
  @IsDateString()
  @IsContentEndDateOnOrAfterStartDate()
  endDate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TechnologyRelationByTechnologyIdRequest)
  technologyRelations?: TechnologyRelationByTechnologyIdRequest[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  experienceIds?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  linkIds?: string[];

  @IsOptional()
  @IsArray()
  @IsContentImageAssetIdArray()
  imageAssetIds?: string[];
}

export class UpdateProjectRequest extends PartialType(CreateProjectRequest) {}
