import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { SpokenLanguageProficiency } from '@prisma/client';
import {
  CreateSpokenLanguageRequest,
  UpdateSpokenLanguageRequest,
} from './spoken-languages.request';

describe('spoken language request contracts', () => {
  it('accepts a valid create payload', () => {
    const instance = plainToInstance(CreateSpokenLanguageRequest, {
      code: 'pt-BR',
      namePt: 'Portugues',
      nameEn: 'Portuguese',
      proficiency: SpokenLanguageProficiency.NATIVE,
      highlight: true,
      sortOrder: '1',
      imageAssetIds: ['ffffffff-ffff-4fff-8fff-ffffffffffff'],
    });

    expect(validateSync(instance)).toEqual([]);
    expect(instance.sortOrder).toBe(1);
  });

  it('rejects invalid enums and image asset identifiers', () => {
    const instance = plainToInstance(CreateSpokenLanguageRequest, {
      code: '',
      namePt: '',
      nameEn: '',
      proficiency: 'INVALID',
      imageAssetIds: ['invalid'],
    });

    const errors = validateSync(instance);

    expect(errors.find((error) => error.property === 'code')).toBeDefined();
    expect(
      errors.find((error) => error.property === 'proficiency'),
    ).toBeDefined();
    expect(
      errors.find((error) => error.property === 'imageAssetIds'),
    ).toBeDefined();
  });

  it('allows partial update payloads', () => {
    const instance = plainToInstance(UpdateSpokenLanguageRequest, {
      highlight: false,
    });

    expect(validateSync(instance)).toEqual([]);
  });
});
