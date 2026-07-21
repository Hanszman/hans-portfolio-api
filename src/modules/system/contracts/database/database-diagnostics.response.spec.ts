import { DatabaseDiagnosticsResponse } from './database-diagnostics.response';

function expectMetadata(target: object, propertyKey: string): void {
  expect(Reflect.getMetadataKeys(target, propertyKey).length).toBeGreaterThan(
    0,
  );
}

describe('DatabaseDiagnosticsResponse', () => {
  it('defines swagger metadata and accepts runtime assignment', () => {
    expectMetadata(DatabaseDiagnosticsResponse.prototype, 'isConnected');
    expectMetadata(DatabaseDiagnosticsResponse.prototype, 'probe');
    expectMetadata(DatabaseDiagnosticsResponse.prototype, 'databaseName');
    expectMetadata(DatabaseDiagnosticsResponse.prototype, 'currentSchema');
    expectMetadata(DatabaseDiagnosticsResponse.prototype, 'serverVersion');
    expectMetadata(DatabaseDiagnosticsResponse.prototype, 'executedAtUtc');

    const instance = Object.assign(new DatabaseDiagnosticsResponse(), {
      isConnected: true,
      probe: 'postgresql',
      databaseName: 'hans-portfolio-db',
      currentSchema: 'portfolio',
      serverVersion: 'PostgreSQL 17.4',
      executedAtUtc: '2026-03-24T22:15:00.000Z',
    });

    expect(instance.isConnected).toBe(true);
  });
});
