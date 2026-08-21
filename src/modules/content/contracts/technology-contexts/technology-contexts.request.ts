import { PartialType } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { TechnologyUsageContext } from '@prisma/client';
import { IsContentEndDateOnOrAfterStartDate } from '../shared/content-date-range-validation';

export class CreateTechnologyContextRequest {
  @IsUUID('4')
  technologyId!: string;

  @IsOptional()
  @IsUUID('4')
  projectId?: string | null;

  @IsEnum(TechnologyUsageContext)
  /* c8 ignore next */
  context!: TechnologyUsageContext;

  @IsDateString()
  startedAt!: string;

  @IsOptional()
  @IsDateString()
  @IsContentEndDateOnOrAfterStartDate('startedAt')
  endedAt?: string | null;
}

export class UpdateTechnologyContextRequest extends PartialType(
  CreateTechnologyContextRequest,
) {}
