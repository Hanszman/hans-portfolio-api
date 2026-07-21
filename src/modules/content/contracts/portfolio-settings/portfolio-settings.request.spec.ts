import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import {
  CreatePortfolioSettingRequest,
  UpdatePortfolioSettingRequest,
} from './portfolio-settings.request';

describe('portfolio setting request contracts', () => {
  it('accepts a valid create payload', () => {
    const instance = plainToInstance(CreatePortfolioSettingRequest, {
      key: 'branding',
      value: { primaryLogoPath: '/assets/img/logo.svg' },
      description: 'Branding assets',
    });

    expect(validateSync(instance)).toEqual([]);
  });

  it('rejects empty keys and undefined values', () => {
    const instance = plainToInstance(CreatePortfolioSettingRequest, {
      key: '',
    });

    const errors = validateSync(instance);

    expect(errors.find((error) => error.property === 'key')).toBeDefined();
    expect(errors.find((error) => error.property === 'value')).toBeDefined();
  });

  it('allows partial update payloads', () => {
    const instance = plainToInstance(UpdatePortfolioSettingRequest, {
      description: 'Updated description',
    });

    expect(validateSync(instance)).toEqual([]);
  });
});
