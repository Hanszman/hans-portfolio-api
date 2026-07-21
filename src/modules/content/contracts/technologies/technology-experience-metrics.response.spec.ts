import {
  TechnologyExperienceDurationResponse,
  TechnologyExperienceMetricsByContextResponse,
  TechnologyExperienceMetricsResponse,
} from './technology-experience-metrics.response';

function expectMetadata(target: object, propertyKey: string): void {
  expect(Reflect.getMetadataKeys(target, propertyKey).length).toBeGreaterThan(
    0,
  );
}

describe('technology experience metrics response contracts', () => {
  it('defines swagger metadata for duration fields', () => {
    expectMetadata(
      TechnologyExperienceDurationResponse.prototype,
      'totalMonths',
    );
    expectMetadata(TechnologyExperienceDurationResponse.prototype, 'years');
    expectMetadata(TechnologyExperienceDurationResponse.prototype, 'months');
    expectMetadata(TechnologyExperienceDurationResponse.prototype, 'label');
    expectMetadata(TechnologyExperienceDurationResponse.prototype, 'startedAt');
    expectMetadata(TechnologyExperienceDurationResponse.prototype, 'endedAt');
  });

  it('defines swagger metadata for context and aggregate fields', () => {
    expectMetadata(
      TechnologyExperienceMetricsByContextResponse.prototype,
      'PROFESSIONAL',
    );
    expectMetadata(
      TechnologyExperienceMetricsByContextResponse.prototype,
      'PERSONAL',
    );
    expectMetadata(
      TechnologyExperienceMetricsByContextResponse.prototype,
      'ACADEMIC',
    );
    expectMetadata(
      TechnologyExperienceMetricsByContextResponse.prototype,
      'STUDY',
    );
    expectMetadata(TechnologyExperienceMetricsResponse.prototype, 'total');
    expectMetadata(TechnologyExperienceMetricsResponse.prototype, 'byContext');
  });

  it('accepts runtime assignment', () => {
    const total = Object.assign(new TechnologyExperienceDurationResponse(), {
      totalMonths: 64,
      years: 5,
      months: 4,
      label: '5 years 4 months',
      startedAt: '2020-01-01',
      endedAt: null,
    });
    const byContext = Object.assign(
      new TechnologyExperienceMetricsByContextResponse(),
      {
        PROFESSIONAL: total,
        PERSONAL: total,
        ACADEMIC: total,
        STUDY: total,
      },
    );
    const response = Object.assign(new TechnologyExperienceMetricsResponse(), {
      total,
      byContext,
    });

    expect(response.byContext.PROFESSIONAL.label).toBe('5 years 4 months');
  });
});
