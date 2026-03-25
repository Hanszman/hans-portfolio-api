import { PingController } from './ping.controller';
import { PingService } from '../../services/ping/ping.service';

describe('PingController', () => {
  let controller: PingController;
  let service: jest.Mocked<Pick<PingService, 'getPing'>>;

  beforeEach(() => {
    service = {
      getPing: jest.fn(),
    };

    controller = new PingController(service as PingService);
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
});
