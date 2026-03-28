import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from '../../services/dashboard/dashboard.service';

describe('DashboardController', () => {
  let controller: DashboardController;
  let service: jest.Mocked<
    Pick<
      DashboardService,
      | 'getDashboardOverview'
      | 'getStackDistribution'
      | 'getProjectContexts'
      | 'getTechnologyUsage'
      | 'getProfessionalTimeline'
      | 'getHighlights'
    >
  >;
  let moduleRef: TestingModule;

  beforeEach(async () => {
    service = {
      getDashboardOverview: jest.fn(),
      getStackDistribution: jest.fn(),
      getProjectContexts: jest.fn(),
      getTechnologyUsage: jest.fn(),
      getProfessionalTimeline: jest.fn(),
      getHighlights: jest.fn(),
    };

    moduleRef = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        {
          provide: DashboardService,
          useValue: service,
        },
      ],
    }).compile();

    controller = moduleRef.get(DashboardController);
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  it('delegates the overview endpoint to the dashboard service', async () => {
    service.getDashboardOverview.mockResolvedValue({
      generatedAtUtc: '2026-03-28T12:00:00.000Z',
      summary: {
        projects: 1,
        experiences: 1,
        technologies: 1,
        formations: 1,
        customers: 1,
        jobs: 1,
        spokenLanguages: 1,
      },
      stackDistribution: {
        generatedAtUtc: '2026-03-28T12:00:00.000Z',
        stacks: [],
      },
      projectContexts: {
        generatedAtUtc: '2026-03-28T12:00:00.000Z',
        totalProjects: 1,
        featuredProjects: 1,
        highlightedProjects: 1,
        contexts: [],
        environments: [],
      },
      technologyUsage: {
        generatedAtUtc: '2026-03-28T12:00:00.000Z',
        totalUsageLinks: 1,
        levels: [],
        frequencies: [],
        contexts: [],
        sources: [],
        topTechnologies: [],
      },
      professionalTimeline: {
        generatedAtUtc: '2026-03-28T12:00:00.000Z',
        totalItems: 1,
        items: [],
      },
      highlights: {
        generatedAtUtc: '2026-03-28T12:00:00.000Z',
        totalItems: 1,
        items: [],
      },
    });

    const result = await controller.getDashboardOverview();

    expect(result.summary.projects).toBe(1);
  });

  it('delegates each segmented endpoint to the dashboard service', async () => {
    service.getStackDistribution.mockResolvedValue({
      generatedAtUtc: '2026-03-28T12:00:00.000Z',
      stacks: [],
    });
    service.getProjectContexts.mockResolvedValue({
      generatedAtUtc: '2026-03-28T12:00:00.000Z',
      totalProjects: 1,
      featuredProjects: 0,
      highlightedProjects: 0,
      contexts: [],
      environments: [],
    });
    service.getTechnologyUsage.mockResolvedValue({
      generatedAtUtc: '2026-03-28T12:00:00.000Z',
      totalUsageLinks: 0,
      levels: [],
      frequencies: [],
      contexts: [],
      sources: [],
      topTechnologies: [],
    });
    service.getProfessionalTimeline.mockResolvedValue({
      generatedAtUtc: '2026-03-28T12:00:00.000Z',
      totalItems: 0,
      items: [],
    });
    service.getHighlights.mockResolvedValue({
      generatedAtUtc: '2026-03-28T12:00:00.000Z',
      totalItems: 0,
      items: [],
    });

    await expect(controller.getStackDistribution()).resolves.toEqual({
      generatedAtUtc: '2026-03-28T12:00:00.000Z',
      stacks: [],
    });
    await expect(controller.getProjectContexts()).resolves.toEqual({
      generatedAtUtc: '2026-03-28T12:00:00.000Z',
      totalProjects: 1,
      featuredProjects: 0,
      highlightedProjects: 0,
      contexts: [],
      environments: [],
    });
    await expect(controller.getTechnologyUsage()).resolves.toEqual({
      generatedAtUtc: '2026-03-28T12:00:00.000Z',
      totalUsageLinks: 0,
      levels: [],
      frequencies: [],
      contexts: [],
      sources: [],
      topTechnologies: [],
    });
    await expect(controller.getProfessionalTimeline()).resolves.toEqual({
      generatedAtUtc: '2026-03-28T12:00:00.000Z',
      totalItems: 0,
      items: [],
    });
    await expect(controller.getHighlights()).resolves.toEqual({
      generatedAtUtc: '2026-03-28T12:00:00.000Z',
      totalItems: 0,
      items: [],
    });
  });
});
