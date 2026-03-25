import { Test, TestingModule } from '@nestjs/testing';
import { ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { DatabaseDiagnosticsService } from './database-diagnostics.service';

describe('DatabaseDiagnosticsService', () => {
  let service: DatabaseDiagnosticsService;
  let prisma: jest.Mocked<Pick<PrismaService, '$queryRaw'>>;
  let moduleRef: TestingModule;

  beforeEach(async () => {
    prisma = {
      $queryRaw: jest.fn(),
    };

    moduleRef = await Test.createTestingModule({
      providers: [
        DatabaseDiagnosticsService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = moduleRef.get(DatabaseDiagnosticsService);
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  it('maps the raw database probe result', async () => {
    prisma.$queryRaw.mockResolvedValue([
      {
        databaseName: 'hans-portfolio-db',
        currentSchema: 'portfolio',
        serverVersion: 'PostgreSQL 17',
        executedAtUtc: '2026-03-24T20:15:00.000Z',
      },
    ]);

    await expect(service.getDatabaseDiagnostics()).resolves.toEqual({
      isConnected: true,
      probe: 'postgresql',
      databaseName: 'hans-portfolio-db',
      currentSchema: 'portfolio',
      serverVersion: 'PostgreSQL 17',
      executedAtUtc: '2026-03-24T20:15:00.000Z',
    });
  });

  it('throws a ServiceUnavailableException when the database probe fails with an Error', async () => {
    prisma.$queryRaw.mockRejectedValue(new Error('Database timeout'));

    await expect(service.getDatabaseDiagnostics()).rejects.toThrow(
      ServiceUnavailableException,
    );
  });

  it('uses a generic error message when the database probe rejects with a non-Error value', async () => {
    prisma.$queryRaw.mockRejectedValue('timeout');

    expect.assertions(2);

    try {
      await service.getDatabaseDiagnostics();
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(ServiceUnavailableException);

      const exception = error as ServiceUnavailableException;
      const response = exception.getResponse() as { error: string };

      expect(response.error).toBe('Unknown database error.');
    }
  });
});
