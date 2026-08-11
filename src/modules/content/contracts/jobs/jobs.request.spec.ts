import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { CreateJobRequest, UpdateJobRequest } from './jobs.request';

describe('job request contracts', () => {
  it('accepts a valid create payload', () => {
    const instance = plainToInstance(CreateJobRequest, {
      slug: 'job-slug',
      namePt: 'Nome PT',
      nameEn: 'Name EN',
      nameEs: 'Nombre ES',
      summaryPt: 'Resumo PT',
      summaryEn: 'Summary EN',
      summaryEs: 'Resumen ES',
      startDate: '2021-09-23',
      endDate: '2024-06-30',
      highlight: true,
      sortOrder: '1',
      experienceIds: ['11111111-1111-4111-8111-111111111111'],
      imageAssetIds: ['dddddddd-dddd-4ddd-8ddd-dddddddddddd'],
    });

    expect(validateSync(instance)).toEqual([]);
    expect(instance.sortOrder).toBe(1);
  });

  it('rejects invalid relation identifiers', () => {
    const instance = plainToInstance(CreateJobRequest, {
      slug: '',
      namePt: '',
      nameEn: '',
      nameEs: '',
      summaryPt: '',
      summaryEn: '',
      summaryEs: '',
      experienceIds: ['invalid'],
      imageAssetIds: ['invalid'],
    });

    const errors = validateSync(instance);

    expect(errors.find((error) => error.property === 'slug')).toBeDefined();
    expect(
      errors.find((error) => error.property === 'experienceIds'),
    ).toBeDefined();
    expect(
      errors.find((error) => error.property === 'imageAssetIds'),
    ).toBeDefined();
  });

  it('allows partial update payloads', () => {
    const instance = plainToInstance(UpdateJobRequest, { highlight: false });

    expect(validateSync(instance)).toEqual([]);
  });

  it('rejects invalid job dates and an end date before the start date', () => {
    const invalidDate = plainToInstance(CreateJobRequest, {
      slug: 'job-slug',
      namePt: 'Nome PT',
      nameEn: 'Name EN',
      nameEs: 'Nombre ES',
      summaryPt: 'Resumo PT',
      summaryEn: 'Summary EN',
      summaryEs: 'Resumen ES',
      startDate: 'invalid',
    });
    const invalidRange = plainToInstance(CreateJobRequest, {
      slug: 'job-slug',
      namePt: 'Nome PT',
      nameEn: 'Name EN',
      nameEs: 'Nombre ES',
      summaryPt: 'Resumo PT',
      summaryEn: 'Summary EN',
      summaryEs: 'Resumen ES',
      startDate: '2024-07-01',
      endDate: '2024-06-30',
    });

    expect(
      validateSync(invalidDate).some(
        ({ property }) => property === 'startDate',
      ),
    ).toBe(true);
    expect(
      validateSync(invalidRange).some(({ property }) => property === 'endDate'),
    ).toBe(true);
  });
});
