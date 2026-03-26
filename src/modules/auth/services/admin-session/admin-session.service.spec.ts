import { Test } from '@nestjs/testing';
import { UserRole } from '@prisma/client';
import { AuthenticatedAdminMapperService } from '../authenticated-admin-mapper/authenticated-admin-mapper.service';
import { AdminSessionService } from './admin-session.service';

describe('AdminSessionService', () => {
  let service: AdminSessionService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AdminSessionService, AuthenticatedAdminMapperService],
    }).compile();

    service = moduleRef.get(AdminSessionService);
  });

  it('returns the authenticated admin session payload', () => {
    expect(
      service.getSession({
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
