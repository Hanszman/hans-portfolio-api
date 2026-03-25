import { Test, TestingModule } from '@nestjs/testing';
import { PingController } from './ping.controller';
import { PingService } from '../../services/ping/ping.service';

describe('PingController', () => {
  let controller: PingController;
  let service: jest.Mocked<Pick<PingService, 'getPing'>>;
  let moduleRef: TestingModule;

  beforeEach(async () => {
    service = {
      getPing: jest.fn(),
    };

    moduleRef = await Test.createTestingModule({
      controllers: [PingController],
      providers: [
        {
          provide: PingService,
          useValue: service,
        },
      ],
    }).compile();

    controller = moduleRef.get(PingController);
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  it('returns the root ping response from the service', () => {
    service.getPing.mockReturnValue({
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
