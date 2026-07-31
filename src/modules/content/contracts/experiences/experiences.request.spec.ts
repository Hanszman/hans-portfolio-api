import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import {
  CreateExperienceRequest,
  UpdateExperienceRequest,
} from './experiences.request';

describe('experience request contracts', () => {
  it('accepts a valid create payload', () => {
    const instance = plainToInstance(CreateExperienceRequest, {
      slug: 'experience-slug',
      companyName: 'Company',
      titlePt: 'Titulo PT',
      titleEn: 'Title EN',
      titleEs: 'Título ES',
      summaryPt: 'Resumo PT',
      summaryEn: 'Summary EN',
      summaryEs: 'Resumen ES',
      descriptionPt: 'Descricao PT',
      descriptionEn: 'Description EN',
      descriptionEs: 'Descripción ES',
      startDate: '2020-01-01',
      endDate: '2021-01-01',
      isCurrent: false,
      highlight: true,
      sortOrder: '4',
      technologyRelations: [
        { technologyId: '11111111-1111-4111-8111-111111111111' },
      ],
      projectIds: ['22222222-2222-4222-8222-222222222222'],
      customerIds: ['33333333-3333-4333-8333-333333333333'],
      jobIds: ['44444444-4444-4444-8444-444444444444'],
      linkIds: ['55555555-5555-4555-8555-555555555555'],
      imageAssetIds: ['bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'],
    });

    expect(validateSync(instance)).toEqual([]);
    expect(instance.sortOrder).toBe(4);
  });

  it('rejects invalid nested relations and asset identifiers', () => {
    const instance = plainToInstance(CreateExperienceRequest, {
      slug: '',
      companyName: '',
      titlePt: '',
      titleEn: '',
      titleEs: '',
      summaryPt: '',
      summaryEn: '',
      summaryEs: '',
      descriptionPt: '',
      descriptionEn: '',
      descriptionEs: '',
      startDate: 'invalid-date',
      technologyRelations: [{ technologyId: 'invalid' }],
      imageAssetIds: ['invalid'],
    });

    const errors = validateSync(instance);

    expect(errors.find((error) => error.property === 'slug')).toBeDefined();
    expect(
      errors.find((error) => error.property === 'startDate'),
    ).toBeDefined();
    expect(
      errors.find((error) => error.property === 'technologyRelations'),
    ).toBeDefined();
    expect(
      errors.find((error) => error.property === 'imageAssetIds'),
    ).toBeDefined();
  });

  it('allows partial update payloads', () => {
    const instance = plainToInstance(UpdateExperienceRequest, {
      isCurrent: true,
    });

    expect(validateSync(instance)).toEqual([]);
  });

  it('rejects update payloads whose end date is earlier than the start date', () => {
    const instance = plainToInstance(UpdateExperienceRequest, {
      startDate: '2026-07-03',
      endDate: '2026-07-01',
    });
    const errors = validateSync(instance);

    expect(errors.find((error) => error.property === 'endDate')).toBeDefined();
  });
});
