import { IsArray, IsEnum, IsOptional, IsUUID } from 'class-validator';
import {
  TechnologyLevel,
  TechnologyUsageContext,
  TechnologyUsageFrequency,
} from '@prisma/client';

export class TechnologyRelationByTechnologyIdRequest {
  @IsUUID('4')
  technologyId!: string;

  @IsOptional()
  @IsEnum(TechnologyLevel)
  level?: TechnologyLevel;

  @IsOptional()
  @IsEnum(TechnologyUsageFrequency)
  frequency?: TechnologyUsageFrequency;

  @IsOptional()
  @IsArray()
  @IsEnum(TechnologyUsageContext, { each: true })
  contexts?: TechnologyUsageContext[];
}

export class TechnologyRelationByProjectIdRequest {
  @IsUUID('4')
  projectId!: string;

  @IsOptional()
  @IsEnum(TechnologyLevel)
  level?: TechnologyLevel;

  @IsOptional()
  @IsEnum(TechnologyUsageFrequency)
  frequency?: TechnologyUsageFrequency;

  @IsOptional()
  @IsArray()
  @IsEnum(TechnologyUsageContext, { each: true })
  contexts?: TechnologyUsageContext[];
}

export class TechnologyRelationByExperienceIdRequest {
  @IsUUID('4')
  experienceId!: string;

  @IsOptional()
  @IsEnum(TechnologyLevel)
  level?: TechnologyLevel;

  @IsOptional()
  @IsEnum(TechnologyUsageFrequency)
  frequency?: TechnologyUsageFrequency;

  @IsOptional()
  @IsArray()
  @IsEnum(TechnologyUsageContext, { each: true })
  contexts?: TechnologyUsageContext[];
}

export class TechnologyRelationByFormationIdRequest {
  @IsUUID('4')
  formationId!: string;

  @IsOptional()
  @IsEnum(TechnologyLevel)
  level?: TechnologyLevel;

  @IsOptional()
  @IsEnum(TechnologyUsageFrequency)
  frequency?: TechnologyUsageFrequency;

  @IsOptional()
  @IsArray()
  @IsEnum(TechnologyUsageContext, { each: true })
  contexts?: TechnologyUsageContext[];
}
