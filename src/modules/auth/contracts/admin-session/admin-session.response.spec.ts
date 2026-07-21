import { UserRole } from '@prisma/client';
import { AuthenticatedAdminResponse } from '../auth/authenticated-admin.response';
import { AdminSessionResponse } from './admin-session.response';

describe('AdminSessionResponse', () => {
  it('inherits from authenticated admin response', () => {
    const session = Object.assign(new AdminSessionResponse(), {
      id: '5f8e1e74-2d49-4b5c-9724-2e8c9c8b0e11',
      email: 'victor@example.com',
      name: 'Victor Hanszman',
      role: UserRole.ADMIN,
    });

    expect(session).toBeInstanceOf(AdminSessionResponse);
    expect(session).toBeInstanceOf(AuthenticatedAdminResponse);
    expect(session.role).toBe(UserRole.ADMIN);
  });
});
