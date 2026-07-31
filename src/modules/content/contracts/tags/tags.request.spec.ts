import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { TagType } from '@prisma/client';
import { CreateTagRequest, UpdateTagRequest } from './tags.request';

describe('tag request contracts', () => {
  it('accepts a valid create payload', () => {
    const instance = plainToInstance(CreateTagRequest, {
      slug: 'tag-slug',
      namePt: 'Nome PT',
      nameEn: 'Name EN',
      nameEs: 'Nombre ES',
      type: TagType.STACK,
      sortOrder: '3',
      projectIds: ['11111111-1111-4111-8111-111111111111'],
      technologyIds: ['22222222-2222-4222-8222-222222222222'],
    });

    expect(validateSync(instance)).toEqual([]);
    expect(instance.sortOrder).toBe(3);
  });

  it('rejects invalid enums and relation identifiers', () => {
    const instance = plainToInstance(CreateTagRequest, {
      slug: '',
      namePt: '',
      nameEn: '',
      nameEs: '',
      type: 'INVALID',
      projectIds: ['invalid'],
    });

    const errors = validateSync(instance);

    expect(errors.find((error) => error.property === 'slug')).toBeDefined();
    expect(errors.find((error) => error.property === 'type')).toBeDefined();
    expect(
      errors.find((error) => error.property === 'projectIds'),
    ).toBeDefined();
  });

  it('allows partial update payloads', () => {
    const instance = plainToInstance(UpdateTagRequest, { nameEn: 'Updated' });

    expect(validateSync(instance)).toEqual([]);
  });
});
