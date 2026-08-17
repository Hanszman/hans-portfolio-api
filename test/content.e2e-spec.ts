import { Server } from 'node:http';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import {
  TechnologyType,
  TechnologyLevel,
  TechnologyUsageContext,
  TechnologyUsageFrequency,
  UserRole,
} from '@prisma/client';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';
import { PasswordService } from '../src/modules/auth/services/password/password.service';
import { ApiRoutes } from '../src/routing/api-routes';
import type {
  LoginEndpointResponse,
  TechnologyContextRecord,
  TechnologyRecord,
} from './content.e2e-spec.types';

describe('Content endpoints (e2e)', () => {
  let app: INestApplication;
  let httpServer: Server;

  beforeAll(async () => {
    process.env.JWT_SECRET = 'test-jwt-secret';
    process.env.JWT_EXPIRES_IN = '1h';

    const passwordHash = await new PasswordService().hashPassword(
      'ChangeMe!123',
    );
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
      },
    ];

    const technologies: TechnologyRecord[] = [
      {
        id: 'f886d274-615f-4ca2-9a23-bdb839a26c58',
        slug: 'typescript',
        name: 'TypeScript',
        type: TechnologyType.PROGRAMMING_LANGUAGES,
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
          type: TechnologyType.PROGRAMMING_LANGUAGES,
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
          type: TechnologyType.PROGRAMMING_LANGUAGES,
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
            .mockImplementation(({ where }: { where: { slug?: string } }) => {
              const project = projects.find((item) => item.slug === where.slug);
              return Promise.resolve(project ?? null);
            }),
        },
        technology: {
          findMany: jest.fn().mockResolvedValue(technologies),
          count: jest.fn().mockResolvedValue(technologies.length),
          findFirst: jest
            .fn()
            .mockImplementation(({ where }: { where: { slug?: string } }) => {
              const technology = technologies.find(
                (item) => item.slug === where.slug,
              );

              return Promise.resolve(technology ?? null);
            }),
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
                  type: technology.type ?? TechnologyType.PROGRAMMING_LANGUAGES,
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
                  type:
                    nextTechnology.type ?? TechnologyType.PROGRAMMING_LANGUAGES,
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
        totalMonths: 62,
        years: 5,
        months: 2,
        label: '5 years 2 months',
      }),
    );
    expect(
      typedFirstTechnology.experienceMetrics.byContext.PROFESSIONAL,
    ).toEqual(
      expect.objectContaining({
        totalMonths: 51,
        years: 4,
        months: 3,
        label: '4 years 3 months',
      }),
    );
    expect(typedFirstTechnology.experienceMetrics.byContext.PERSONAL).toEqual(
      expect.objectContaining({
        totalMonths: 11,
        years: 0,
        months: 11,
        label: '11 months',
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
    expect(firstGroup?.experienceMetrics.total.totalMonths).toBe(62);
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
        totalMonths: 62,
        years: 5,
        months: 2,
        label: '5 years 2 months',
      }),
    );
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
