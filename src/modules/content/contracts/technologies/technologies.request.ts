import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';
import {
  TechnologyCategory,
  TechnologyLevel,
  TechnologyUsageFrequency,
} from '@prisma/client';
import { PartialType } from '@nestjs/swagger';
import { CONTENT_IDENTIFIER_PATTERN } from '../content-contracts.constants';
import {
  TechnologyContextRequest,
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
  @IsEnum(TechnologyLevel)
  level?: TechnologyLevel;

  @IsOptional()
  @IsEnum(TechnologyUsageFrequency)
  frequency?: TechnologyUsageFrequency;

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
  @ValidateNested({ each: true })
  @Type(() => TechnologyContextRequest)
  technologyContexts?: TechnologyContextRequest[];

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
  @Matches(CONTENT_IDENTIFIER_PATTERN, {
    each: true,
    message: 'each value in imageAssetIds must be a UUID',
  })
  imageAssetIds?: string[];
}

export class UpdateTechnologyRequest extends PartialType(
  CreateTechnologyRequest,
) {}
