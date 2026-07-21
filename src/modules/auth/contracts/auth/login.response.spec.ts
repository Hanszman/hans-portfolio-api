import { UserRole } from '@prisma/client';
import { AuthenticatedAdminResponse } from './authenticated-admin.response';
import { LoginResponse } from './login.response';

function expectMetadata(target: object, propertyKey: string): void {
  expect(Reflect.getMetadataKeys(target, propertyKey).length).toBeGreaterThan(
    0,
  );
}

describe('LoginResponse', () => {
  it('defines swagger metadata for all fields', () => {
    expectMetadata(LoginResponse.prototype, 'accessToken');
    expectMetadata(LoginResponse.prototype, 'tokenType');
    expectMetadata(LoginResponse.prototype, 'expiresIn');
    expectMetadata(LoginResponse.prototype, 'user');
  });

  it('accepts runtime assignment', () => {
    const response = Object.assign(new LoginResponse(), {
      accessToken: 'token',
      tokenType: 'Bearer' as const,
      expiresIn: '1d',
      user: Object.assign(new AuthenticatedAdminResponse(), {
        id: '5f8e1e74-2d49-4b5c-9724-2e8c9c8b0e11',
        email: 'victor@example.com',
        name: 'Victor Hanszman',
        role: UserRole.ADMIN,
      }),
    });

    expect(response.user.role).toBe(UserRole.ADMIN);
    expect(response.tokenType).toBe('Bearer');
  });
});
