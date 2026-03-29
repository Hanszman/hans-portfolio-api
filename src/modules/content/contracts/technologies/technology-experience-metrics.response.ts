import { ApiProperty } from '@nestjs/swagger';

export class TechnologyExperienceDurationResponse {
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

export class TechnologyExperienceMetricsByContextResponse {
  @ApiProperty({ type: TechnologyExperienceDurationResponse })
  PROFESSIONAL!: TechnologyExperienceDurationResponse;

  @ApiProperty({ type: TechnologyExperienceDurationResponse })
  PERSONAL!: TechnologyExperienceDurationResponse;

  @ApiProperty({ type: TechnologyExperienceDurationResponse })
  ACADEMIC!: TechnologyExperienceDurationResponse;

  @ApiProperty({ type: TechnologyExperienceDurationResponse })
  STUDY!: TechnologyExperienceDurationResponse;
}

export class TechnologyExperienceMetricsResponse {
  @ApiProperty({ type: TechnologyExperienceDurationResponse })
  total!: TechnologyExperienceDurationResponse;

  @ApiProperty({ type: TechnologyExperienceMetricsByContextResponse })
  byContext!: TechnologyExperienceMetricsByContextResponse;
}
