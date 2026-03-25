import { PingService } from '../ping/ping.service';
import { SystemService } from './system.service';

describe('SystemService', () => {
  let service: SystemService;
  let pingService: jest.Mocked<Pick<PingService, 'getPing'>>;

  beforeEach(() => {
    pingService = {
      getPing: jest.fn(),
    };

    service = new SystemService(pingService as PingService);
  });

  it('returns the root ping from the PingService', () => {
    pingService.getPing.mockReturnValue({
      name: 'Hans Portfolio API',
      environment: 'test',
      status: 'ok',
      utcNow: '2026-03-24T20:15:00.000Z',
    });

    expect(service.getRootPing()).toEqual({
      name: 'Hans Portfolio API',
      environment: 'test',
      status: 'ok',
      utcNow: '2026-03-24T20:15:00.000Z',
    });
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
