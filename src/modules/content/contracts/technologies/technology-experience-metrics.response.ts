import { ApiProperty } from '@nestjs/swagger';

class TechnologyExperienceDurationResponse {
  @ApiProperty({ example: 64 })
  totalMonths!: number;

  @ApiProperty({ example: 5 })
  years!: number;

  @ApiProperty({ example: 4 })
  months!: number;

  @ApiProperty({ example: '5 years 4 months' })
  label!: string;

  @ApiProperty({ example: '2020-01-01', nullable: true })
  startedAt!: string | null;

  @ApiProperty({ example: '2025-04-01', nullable: true })
  endedAt!: string | null;
}

class TechnologyExperienceMetricsByContextResponse {
  @ApiProperty({ type: TechnologyExperienceDurationResponse })
  PROFESSIONAL!: TechnologyExperienceDurationResponse;

  @ApiProperty({ type: TechnologyExperienceDurationResponse })
  PERSONAL!: TechnologyExperienceDurationResponse;

  @ApiProperty({ type: TechnologyExperienceDurationResponse })
  ACADEMIC!: TechnologyExperienceDurationResponse;

  @ApiProperty({ type: TechnologyExperienceDurationResponse })
  STUDY!: TechnologyExperienceDurationResponse;
}

class TechnologyExperienceMetricsResponse {
  @ApiProperty({ type: TechnologyExperienceDurationResponse })
  total!: TechnologyExperienceDurationResponse;

  @ApiProperty({ type: TechnologyExperienceMetricsByContextResponse })
  byContext!: TechnologyExperienceMetricsByContextResponse;
}

export class TechnologyExperienceMetricsEndpointResponse {
  @ApiProperty({ example: 'typescript' })
  slug!: string;

  @ApiProperty({ example: 'TypeScript' })
  name!: string;

  @ApiProperty({ type: TechnologyExperienceMetricsResponse })
  experienceMetrics!: TechnologyExperienceMetricsResponse;
}
