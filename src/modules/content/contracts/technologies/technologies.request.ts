import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { TechnologyCategory } from '@prisma/client';
import { PartialType } from '@nestjs/swagger';
import {
  TechnologyRelationByExperienceIdRequest,
  TechnologyRelationByFormationIdRequest,
  TechnologyRelationByProjectIdRequest,
} from '../shared/content-relations.request';

export class CreateTechnologyRequest {
  @IsString()
  @IsNotEmpty()
  slug!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEnum(TechnologyCategory)
  category!: TechnologyCategory;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsUrl()
  officialUrl?: string;

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
  @Type(() => TechnologyRelationByProjectIdRequest)
  projectRelations?: TechnologyRelationByProjectIdRequest[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TechnologyRelationByExperienceIdRequest)
  experienceRelations?: TechnologyRelationByExperienceIdRequest[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TechnologyRelationByFormationIdRequest)
  formationRelations?: TechnologyRelationByFormationIdRequest[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  tagIds?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  imageAssetIds?: string[];
}

export class UpdateTechnologyRequest extends PartialType(
  CreateTechnologyRequest,
) {}
