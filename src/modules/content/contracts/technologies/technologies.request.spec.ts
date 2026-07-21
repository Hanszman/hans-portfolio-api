import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import {
  TechnologyCategory,
  TechnologyLevel,
  TechnologyUsageContext,
  TechnologyUsageFrequency,
} from '@prisma/client';
import {
  CreateTechnologyRequest,
  UpdateTechnologyRequest,
} from './technologies.request';

describe('technology request contracts', () => {
  it('accepts a valid create payload', () => {
    const instance = plainToInstance(CreateTechnologyRequest, {
      slug: 'typescript',
      name: 'TypeScript',
      category: TechnologyCategory.LANGUAGE,
      level: TechnologyLevel.ADVANCED,
      frequency: TechnologyUsageFrequency.FREQUENT,
      highlight: true,
      sortOrder: '5',
      projectRelations: [{ projectId: '11111111-1111-4111-8111-111111111111' }],
      experienceRelations: [
        { experienceId: '22222222-2222-4222-8222-222222222222' },
      ],
      formationRelations: [
        { formationId: '33333333-3333-4333-8333-333333333333' },
      ],
      technologyContexts: [
        {
          context: TechnologyUsageContext.PROFESSIONAL,
          startedAt: '2020-01-01',
          endedAt: '2021-01-01',
        },
      ],
      tagIds: ['44444444-4444-4444-8444-444444444444'],
      linkIds: ['55555555-5555-4555-8555-555555555555'],
      imageAssetIds: ['99999999-9999-4999-8999-999999999999'],
    });

    expect(validateSync(instance)).toEqual([]);
    expect(instance.sortOrder).toBe(5);
  });

  it('rejects invalid enums, nested relations and image asset identifiers', () => {
    const instance = plainToInstance(CreateTechnologyRequest, {
      slug: '',
      name: '',
      category: 'INVALID',
      level: 'INVALID',
      frequency: 'INVALID',
      projectRelations: [{ projectId: 'invalid' }],
      experienceRelations: [{ experienceId: 'invalid' }],
      formationRelations: [{ formationId: 'invalid' }],
      technologyContexts: [
        {
          context: 'INVALID',
          startedAt: 'invalid-date',
        },
      ],
      imageAssetIds: ['invalid'],
    });

    const errors = validateSync(instance);

    expect(errors.find((error) => error.property === 'category')).toBeDefined();
    expect(errors.find((error) => error.property === 'level')).toBeDefined();
    expect(
      errors.find((error) => error.property === 'frequency'),
    ).toBeDefined();
    expect(
      errors.find((error) => error.property === 'projectRelations'),
    ).toBeDefined();
    expect(
      errors.find((error) => error.property === 'experienceRelations'),
    ).toBeDefined();
    expect(
      errors.find((error) => error.property === 'formationRelations'),
    ).toBeDefined();
    expect(
      errors.find((error) => error.property === 'technologyContexts'),
    ).toBeDefined();
    expect(
      errors.find((error) => error.property === 'imageAssetIds'),
    ).toBeDefined();
  });

  it('allows partial update payloads', () => {
    const instance = plainToInstance(UpdateTechnologyRequest, {
      highlight: false,
    });

    expect(validateSync(instance)).toEqual([]);
  });
});
