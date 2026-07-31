import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { DegreeType } from '@prisma/client';
import {
  CreateFormationRequest,
  UpdateFormationRequest,
} from './formations.request';

describe('formation request contracts', () => {
  it('accepts a valid create payload', () => {
    const instance = plainToInstance(CreateFormationRequest, {
      slug: 'formation-slug',
      institution: 'University',
      titlePt: 'Titulo PT',
      titleEn: 'Title EN',
      titleEs: 'Título ES',
      degreeType: DegreeType.BACHELOR,
      summaryPt: 'Resumo PT',
      summaryEn: 'Summary EN',
      summaryEs: 'Resumen ES',
      startDate: '2020-01-01',
      endDate: '2022-01-01',
      highlight: true,
      sortOrder: '3',
      technologyRelations: [
        { technologyId: '11111111-1111-4111-8111-111111111111' },
      ],
      linkIds: ['22222222-2222-4222-8222-222222222222'],
      imageAssetIds: ['cccccccc-cccc-4ccc-8ccc-cccccccccccc'],
    });

    expect(validateSync(instance)).toEqual([]);
    expect(instance.sortOrder).toBe(3);
  });

  it('rejects invalid enum, dates and asset identifiers', () => {
    const instance = plainToInstance(CreateFormationRequest, {
      slug: '',
      institution: '',
      titlePt: '',
      titleEn: '',
      titleEs: '',
      degreeType: 'INVALID',
      summaryPt: '',
      summaryEn: '',
      summaryEs: '',
      startDate: 'invalid-date',
      technologyRelations: [{ technologyId: 'invalid' }],
      imageAssetIds: ['invalid'],
    });

    const errors = validateSync(instance);

    expect(
      errors.find((error) => error.property === 'degreeType'),
    ).toBeDefined();
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
    const instance = plainToInstance(UpdateFormationRequest, {
      institution: 'Updated',
    });

    expect(validateSync(instance)).toEqual([]);
  });

  it('rejects update payloads whose end date is earlier than the start date', () => {
    const instance = plainToInstance(UpdateFormationRequest, {
      startDate: '2026-07-03',
      endDate: '2026-07-01',
    });
    const errors = validateSync(instance);

    expect(errors.find((error) => error.property === 'endDate')).toBeDefined();
  });
});
