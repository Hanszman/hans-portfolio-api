import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { UserRole, type User } from '@prisma/client';
import { PrismaService } from '../../../../prisma/prisma.service';
import { PasswordService } from '../password/password.service';
import { AuthService } from './auth.service';

type UserFindUniqueArgs = {
  where: { email?: string; id?: string };
};

type MockUserDelegate = {
  findUnique: jest.Mock<Promise<User | null>, [UserFindUniqueArgs]>;
};

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: { user: MockUserDelegate };
  let jwtService: jest.Mocked<Pick<JwtService, 'signAsync'>>;
  let passwordService: jest.Mocked<Pick<PasswordService, 'matchesPassword'>>;
  let findUniqueMock: MockUserDelegate['findUnique'];

  beforeEach(() => {
    process.env.JWT_EXPIRES_IN = '1d';
    findUniqueMock = jest.fn<Promise<User | null>, [UserFindUniqueArgs]>();
    prismaService = {
      user: {
        findUnique: findUniqueMock,
      },
    };

    jwtService = {
      signAsync: jest.fn(),
    };

    passwordService = {
      matchesPassword: jest.fn(),
    };

    service = new AuthService(
      prismaService as PrismaService,
      jwtService as JwtService,
      passwordService as PasswordService,
    );
  });

  it('returns a login response for a valid admin user', async () => {
    prismaService.user.findUnique.mockResolvedValue({
      id: 'user-1',
      name: 'Victor Hanszman',
      email: 'victor@example.com',
      passwordHash: 'hashed-password',
      role: UserRole.ADMIN,
      isActive: true,
      createdAt: new Date('2026-03-26T00:00:00.000Z'),
      updatedAt: new Date('2026-03-26T00:00:00.000Z'),
    });
    passwordService.matchesPassword.mockResolvedValue(true);
    jwtService.signAsync.mockResolvedValue('jwt-token');

    await expect(
      service.login('Victor@Example.com', 'ChangeMe!123'),
    ).resolves.toEqual({
      accessToken: 'jwt-token',
      tokenType: 'Bearer',
      expiresIn: '1d',
      user: {
        id: 'user-1',
        email: 'victor@example.com',
        name: 'Victor Hanszman',
        role: UserRole.ADMIN,
      },
    });

    expect(findUniqueMock.mock.calls).toEqual([
      [{ where: { email: 'victor@example.com' } }],
    ]);
    expect(passwordService.matchesPassword).toHaveBeenCalledWith(
      'ChangeMe!123',
      'hashed-password',
    );
    expect(jwtService.signAsync).toHaveBeenCalledWith({
      sub: 'user-1',
      email: 'victor@example.com',
      name: 'Victor Hanszman',
      role: UserRole.ADMIN,
    });
  });

  it('throws when the user is not found', async () => {
    prismaService.user.findUnique.mockResolvedValue(null);

    await expect(
      service.login('victor@example.com', 'ChangeMe!123'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('throws when the user is not an active admin', async () => {
    prismaService.user.findUnique.mockResolvedValue({
      id: 'user-1',
      name: 'Victor Hanszman',
      email: 'victor@example.com',
      passwordHash: 'hashed-password',
      role: UserRole.EDITOR,
      isActive: true,
      createdAt: new Date('2026-03-26T00:00:00.000Z'),
      updatedAt: new Date('2026-03-26T00:00:00.000Z'),
    });

    await expect(
      service.login('victor@example.com', 'ChangeMe!123'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('throws when the admin user is inactive', async () => {
    prismaService.user.findUnique.mockResolvedValue({
      id: 'user-1',
      name: 'Victor Hanszman',
      email: 'victor@example.com',
      passwordHash: 'hashed-password',
      role: UserRole.ADMIN,
      isActive: false,
      createdAt: new Date('2026-03-26T00:00:00.000Z'),
      updatedAt: new Date('2026-03-26T00:00:00.000Z'),
    });

    await expect(
      service.login('victor@example.com', 'ChangeMe!123'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('throws when the password does not match', async () => {
    prismaService.user.findUnique.mockResolvedValue({
      id: 'user-1',
      name: 'Victor Hanszman',
      email: 'victor@example.com',
      passwordHash: 'hashed-password',
      role: UserRole.ADMIN,
      isActive: true,
      createdAt: new Date('2026-03-26T00:00:00.000Z'),
      updatedAt: new Date('2026-03-26T00:00:00.000Z'),
    });
    passwordService.matchesPassword.mockResolvedValue(false);

    await expect(
      service.login('victor@example.com', 'WrongPassword!123'),
    ).rejects.toThrow(UnauthorizedException);
  });
});
