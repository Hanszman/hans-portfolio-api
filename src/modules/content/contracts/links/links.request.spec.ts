import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { LinkType } from '@prisma/client';
import { CreateLinkRequest, UpdateLinkRequest } from './links.request';

describe('link request contracts', () => {
  it('accepts a valid create payload', () => {
    const instance = plainToInstance(CreateLinkRequest, {
      url: 'https://example.com',
      labelPt: 'Rotulo PT',
      labelEn: 'Label EN',
      descriptionPt: 'Descricao PT',
      descriptionEn: 'Description EN',
      type: LinkType.GITHUB,
      sortOrder: '2',
      projectIds: ['11111111-1111-4111-8111-111111111111'],
      experienceIds: ['22222222-2222-4222-8222-222222222222'],
      formationIds: ['33333333-3333-4333-8333-333333333333'],
      technologyIds: ['44444444-4444-4444-8444-444444444444'],
    });

    expect(validateSync(instance)).toEqual([]);
    expect(instance.sortOrder).toBe(2);
  });

  it('rejects invalid urls, enums and relation identifiers', () => {
    const instance = plainToInstance(CreateLinkRequest, {
      url: 'invalid-url',
      labelPt: '',
      labelEn: '',
      type: 'INVALID',
      projectIds: ['invalid'],
    });

    const errors = validateSync(instance);

    expect(errors.find((error) => error.property === 'url')).toBeDefined();
    expect(errors.find((error) => error.property === 'type')).toBeDefined();
    expect(
      errors.find((error) => error.property === 'projectIds'),
    ).toBeDefined();
  });

  it('allows partial update payloads', () => {
    const instance = plainToInstance(UpdateLinkRequest, {
      descriptionEn: 'Updated',
    });

    expect(validateSync(instance)).toEqual([]);
  });
});
