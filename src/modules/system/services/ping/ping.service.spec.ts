import { PingService } from './ping.service';

describe('PingService', () => {
  let service: PingService;

  beforeEach(() => {
    service = new PingService();
  });

  it('returns the ping payload using environment metadata', () => {
    process.env.APP_NAME = 'Hans Portfolio API';
    process.env.NODE_ENV = 'test';

    const result = service.getPing();

    expect(result.name).toBe('Hans Portfolio API');
    expect(result.environment).toBe('test');
    expect(result.status).toBe('ok');
    expect(result.utcNow).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('falls back to default metadata when APP_NAME and NODE_ENV are missing', () => {
    delete process.env.APP_NAME;
    delete process.env.NODE_ENV;

    const result = service.getPing();

    expect(result.name).toBe('Hans Portfolio API');
    expect(result.environment).toBe('development');
  });
});
