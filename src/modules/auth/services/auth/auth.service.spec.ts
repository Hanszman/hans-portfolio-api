import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../../../../prisma/prisma.service';
import { AuthenticatedAdminMapperService } from '../authenticated-admin-mapper/authenticated-admin-mapper.service';
import { PasswordService } from '../password/password.service';
import type {
  AuthSpecUserRecord,
  MockUserDelegate,
  UserFindUniqueArgs,
} from '../../types/auth.spec.types';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: { user: MockUserDelegate };
  let jwtService: jest.Mocked<Pick<JwtService, 'signAsync'>>;
  let passwordService: jest.Mocked<Pick<PasswordService, 'matchesPassword'>>;
  let findUniqueMock: MockUserDelegate['findUnique'];

  beforeEach(async () => {
    process.env.JWT_EXPIRES_IN = '1d';
    findUniqueMock = jest.fn<
      Promise<AuthSpecUserRecord | null>,
      [UserFindUniqueArgs]
    >();
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

    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        AuthenticatedAdminMapperService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
        {
          provide: PasswordService,
          useValue: passwordService,
        },
      ],
    }).compile();

    service = moduleRef.get(AuthService);
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
