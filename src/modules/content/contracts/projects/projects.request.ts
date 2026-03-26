import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';
import {
  ProjectContext,
  ProjectEnvironment,
  ProjectStatus,
} from '@prisma/client';
import { PartialType } from '@nestjs/swagger';

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
  @IsUrl()
  repositoryUrl?: string;

  @IsOptional()
  @IsUrl()
  deployUrl?: string;

  @IsOptional()
  @IsUrl()
  docsUrl?: string;

  @IsOptional()
  @IsUrl()
  npmUrl?: string;

  @IsOptional()
  @IsString()
  icon?: string;

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
}

export class UpdateProjectRequest extends PartialType(CreateProjectRequest) {}
