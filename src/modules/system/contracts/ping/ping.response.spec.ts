import { PingResponse } from './ping.response';

function expectMetadata(target: object, propertyKey: string): void {
  expect(Reflect.getMetadataKeys(target, propertyKey).length).toBeGreaterThan(
    0,
  );
}

describe('PingResponse', () => {
  it('defines swagger metadata and accepts runtime assignment', () => {
    expectMetadata(PingResponse.prototype, 'name');
    expectMetadata(PingResponse.prototype, 'environment');
    expectMetadata(PingResponse.prototype, 'status');
    expectMetadata(PingResponse.prototype, 'utcNow');

    const instance = Object.assign(new PingResponse(), {
      name: 'Hans Portfolio API',
      environment: 'development',
      status: 'ok' as const,
      utcNow: '2026-03-24T22:15:00.000Z',
    });

    expect(instance.status).toBe('ok');
  });
});
