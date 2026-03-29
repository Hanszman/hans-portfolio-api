import { ContentMutationPayloadService } from './content-mutation-payload.service';

describe('ContentMutationPayloadService', () => {
  let service: ContentMutationPayloadService;

  beforeEach(() => {
    service = new ContentMutationPayloadService();
  });

  it('builds a project payload with nested relation creates', () => {
    const result = service.buildCreateData('projects', {
      slug: 'portfolio-remake',
      technologyRelations: [
        {
          technologyId: '11111111-1111-4111-8111-111111111111',
        },
      ],
      experienceIds: ['22222222-2222-4222-8222-222222222222'],
      tagIds: ['33333333-3333-4333-8333-333333333333'],
      linkIds: ['44444444-4444-4444-8444-444444444444'],
      imageAssetIds: ['55555555-5555-4555-8555-555555555555'],
    });

    expect(result).toMatchObject({
      slug: 'portfolio-remake',
      technologies: {
        create: [
          {
            technology: {
              connect: {
                id: '11111111-1111-4111-8111-111111111111',
              },
            },
          },
        ],
      },
      experiences: {
        create: [
          {
            sortOrder: 0,
            experience: {
              connect: {
                id: '22222222-2222-4222-8222-222222222222',
              },
            },
          },
        ],
      },
      tags: {
        create: [
          {
            tag: {
              connect: {
                id: '33333333-3333-4333-8333-333333333333',
              },
            },
          },
        ],
      },
      links: {
        create: [
          {
            sortOrder: 0,
            link: {
              connect: {
                id: '44444444-4444-4444-8444-444444444444',
              },
            },
          },
        ],
      },
      imageAssets: {
        create: [
          {
            sortOrder: 0,
            imageAsset: {
              connect: {
                id: '55555555-5555-4555-8555-555555555555',
              },
            },
          },
        ],
      },
    });
  });

  it('builds an experience payload with nested relation creates', () => {
    const result = service.buildCreateData('experiences', {
      slug: 'pagbank',
      projectIds: ['11111111-1111-4111-8111-111111111111'],
      customerIds: ['22222222-2222-4222-8222-222222222222'],
      jobIds: ['33333333-3333-4333-8333-333333333333'],
      linkIds: ['44444444-4444-4444-8444-444444444444'],
      imageAssetIds: ['55555555-5555-4555-8555-555555555555'],
    });

    expect(result).toMatchObject({
      projects: { create: [{ sortOrder: 0 }] },
      customers: { create: [{ sortOrder: 0 }] },
      jobs: { create: [{ sortOrder: 0 }] },
      links: { create: [{ sortOrder: 0 }] },
      imageAssets: { create: [{ sortOrder: 0 }] },
    });
  });

  it('builds a technology payload with inverse usage relations', () => {
    const result = service.buildCreateData('technologies', {
      slug: 'typescript',
      level: 'ADVANCED',
      frequency: 'FREQUENT',
      projectRelations: [
        {
          projectId: '11111111-1111-4111-8111-111111111111',
        },
      ],
      experienceRelations: [
        {
          experienceId: '22222222-2222-4222-8222-222222222222',
        },
      ],
      formationRelations: [
        {
          formationId: '33333333-3333-4333-8333-333333333333',
        },
      ],
      technologyContexts: [
        {
          context: 'PROFESSIONAL',
          startedAt: '2020-01-01',
          endedAt: '2023-02-01',
        },
        {
          context: 'PERSONAL',
          startedAt: '2024-01-01',
        },
      ],
      tagIds: ['44444444-4444-4444-8444-444444444444'],
      imageAssetIds: ['55555555-5555-4555-8555-555555555555'],
    });

    expect(result).toMatchObject({
      level: 'ADVANCED',
      frequency: 'FREQUENT',
      projectUsages: {
        create: [
          {
            project: {
              connect: {
                id: '11111111-1111-4111-8111-111111111111',
              },
            },
          },
        ],
      },
      experienceUses: {
        create: [
          {
            experience: {
              connect: {
                id: '22222222-2222-4222-8222-222222222222',
              },
            },
          },
        ],
      },
      formationUses: {
        create: [
          {
            formation: {
              connect: {
                id: '33333333-3333-4333-8333-333333333333',
              },
            },
          },
        ],
      },
      technologyContexts: {
        create: [
          {
            context: 'PROFESSIONAL',
            startedAt: '2020-01-01',
            endedAt: '2023-02-01',
          },
          {
            context: 'PERSONAL',
            startedAt: '2024-01-01',
            endedAt: undefined,
          },
        ],
      },
      tags: {
        create: [
          {
            tag: {
              connect: {
                id: '44444444-4444-4444-8444-444444444444',
              },
            },
          },
        ],
      },
      imageAssets: { create: [{ sortOrder: 0 }] },
    });
  });

  it('builds a formation payload with nested relations', () => {
    const result = service.buildCreateData('formations', {
      slug: 'college',
      linkIds: ['11111111-1111-4111-8111-111111111111'],
      imageAssetIds: ['22222222-2222-4222-8222-222222222222'],
    });

    expect(result).toMatchObject({
      links: { create: [{ sortOrder: 0 }] },
      imageAssets: { create: [{ sortOrder: 0 }] },
    });
  });

  it('builds a spoken language payload with image assets', () => {
    const result = service.buildCreateData('spokenLanguages', {
      code: 'en-US',
      imageAssetIds: ['11111111-1111-4111-8111-111111111111'],
    });

    expect(result).toMatchObject({
      imageAssets: { create: [{ sortOrder: 0 }] },
    });
  });

  it('builds customer and job payloads with ordered relations', () => {
    const customerResult = service.buildCreateData('customers', {
      slug: 'pagbank',
      experienceIds: ['11111111-1111-4111-8111-111111111111'],
      imageAssetIds: ['22222222-2222-4222-8222-222222222222'],
    });
    const jobResult = service.buildCreateData('jobs', {
      slug: 'frontend-engineer',
      experienceIds: ['33333333-3333-4333-8333-333333333333'],
      imageAssetIds: ['44444444-4444-4444-8444-444444444444'],
    });

    expect(customerResult).toMatchObject({
      experiences: { create: [{ sortOrder: 0 }] },
      imageAssets: { create: [{ sortOrder: 0 }] },
    });
    expect(jobResult).toMatchObject({
      experiences: { create: [{ sortOrder: 0 }] },
      imageAssets: { create: [{ sortOrder: 0 }] },
    });
  });

  it('builds a link payload with project, experience, and formation relations', () => {
    const result = service.buildCreateData('links', {
      url: 'https://example.com',
      projectIds: ['11111111-1111-4111-8111-111111111111'],
      experienceIds: ['22222222-2222-4222-8222-222222222222'],
      formationIds: ['33333333-3333-4333-8333-333333333333'],
    });

    expect(result).toMatchObject({
      projects: { create: [{ sortOrder: 0 }] },
      experiences: { create: [{ sortOrder: 0 }] },
      formations: { create: [{ sortOrder: 0 }] },
    });
  });

  it('builds an image asset payload with all supported inverse relations', () => {
    const result = service.buildCreateData('imageAssets', {
      fileName: 'asset.png',
      projectIds: ['11111111-1111-4111-8111-111111111111'],
      experienceIds: ['22222222-2222-4222-8222-222222222222'],
      formationIds: ['33333333-3333-4333-8333-333333333333'],
      technologyIds: ['44444444-4444-4444-8444-444444444444'],
      spokenLanguageIds: ['55555555-5555-4555-8555-555555555555'],
      customerIds: ['66666666-6666-4666-8666-666666666666'],
      jobIds: ['77777777-7777-4777-8777-777777777777'],
    });

    expect(result).toMatchObject({
      projects: { create: [{ sortOrder: 0 }] },
      experiences: { create: [{ sortOrder: 0 }] },
      formations: { create: [{ sortOrder: 0 }] },
      technologies: { create: [{ sortOrder: 0 }] },
      spokenLanguages: { create: [{ sortOrder: 0 }] },
      customers: { create: [{ sortOrder: 0 }] },
      jobs: { create: [{ sortOrder: 0 }] },
    });
  });

  it('builds a tag payload with project and technology relations', () => {
    const result = service.buildCreateData('tags', {
      slug: 'frontend',
      projectIds: ['11111111-1111-4111-8111-111111111111'],
      technologyIds: ['22222222-2222-4222-8222-222222222222'],
    });

    expect(result).toMatchObject({
      projects: {
        create: [
          {
            project: {
              connect: {
                id: '11111111-1111-4111-8111-111111111111',
              },
            },
          },
        ],
      },
      technologies: {
        create: [
          {
            technology: {
              connect: {
                id: '22222222-2222-4222-8222-222222222222',
              },
            },
          },
        ],
      },
    });
  });

  it('returns portfolio setting payloads unchanged', () => {
    const payload = {
      key: 'hero',
      value: { title: 'Victor Hanszman' },
    };

    expect(service.buildCreateData('portfolioSettings', payload)).toEqual(
      payload,
    );
  });

  it('replaces relation sets on update while keeping partial scalar updates', () => {
    const result = service.buildUpdateData('projects', {
      titlePt: 'Updated title',
      tagIds: ['11111111-1111-4111-8111-111111111111'],
      imageAssetIds: [],
    });

    expect(result).toEqual({
      titlePt: 'Updated title',
      tags: {
        deleteMany: {},
        create: [
          {
            tag: {
              connect: {
                id: '11111111-1111-4111-8111-111111111111',
              },
            },
          },
        ],
      },
      imageAssets: {
        deleteMany: {},
        create: [],
      },
    });
  });

  it('replaces non-ordered relation sets on update for tag mutations', () => {
    const result = service.buildUpdateData('tags', {
      technologyIds: ['22222222-2222-4222-8222-222222222222'],
    });

    expect(result).toEqual({
      technologies: {
        deleteMany: {},
        create: [
          {
            technology: {
              connect: {
                id: '22222222-2222-4222-8222-222222222222',
              },
            },
          },
        ],
      },
    });
  });

  it('replaces technology usage relation sets on update', () => {
    const result = service.buildUpdateData('projects', {
      technologyRelations: [
        {
          technologyId: '11111111-1111-4111-8111-111111111111',
        },
      ],
    });

    expect(result).toEqual({
      technologies: {
        deleteMany: {},
        create: [
          {
            technology: {
              connect: {
                id: '11111111-1111-4111-8111-111111111111',
              },
            },
          },
        ],
      },
    });
  });

  it('replaces technology contexts on update while keeping scalar technology fields partial', () => {
    const result = service.buildUpdateData('technologies', {
      frequency: 'OCCASIONAL',
      technologyContexts: [
        {
          context: 'PERSONAL',
          startedAt: '2024-01-01',
          endedAt: null,
        },
      ],
    });

    expect(result).toEqual({
      frequency: 'OCCASIONAL',
      technologyContexts: {
        deleteMany: {},
        create: [
          {
            context: 'PERSONAL',
            startedAt: '2024-01-01',
            endedAt: null,
          },
        ],
      },
    });
  });
});
