import { PartialType } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { TechnologyUsageContext } from '@prisma/client';

export class CreateTechnologyContextRequest {
  @IsUUID('4')
  technologyId!: string;

  @IsEnum(TechnologyUsageContext)
  /* c8 ignore next */
  context!: TechnologyUsageContext;

  @IsDateString()
  startedAt!: string;

  @IsOptional()
  @IsDateString()
  endedAt?: string | null;
}

export class UpdateTechnologyContextRequest extends PartialType(
  CreateTechnologyContextRequest,
) {}
