import { HealthController } from './health.controller';
import { SystemDiagnosticsService } from '../services/system-diagnostics.service';

describe('HealthController', () => {
  let controller: HealthController;
  let service: jest.Mocked<Pick<SystemDiagnosticsService, 'getHealth'>>;

  beforeEach(() => {
    service = {
      getHealth: jest.fn(),
    };

    controller = new HealthController(
      service as unknown as SystemDiagnosticsService,
    );
  });

  it('returns the health response from the service', async () => {
    service.getHealth.mockResolvedValue({
      status: 'healthy',
      checks: {
        database: 'up',
      },
      checkedAtUtc: '2026-03-24T20:15:00.000Z',
    });

    await expect(controller.getSystemHealth()).resolves.toEqual({
      status: 'healthy',
      checks: {
        database: 'up',
      },
      checkedAtUtc: '2026-03-24T20:15:00.000Z',
    });
  });

  it('returns the health alias response from the service', async () => {
    service.getHealth.mockResolvedValue({
      status: 'healthy',
      checks: {
        database: 'up',
      },
      checkedAtUtc: '2026-03-24T20:15:00.000Z',
    });

    await expect(controller.getHealthAlias()).resolves.toEqual({
      status: 'healthy',
      checks: {
        database: 'up',
      },
      checkedAtUtc: '2026-03-24T20:15:00.000Z',
    });
  });
});
