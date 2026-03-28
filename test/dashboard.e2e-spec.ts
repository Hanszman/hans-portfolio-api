import { Server } from 'node:http';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DashboardService } from '../src/modules/dashboard/services/dashboard/dashboard.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { ApiRoutes } from '../src/routing/api-routes';
import type {
  DashboardOverviewStub,
  SwaggerDocumentResponse,
} from './dashboard.e2e-spec.types';

describe('Dashboard endpoints (e2e)', () => {
  let app: INestApplication;
  let httpServer: Server;

  beforeAll(async () => {
    const dashboardOverview: DashboardOverviewStub = {
      generatedAtUtc: '2026-03-28T12:00:00.000Z',
      summary: {
        projects: 21,
        experiences: 3,
        technologies: 2,
        formations: 1,
        customers: 1,
        jobs: 1,
        spokenLanguages: 1,
      },
    };

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        onModuleInit: jest.fn(),
        onModuleDestroy: jest.fn(),
        user: {
          findUnique: jest.fn(),
        },
      })
      .overrideProvider(DashboardService)
      .useValue({
        getDashboardOverview: jest.fn().mockResolvedValue({
          ...dashboardOverview,
          stackDistribution: {
            generatedAtUtc: '2026-03-28T12:00:00.000Z',
            stacks: [],
          },
          projectContexts: {
            generatedAtUtc: '2026-03-28T12:00:00.000Z',
            totalProjects: 21,
            featuredProjects: 4,
            highlightedProjects: 3,
            contexts: [],
            environments: [],
          },
          technologyUsage: {
            generatedAtUtc: '2026-03-28T12:00:00.000Z',
            totalUsageLinks: 10,
            levels: [],
            frequencies: [],
            contexts: [],
            sources: [],
            topTechnologies: [],
          },
          professionalTimeline: {
            generatedAtUtc: '2026-03-28T12:00:00.000Z',
            totalItems: 3,
            items: [],
          },
          highlights: {
            generatedAtUtc: '2026-03-28T12:00:00.000Z',
            totalItems: 5,
            items: [],
          },
        }),
        getStackDistribution: jest.fn().mockResolvedValue({
          generatedAtUtc: '2026-03-28T12:00:00.000Z',
          stacks: [],
        }),
        getProjectContexts: jest.fn().mockResolvedValue({
          generatedAtUtc: '2026-03-28T12:00:00.000Z',
          totalProjects: 21,
          featuredProjects: 4,
          highlightedProjects: 3,
          contexts: [],
          environments: [],
        }),
        getTechnologyUsage: jest.fn().mockResolvedValue({
          generatedAtUtc: '2026-03-28T12:00:00.000Z',
          totalUsageLinks: 10,
          levels: [],
          frequencies: [],
          contexts: [],
          sources: [],
          topTechnologies: [],
        }),
        getProfessionalTimeline: jest.fn().mockResolvedValue({
          generatedAtUtc: '2026-03-28T12:00:00.000Z',
          totalItems: 3,
          items: [],
        }),
        getHighlights: jest.fn().mockResolvedValue({
          generatedAtUtc: '2026-03-28T12:00:00.000Z',
          totalItems: 5,
          items: [],
        }),
      })
      .compile();

    app = moduleRef.createNestApplication();

    const document = SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('Hans Portfolio API')
        .setDescription('NestJS backend for the Hans Portfolio remake.')
        .setVersion('1.0.0')
        .build(),
    );

    SwaggerModule.setup(ApiRoutes.swagger, app, document);

    await app.init();
    httpServer = app.getHttpServer() as Server;
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /dashboard returns the aggregated overview', async () => {
    const response = await request(httpServer)
      .get(`/${ApiRoutes.dashboard.base}`)
      .expect(200);
    const responseBody = response.body as DashboardOverviewStub;

    expect(responseBody.summary.projects).toBe(21);
    expect(responseBody.summary.experiences).toBe(3);
  });

  it('GET segmented dashboard endpoints returns their analytics payloads', async () => {
    await request(httpServer)
      .get(
        `/${ApiRoutes.dashboard.base}/${ApiRoutes.dashboard.stackDistribution}`,
      )
      .expect(200);
    await request(httpServer)
      .get(
        `/${ApiRoutes.dashboard.base}/${ApiRoutes.dashboard.projectContexts}`,
      )
      .expect(200);
    await request(httpServer)
      .get(
        `/${ApiRoutes.dashboard.base}/${ApiRoutes.dashboard.technologyUsage}`,
      )
      .expect(200);
    await request(httpServer)
      .get(
        `/${ApiRoutes.dashboard.base}/${ApiRoutes.dashboard.professionalTimeline}`,
      )
      .expect(200);
    await request(httpServer)
      .get(`/${ApiRoutes.dashboard.base}/${ApiRoutes.dashboard.highlights}`)
      .expect(200);
  });

  it('GET /swagger-json exposes the dashboard endpoints in OpenAPI', async () => {
    const response = await request(httpServer).get('/swagger-json').expect(200);

    const swaggerDocument = response.body as SwaggerDocumentResponse;

    expect(swaggerDocument.paths[`/${ApiRoutes.dashboard.base}`]).toBeDefined();
    expect(
      swaggerDocument.paths[
        `/${ApiRoutes.dashboard.base}/${ApiRoutes.dashboard.stackDistribution}`
      ],
    ).toBeDefined();
    expect(
      swaggerDocument.paths[
        `/${ApiRoutes.dashboard.base}/${ApiRoutes.dashboard.projectContexts}`
      ],
    ).toBeDefined();
    expect(
      swaggerDocument.paths[
        `/${ApiRoutes.dashboard.base}/${ApiRoutes.dashboard.technologyUsage}`
      ],
    ).toBeDefined();
    expect(
      swaggerDocument.paths[
        `/${ApiRoutes.dashboard.base}/${ApiRoutes.dashboard.professionalTimeline}`
      ],
    ).toBeDefined();
    expect(
      swaggerDocument.paths[
        `/${ApiRoutes.dashboard.base}/${ApiRoutes.dashboard.highlights}`
      ],
    ).toBeDefined();
  });
});
