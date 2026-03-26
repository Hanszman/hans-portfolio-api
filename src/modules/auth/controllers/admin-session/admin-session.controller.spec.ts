import { Test } from '@nestjs/testing';
import { UserRole } from '@prisma/client';
import { AdminSessionController } from './admin-session.controller';
import { AdminSessionService } from '../../services/admin-session/admin-session.service';

describe('AdminSessionController', () => {
  it('returns the authenticated admin session from the admin session service', async () => {
    const getSession = jest.fn().mockReturnValue({
      id: 'user-1',
      email: 'victor@example.com',
      name: 'Victor Hanszman',
      role: UserRole.ADMIN,
    });

    const moduleRef = await Test.createTestingModule({
      controllers: [AdminSessionController],
      providers: [
        {
          provide: AdminSessionService,
          useValue: {
            getSession,
          },
        },
      ],
    }).compile();

    const controller = moduleRef.get(AdminSessionController);
    const request = {
      user: {
        id: 'user-1',
        email: 'victor@example.com',
        name: 'Victor Hanszman',
        role: UserRole.ADMIN,
      },
    };

    const result = controller.getSession(request);

    expect(result).toEqual({
      id: 'user-1',
      email: 'victor@example.com',
      name: 'Victor Hanszman',
      role: UserRole.ADMIN,
    });
    expect(getSession).toHaveBeenCalledWith(request.user);
  });
});
