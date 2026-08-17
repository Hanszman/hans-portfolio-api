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
  Min,
  ValidateNested,
} from 'class-validator';
import {
  TechnologyLevel,
  TechnologyStack,
  TechnologyType,
  TechnologyUsageFrequency,
} from '@prisma/client';
import { PartialType } from '@nestjs/swagger';
import { IsContentImageAssetIdArray } from '../shared/content-image-asset-validation';
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

  @IsEnum(TechnologyStack)
  /* c8 ignore next */
  stack!: TechnologyStack;

  @IsEnum(TechnologyType)
  /* c8 ignore next */
  type!: TechnologyType;

  @IsOptional()
  @IsEnum(TechnologyLevel)
  /* c8 ignore next */
  level?: TechnologyLevel;

  @IsOptional()
  @IsEnum(TechnologyUsageFrequency)
  /* c8 ignore next */
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
  linkIds?: string[];

  @IsOptional()
  @IsArray()
  @IsContentImageAssetIdArray()
  imageAssetIds?: string[];
}

export class UpdateTechnologyRequest extends PartialType(
  CreateTechnologyRequest,
) {}
