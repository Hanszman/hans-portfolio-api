import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseDiagnosticsController } from './database-diagnostics.controller';
import { DatabaseDiagnosticsService } from '../../services/database/database-diagnostics.service';

describe('DatabaseDiagnosticsController', () => {
  let controller: DatabaseDiagnosticsController;
  let service: jest.Mocked<
    Pick<DatabaseDiagnosticsService, 'getDatabaseDiagnostics'>
  >;
  let moduleRef: TestingModule;

  beforeEach(async () => {
    service = {
      getDatabaseDiagnostics: jest.fn(),
    };

    moduleRef = await Test.createTestingModule({
      controllers: [DatabaseDiagnosticsController],
      providers: [
        {
          provide: DatabaseDiagnosticsService,
          useValue: service,
        },
      ],
    }).compile();

    controller = moduleRef.get(DatabaseDiagnosticsController);
  });

  afterEach(async () => {
    await moduleRef.close();
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
