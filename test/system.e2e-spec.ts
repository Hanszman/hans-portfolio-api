import { Server } from 'node:http';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DatabaseDiagnosticsService } from '../src/modules/system/services/database/database-diagnostics.service';
import { HealthService } from '../src/modules/system/services/health/health.service';
import { PingService } from '../src/modules/system/services/ping/ping.service';
import { SystemService } from '../src/modules/system/services/system/system.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { ApiRoutes } from '../src/routing/api-routes';
import type { SwaggerDocumentResponse } from './system.e2e-spec.types';

describe('System endpoints (e2e)', () => {
  let app: INestApplication;
  let httpServer: Server;

  beforeAll(async () => {
    process.env.JWT_SECRET = 'test-jwt-secret';
    process.env.JWT_EXPIRES_IN = '1h';

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
      .overrideProvider(PingService)
      .useValue({
        getPing: jest.fn().mockReturnValue({
          name: 'Hans Portfolio API',
          environment: 'test',
          status: 'ok',
          utcNow: '2026-03-24T20:15:00.000Z',
        }),
      })
      .overrideProvider(DatabaseDiagnosticsService)
      .useValue({
        getDatabaseDiagnostics: jest.fn().mockResolvedValue({
          isConnected: true,
          probe: 'postgresql',
          databaseName: 'hans-portfolio-db',
          currentSchema: 'portfolio',
          serverVersion: 'PostgreSQL 17',
          executedAtUtc: '2026-03-24T20:15:00.000Z',
        }),
      })
      .overrideProvider(HealthService)
      .useValue({
        getHealth: jest.fn().mockResolvedValue({
          status: 'healthy',
          checks: {
            database: 'up',
          },
          checkedAtUtc: '2026-03-24T20:15:00.000Z',
        }),
      })
      .overrideProvider(SystemService)
      .useValue({
        getSystemOverview: jest.fn().mockReturnValue({
          name: 'Hans Portfolio API',
          module: 'system',
          status: 'operational',
          routes: [
            '/system/ping',
            '/system/database',
            '/system/health',
            '/health',
            '/swagger',
          ],
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

  it('GET /', async () => {
    const response = await request(httpServer).get('/').expect(200);

    expect(response.body).toEqual({
      name: 'Hans Portfolio API',
      environment: 'test',
      status: 'ok',
      utcNow: '2026-03-24T20:15:00.000Z',
    });
  });

  it('GET /system', async () => {
    const response = await request(httpServer)
      .get(`/${ApiRoutes.system.base}`)
      .expect(200);

    expect(response.body).toEqual({
      name: 'Hans Portfolio API',
      module: 'system',
      status: 'operational',
      routes: [
        '/system/ping',
        '/system/database',
        '/system/health',
        '/health',
        '/swagger',
      ],
    });
  });

  it('GET /system/ping', async () => {
    const response = await request(httpServer)
      .get(`/${ApiRoutes.system.base}/${ApiRoutes.system.ping}`)
      .expect(200);

    expect(response.body).toEqual({
      name: 'Hans Portfolio API',
      environment: 'test',
      status: 'ok',
      utcNow: '2026-03-24T20:15:00.000Z',
    });
  });

  it('GET /system/database', async () => {
    const response = await request(httpServer)
      .get(`/${ApiRoutes.system.base}/${ApiRoutes.system.database}`)
      .expect(200);

    expect(response.body).toEqual({
      isConnected: true,
      probe: 'postgresql',
      databaseName: 'hans-portfolio-db',
      currentSchema: 'portfolio',
      serverVersion: 'PostgreSQL 17',
      executedAtUtc: '2026-03-24T20:15:00.000Z',
    });
  });

  it('GET /system/health', async () => {
    const response = await request(httpServer)
      .get(`/${ApiRoutes.system.base}/${ApiRoutes.system.health}`)
      .expect(200);

    expect(response.body).toEqual({
      status: 'healthy',
      checks: {
        database: 'up',
      },
      checkedAtUtc: '2026-03-24T20:15:00.000Z',
    });
  });

  it('GET /health', async () => {
    const response = await request(httpServer)
      .get(`/${ApiRoutes.health.alias}`)
      .expect(200);

    expect(response.body).toEqual({
      status: 'healthy',
      checks: {
        database: 'up',
      },
      checkedAtUtc: '2026-03-24T20:15:00.000Z',
    });
  });

  it('GET /swagger-json', async () => {
    const response = await request(httpServer).get('/swagger-json').expect(200);

    const swaggerDocument = response.body as SwaggerDocumentResponse;

    expect(
      swaggerDocument.paths[
        `/${ApiRoutes.system.base}/${ApiRoutes.system.ping}`
      ],
    ).toBeDefined();
    expect(
      swaggerDocument.paths[
        `/${ApiRoutes.system.base}/${ApiRoutes.system.database}`
      ],
    ).toBeDefined();
    expect(
      swaggerDocument.paths[
        `/${ApiRoutes.system.base}/${ApiRoutes.system.health}`
      ],
    ).toBeDefined();
    expect(swaggerDocument.paths[`/${ApiRoutes.system.base}`]).toBeDefined();
    expect(swaggerDocument.paths['/']).toBeUndefined();
    expect(swaggerDocument.paths[`/${ApiRoutes.health.alias}`]).toBeUndefined();
  });
});
