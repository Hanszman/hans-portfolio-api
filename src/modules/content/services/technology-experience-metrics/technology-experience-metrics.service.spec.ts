import { TechnologyUsageContext } from '@prisma/client';
import { TechnologyExperienceMetricsService } from './technology-experience-metrics.service';

describe('TechnologyExperienceMetricsService', () => {
  let service: TechnologyExperienceMetricsService;

  beforeEach(() => {
    service = new TechnologyExperienceMetricsService();
  });

  it('builds merged total and context durations for a technology item', () => {
    const result = service.enrichTechnologyItem({
      slug: 'typescript',
      technologyContexts: [
        {
          context: TechnologyUsageContext.PERSONAL,
          startedAt: '2021-01-01',
          endedAt: '2021-12-01',
        },
        {
          context: TechnologyUsageContext.PROFESSIONAL,
          startedAt: '2020-01-01',
          endedAt: '2023-02-01',
        },
        {
          context: TechnologyUsageContext.STUDY,
          startedAt: '2019-01-01',
          endedAt: '2019-06-01',
        },
      ],
    }) as {
      experienceMetrics: {
        total: {
          totalMonths: number;
          years: number;
          months: number;
          label: string;
          startedAt: string | null;
          endedAt: string | null;
        };
        byContext: Record<
          TechnologyUsageContext,
          {
            totalMonths: number;
            years: number;
            months: number;
            label: string;
          }
        >;
      };
    };

    expect(result.experienceMetrics.total).toEqual({
      totalMonths: 44,
      years: 3,
      months: 8,
      label: '3 years 8 months',
      startedAt: '2019-01-01',
      endedAt: '2023-02-01',
    });
    expect(result.experienceMetrics.byContext.PROFESSIONAL).toEqual(
      expect.objectContaining({
        totalMonths: 38,
        years: 3,
        months: 2,
        label: '3 years 2 months',
      }),
    );
    expect(result.experienceMetrics.byContext.PERSONAL).toEqual(
      expect.objectContaining({
        totalMonths: 12,
        years: 1,
        months: 0,
        label: '1 year',
      }),
    );
    expect(result.experienceMetrics.byContext.STUDY).toEqual(
      expect.objectContaining({
        totalMonths: 6,
        years: 0,
        months: 6,
        label: '6 months',
      }),
    );
    expect(result.experienceMetrics.byContext.ACADEMIC).toEqual(
      expect.objectContaining({
        totalMonths: 0,
        years: 0,
        months: 0,
        label: '0 months',
      }),
    );
  });

  it('uses technologyContexts directly when the precise context table is available', () => {
    const result = service.enrichTechnologyItem({
      slug: 'typescript',
      technologyContexts: [
        {
          context: TechnologyUsageContext.PROFESSIONAL,
          startedAt: '2020-01-01',
          endedAt: '2024-04-01',
        },
        {
          context: TechnologyUsageContext.PERSONAL,
          startedAt: '2024-05-01',
          endedAt: '2025-04-01',
        },
      ],
    }) as {
      experienceMetrics: {
        total: {
          totalMonths: number;
          label: string;
        };
        byContext: Record<
          TechnologyUsageContext,
          {
            totalMonths: number;
          }
        >;
      };
    };

    expect(result.experienceMetrics.total).toEqual(
      expect.objectContaining({
        totalMonths: 64,
        label: '5 years 4 months',
      }),
    );
    expect(result.experienceMetrics.byContext.PROFESSIONAL.totalMonths).toBe(
      52,
    );
    expect(result.experienceMetrics.byContext.PERSONAL.totalMonths).toBe(12);
    expect(result.experienceMetrics.byContext.STUDY.totalMonths).toBe(0);
  });

  it('merges overlapping periods instead of double-counting the same months', () => {
    const result = service.enrichTechnologyItem({
      technologyContexts: [
        {
          context: TechnologyUsageContext.PERSONAL,
          startedAt: '2024-01-01',
          endedAt: '2024-06-01',
        },
        {
          context: TechnologyUsageContext.PROFESSIONAL,
          startedAt: '2024-03-01',
          endedAt: '2024-08-01',
        },
      ],
    }) as {
      experienceMetrics: {
        total: {
          totalMonths: number;
          years: number;
          months: number;
          label: string;
        };
      };
    };

    expect(result.experienceMetrics.total).toEqual(
      expect.objectContaining({
        totalMonths: 8,
        years: 0,
        months: 8,
        label: '8 months',
      }),
    );
  });

  it('keeps an open-ended period open and uses Date inputs directly', () => {
    const result = service.enrichTechnologyItem({
      technologyContexts: [
        {
          context: TechnologyUsageContext.PERSONAL,
          startedAt: new Date('2026-01-01T00:00:00.000Z'),
          endedAt: null,
        },
      ],
    }) as {
      experienceMetrics: {
        total: {
          totalMonths: number;
          startedAt: string | null;
          endedAt: string | null;
        };
      };
    };

    expect(result.experienceMetrics.total.totalMonths).toBeGreaterThan(0);
    expect(result.experienceMetrics.total.startedAt).toBe('2026-01-01');
    expect(result.experienceMetrics.total.endedAt).toBeNull();
  });

  it('ignores usage rows without a valid startedAt date', () => {
    const result = service.enrichTechnologyItem({
      technologyContexts: [
        {
          context: TechnologyUsageContext.PERSONAL,
          startedAt: null,
          endedAt: '2025-01-01',
        },
      ],
    }) as {
      experienceMetrics: {
        total: {
          totalMonths: number;
          years: number;
          months: number;
          label: string;
          startedAt: string | null;
          endedAt: string | null;
        };
      };
    };

    expect(result.experienceMetrics.total).toEqual({
      totalMonths: 0,
      years: 0,
      months: 0,
      label: '0 months',
      startedAt: null,
      endedAt: null,
    });
  });

  it('returns zeroed metrics when there are no technology contexts', () => {
    const result = service.enrichTechnologyItem({
      technologyContexts: [],
    }) as {
      experienceMetrics: {
        total: {
          totalMonths: number;
          label: string;
        };
        byContext: Record<
          TechnologyUsageContext,
          {
            totalMonths: number;
          }
        >;
      };
    };

    expect(result.experienceMetrics.total).toEqual(
      expect.objectContaining({
        totalMonths: 0,
        label: '0 months',
      }),
    );
    expect(result.experienceMetrics.byContext.PERSONAL.totalMonths).toBe(0);
    expect(result.experienceMetrics.byContext.PROFESSIONAL.totalMonths).toBe(0);
  });

  it('treats a non-array technologyContexts value as an empty list', () => {
    const result = service.enrichTechnologyItem({
      technologyContexts: 'invalid',
    }) as {
      experienceMetrics: {
        total: {
          totalMonths: number;
        };
      };
    };

    expect(result.experienceMetrics.total.totalMonths).toBe(0);
  });

  it('returns the input unchanged when the value is null', () => {
    expect(service.enrichTechnologyItem(null)).toBeNull();
  });

  it('returns the item unchanged when it is not a technology usage record', () => {
    const plainItem = { slug: 'portfolio-remake' };

    expect(service.enrichTechnologyItem(plainItem)).toEqual(plainItem);
  });

  it('enriches a technology collection item by item', () => {
    const result = service.enrichTechnologyCollection([
      {
        slug: 'typescript',
        technologyContexts: [],
      },
    ]) as Array<{
      experienceMetrics: {
        total: {
          totalMonths: number;
        };
      };
    }>;

    expect(result).toHaveLength(1);
    expect(result[0]?.experienceMetrics.total.totalMonths).toBe(0);
  });

  it('keeps the latest explicit end date when overlapping closed periods are merged', () => {
    const result = service.enrichTechnologyItem({
      technologyContexts: [
        {
          context: TechnologyUsageContext.PERSONAL,
          startedAt: '2024-01-01',
          endedAt: '2024-04-01',
        },
        {
          context: TechnologyUsageContext.PERSONAL,
          startedAt: '2024-03-01',
          endedAt: '2024-08-01',
        },
      ],
    }) as {
      experienceMetrics: {
        total: {
          endedAt: string | null;
        };
      };
    };

    expect(result.experienceMetrics.total.endedAt).toBe('2024-08-01');
  });

  it('keeps the earliest concrete date inside the same month and preserves open-ended overlaps', () => {
    const result = service.enrichTechnologyItem({
      technologyContexts: [
        {
          context: TechnologyUsageContext.PERSONAL,
          startedAt: '2024-01-20',
          endedAt: '2024-02-01',
        },
        {
          context: TechnologyUsageContext.PERSONAL,
          startedAt: '2024-01-05',
          endedAt: null,
        },
      ],
    }) as {
      experienceMetrics: {
        total: {
          startedAt: string | null;
          endedAt: string | null;
        };
      };
    };

    expect(result.experienceMetrics.total.startedAt).toBe('2024-01-05');
    expect(result.experienceMetrics.total.endedAt).toBeNull();
  });

  it('formats a single month using the singular label', () => {
    const result = service.enrichTechnologyItem({
      technologyContexts: [
        {
          context: TechnologyUsageContext.STUDY,
          startedAt: '2024-01-01',
          endedAt: '2024-01-01',
        },
      ],
    }) as {
      experienceMetrics: {
        total: {
          totalMonths: number;
          label: string;
        };
      };
    };

    expect(result.experienceMetrics.total).toEqual(
      expect.objectContaining({
        totalMonths: 1,
        label: '1 month',
      }),
    );
  });
});
