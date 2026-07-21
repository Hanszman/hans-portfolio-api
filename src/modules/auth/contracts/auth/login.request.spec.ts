import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { LoginRequest } from './login.request';

describe('LoginRequest', () => {
  it('accepts a valid login payload', () => {
    const instance = plainToInstance(LoginRequest, {
      email: 'victor@example.com',
      password: 'ChangeMe!123',
    });

    expect(validateSync(instance)).toEqual([]);
  });

  it('rejects invalid email and short password payloads', () => {
    const instance = plainToInstance(LoginRequest, {
      email: 'invalid-email',
      password: 'short',
    });

    const errors = validateSync(instance);

    expect(errors.find((error) => error.property === 'email')).toBeDefined();
    expect(errors.find((error) => error.property === 'password')).toBeDefined();
  });
});
