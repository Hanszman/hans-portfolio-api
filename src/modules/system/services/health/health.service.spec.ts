import { HealthService } from './health.service';
import { DatabaseDiagnosticsService } from '../database/database-diagnostics.service';

describe('HealthService', () => {
  let service: HealthService;
  let databaseDiagnosticsService: jest.Mocked<
    Pick<DatabaseDiagnosticsService, 'getDatabaseDiagnostics'>
  >;

  beforeEach(() => {
    databaseDiagnosticsService = {
      getDatabaseDiagnostics: jest.fn(),
    };

    service = new HealthService(
      databaseDiagnosticsService as DatabaseDiagnosticsService,
    );
  });

  it('returns a healthy payload when the database probe succeeds', async () => {
    databaseDiagnosticsService.getDatabaseDiagnostics.mockResolvedValue({
      isConnected: true,
      probe: 'postgresql',
      databaseName: 'hans-portfolio-db',
      currentSchema: 'portfolio',
      serverVersion: 'PostgreSQL 17',
      executedAtUtc: '2026-03-24T20:15:00.000Z',
    });

    const result = await service.getHealth();

    expect(result.status).toBe('healthy');
    expect(result.checks.database).toBe('up');
    expect(result.checkedAtUtc).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('rethrows the database error when the probe fails', async () => {
    databaseDiagnosticsService.getDatabaseDiagnostics.mockRejectedValue(
      new Error('Database timeout'),
    );

    await expect(service.getHealth()).rejects.toThrow('Database timeout');
  });
});
