import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { SystemDiagnosticsService } from '../src/modules/system/services/system-diagnostics.service';
import { PrismaService } from '../src/prisma/prisma.service';

describe('System endpoints (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        onModuleInit: jest.fn(),
        onModuleDestroy: jest.fn(),
      })
      .overrideProvider(SystemDiagnosticsService)
      .useValue({
        getPing: jest.fn().mockReturnValue({
          name: 'Hans Portfolio API',
          environment: 'test',
          status: 'ok',
          utcNow: '2026-03-24T20:15:00.000Z',
        }),
        getDatabaseDiagnostics: jest.fn().mockResolvedValue({
          isConnected: true,
          probe: 'postgresql',
          databaseName: 'hans-portfolio-db',
          currentSchema: 'portfolio',
          serverVersion: 'PostgreSQL 17',
          executedAtUtc: '2026-03-24T20:15:00.000Z',
        }),
        getHealth: jest.fn().mockResolvedValue({
          status: 'healthy',
          checks: {
            database: 'up',
          },
          checkedAtUtc: '2026-03-24T20:15:00.000Z',
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

    SwaggerModule.setup('swagger', app, document);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/system/ping', async () => {
    const response = await request(app.getHttpServer()).get('/api/system/ping').expect(200);

    expect(response.body).toEqual({
      name: 'Hans Portfolio API',
      environment: 'test',
      status: 'ok',
      utcNow: '2026-03-24T20:15:00.000Z',
    });
  });

  it('GET /api/system/database', async () => {
    const response = await request(app.getHttpServer()).get('/api/system/database').expect(200);

    expect(response.body).toEqual({
      isConnected: true,
      probe: 'postgresql',
      databaseName: 'hans-portfolio-db',
      currentSchema: 'portfolio',
      serverVersion: 'PostgreSQL 17',
      executedAtUtc: '2026-03-24T20:15:00.000Z',
    });
  });

  it('GET /health', async () => {
    const response = await request(app.getHttpServer()).get('/health').expect(200);

    expect(response.body).toEqual({
      status: 'healthy',
      checks: {
        database: 'up',
      },
      checkedAtUtc: '2026-03-24T20:15:00.000Z',
    });
  });

  it('GET /swagger-json', async () => {
    const response = await request(app.getHttpServer()).get('/swagger-json').expect(200);

    expect(response.body.paths['/api/system/ping']).toBeDefined();
    expect(response.body.paths['/api/system/database']).toBeDefined();
    expect(response.body.paths['/health']).toBeDefined();
  });
});
