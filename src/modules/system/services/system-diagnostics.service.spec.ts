import { ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { SystemDiagnosticsService } from './system-diagnostics.service';

describe('SystemDiagnosticsService', () => {
  let service: SystemDiagnosticsService;
  let prisma: jest.Mocked<Pick<PrismaService, '$queryRaw'>>;

  beforeEach(() => {
    prisma = {
      $queryRaw: jest.fn(),
    };

    process.env.APP_NAME = 'Hans Portfolio API';
    process.env.NODE_ENV = 'test';

    service = new SystemDiagnosticsService();
    Object.assign(service, { prisma });
  });

  it('returns the ping payload', () => {
    const result = service.getPing();

    expect(result.name).toBe('Hans Portfolio API');
    expect(result.environment).toBe('test');
    expect(result.status).toBe('ok');
    expect(result.utcNow).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('falls back to default metadata when APP_NAME and NODE_ENV are missing', () => {
    delete process.env.APP_NAME;
    delete process.env.NODE_ENV;

    const result = service.getPing();

    expect(result.name).toBe('Hans Portfolio API');
    expect(result.environment).toBe('development');
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

  it('returns a healthy payload when the database probe succeeds', async () => {
    prisma.$queryRaw.mockResolvedValue([
      {
        databaseName: 'hans-portfolio-db',
        currentSchema: 'portfolio',
        serverVersion: 'PostgreSQL 17',
        executedAtUtc: '2026-03-24T20:15:00.000Z',
      },
    ]);

    const result = await service.getHealth();

    expect(result.status).toBe('healthy');
    expect(result.checks.database).toBe('up');
    expect(result.checkedAtUtc).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('throws a ServiceUnavailableException when the database probe fails', async () => {
    prisma.$queryRaw.mockRejectedValue(new Error('Database timeout'));

    await expect(service.getDatabaseDiagnostics()).rejects.toThrow(ServiceUnavailableException);
  });

  it('throws a ServiceUnavailableException from health when the database probe fails', async () => {
    prisma.$queryRaw.mockRejectedValue(new Error('Database timeout'));

    await expect(service.getHealth()).rejects.toThrow(ServiceUnavailableException);
  });

  it('uses a generic error message when the database probe rejects with a non-Error value', async () => {
    prisma.$queryRaw.mockRejectedValue('timeout');

    await expect(service.getDatabaseDiagnostics()).rejects.toMatchObject({
      response: expect.objectContaining({
        error: 'Unknown database error.',
      }),
    });
  });
});
