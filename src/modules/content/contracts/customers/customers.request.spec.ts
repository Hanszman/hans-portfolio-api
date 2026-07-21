import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import {
  CreateCustomerRequest,
  UpdateCustomerRequest,
} from './customers.request';

describe('customer request contracts', () => {
  it('accepts a valid create payload', () => {
    const instance = plainToInstance(CreateCustomerRequest, {
      slug: 'ford',
      name: 'Ford',
      summaryPt: 'Resumo PT',
      summaryEn: 'Summary EN',
      highlight: true,
      sortOrder: '2',
      experienceIds: ['11111111-1111-4111-8111-111111111111'],
      imageAssetIds: ['aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'],
    });

    expect(validateSync(instance)).toEqual([]);
    expect(instance.sortOrder).toBe(2);
  });

  it('rejects invalid relation identifiers', () => {
    const instance = plainToInstance(CreateCustomerRequest, {
      slug: '',
      name: '',
      summaryPt: '',
      summaryEn: '',
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
    const instance = plainToInstance(UpdateCustomerRequest, { name: 'Ford' });

    expect(validateSync(instance)).toEqual([]);
  });
});
