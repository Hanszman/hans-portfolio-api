import {
  DashboardDistributionEntryResponse,
  DashboardHighlightItemResponse,
  DashboardHighlightsResponse,
  DashboardOverviewResponse,
  DashboardProfessionalTimelineResponse,
  DashboardProjectContextsResponse,
  DashboardStackDistributionEntryResponse,
  DashboardStackDistributionResponse,
  DashboardSummaryCountersResponse,
  DashboardTechnologyUsageResponse,
  DashboardTimelineItemResponse,
  DashboardTopTechnologyEntryResponse,
} from './dashboard.response';

function expectMetadata(target: object, propertyKey: string): void {
  expect(Reflect.getMetadataKeys(target, propertyKey).length).toBeGreaterThan(
    0,
  );
}

describe('dashboard response contracts', () => {
  it('defines swagger metadata across every dashboard DTO field', () => {
    expectMetadata(DashboardDistributionEntryResponse.prototype, 'key');
    expectMetadata(DashboardDistributionEntryResponse.prototype, 'count');
    expectMetadata(DashboardStackDistributionEntryResponse.prototype, 'slug');
    expectMetadata(DashboardStackDistributionEntryResponse.prototype, 'namePt');
    expectMetadata(DashboardStackDistributionEntryResponse.prototype, 'nameEn');
    expectMetadata(
      DashboardStackDistributionEntryResponse.prototype,
      'projectCount',
    );
    expectMetadata(
      DashboardStackDistributionEntryResponse.prototype,
      'technologyCount',
    );
    expectMetadata(
      DashboardProjectContextsResponse.prototype,
      'generatedAtUtc',
    );
    expectMetadata(DashboardProjectContextsResponse.prototype, 'totalProjects');
    expectMetadata(
      DashboardProjectContextsResponse.prototype,
      'highlightedProjects',
    );
    expectMetadata(DashboardProjectContextsResponse.prototype, 'contexts');
    expectMetadata(DashboardProjectContextsResponse.prototype, 'environments');
    expectMetadata(
      DashboardStackDistributionResponse.prototype,
      'generatedAtUtc',
    );
    expectMetadata(DashboardStackDistributionResponse.prototype, 'stacks');
    expectMetadata(DashboardTopTechnologyEntryResponse.prototype, 'slug');
    expectMetadata(DashboardTopTechnologyEntryResponse.prototype, 'name');
    expectMetadata(DashboardTopTechnologyEntryResponse.prototype, 'type');
    expectMetadata(DashboardTopTechnologyEntryResponse.prototype, 'usageCount');
    expectMetadata(
      DashboardTechnologyUsageResponse.prototype,
      'generatedAtUtc',
    );
    expectMetadata(
      DashboardTechnologyUsageResponse.prototype,
      'totalUsageLinks',
    );
    expectMetadata(DashboardTechnologyUsageResponse.prototype, 'levels');
    expectMetadata(DashboardTechnologyUsageResponse.prototype, 'frequencies');
    expectMetadata(DashboardTechnologyUsageResponse.prototype, 'contexts');
    expectMetadata(DashboardTechnologyUsageResponse.prototype, 'sources');
    expectMetadata(
      DashboardTechnologyUsageResponse.prototype,
      'topTechnologies',
    );
    expectMetadata(DashboardTimelineItemResponse.prototype, 'slug');
    expectMetadata(DashboardTimelineItemResponse.prototype, 'companyName');
    expectMetadata(DashboardTimelineItemResponse.prototype, 'titlePt');
    expectMetadata(DashboardTimelineItemResponse.prototype, 'titleEn');
    expectMetadata(DashboardTimelineItemResponse.prototype, 'startDate');
    expectMetadata(DashboardTimelineItemResponse.prototype, 'endDate');
    expectMetadata(DashboardTimelineItemResponse.prototype, 'isCurrent');
    expectMetadata(DashboardTimelineItemResponse.prototype, 'highlight');
    expectMetadata(DashboardTimelineItemResponse.prototype, 'jobs');
    expectMetadata(DashboardTimelineItemResponse.prototype, 'customers');
    expectMetadata(DashboardTimelineItemResponse.prototype, 'projects');
    expectMetadata(DashboardTimelineItemResponse.prototype, 'technologies');
    expectMetadata(DashboardTimelineItemResponse.prototype, 'imagePath');
    expectMetadata(
      DashboardProfessionalTimelineResponse.prototype,
      'generatedAtUtc',
    );
    expectMetadata(
      DashboardProfessionalTimelineResponse.prototype,
      'totalItems',
    );
    expectMetadata(DashboardProfessionalTimelineResponse.prototype, 'items');
    expectMetadata(DashboardHighlightItemResponse.prototype, 'entity');
    expectMetadata(DashboardHighlightItemResponse.prototype, 'slug');
    expectMetadata(DashboardHighlightItemResponse.prototype, 'titlePt');
    expectMetadata(DashboardHighlightItemResponse.prototype, 'titleEn');
    expectMetadata(DashboardHighlightItemResponse.prototype, 'subtitlePt');
    expectMetadata(DashboardHighlightItemResponse.prototype, 'subtitleEn');
    expectMetadata(DashboardHighlightItemResponse.prototype, 'icon');
    expectMetadata(DashboardHighlightItemResponse.prototype, 'imagePath');
    expectMetadata(DashboardHighlightsResponse.prototype, 'generatedAtUtc');
    expectMetadata(DashboardHighlightsResponse.prototype, 'totalItems');
    expectMetadata(DashboardHighlightsResponse.prototype, 'items');
    expectMetadata(DashboardSummaryCountersResponse.prototype, 'projects');
    expectMetadata(DashboardSummaryCountersResponse.prototype, 'experiences');
    expectMetadata(DashboardSummaryCountersResponse.prototype, 'technologies');
    expectMetadata(DashboardSummaryCountersResponse.prototype, 'formations');
    expectMetadata(DashboardSummaryCountersResponse.prototype, 'customers');
    expectMetadata(DashboardSummaryCountersResponse.prototype, 'jobs');
    expectMetadata(
      DashboardSummaryCountersResponse.prototype,
      'spokenLanguages',
    );
    expectMetadata(DashboardOverviewResponse.prototype, 'generatedAtUtc');
    expectMetadata(DashboardOverviewResponse.prototype, 'summary');
    expectMetadata(DashboardOverviewResponse.prototype, 'stackDistribution');
    expectMetadata(DashboardOverviewResponse.prototype, 'projectContexts');
    expectMetadata(DashboardOverviewResponse.prototype, 'technologyUsage');
    expectMetadata(DashboardOverviewResponse.prototype, 'professionalTimeline');
    expectMetadata(DashboardOverviewResponse.prototype, 'highlights');
  });

  it('accepts assignment of nested runtime values for every response class', () => {
    const distributionEntry = Object.assign(
      new DashboardDistributionEntryResponse(),
      {
        key: 'FULLSTACK',
        count: 7,
      },
    );
    const stackEntry = Object.assign(
      new DashboardStackDistributionEntryResponse(),
      {
        slug: 'stack-front-end',
        namePt: 'Front-End',
        nameEn: 'Front-End',
        projectCount: 12,
        technologyCount: 24,
      },
    );
    const topTechnologyEntry = Object.assign(
      new DashboardTopTechnologyEntryResponse(),
      {
        slug: 'typescript',
        name: 'TypeScript',
        type: 'PROGRAMMING_LANGUAGES',
        usageCount: 9,
      },
    );
    const timelineItem = Object.assign(new DashboardTimelineItemResponse(), {
      slug: 'pagbank',
      companyName: 'PagBank',
      titlePt: 'Engenheiro de Software',
      titleEn: 'Software Engineer',
      startDate: '2023-01-01',
      endDate: null,
      isCurrent: true,
      highlight: true,
      jobs: ['Frontend Engineer'],
      customers: ['PagBank'],
      projects: ['portfolio-remake'],
      technologies: ['TypeScript', 'Angular'],
      imagePath: '/assets/img/experiences/pagbank.png',
    });
    const highlightItem = Object.assign(new DashboardHighlightItemResponse(), {
      entity: 'project',
      slug: 'portfolio-remake',
      titlePt: 'Remake do Portfolio',
      titleEn: 'Portfolio Remake',
      subtitlePt: 'Projeto full stack com dashboard e area admin.',
      subtitleEn: 'Full-stack project with dashboard and admin area.',
      icon: '/assets/img/logo/angular.svg',
      imagePath: '/assets/img/projects/portfolio-remake.png',
    });
    const summary = Object.assign(new DashboardSummaryCountersResponse(), {
      projects: 21,
      experiences: 3,
      technologies: 60,
      formations: 3,
      customers: 10,
      jobs: 3,
      spokenLanguages: 2,
    });
    const stackDistribution = Object.assign(
      new DashboardStackDistributionResponse(),
      {
        generatedAtUtc: '2026-03-28T12:00:00.000Z',
        stacks: [stackEntry],
      },
    );
    const projectContexts = Object.assign(
      new DashboardProjectContextsResponse(),
      {
        generatedAtUtc: '2026-03-28T12:00:00.000Z',
        totalProjects: 21,
        highlightedProjects: 4,
        contexts: [distributionEntry],
        environments: [distributionEntry],
      },
    );
    const technologyUsage = Object.assign(
      new DashboardTechnologyUsageResponse(),
      {
        generatedAtUtc: '2026-03-28T12:00:00.000Z',
        totalUsageLinks: 42,
        levels: [distributionEntry],
        frequencies: [distributionEntry],
        contexts: [distributionEntry],
        sources: [distributionEntry],
        topTechnologies: [topTechnologyEntry],
      },
    );
    const professionalTimeline = Object.assign(
      new DashboardProfessionalTimelineResponse(),
      {
        generatedAtUtc: '2026-03-28T12:00:00.000Z',
        totalItems: 1,
        items: [timelineItem],
      },
    );
    const highlights = Object.assign(new DashboardHighlightsResponse(), {
      generatedAtUtc: '2026-03-28T12:00:00.000Z',
      totalItems: 1,
      items: [highlightItem],
    });
    const overview = Object.assign(new DashboardOverviewResponse(), {
      generatedAtUtc: '2026-03-28T12:00:00.000Z',
      summary,
      stackDistribution,
      projectContexts,
      technologyUsage,
      professionalTimeline,
      highlights,
    });

    expect(overview.stackDistribution.stacks[0].technologyCount).toBe(24);
    expect(overview.professionalTimeline.items[0].jobs[0]).toBe(
      'Frontend Engineer',
    );
    expect(overview.highlights.items[0].slug).toBe('portfolio-remake');
  });
});
