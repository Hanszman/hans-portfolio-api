import { UserRole } from '@prisma/client';
import { AuthenticatedAdminMapperService } from './authenticated-admin-mapper.service';

describe('AuthenticatedAdminMapperService', () => {
  let service: AuthenticatedAdminMapperService;

  beforeEach(() => {
    service = new AuthenticatedAdminMapperService();
  });

  it('maps a user-like source into an authenticated admin payload', () => {
    expect(
      service.toAuthenticatedAdmin({
        id: 'user-1',
        email: 'victor@example.com',
        name: 'Victor Hanszman',
        role: UserRole.ADMIN,
      }),
    ).toEqual({
      id: 'user-1',
      email: 'victor@example.com',
      name: 'Victor Hanszman',
      role: UserRole.ADMIN,
    });
  });
});
