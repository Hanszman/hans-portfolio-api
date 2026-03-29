import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { TechnologyUsageContext } from '@prisma/client';

export class TechnologyRelationByTechnologyIdRequest {
  @IsUUID('4')
  technologyId!: string;
}

export class TechnologyRelationByProjectIdRequest {
  @IsUUID('4')
  projectId!: string;
}

export class TechnologyRelationByExperienceIdRequest {
  @IsUUID('4')
  experienceId!: string;
}

export class TechnologyRelationByFormationIdRequest {
  @IsUUID('4')
  formationId!: string;
}

export class TechnologyContextRequest {
  @IsEnum(TechnologyUsageContext)
  context!: TechnologyUsageContext;

  @IsDateString()
  startedAt!: string;

  @IsOptional()
  @IsDateString()
  endedAt?: string;
}
