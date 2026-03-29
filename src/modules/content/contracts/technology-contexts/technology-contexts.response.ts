import { ApiProperty } from '@nestjs/swagger';
import {
  TechnologyCategory,
  TechnologyLevel,
  TechnologyUsageContext,
  TechnologyUsageFrequency,
} from '@prisma/client';
import { TechnologyExperienceMetricsResponse } from '../technologies/technology-experience-metrics.response';

export class TechnologyContextRecordResponse {
  @ApiProperty({ example: '11111111-1111-4111-8111-111111111111' })
  id!: string;

  @ApiProperty({
    enum: TechnologyUsageContext,
    example: TechnologyUsageContext.PROFESSIONAL,
  })
  context!: TechnologyUsageContext;

  @ApiProperty({ example: '2020-01-01' })
  startedAt!: string;

  @ApiProperty({ example: '2022-04-01', nullable: true })
  endedAt!: string | null;
}

export class TechnologyContextGroupResponse {
  @ApiProperty({ example: '11111111-1111-4111-8111-111111111111' })
  technologyId!: string;

  @ApiProperty({ example: 'typescript' })
  slug!: string;

  @ApiProperty({ example: 'TypeScript' })
  name!: string;

  @ApiProperty({
    enum: TechnologyCategory,
    example: TechnologyCategory.LANGUAGE,
  })
  category!: TechnologyCategory;

  @ApiProperty({
    enum: TechnologyLevel,
    example: TechnologyLevel.ADVANCED,
    nullable: true,
  })
  level!: TechnologyLevel | null;

  @ApiProperty({
    enum: TechnologyUsageFrequency,
    example: TechnologyUsageFrequency.FREQUENT,
    nullable: true,
  })
  frequency!: TechnologyUsageFrequency | null;

  @ApiProperty({ type: [TechnologyContextRecordResponse] })
  technologyContexts!: TechnologyContextRecordResponse[];

  @ApiProperty({ type: TechnologyExperienceMetricsResponse })
  experienceMetrics!: TechnologyExperienceMetricsResponse;
}

export class TechnologyContextCollectionResponse {
  @ApiProperty({ type: [TechnologyContextGroupResponse] })
  data!: TechnologyContextGroupResponse[];

  @ApiProperty({
    example: {
      page: 1,
      pageSize: 12,
      totalItems: 60,
      totalPages: 5,
      hasNextPage: true,
      hasPreviousPage: false,
    },
  })
  pagination!: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export class TechnologyContextMutationResponse {
  @ApiProperty({ example: '11111111-1111-4111-8111-111111111111' })
  id!: string;

  @ApiProperty({ example: '11111111-1111-4111-8111-111111111111' })
  technologyId!: string;

  @ApiProperty({
    enum: TechnologyUsageContext,
    example: TechnologyUsageContext.PROFESSIONAL,
  })
  context!: TechnologyUsageContext;

  @ApiProperty({ example: '2020-01-01' })
  startedAt!: string;

  @ApiProperty({ example: '2022-04-01', nullable: true })
  endedAt!: string | null;

  @ApiProperty({
    example: {
      id: '11111111-1111-4111-8111-111111111111',
      slug: 'typescript',
      name: 'TypeScript',
      category: 'LANGUAGE',
      level: 'ADVANCED',
      frequency: 'FREQUENT',
    },
  })
  technology!: {
    id: string;
    slug: string;
    name: string;
    category: TechnologyCategory;
    level: TechnologyLevel | null;
    frequency: TechnologyUsageFrequency | null;
  };
}
