import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { TechnologyUsageContext } from '@prisma/client';
import {
  CreateTechnologyContextRequest,
  UpdateTechnologyContextRequest,
} from './technology-contexts.request';

describe('technology context request contracts', () => {
  it('accepts a valid create payload', () => {
    const instance = plainToInstance(CreateTechnologyContextRequest, {
      technologyId: '11111111-1111-4111-8111-111111111111',
      context: TechnologyUsageContext.PROFESSIONAL,
      startedAt: '2020-01-01',
      endedAt: '2021-01-01',
    });

    expect(validateSync(instance)).toEqual([]);
  });

  it('rejects invalid uuids, enums and dates', () => {
    const instance = plainToInstance(CreateTechnologyContextRequest, {
      technologyId: 'invalid',
      context: 'INVALID',
      startedAt: 'invalid-date',
      endedAt: 'invalid-date',
    });

    const errors = validateSync(instance);

    expect(
      errors.find((error) => error.property === 'technologyId'),
    ).toBeDefined();
    expect(errors.find((error) => error.property === 'context')).toBeDefined();
    expect(
      errors.find((error) => error.property === 'startedAt'),
    ).toBeDefined();
    expect(errors.find((error) => error.property === 'endedAt')).toBeDefined();
  });

  it('allows partial update payloads', () => {
    const instance = plainToInstance(UpdateTechnologyContextRequest, {
      endedAt: '2022-01-01',
    });

    expect(validateSync(instance)).toEqual([]);
  });

  it('accepts an optional projectId', () => {
    const instance = plainToInstance(CreateTechnologyContextRequest, {
      technologyId: '11111111-1111-4111-8111-111111111111',
      projectId: '22222222-2222-4222-8222-222222222222',
      context: TechnologyUsageContext.PROFESSIONAL,
      startedAt: '2020-01-01',
    });

    expect(validateSync(instance)).toEqual([]);
  });

  it('rejects an invalid projectId', () => {
    const instance = plainToInstance(CreateTechnologyContextRequest, {
      technologyId: '11111111-1111-4111-8111-111111111111',
      projectId: 'invalid',
      context: TechnologyUsageContext.PROFESSIONAL,
      startedAt: '2020-01-01',
    });

    const errors = validateSync(instance);

    expect(
      errors.find((error) => error.property === 'projectId'),
    ).toBeDefined();
  });

  it('rejects a create payload whose endedAt is earlier than startedAt', () => {
    const instance = plainToInstance(CreateTechnologyContextRequest, {
      technologyId: '11111111-1111-4111-8111-111111111111',
      context: TechnologyUsageContext.PROFESSIONAL,
      startedAt: '2020-07-03',
      endedAt: '2020-07-01',
    });

    const errors = validateSync(instance);

    expect(errors.find((error) => error.property === 'endedAt')).toBeDefined();
  });
});
