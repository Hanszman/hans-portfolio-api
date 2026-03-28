import { IsArray, IsEnum, IsOptional, IsUUID } from 'class-validator';
import {
  TechnologyLevel,
  TechnologyUsageContext,
  TechnologyUsageFrequency,
} from '@prisma/client';

abstract class TechnologyUsageRelationRequestBase {
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

export class TechnologyRelationByTechnologyIdRequest extends TechnologyUsageRelationRequestBase {
  @IsUUID('4')
  technologyId!: string;
}

export class TechnologyRelationByProjectIdRequest extends TechnologyUsageRelationRequestBase {
  @IsUUID('4')
  projectId!: string;
}

export class TechnologyRelationByExperienceIdRequest extends TechnologyUsageRelationRequestBase {
  @IsUUID('4')
  experienceId!: string;
}

export class TechnologyRelationByFormationIdRequest extends TechnologyUsageRelationRequestBase {
  @IsUUID('4')
  formationId!: string;
}
