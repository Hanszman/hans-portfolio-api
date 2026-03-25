import { Test, TestingModule } from '@nestjs/testing';
import { PingService } from '../ping/ping.service';
import { SystemService } from './system.service';

describe('SystemService', () => {
  let service: SystemService;
  let pingService: jest.Mocked<Pick<PingService, 'getPing'>>;
  let moduleRef: TestingModule;

  beforeEach(async () => {
    pingService = {
      getPing: jest.fn(),
    };

    moduleRef = await Test.createTestingModule({
      providers: [
        SystemService,
        {
          provide: PingService,
          useValue: pingService,
        },
      ],
    }).compile();

    service = moduleRef.get(SystemService);
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  it('returns an overview of the system routes', () => {
    pingService.getPing.mockReturnValue({
      name: 'Hans Portfolio API',
      environment: 'test',
      status: 'ok',
      utcNow: '2026-03-24T20:15:00.000Z',
    });

    expect(service.getSystemOverview()).toEqual({
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
});
