import { HealthResponse } from './health.response';

type HealthChecksConstructor = {
  prototype: object;
  new (): { database: 'up' };
};

function expectMetadata(target: object, propertyKey: string): void {
  expect(Reflect.getMetadataKeys(target, propertyKey).length).toBeGreaterThan(
    0,
  );
}

describe('HealthResponse', () => {
  it('defines swagger metadata and accepts runtime assignment', () => {
    expectMetadata(HealthResponse.prototype, 'status');
    expectMetadata(HealthResponse.prototype, 'checks');
    expectMetadata(HealthResponse.prototype, 'checkedAtUtc');

    const checksType = Reflect.getMetadata(
      'design:type',
      HealthResponse.prototype,
      'checks',
    ) as HealthChecksConstructor;

    expectMetadata(checksType.prototype, 'database');

    const checks = Object.assign(new checksType(), {
      database: 'up' as const,
    });
    const instance = Object.assign(new HealthResponse(), {
      status: 'healthy' as const,
      checks,
      checkedAtUtc: '2026-03-24T22:15:00.000Z',
    });

    expect(instance.checks.database).toBe('up');
  });
});
