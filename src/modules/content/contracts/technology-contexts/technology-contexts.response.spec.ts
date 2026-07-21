import {
  TechnologyCategory,
  TechnologyLevel,
  TechnologyUsageContext,
  TechnologyUsageFrequency,
} from '@prisma/client';
import {
  TechnologyContextCollectionResponse,
  TechnologyContextGroupResponse,
  TechnologyContextMutationResponse,
  TechnologyContextRecordResponse,
} from './technology-contexts.response';
import {
  TechnologyExperienceDurationResponse,
  TechnologyExperienceMetricsByContextResponse,
  TechnologyExperienceMetricsResponse,
} from '../technologies/technology-experience-metrics.response';

function expectMetadata(target: object, propertyKey: string): void {
  expect(Reflect.getMetadataKeys(target, propertyKey).length).toBeGreaterThan(
    0,
  );
}

describe('technology context response contracts', () => {
  it('defines swagger metadata for every response field', () => {
    expectMetadata(TechnologyContextRecordResponse.prototype, 'id');
    expectMetadata(TechnologyContextRecordResponse.prototype, 'context');
    expectMetadata(TechnologyContextRecordResponse.prototype, 'startedAt');
    expectMetadata(TechnologyContextRecordResponse.prototype, 'endedAt');
    expectMetadata(TechnologyContextGroupResponse.prototype, 'technologyId');
    expectMetadata(TechnologyContextGroupResponse.prototype, 'slug');
    expectMetadata(TechnologyContextGroupResponse.prototype, 'name');
    expectMetadata(TechnologyContextGroupResponse.prototype, 'category');
    expectMetadata(TechnologyContextGroupResponse.prototype, 'level');
    expectMetadata(TechnologyContextGroupResponse.prototype, 'frequency');
    expectMetadata(
      TechnologyContextGroupResponse.prototype,
      'technologyContexts',
    );
    expectMetadata(
      TechnologyContextGroupResponse.prototype,
      'experienceMetrics',
    );
    expectMetadata(TechnologyContextCollectionResponse.prototype, 'data');
    expectMetadata(TechnologyContextCollectionResponse.prototype, 'pagination');
    expectMetadata(TechnologyContextMutationResponse.prototype, 'id');
    expectMetadata(TechnologyContextMutationResponse.prototype, 'technologyId');
    expectMetadata(TechnologyContextMutationResponse.prototype, 'context');
    expectMetadata(TechnologyContextMutationResponse.prototype, 'startedAt');
    expectMetadata(TechnologyContextMutationResponse.prototype, 'endedAt');
    expectMetadata(TechnologyContextMutationResponse.prototype, 'technology');
  });

  it('accepts runtime assignment across nested response classes', () => {
    const duration = Object.assign(new TechnologyExperienceDurationResponse(), {
      totalMonths: 64,
      years: 5,
      months: 4,
      label: '5 years 4 months',
      startedAt: '2020-01-01',
      endedAt: null,
    });
    const experienceMetrics = Object.assign(
      new TechnologyExperienceMetricsResponse(),
      {
        total: duration,
        byContext: Object.assign(
          new TechnologyExperienceMetricsByContextResponse(),
          {
            PROFESSIONAL: duration,
            PERSONAL: duration,
            ACADEMIC: duration,
            STUDY: duration,
          },
        ),
      },
    );
    const record = Object.assign(new TechnologyContextRecordResponse(), {
      id: '11111111-1111-4111-8111-111111111111',
      context: TechnologyUsageContext.PROFESSIONAL,
      startedAt: '2020-01-01',
      endedAt: null,
    });
    const group = Object.assign(new TechnologyContextGroupResponse(), {
      technologyId: '22222222-2222-4222-8222-222222222222',
      slug: 'typescript',
      name: 'TypeScript',
      category: TechnologyCategory.LANGUAGE,
      level: TechnologyLevel.ADVANCED,
      frequency: TechnologyUsageFrequency.FREQUENT,
      technologyContexts: [record],
      experienceMetrics,
    });
    const collection = Object.assign(
      new TechnologyContextCollectionResponse(),
      {
        data: [group],
        pagination: {
          page: 1,
          pageSize: 12,
          totalItems: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      },
    );
    const mutation = Object.assign(new TechnologyContextMutationResponse(), {
      id: '33333333-3333-4333-8333-333333333333',
      technologyId: '22222222-2222-4222-8222-222222222222',
      context: TechnologyUsageContext.PROFESSIONAL,
      startedAt: '2020-01-01',
      endedAt: null,
      technology: {
        id: '22222222-2222-4222-8222-222222222222',
        slug: 'typescript',
        name: 'TypeScript',
        category: TechnologyCategory.LANGUAGE,
        level: TechnologyLevel.ADVANCED,
        frequency: TechnologyUsageFrequency.FREQUENT,
      },
    });

    expect(collection.data[0].experienceMetrics.byContext.STUDY.label).toBe(
      '5 years 4 months',
    );
    expect(mutation.technology.frequency).toBe(
      TechnologyUsageFrequency.FREQUENT,
    );
  });
});
