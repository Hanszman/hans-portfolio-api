import { SystemResponse } from './system.response';

function expectMetadata(target: object, propertyKey: string): void {
  expect(Reflect.getMetadataKeys(target, propertyKey).length).toBeGreaterThan(
    0,
  );
}

describe('SystemResponse', () => {
  it('defines swagger metadata and accepts runtime assignment', () => {
    expectMetadata(SystemResponse.prototype, 'name');
    expectMetadata(SystemResponse.prototype, 'module');
    expectMetadata(SystemResponse.prototype, 'status');
    expectMetadata(SystemResponse.prototype, 'routes');

    const instance = Object.assign(new SystemResponse(), {
      name: 'Hans Portfolio API',
      module: 'system' as const,
      status: 'operational' as const,
      routes: ['/system/ping'],
    });

    expect(instance.routes).toEqual(['/system/ping']);
  });
});
