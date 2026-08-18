import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { ImageAssetKind } from '@prisma/client';
import {
  CreateImageAssetRequest,
  UpdateImageAssetRequest,
} from './image-assets.request';

describe('image asset request contracts', () => {
  it('accepts a valid create payload', () => {
    const instance = plainToInstance(CreateImageAssetRequest, {
      fileName: 'logo.svg',
      filePath: '/assets/img/logo.svg',
      kind: ImageAssetKind.ICON,
      altPt: 'Logo PT',
      altEn: 'Logo EN',
      width: '128',
      height: '128',
      sortOrder: '1',
      projectIds: ['11111111-1111-4111-8111-111111111111'],
      experienceIds: ['22222222-2222-4222-8222-222222222222'],
      formationIds: ['33333333-3333-4333-8333-333333333333'],
      technologyIds: ['44444444-4444-4444-8444-444444444444'],
      spokenLanguageIds: ['55555555-5555-4555-8555-555555555555'],
      customerIds: ['66666666-6666-4666-8666-666666666666'],
    });

    expect(validateSync(instance)).toEqual([]);
    expect(instance.width).toBe(128);
    expect(instance.height).toBe(128);
  });

  it('rejects invalid enum, dimensions and relation identifiers', () => {
    const instance = plainToInstance(CreateImageAssetRequest, {
      fileName: '',
      filePath: '',
      kind: 'INVALID',
      width: '-1',
      projectIds: ['invalid'],
    });

    const errors = validateSync(instance);

    expect(errors.find((error) => error.property === 'fileName')).toBeDefined();
    expect(errors.find((error) => error.property === 'kind')).toBeDefined();
    expect(errors.find((error) => error.property === 'width')).toBeDefined();
    expect(
      errors.find((error) => error.property === 'projectIds'),
    ).toBeDefined();
  });

  it('allows partial update payloads', () => {
    const instance = plainToInstance(UpdateImageAssetRequest, {
      altEn: 'Updated alt text',
    });

    expect(validateSync(instance)).toEqual([]);
  });
});
