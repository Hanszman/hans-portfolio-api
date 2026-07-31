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
});
