import { Test } from '@nestjs/testing';
import { PrismaService } from '../../../../prisma/prisma.service';
import type { ContentFindManyArgs } from '../../types/content.types';
import { ContentResourceRegistryService } from '../content-resource-registry/content-resource-registry.service';
import { ContentReadService } from './content-read.service';

describe('ContentReadService', () => {
  let service: ContentReadService;
  let projectFindMany: jest.Mock<Promise<unknown[]>>;
  let projectFindFirst: jest.Mock<Promise<Record<string, unknown> | null>>;
  let experienceFindMany: jest.Mock<Promise<unknown[]>>;
  let technologyFindMany: jest.Mock<Promise<unknown[]>>;
  let formationFindMany: jest.Mock<Promise<unknown[]>>;
  let spokenLanguageFindMany: jest.Mock<Promise<unknown[]>>;
  let spokenLanguageFindFirst: jest.Mock<
    Promise<Record<string, unknown> | null>
  >;
  let customerFindMany: jest.Mock<Promise<unknown[]>>;
  let jobFindMany: jest.Mock<Promise<unknown[]>>;

  beforeEach(async () => {
    projectFindMany = jest.fn<Promise<unknown[]>, []>();
    projectFindFirst = jest.fn<Promise<Record<string, unknown> | null>, []>();
    experienceFindMany = jest.fn<Promise<unknown[]>, []>();
    technologyFindMany = jest.fn<Promise<unknown[]>, []>();
    formationFindMany = jest.fn<Promise<unknown[]>, []>();
    spokenLanguageFindMany = jest.fn<Promise<unknown[]>, []>();
    spokenLanguageFindFirst = jest.fn<
      Promise<Record<string, unknown> | null>,
      []
    >();
    customerFindMany = jest.fn<Promise<unknown[]>, []>();
    jobFindMany = jest.fn<Promise<unknown[]>, []>();

    const moduleRef = await Test.createTestingModule({
      providers: [
        ContentReadService,
        ContentResourceRegistryService,
        {
          provide: PrismaService,
          useValue: {
            project: {
              findMany: projectFindMany,
              findFirst: projectFindFirst,
            },
            experience: {
              findMany: experienceFindMany,
              findFirst: jest.fn(),
            },
            technology: {
              findMany: technologyFindMany,
              findFirst: jest.fn(),
            },
            formation: {
              findMany: formationFindMany,
              findFirst: jest.fn(),
            },
            spokenLanguage: {
              findMany: spokenLanguageFindMany,
              findFirst: spokenLanguageFindFirst,
            },
            customer: {
              findMany: customerFindMany,
              findFirst: jest.fn(),
            },
            job: {
              findMany: jobFindMany,
              findFirst: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = moduleRef.get(ContentReadService);
  });

  it('lists only published projects with the configured include and ordering', async () => {
    projectFindMany.mockResolvedValue([{ id: 'project-1' }]);

    const result = await service.getPublicCollection('projects');
    const [findManyArgs] = projectFindMany.mock.calls[0] as [
      ContentFindManyArgs,
    ];

    expect(result).toEqual([{ id: 'project-1' }]);
    expect(findManyArgs.where).toEqual({ isPublished: true });
    expect(findManyArgs.orderBy).toEqual([
      { sortOrder: 'asc' },
      { slug: 'asc' },
    ]);
    expect(findManyArgs.include).toBeDefined();
    expect(findManyArgs.include).not.toBeNull();
    expect('technologies' in (findManyArgs.include ?? {})).toBe(true);
    expect(
      'orderBy' in
        ((findManyArgs.include as { technologies?: Record<string, unknown> })
          .technologies ?? {}),
    ).toBe(false);
  });

  it('lists published experiences without using an invalid sortOrder on the technology join table', async () => {
    experienceFindMany.mockResolvedValue([{ id: 'experience-1' }]);

    const result = await service.getPublicCollection('experiences');
    const [findManyArgs] = experienceFindMany.mock.calls[0] as [
      ContentFindManyArgs,
    ];

    expect(result).toEqual([{ id: 'experience-1' }]);
    expect(findManyArgs.where).toEqual({ isPublished: true });
    expect(
      'orderBy' in
        ((findManyArgs.include as { technologies?: Record<string, unknown> })
          .technologies ?? {}),
    ).toBe(false);
  });

  it('lists published technologies with image assets included for icon metadata', async () => {
    technologyFindMany.mockResolvedValue([{ id: 'technology-1' }]);

    const result = await service.getPublicCollection('technologies');
    const [findManyArgs] = technologyFindMany.mock.calls[0] as [
      ContentFindManyArgs,
    ];

    expect(result).toEqual([{ id: 'technology-1' }]);
    expect(findManyArgs.where).toEqual({ isPublished: true });
    expect(findManyArgs.include).toBeDefined();
    expect(findManyArgs.include).not.toBeNull();
    expect('imageAssets' in (findManyArgs.include ?? {})).toBe(true);
  });

  it('lists published formations without using an invalid sortOrder on the technology join table', async () => {
    formationFindMany.mockResolvedValue([{ id: 'formation-1' }]);

    const result = await service.getPublicCollection('formations');
    const [findManyArgs] = formationFindMany.mock.calls[0] as [
      ContentFindManyArgs,
    ];

    expect(result).toEqual([{ id: 'formation-1' }]);
    expect(findManyArgs.where).toEqual({ isPublished: true });
    expect(
      'orderBy' in
        ((findManyArgs.include as { technologies?: Record<string, unknown> })
          .technologies ?? {}),
    ).toBe(false);
  });

  it('lists spoken languages without a publication filter', async () => {
    spokenLanguageFindMany.mockResolvedValue([{ code: 'en' }]);

    const result = await service.getPublicCollection('spokenLanguages');
    const [findManyArgs] = spokenLanguageFindMany.mock.calls[0] as [
      ContentFindManyArgs,
    ];

    expect(result).toEqual([{ code: 'en' }]);
    expect(findManyArgs.orderBy).toEqual([
      { sortOrder: 'asc' },
      { code: 'asc' },
    ]);
    expect(findManyArgs.include).toBeDefined();
    expect(findManyArgs.include).not.toBeNull();
    expect('imageAssets' in (findManyArgs.include ?? {})).toBe(true);
  });

  it('returns a published project item by slug', async () => {
    projectFindFirst.mockResolvedValue({ slug: 'portfolio-remake' });

    const result = await service.getPublicItem('projects', 'portfolio-remake');
    const [findFirstArgs] = projectFindFirst.mock.calls[0] as [
      ContentFindManyArgs,
    ];

    expect(result).toEqual({ slug: 'portfolio-remake' });
    expect(findFirstArgs.where).toEqual({
      slug: 'portfolio-remake',
      isPublished: true,
    });
  });

  it('returns a spoken language item without a publication filter', async () => {
    spokenLanguageFindFirst.mockResolvedValue({ code: 'en' });

    const result = await service.getPublicItem('spokenLanguages', 'en');
    const [findFirstArgs] = spokenLanguageFindFirst.mock.calls[0] as [
      ContentFindManyArgs,
    ];

    expect(result).toEqual({ code: 'en' });
    expect(findFirstArgs.where).toEqual({
      code: 'en',
    });
  });

  it('lists published customers with image assets included', async () => {
    customerFindMany.mockResolvedValue([{ id: 'customer-1' }]);

    const result = await service.getPublicCollection('customers');
    const [findManyArgs] = customerFindMany.mock.calls[0] as [
      ContentFindManyArgs,
    ];

    expect(result).toEqual([{ id: 'customer-1' }]);
    expect(findManyArgs.where).toEqual({ isPublished: true });
    expect('imageAssets' in (findManyArgs.include ?? {})).toBe(true);
  });

  it('lists published jobs with image assets included', async () => {
    jobFindMany.mockResolvedValue([{ id: 'job-1' }]);

    const result = await service.getPublicCollection('jobs');
    const [findManyArgs] = jobFindMany.mock.calls[0] as [ContentFindManyArgs];

    expect(result).toEqual([{ id: 'job-1' }]);
    expect(findManyArgs.where).toEqual({ isPublished: true });
    expect('imageAssets' in (findManyArgs.include ?? {})).toBe(true);
  });

  it('throws when the public item does not exist', async () => {
    projectFindFirst.mockResolvedValue(null);

    await expect(
      service.getPublicItem('projects', 'missing-project'),
    ).rejects.toThrow('Public projects item not found.');
  });
});
