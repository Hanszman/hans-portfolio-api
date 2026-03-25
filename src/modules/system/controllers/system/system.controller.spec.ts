import { Test, TestingModule } from '@nestjs/testing';
import { SystemController } from './system.controller';
import { SystemService } from '../../services/system/system.service';

describe('SystemController', () => {
  let controller: SystemController;
  let service: jest.Mocked<Pick<SystemService, 'getSystemOverview'>>;
  let moduleRef: TestingModule;

  beforeEach(async () => {
    service = {
      getSystemOverview: jest.fn(),
    };

    moduleRef = await Test.createTestingModule({
      controllers: [SystemController],
      providers: [
        {
          provide: SystemService,
          useValue: service,
        },
      ],
    }).compile();

    controller = moduleRef.get(SystemController);
  });

  afterEach(async () => {
    await moduleRef.close();
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
