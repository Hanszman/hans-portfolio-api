import { Server } from 'node:http';
import { hashSync } from 'bcrypt';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { UserRole } from '@prisma/client';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { ApiRoutes } from '../src/routing/api-routes';
import type { LoginEndpointResponse } from './auth.e2e-spec.types';

describe('Auth endpoints (e2e)', () => {
  let app: INestApplication;
  let httpServer: Server;

  beforeAll(async () => {
    process.env.JWT_SECRET = 'test-jwt-secret';
    process.env.JWT_EXPIRES_IN = '1h';

    const passwordHash = hashSync('ChangeMe!123', 12);
    const adminUser = {
      id: 'user-1',
      name: 'Victor Hanszman',
      email: 'victor@example.com',
      passwordHash,
      role: UserRole.ADMIN,
      isActive: true,
      createdAt: new Date('2026-03-26T00:00:00.000Z'),
      updatedAt: new Date('2026-03-26T00:00:00.000Z'),
    };

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        onModuleInit: jest.fn(),
        onModuleDestroy: jest.fn(),
        user: {
          findUnique: jest
            .fn()
            .mockImplementation(
              ({ where }: { where: { email?: string; id?: string } }) => {
                if (
                  where.email === adminUser.email ||
                  where.id === adminUser.id
                ) {
                  return Promise.resolve(adminUser);
                }

                return Promise.resolve(null);
              },
            ),
        },
      })
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
    httpServer = app.getHttpServer() as Server;
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /auth/login returns an admin JWT for valid credentials', async () => {
    const response = await request(httpServer)
      .post(`/${ApiRoutes.auth.base}/${ApiRoutes.auth.login}`)
      .send({
        email: 'victor@example.com',
        password: 'ChangeMe!123',
      })
      .expect(201);
    const responseBody = response.body as LoginEndpointResponse;

    expect(responseBody).toMatchObject({
      tokenType: 'Bearer',
      expiresIn: '1h',
      user: {
        id: 'user-1',
        email: 'victor@example.com',
        name: 'Victor Hanszman',
        role: UserRole.ADMIN,
      },
    });
    expect(responseBody.accessToken).toEqual(expect.any(String));
  });

  it('POST /auth/login rejects invalid credentials', async () => {
    await request(httpServer)
      .post(`/${ApiRoutes.auth.base}/${ApiRoutes.auth.login}`)
      .send({
        email: 'victor@example.com',
        password: 'WrongPassword!123',
      })
      .expect(401);
  });

  it('GET /admin/session rejects requests without a bearer token', async () => {
    await request(httpServer)
      .get(`/${ApiRoutes.admin.base}/${ApiRoutes.admin.session}`)
      .expect(401);
  });

  it('GET /admin/session returns the authenticated admin session', async () => {
    const loginResponse = await request(httpServer)
      .post(`/${ApiRoutes.auth.base}/${ApiRoutes.auth.login}`)
      .send({
        email: 'victor@example.com',
        password: 'ChangeMe!123',
      })
      .expect(201);
    const loginResponseBody = loginResponse.body as LoginEndpointResponse;
    const accessToken = loginResponseBody.accessToken;

    const response = await request(httpServer)
      .get(`/${ApiRoutes.admin.base}/${ApiRoutes.admin.session}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body).toEqual({
      id: 'user-1',
      email: 'victor@example.com',
      name: 'Victor Hanszman',
      role: UserRole.ADMIN,
    });
  });
});
