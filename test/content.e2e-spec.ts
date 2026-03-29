import { Server } from 'node:http';
import { hashSync } from 'bcrypt';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import {
  TechnologyCategory,
  TechnologyLevel,
  TechnologyUsageContext,
  TechnologyUsageFrequency,
  UserRole,
} from '@prisma/client';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { ApiRoutes } from '../src/routing/api-routes';
import type {
  LoginEndpointResponse,
  TagRecord,
  TechnologyContextRecord,
  TechnologyRecord,
} from './content.e2e-spec.types';

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
    const technologies: TechnologyRecord[] = [
      {
        id: 'f886d274-615f-4ca2-9a23-bdb839a26c58',
        slug: 'typescript',
        name: 'TypeScript',
        category: TechnologyCategory.LANGUAGE,
        level: TechnologyLevel.ADVANCED,
        frequency: TechnologyUsageFrequency.FREQUENT,
        technologyContexts: [
          {
            id: '9ba9a7a2-9d5d-4f2d-89be-6be266e63811',
            context: TechnologyUsageContext.PERSONAL,
            startedAt: '2024-05-01',
            endedAt: '2025-04-01',
          },
          {
            id: '8533c4b0-cc95-4ce1-b0be-77f8fd13ac44',
            context: TechnologyUsageContext.PROFESSIONAL,
            startedAt: '2020-01-01',
            endedAt: '2024-04-01',
          },
        ],
      },
    ];
    const technologyContexts: TechnologyContextRecord[] = [
      {
        id: '9ba9a7a2-9d5d-4f2d-89be-6be266e63811',
        technologyId: 'f886d274-615f-4ca2-9a23-bdb839a26c58',
        context: TechnologyUsageContext.PERSONAL,
        startedAt: '2024-05-01',
        endedAt: '2025-04-01',
        technology: {
          id: 'f886d274-615f-4ca2-9a23-bdb839a26c58',
          slug: 'typescript',
          name: 'TypeScript',
          category: TechnologyCategory.LANGUAGE,
          level: TechnologyLevel.ADVANCED,
          frequency: TechnologyUsageFrequency.FREQUENT,
        },
      },
      {
        id: '8533c4b0-cc95-4ce1-b0be-77f8fd13ac44',
        technologyId: 'f886d274-615f-4ca2-9a23-bdb839a26c58',
        context: TechnologyUsageContext.PROFESSIONAL,
        startedAt: '2020-01-01',
        endedAt: '2024-04-01',
        technology: {
          id: 'f886d274-615f-4ca2-9a23-bdb839a26c58',
          slug: 'typescript',
          name: 'TypeScript',
          category: TechnologyCategory.LANGUAGE,
          level: TechnologyLevel.ADVANCED,
          frequency: TechnologyUsageFrequency.FREQUENT,
        },
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
          count: jest.fn().mockResolvedValue(projects.length),
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
        technology: {
          findMany: jest.fn().mockResolvedValue(technologies),
          count: jest.fn().mockResolvedValue(technologies.length),
          findFirst: jest
            .fn()
            .mockImplementation(
              ({
                where,
              }: {
                where: { slug?: string; isPublished?: boolean };
              }) => {
                const technology = technologies.find(
                  (item) =>
                    item.slug === where.slug && where.isPublished === true,
                );

                return Promise.resolve(technology ?? null);
              },
            ),
        },
        technologyContext: {
          create: jest.fn().mockImplementation(
            ({
              data,
            }: {
              data: {
                technology: { connect: { id: string } };
                context: TechnologyUsageContext;
                startedAt: string;
                endedAt?: string | null;
              };
            }) => {
              const technology = technologies.find(
                (item) => item.id === data.technology.connect.id,
              );

              if (!technology) {
                return Promise.reject(new Error('Technology not found.'));
              }

              const nextContext: TechnologyContextRecord = {
                id: 'eb2f3486-f5f5-40a0-9af9-17e02d70f7d2',
                technologyId: technology.id,
                context: data.context,
                startedAt: data.startedAt,
                endedAt: data.endedAt ?? null,
                technology: {
                  id: technology.id,
                  slug: technology.slug,
                  name: technology.name,
                  category: technology.category ?? TechnologyCategory.LANGUAGE,
                  level: technology.level ?? null,
                  frequency: technology.frequency ?? null,
                },
              };
              technologyContexts.push(nextContext);
              technology.technologyContexts.push({
                id: nextContext.id,
                context: nextContext.context,
                startedAt: nextContext.startedAt,
                endedAt: nextContext.endedAt,
              });

              return Promise.resolve(nextContext);
            },
          ),
          update: jest.fn().mockImplementation(
            ({
              where,
              data,
            }: {
              where: { id: string };
              data: {
                technology?: { connect: { id: string } };
                context?: TechnologyUsageContext;
                startedAt?: string;
                endedAt?: string | null;
              };
            }) => {
              const contextIndex = technologyContexts.findIndex(
                (item) => item.id === where.id,
              );

              if (contextIndex === -1) {
                return Promise.reject(
                  new Error('Technology context not found.'),
                );
              }

              const current = technologyContexts[contextIndex];
              const nextTechnologyId =
                data.technology?.connect.id ?? current.technologyId;
              const nextTechnology = technologies.find(
                (item) => item.id === nextTechnologyId,
              );

              if (!nextTechnology) {
                return Promise.reject(new Error('Technology not found.'));
              }

              const updatedContext: TechnologyContextRecord = {
                ...current,
                technologyId: nextTechnologyId,
                context: data.context ?? current.context,
                startedAt: data.startedAt ?? current.startedAt,
                endedAt:
                  'endedAt' in data ? (data.endedAt ?? null) : current.endedAt,
                technology: {
                  id: nextTechnology.id,
                  slug: nextTechnology.slug,
                  name: nextTechnology.name,
                  category:
                    nextTechnology.category ?? TechnologyCategory.LANGUAGE,
                  level: nextTechnology.level ?? null,
                  frequency: nextTechnology.frequency ?? null,
                },
              };

              technologyContexts[contextIndex] = updatedContext;
              for (const technology of technologies) {
                technology.technologyContexts =
                  technology.technologyContexts.filter(
                    (item) => item.id !== updatedContext.id,
                  );
              }
              nextTechnology.technologyContexts.push({
                id: updatedContext.id,
                context: updatedContext.context,
                startedAt: updatedContext.startedAt,
                endedAt: updatedContext.endedAt,
              });

              return Promise.resolve(updatedContext);
            },
          ),
          delete: jest
            .fn()
            .mockImplementation(({ where }: { where: { id: string } }) => {
              const contextIndex = technologyContexts.findIndex(
                (item) => item.id === where.id,
              );

              if (contextIndex === -1) {
                return Promise.reject(
                  new Error('Technology context not found.'),
                );
              }

              const [deletedContext] = technologyContexts.splice(
                contextIndex,
                1,
              );
              const parentTechnology = technologies.find(
                (item) => item.id === deletedContext.technologyId,
              );

              if (parentTechnology) {
                parentTechnology.technologyContexts =
                  parentTechnology.technologyContexts.filter(
                    (item) => item.id !== deletedContext.id,
                  );
              }

              return Promise.resolve(deletedContext);
            }),
        },
        tag: {
          findMany: jest
            .fn()
            .mockImplementation(() => Promise.resolve([...tags])),
          count: jest
            .fn()
            .mockImplementation(() => Promise.resolve(tags.length)),
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

  it('GET /projects returns the public project collection with pagination metadata', async () => {
    const response = await request(httpServer)
      .get(`/${ApiRoutes.content.projects}`)
      .expect(200);

    expect(response.body).toEqual({
      data: [
        expect.objectContaining({
          slug: 'portfolio-remake',
        }),
      ],
      pagination: {
        page: 1,
        pageSize: 12,
        totalItems: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    });
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

  it('GET /technologies returns technology experience metrics with merged totals', async () => {
    const response = await request(httpServer)
      .get(`/${ApiRoutes.content.technologies}`)
      .expect(200);
    const body = response.body as {
      data: Array<{
        slug: string;
        experienceMetrics: {
          total: {
            totalMonths: number;
            years: number;
            months: number;
            label: string;
          };
          byContext: {
            PROFESSIONAL: {
              totalMonths: number;
              years: number;
              months: number;
              label: string;
            };
            PERSONAL: {
              totalMonths: number;
              years: number;
              months: number;
              label: string;
            };
          };
        };
      }>;
      pagination: {
        page: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
      };
    };

    const [firstTechnology] = body.data;
    expect(firstTechnology).toBeDefined();
    const typedFirstTechnology = firstTechnology as {
      slug: string;
      experienceMetrics: {
        total: {
          totalMonths: number;
          years: number;
          months: number;
          label: string;
        };
        byContext: {
          PROFESSIONAL: {
            totalMonths: number;
            years: number;
            months: number;
            label: string;
          };
          PERSONAL: {
            totalMonths: number;
            years: number;
            months: number;
            label: string;
          };
        };
      };
    };

    expect(typedFirstTechnology.slug).toBe('typescript');
    expect(typedFirstTechnology.experienceMetrics.total).toEqual(
      expect.objectContaining({
        totalMonths: 64,
        years: 5,
        months: 4,
        label: '5 years 4 months',
      }),
    );
    expect(
      typedFirstTechnology.experienceMetrics.byContext.PROFESSIONAL,
    ).toEqual(
      expect.objectContaining({
        totalMonths: 52,
        years: 4,
        months: 4,
        label: '4 years 4 months',
      }),
    );
    expect(typedFirstTechnology.experienceMetrics.byContext.PERSONAL).toEqual(
      expect.objectContaining({
        totalMonths: 12,
        years: 1,
        months: 0,
        label: '1 year',
      }),
    );
    expect(body.pagination).toEqual({
      page: 1,
      pageSize: 12,
      totalItems: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    });
  });

  it('GET /technology-contexts returns grouped technology contexts by technology', async () => {
    const response = await request(httpServer)
      .get(`/${ApiRoutes.content.technologyContexts}`)
      .expect(200);

    const body = response.body as {
      data: Array<{
        slug: string;
        technologyContexts: Array<{ id: string; context: string }>;
        experienceMetrics: {
          total: { totalMonths: number };
          byContext: {
            PROFESSIONAL: { totalMonths: number };
            PERSONAL: { totalMonths: number };
          };
        };
      }>;
    };

    expect(body.data).toHaveLength(1);
    expect(body.data[0]).toEqual(
      expect.objectContaining({
        slug: 'typescript',
      }),
    );
    const [firstGroup] = body.data;
    expect(firstGroup?.technologyContexts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: '9ba9a7a2-9d5d-4f2d-89be-6be266e63811',
          context: 'PERSONAL',
        }),
        expect.objectContaining({
          id: '8533c4b0-cc95-4ce1-b0be-77f8fd13ac44',
          context: 'PROFESSIONAL',
        }),
      ]),
    );
    expect(firstGroup?.experienceMetrics.total.totalMonths).toBe(64);
  });

  it('GET /technology-contexts/:slug returns one grouped technology context payload by technology slug', async () => {
    const response = await request(httpServer)
      .get(`/${ApiRoutes.content.technologyContexts}/typescript`)
      .expect(200);

    const body = response.body as {
      slug: string;
      technologyContexts: Array<{ id: string; context: string }>;
      experienceMetrics: {
        total: {
          totalMonths: number;
          years: number;
          months: number;
          label: string;
        };
      };
    };

    expect(body.slug).toBe('typescript');
    expect(body.technologyContexts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: '9ba9a7a2-9d5d-4f2d-89be-6be266e63811',
          context: 'PERSONAL',
        }),
        expect.objectContaining({
          id: '8533c4b0-cc95-4ce1-b0be-77f8fd13ac44',
          context: 'PROFESSIONAL',
        }),
      ]),
    );
    expect(body.experienceMetrics.total).toEqual(
      expect.objectContaining({
        totalMonths: 64,
        years: 5,
        months: 4,
        label: '5 years 4 months',
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

  it('admin mutation routes for technology contexts require login and work with a bearer token', async () => {
    const loginResponse = await request(httpServer)
      .post(`/${ApiRoutes.auth.base}/${ApiRoutes.auth.login}`)
      .send({
        email: 'victor@example.com',
        password: 'ChangeMe!123',
      })
      .expect(201);
    const { accessToken } = loginResponse.body as LoginEndpointResponse;

    const createResponse = await request(httpServer)
      .post(`/${ApiRoutes.admin.base}/${ApiRoutes.content.technologyContexts}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        technologyId: 'f886d274-615f-4ca2-9a23-bdb839a26c58',
        context: 'STUDY',
        startedAt: '2025-01-01',
        endedAt: null,
      })
      .expect(201);

    expect(createResponse.body).toEqual(
      expect.objectContaining({
        id: 'eb2f3486-f5f5-40a0-9af9-17e02d70f7d2',
        context: 'STUDY',
      }),
    );

    const updateResponse = await request(httpServer)
      .put(
        `/${ApiRoutes.admin.base}/${ApiRoutes.content.technologyContexts}/eb2f3486-f5f5-40a0-9af9-17e02d70f7d2`,
      )
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        context: 'PERSONAL',
      })
      .expect(200);

    expect(updateResponse.body).toEqual(
      expect.objectContaining({
        id: 'eb2f3486-f5f5-40a0-9af9-17e02d70f7d2',
        context: 'PERSONAL',
      }),
    );

    await request(httpServer)
      .delete(
        `/${ApiRoutes.admin.base}/${ApiRoutes.content.technologyContexts}/eb2f3486-f5f5-40a0-9af9-17e02d70f7d2`,
      )
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });
});
