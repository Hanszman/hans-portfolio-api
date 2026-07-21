import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { TechnologyUsageContext } from '@prisma/client';
import {
  TechnologyContextRequest,
  TechnologyRelationByExperienceIdRequest,
  TechnologyRelationByFormationIdRequest,
  TechnologyRelationByProjectIdRequest,
  TechnologyRelationByTechnologyIdRequest,
} from './content-relations.request';

type RelationRequestClass = new () => object;

type RelationRequestCase = readonly [
  RelationRequestClass,
  Record<string, string>,
];

const UUID = '11111111-1111-4111-8111-111111111111';

const relationCases: readonly RelationRequestCase[] = [
  [TechnologyRelationByTechnologyIdRequest, { technologyId: UUID }],
  [TechnologyRelationByProjectIdRequest, { projectId: UUID }],
  [TechnologyRelationByExperienceIdRequest, { experienceId: UUID }],
  [TechnologyRelationByFormationIdRequest, { formationId: UUID }],
] as const;

describe('content relation request contracts', () => {
  it.each(relationCases)(
    'accepts valid UUID payloads for %p',
    (requestClass, payload) => {
      const instance: object = plainToInstance(requestClass, payload);

      expect(validateSync(instance)).toEqual([]);
    },
  );

  it('rejects invalid UUID values', () => {
    const instance = plainToInstance(TechnologyRelationByTechnologyIdRequest, {
      technologyId: 'invalid-uuid',
    });

    expect(validateSync(instance)[0]?.property).toBe('technologyId');
  });

  it('validates technology context dates and enum', () => {
    const valid = plainToInstance(TechnologyContextRequest, {
      context: TechnologyUsageContext.PROFESSIONAL,
      startedAt: '2020-01-01',
      endedAt: '2024-01-01',
    });
    const invalid = plainToInstance(TechnologyContextRequest, {
      context: 'UNKNOWN',
      startedAt: 'invalid-date',
    });

    expect(validateSync(valid)).toEqual([]);
    const errors = validateSync(invalid);
    expect(errors.find((error) => error.property === 'context')).toBeDefined();
    expect(
      errors.find((error) => error.property === 'startedAt'),
    ).toBeDefined();
  });
});
