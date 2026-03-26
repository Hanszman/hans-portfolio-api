import { UnauthorizedException } from '@nestjs/common';
import { UserRole, type User } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { JwtStrategy } from './jwt.strategy';

type UserFindUniqueArgs = {
  where: { id?: string; email?: string };
};

type MockUserDelegate = {
  findUnique: jest.Mock<Promise<User | null>, [UserFindUniqueArgs]>;
};

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let prismaService: { user: MockUserDelegate };
  let findUniqueMock: MockUserDelegate['findUnique'];

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-jwt-secret';
    findUniqueMock = jest.fn<Promise<User | null>, [UserFindUniqueArgs]>();
    prismaService = {
      user: {
        findUnique: findUniqueMock,
      },
    };

    strategy = new JwtStrategy(prismaService as PrismaService);
  });

  it('returns the authenticated admin user when the token payload is valid', async () => {
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

    await expect(
      strategy.validate({
        sub: 'user-1',
        email: 'victor@example.com',
        name: 'Victor Hanszman',
        role: UserRole.ADMIN,
      }),
    ).resolves.toEqual({
      id: 'user-1',
      email: 'victor@example.com',
      name: 'Victor Hanszman',
      role: UserRole.ADMIN,
    });
  });

  it('throws when the user no longer exists', async () => {
    prismaService.user.findUnique.mockResolvedValue(null);

    await expect(
      strategy.validate({
        sub: 'user-1',
        email: 'victor@example.com',
        name: 'Victor Hanszman',
        role: UserRole.ADMIN,
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('throws when the user is not an active admin anymore', async () => {
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
      strategy.validate({
        sub: 'user-1',
        email: 'victor@example.com',
        name: 'Victor Hanszman',
        role: UserRole.ADMIN,
      }),
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
      strategy.validate({
        sub: 'user-1',
        email: 'victor@example.com',
        name: 'Victor Hanszman',
        role: UserRole.ADMIN,
      }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
