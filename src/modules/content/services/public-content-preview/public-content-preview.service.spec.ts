import { REQUEST } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Test, type TestingModule } from '@nestjs/testing';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../../../../prisma/prisma.service';
import { PublicContentPreviewService } from './public-content-preview.service';

type PreviewPayload = { sub: string };
type AdminUserRecord = {
  id: string;
  isActive: boolean;
  role: UserRole;
};

describe('PublicContentPreviewService', () => {
  let service: PublicContentPreviewService;
  let request: { headers: { authorization?: string | string[] } };
  let jwtVerifyAsync: jest.Mock<
    Promise<PreviewPayload>,
    [string, { secret: string }]
  >;
  let userFindUnique: jest.Mock<
    Promise<AdminUserRecord | null>,
    [{ where: { id: string } }]
  >;

  beforeEach(async () => {
    process.env.JWT_SECRET = 'test-secret';
    request = {
      headers: {},
    };
    jwtVerifyAsync = jest.fn<
      Promise<PreviewPayload>,
      [string, { secret: string }]
    >();
    userFindUnique = jest.fn<
      Promise<AdminUserRecord | null>,
      [{ where: { id: string } }]
    >();

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        PublicContentPreviewService,
        {
          provide: REQUEST,
          useValue: request,
        },
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jwtVerifyAsync,
          },
        },
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: userFindUnique,
            },
          },
        },
      ],
    }).compile();

    service = await moduleRef.resolve<PublicContentPreviewService>(
      PublicContentPreviewService,
    );
  });

  it('enables admin preview for an active admin bearer token and caches the result', async () => {
    request.headers.authorization = 'Bearer admin-token';
    jwtVerifyAsync.mockResolvedValue({ sub: 'admin-user-1' });
    userFindUnique.mockResolvedValue({
      id: 'admin-user-1',
      isActive: true,
      role: UserRole.ADMIN,
    });

    await expect(service.isAdminPreviewEnabled()).resolves.toBe(true);
    await expect(service.isAdminPreviewEnabled()).resolves.toBe(true);

    expect(jwtVerifyAsync).toHaveBeenCalledTimes(1);
    expect(jwtVerifyAsync).toHaveBeenCalledWith('admin-token', {
      secret: 'test-secret',
    });
    expect(userFindUnique).toHaveBeenCalledTimes(1);
    expect(userFindUnique).toHaveBeenCalledWith({
      where: { id: 'admin-user-1' },
    });
  });

  it('supports array-based authorization headers', async () => {
    request.headers.authorization = ['Bearer array-token'];
    jwtVerifyAsync.mockResolvedValue({ sub: 'admin-user-2' });
    userFindUnique.mockResolvedValue({
      id: 'admin-user-2',
      isActive: true,
      role: UserRole.ADMIN,
    });

    await expect(service.isAdminPreviewEnabled()).resolves.toBe(true);

    expect(jwtVerifyAsync).toHaveBeenCalledWith('array-token', {
      secret: 'test-secret',
    });
  });

  it('disables admin preview when the authorization header is missing and caches the result', async () => {
    await expect(service.isAdminPreviewEnabled()).resolves.toBe(false);
    await expect(service.isAdminPreviewEnabled()).resolves.toBe(false);

    expect(jwtVerifyAsync).not.toHaveBeenCalled();
    expect(userFindUnique).not.toHaveBeenCalled();
  });

  it('disables admin preview when the authorization scheme is malformed', async () => {
    request.headers.authorization = 'Token malformed';

    await expect(service.isAdminPreviewEnabled()).resolves.toBe(false);

    expect(jwtVerifyAsync).not.toHaveBeenCalled();
    expect(userFindUnique).not.toHaveBeenCalled();
  });

  it('disables admin preview when the bearer token is blank', async () => {
    request.headers.authorization = 'Bearer    ';

    await expect(service.isAdminPreviewEnabled()).resolves.toBe(false);

    expect(jwtVerifyAsync).not.toHaveBeenCalled();
    expect(userFindUnique).not.toHaveBeenCalled();
  });

  it('disables admin preview when the bearer token becomes empty after trim', async () => {
    request.headers.authorization = 'Bearer \t';

    await expect(service.isAdminPreviewEnabled()).resolves.toBe(false);

    expect(jwtVerifyAsync).not.toHaveBeenCalled();
    expect(userFindUnique).not.toHaveBeenCalled();
  });

  it('disables admin preview when the token is invalid', async () => {
    request.headers.authorization = 'Bearer invalid-token';
    const invalidTokenError = new Error('Invalid token');
    jwtVerifyAsync.mockRejectedValue(invalidTokenError);

    await expect(service.isAdminPreviewEnabled()).resolves.toBe(false);

    expect(userFindUnique).not.toHaveBeenCalled();
  });

  it('disables admin preview when the authenticated user is not an active admin', async () => {
    request.headers.authorization = 'Bearer editor-token';
    jwtVerifyAsync.mockResolvedValue({ sub: 'editor-user-1' });
    const nonAdminUser: AdminUserRecord = {
      id: 'editor-user-1',
      isActive: true,
      role: 'USER' as UserRole,
    };
    userFindUnique.mockResolvedValue(nonAdminUser);

    await expect(service.isAdminPreviewEnabled()).resolves.toBe(false);
  });
});
