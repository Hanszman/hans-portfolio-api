import { ContentResourceRegistryService } from './content-resource-registry.service';

describe('ContentResourceRegistryService', () => {
  let service: ContentResourceRegistryService;

  beforeEach(() => {
    service = new ContentResourceRegistryService();
  });

  it('returns the projects configuration with public slug lookup and admin dto classes', () => {
    const config = service.getConfig('projects');

    expect(config).toMatchObject({
      key: 'projects',
      routePath: 'projects',
      publicLookupField: 'slug',
      adminLookupParam: 'id',
      hasPublishedFlag: true,
      tag: 'Projects',
    });
    expect(config.createRequestDto.name).toBe('CreateProjectRequest');
    expect(config.updateRequestDto.name).toBe('UpdateProjectRequest');
  });

  it('returns all registered content resources', () => {
    const configs = service.getAllConfigs();

    expect(configs).toHaveLength(11);
    expect(configs.map((config) => config.key)).toEqual(
      expect.arrayContaining(['projects', 'technologies', 'portfolioSettings']),
    );
  });
});
