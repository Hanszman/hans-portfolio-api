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
  shortDescriptionPt!: string;

  @IsString()
  @IsNotEmpty()
  shortDescriptionEn!: string;

  @IsString()
  @IsNotEmpty()
  fullDescriptionPt!: string;

  @IsString()
  @IsNotEmpty()
  fullDescriptionEn!: string;

  @IsEnum(ProjectContext)
  context!: ProjectContext;

  @IsEnum(ProjectStatus)
  status!: ProjectStatus;

  @IsEnum(ProjectEnvironment)
  environment!: ProjectEnvironment;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsBoolean()
  highlight?: boolean;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

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
  experienceIds?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  tagIds?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  linkIds?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  imageAssetIds?: string[];
}

export class UpdateProjectRequest extends PartialType(CreateProjectRequest) {}
