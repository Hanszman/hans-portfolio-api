import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthService } from '../../services/health/health.service';

describe('HealthController', () => {
  let controller: HealthController;
  let service: jest.Mocked<Pick<HealthService, 'getHealth'>>;
  let moduleRef: TestingModule;

  beforeEach(async () => {
    service = {
      getHealth: jest.fn(),
    };

    moduleRef = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthService,
          useValue: service,
        },
      ],
    }).compile();

    controller = moduleRef.get(HealthController);
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  it('returns the system health response from the service', async () => {
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
