import { Server } from 'node:http';
import { hashSync } from 'bcrypt';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { UserRole } from '@prisma/client';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { ApiRoutes } from '../src/routing/api-routes';

type LoginEndpointResponse = {
  accessToken: string;
};

type TagRecord = {
  id: string;
  slug: string;
  namePt: string;
  nameEn: string;
  type: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

describe('Content endpoints (e2e)', () => {
  let app: INestApplication;
  let httpServer: Server;

  beforeAll(async () => {
    process.env.JWT_SECRET = 'test-jwt-secret';
    process.env.JWT_EXPIRES_IN = '1h';

    const passwordHash = hashSync('ChangeMe!123', 12);
    const adminUser = {
      id: 'c96b4178-211b-43b3-84f0-e4cb42c0b62e',
      name: 'Victor Hanszman',
      email: 'victor@example.com',
      passwordHash,
      role: UserRole.ADMIN,
      isActive: true,
      createdAt: new Date('2026-03-26T00:00:00.000Z'),
      updatedAt: new Date('2026-03-26T00:00:00.000Z'),
    };

    const projects = [
      {
        id: '2b60e43f-7923-4038-9d9f-44a759f0f7ca',
        slug: 'portfolio-remake',
        titlePt: 'Remake do Portfolio',
        isPublished: true,
      },
    ];

    const tags: TagRecord[] = [
      {
        id: '8d2744f8-e795-48d8-a123-8be5d9820153',
        slug: 'frontend',
        namePt: 'Frontend',
        nameEn: 'Frontend',
        type: 'STACK',
        sortOrder: 1,
        createdAt: new Date('2026-03-26T00:00:00.000Z'),
        updatedAt: new Date('2026-03-26T00:00:00.000Z'),
      },
    ];

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
        project: {
          findMany: jest.fn().mockResolvedValue(projects),
          findFirst: jest
            .fn()
            .mockImplementation(
              ({
                where,
              }: {
                where: { slug?: string; isPublished?: boolean };
              }) => {
                const project = projects.find(
                  (item) =>
                    item.slug === where.slug &&
                    item.isPublished === where.isPublished,
                );

                return Promise.resolve(project ?? null);
              },
            ),
        },
        tag: {
          findMany: jest
            .fn()
            .mockImplementation(() => Promise.resolve([...tags])),
          findFirst: jest.fn(),
          findUnique: jest
            .fn()
            .mockImplementation(({ where }: { where: { id: string } }) => {
              const tag = tags.find((item) => item.id === where.id);
              return Promise.resolve(tag ?? null);
            }),
          create: jest.fn().mockImplementation(
            ({
              data,
            }: {
              data: Pick<TagRecord, 'slug' | 'namePt' | 'nameEn' | 'type'> & {
                sortOrder?: number;
              };
            }) => {
              const nextTag: TagRecord = {
                id: 'a4875d1e-cd31-49ca-b896-704c8426b6b8',
                slug: data.slug,
                namePt: data.namePt,
                nameEn: data.nameEn,
                type: data.type,
                sortOrder: data.sortOrder ?? 0,
                createdAt: new Date('2026-03-26T00:00:00.000Z'),
                updatedAt: new Date('2026-03-26T00:00:00.000Z'),
              };
              tags.push(nextTag);
              return Promise.resolve(nextTag);
            },
          ),
          update: jest
            .fn()
            .mockImplementation(
              ({
                where,
                data,
              }: {
                where: { id: string };
                data: Partial<TagRecord>;
              }) => {
                const tagIndex = tags.findIndex((item) => item.id === where.id);

                if (tagIndex === -1) {
                  return Promise.reject(new Error('Tag not found.'));
                }

                tags[tagIndex] = {
                  ...tags[tagIndex],
                  ...data,
                };

                return Promise.resolve(tags[tagIndex]);
              },
            ),
          delete: jest
            .fn()
            .mockImplementation(({ where }: { where: { id: string } }) => {
              const tagIndex = tags.findIndex((item) => item.id === where.id);

              if (tagIndex === -1) {
                return Promise.reject(new Error('Tag not found.'));
              }

              const [deletedTag] = tags.splice(tagIndex, 1);
              return Promise.resolve(deletedTag);
            }),
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

  it('GET /projects returns the public project collection without authentication', async () => {
    const response = await request(httpServer)
      .get(`/${ApiRoutes.content.projects}`)
      .expect(200);

    expect(response.body).toEqual([
      expect.objectContaining({
        slug: 'portfolio-remake',
      }),
    ]);
  });

  it('GET /projects/:slug returns a public project item without authentication', async () => {
    const response = await request(httpServer)
      .get(`/${ApiRoutes.content.projects}/portfolio-remake`)
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        slug: 'portfolio-remake',
      }),
    );
  });

  it('POST /admin/tags rejects requests without a bearer token', async () => {
    await request(httpServer)
      .post(`/${ApiRoutes.admin.base}/${ApiRoutes.content.tags}`)
      .expect(401);
  });

  it('admin mutation routes for tags require login and work with a bearer token', async () => {
    const loginResponse = await request(httpServer)
      .post(`/${ApiRoutes.auth.base}/${ApiRoutes.auth.login}`)
      .send({
        email: 'victor@example.com',
        password: 'ChangeMe!123',
      })
      .expect(201);
    const { accessToken } = loginResponse.body as LoginEndpointResponse;

    const createResponse = await request(httpServer)
      .post(`/${ApiRoutes.admin.base}/${ApiRoutes.content.tags}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        slug: 'nestjs',
        namePt: 'NestJS',
        nameEn: 'NestJS',
        type: 'STACK',
      })
      .expect(201);

    const createdTag = createResponse.body as TagRecord;

    expect(createdTag.slug).toBe('nestjs');

    const updateResponse = await request(httpServer)
      .put(
        `/${ApiRoutes.admin.base}/${ApiRoutes.content.tags}/${createdTag.id}`,
      )
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        namePt: 'Nest Framework',
      })
      .expect(200);

    expect(updateResponse.body).toEqual(
      expect.objectContaining({
        id: createdTag.id,
        namePt: 'Nest Framework',
      }),
    );

    await request(httpServer)
      .delete(
        `/${ApiRoutes.admin.base}/${ApiRoutes.content.tags}/${createdTag.id}`,
      )
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });
});
