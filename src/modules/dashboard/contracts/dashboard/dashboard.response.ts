import { ApiProperty } from '@nestjs/swagger';

export class DashboardDistributionEntryResponse {
  @ApiProperty({ example: 'FULLSTACK' })
  key!: string;

  @ApiProperty({ example: 7 })
  count!: number;
}

export class DashboardStackDistributionEntryResponse {
  @ApiProperty({ example: 'stack-front-end' })
  slug!: string;

  @ApiProperty({ example: 'Front-End' })
  namePt!: string;

  @ApiProperty({ example: 'Front-End' })
  nameEn!: string;

  @ApiProperty({ example: 12 })
  projectCount!: number;

  @ApiProperty({ example: 24 })
  technologyCount!: number;
}

export class DashboardProjectContextsResponse {
  @ApiProperty({ example: '2026-03-28T12:00:00.000Z' })
  generatedAtUtc!: string;

  @ApiProperty({ example: 21 })
  totalProjects!: number;

  @ApiProperty({ example: 6 })
  featuredProjects!: number;

  @ApiProperty({ example: 4 })
  highlightedProjects!: number;

  @ApiProperty({ type: [DashboardDistributionEntryResponse] })
  contexts!: DashboardDistributionEntryResponse[];

  @ApiProperty({ type: [DashboardDistributionEntryResponse] })
  environments!: DashboardDistributionEntryResponse[];
}

export class DashboardStackDistributionResponse {
  @ApiProperty({ example: '2026-03-28T12:00:00.000Z' })
  generatedAtUtc!: string;

  @ApiProperty({ type: [DashboardStackDistributionEntryResponse] })
  stacks!: DashboardStackDistributionEntryResponse[];
}

export class DashboardTopTechnologyEntryResponse {
  @ApiProperty({ example: 'typescript' })
  slug!: string;

  @ApiProperty({ example: 'TypeScript' })
  name!: string;

  @ApiProperty({ example: 'LANGUAGE' })
  category!: string;

  @ApiProperty({ example: 9 })
  usageCount!: number;
}

export class DashboardTechnologyUsageResponse {
  @ApiProperty({ example: '2026-03-28T12:00:00.000Z' })
  generatedAtUtc!: string;

  @ApiProperty({ example: 42 })
  totalUsageLinks!: number;

  @ApiProperty({ type: [DashboardDistributionEntryResponse] })
  levels!: DashboardDistributionEntryResponse[];

  @ApiProperty({ type: [DashboardDistributionEntryResponse] })
  frequencies!: DashboardDistributionEntryResponse[];

  @ApiProperty({ type: [DashboardDistributionEntryResponse] })
  contexts!: DashboardDistributionEntryResponse[];

  @ApiProperty({ type: [DashboardDistributionEntryResponse] })
  sources!: DashboardDistributionEntryResponse[];

  @ApiProperty({ type: [DashboardTopTechnologyEntryResponse] })
  topTechnologies!: DashboardTopTechnologyEntryResponse[];
}

export class DashboardTimelineItemResponse {
  @ApiProperty({ example: 'pagbank' })
  slug!: string;

  @ApiProperty({ example: 'PagBank' })
  companyName!: string;

  @ApiProperty({ example: 'Engenheiro de Software' })
  titlePt!: string;

  @ApiProperty({ example: 'Software Engineer' })
  titleEn!: string;

  @ApiProperty({ example: '2023-01-01' })
  startDate!: string;

  @ApiProperty({ example: null, nullable: true })
  endDate!: string | null;

  @ApiProperty({ example: true })
  isCurrent!: boolean;

  @ApiProperty({ example: true })
  highlight!: boolean;

  @ApiProperty({ type: [String], example: ['Frontend Engineer'] })
  jobs!: string[];

  @ApiProperty({ type: [String], example: ['PagBank'] })
  customers!: string[];

  @ApiProperty({ type: [String], example: ['portfolio-remake'] })
  projects!: string[];

  @ApiProperty({ type: [String], example: ['TypeScript', 'Angular'] })
  technologies!: string[];

  @ApiProperty({
    example: '/assets/img/experiences/pagbank.png',
    nullable: true,
  })
  imagePath!: string | null;
}

export class DashboardProfessionalTimelineResponse {
  @ApiProperty({ example: '2026-03-28T12:00:00.000Z' })
  generatedAtUtc!: string;

  @ApiProperty({ example: 3 })
  totalItems!: number;

  @ApiProperty({ type: [DashboardTimelineItemResponse] })
  items!: DashboardTimelineItemResponse[];
}

export class DashboardHighlightItemResponse {
  @ApiProperty({ example: 'project' })
  entity!: string;

  @ApiProperty({ example: 'portfolio-remake' })
  slug!: string;

  @ApiProperty({ example: 'Remake do Portfolio' })
  titlePt!: string;

  @ApiProperty({ example: 'Portfolio Remake' })
  titleEn!: string;

  @ApiProperty({
    example: 'Projeto full stack com dashboard e area admin.',
    required: false,
  })
  subtitlePt?: string;

  @ApiProperty({
    example: 'Full-stack project with dashboard and admin area.',
    required: false,
  })
  subtitleEn?: string;

  @ApiProperty({ example: '/assets/img/logo/angular.svg', nullable: true })
  icon?: string | null;

  @ApiProperty({
    example: '/assets/img/projects/portfolio-remake.png',
    nullable: true,
    required: false,
  })
  imagePath?: string | null;

  @ApiProperty({ example: true, required: false })
  featured?: boolean;
}

export class DashboardHighlightsResponse {
  @ApiProperty({ example: '2026-03-28T12:00:00.000Z' })
  generatedAtUtc!: string;

  @ApiProperty({ example: 12 })
  totalItems!: number;

  @ApiProperty({ type: [DashboardHighlightItemResponse] })
  items!: DashboardHighlightItemResponse[];
}

export class DashboardSummaryCountersResponse {
  @ApiProperty({ example: 21 })
  projects!: number;

  @ApiProperty({ example: 3 })
  experiences!: number;

  @ApiProperty({ example: 60 })
  technologies!: number;

  @ApiProperty({ example: 3 })
  formations!: number;

  @ApiProperty({ example: 10 })
  customers!: number;

  @ApiProperty({ example: 3 })
  jobs!: number;

  @ApiProperty({ example: 2 })
  spokenLanguages!: number;
}

export class DashboardOverviewResponse {
  @ApiProperty({ example: '2026-03-28T12:00:00.000Z' })
  generatedAtUtc!: string;

  @ApiProperty({ type: DashboardSummaryCountersResponse })
  summary!: DashboardSummaryCountersResponse;

  @ApiProperty({ type: DashboardStackDistributionResponse })
  stackDistribution!: DashboardStackDistributionResponse;

  @ApiProperty({ type: DashboardProjectContextsResponse })
  projectContexts!: DashboardProjectContextsResponse;

  @ApiProperty({ type: DashboardTechnologyUsageResponse })
  technologyUsage!: DashboardTechnologyUsageResponse;

  @ApiProperty({ type: DashboardProfessionalTimelineResponse })
  professionalTimeline!: DashboardProfessionalTimelineResponse;

  @ApiProperty({ type: DashboardHighlightsResponse })
  highlights!: DashboardHighlightsResponse;
}
