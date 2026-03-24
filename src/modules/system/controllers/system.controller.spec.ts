import { SystemController } from './system.controller';
import { SystemDiagnosticsService } from '../services/system-diagnostics.service';

describe('SystemController', () => {
  let controller: SystemController;
  let service: jest.Mocked<Pick<SystemDiagnosticsService, 'getPing' | 'getDatabaseDiagnostics'>>;

  beforeEach(() => {
    service = {
      getPing: jest.fn(),
      getDatabaseDiagnostics: jest.fn(),
    };

    controller = new SystemController(service as unknown as SystemDiagnosticsService);
  });

  it('returns the ping response from the service', () => {
    service.getPing.mockReturnValue({
      name: 'Hans Portfolio API',
      environment: 'test',
      status: 'ok',
      utcNow: '2026-03-24T20:15:00.000Z',
    });

    expect(controller.getPing()).toEqual({
      name: 'Hans Portfolio API',
      environment: 'test',
      status: 'ok',
      utcNow: '2026-03-24T20:15:00.000Z',
    });
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
