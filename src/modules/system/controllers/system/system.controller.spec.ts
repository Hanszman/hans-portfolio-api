import { SystemController } from './system.controller';
import { SystemService } from '../../services/system/system.service';

describe('SystemController', () => {
  let controller: SystemController;
  let service: jest.Mocked<
    Pick<SystemService, 'getRootPing' | 'getSystemOverview'>
  >;

  beforeEach(() => {
    service = {
      getRootPing: jest.fn(),
      getSystemOverview: jest.fn(),
    };

    controller = new SystemController(service as unknown as SystemService);
  });

  it('returns the root ping response from the service', () => {
    service.getRootPing.mockReturnValue({
      name: 'Hans Portfolio API',
      environment: 'test',
      status: 'ok',
      utcNow: '2026-03-24T20:15:00.000Z',
    });

    expect(controller.getRootPing()).toEqual({
      name: 'Hans Portfolio API',
      environment: 'test',
      status: 'ok',
      utcNow: '2026-03-24T20:15:00.000Z',
    });
  });

  it('returns the system overview from the service', () => {
    service.getSystemOverview.mockReturnValue({
      name: 'Hans Portfolio API',
      module: 'system',
      status: 'operational',
      routes: ['/system/ping', '/system/database', '/system/health'],
    });

    expect(controller.getSystemOverview()).toEqual({
      name: 'Hans Portfolio API',
      module: 'system',
      status: 'operational',
      routes: ['/system/ping', '/system/database', '/system/health'],
    });
  });
});
