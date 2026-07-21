import { UserRole } from '@prisma/client';
import { AuthenticatedAdminResponse } from './authenticated-admin.response';

function expectMetadata(target: object, propertyKey: string): void {
  expect(Reflect.getMetadataKeys(target, propertyKey).length).toBeGreaterThan(
    0,
  );
}

describe('AuthenticatedAdminResponse', () => {
  it('defines swagger metadata for all fields', () => {
    expectMetadata(AuthenticatedAdminResponse.prototype, 'id');
    expectMetadata(AuthenticatedAdminResponse.prototype, 'email');
    expectMetadata(AuthenticatedAdminResponse.prototype, 'name');
    expectMetadata(AuthenticatedAdminResponse.prototype, 'role');
  });

  it('accepts runtime assignment', () => {
    const response = Object.assign(new AuthenticatedAdminResponse(), {
      id: '5f8e1e74-2d49-4b5c-9724-2e8c9c8b0e11',
      email: 'victor@example.com',
      name: 'Victor Hanszman',
      role: UserRole.ADMIN,
    });

    expect(response.role).toBe(UserRole.ADMIN);
    expect(response.email).toBe('victor@example.com');
  });
});
