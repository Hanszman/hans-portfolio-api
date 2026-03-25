import { DatabaseDiagnosticsController } from './database-diagnostics.controller';
import { DatabaseDiagnosticsService } from '../../services/database/database-diagnostics.service';

describe('DatabaseDiagnosticsController', () => {
  let controller: DatabaseDiagnosticsController;
  let service: jest.Mocked<
    Pick<DatabaseDiagnosticsService, 'getDatabaseDiagnostics'>
  >;

  beforeEach(() => {
    service = {
      getDatabaseDiagnostics: jest.fn(),
    };

    controller = new DatabaseDiagnosticsController(
      service as DatabaseDiagnosticsService,
    );
  });

  it('returns the database diagnostics response from the service', async () => {
    service.getDatabaseDiagnostics.mockResolvedValue({
      isConnected: true,
      probe: 'postgresql',
      databaseName: 'hans-portfolio-db',
      currentSchema: 'portfolio',
      serverVersion: 'PostgreSQL 17',
      executedAtUtc: '2026-03-24T20:15:00.000Z',
    });

    await expect(controller.getDatabaseDiagnostics()).resolves.toEqual({
      isConnected: true,
      probe: 'postgresql',
      databaseName: 'hans-portfolio-db',
      currentSchema: 'portfolio',
      serverVersion: 'PostgreSQL 17',
      executedAtUtc: '2026-03-24T20:15:00.000Z',
    });
  });
});
