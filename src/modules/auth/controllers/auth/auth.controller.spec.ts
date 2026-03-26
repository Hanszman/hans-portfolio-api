import { Test } from '@nestjs/testing';
import { UserRole } from '@prisma/client';
import { AuthController } from './auth.controller';
import { AuthService } from '../../services/auth/auth.service';

describe('AuthController', () => {
  it('delegates login requests to the auth service', async () => {
    const login = jest.fn().mockResolvedValue({
      accessToken: 'jwt-token',
      tokenType: 'Bearer',
      expiresIn: '1h',
      user: {
        id: 'user-1',
        email: 'victor@example.com',
        name: 'Victor Hanszman',
        role: UserRole.ADMIN,
      },
    });

    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login,
          },
        },
      ],
    }).compile();

    const controller = moduleRef.get(AuthController);

    const result = await controller.login({
      email: 'victor@example.com',
      password: 'ChangeMe!123',
    });

    expect(result).toMatchObject({
      accessToken: 'jwt-token',
      tokenType: 'Bearer',
      expiresIn: '1h',
      user: {
        email: 'victor@example.com',
        role: UserRole.ADMIN,
      },
    });
    expect(login).toHaveBeenCalledWith('victor@example.com', 'ChangeMe!123');
  });
});
