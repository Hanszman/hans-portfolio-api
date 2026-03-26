import { Test } from '@nestjs/testing';
import { PrismaService } from '../../../../prisma/prisma.service';
import type { ContentFindManyArgs } from '../../types/content.types';
import { ContentResourceRegistryService } from '../content-resource-registry/content-resource-registry.service';
import { ContentReadService } from './content-read.service';

describe('ContentReadService', () => {
  let service: ContentReadService;
  let projectFindMany: jest.Mock<Promise<unknown[]>>;
  let projectFindFirst: jest.Mock<Promise<Record<string, unknown> | null>>;
  let spokenLanguageFindMany: jest.Mock<Promise<unknown[]>>;
  let spokenLanguageFindFirst: jest.Mock<
    Promise<Record<string, unknown> | null>
  >;

  beforeEach(async () => {
    projectFindMany = jest.fn<Promise<unknown[]>, []>();
    projectFindFirst = jest.fn<Promise<Record<string, unknown> | null>, []>();
    spokenLanguageFindMany = jest.fn<Promise<unknown[]>, []>();
    spokenLanguageFindFirst = jest.fn<
      Promise<Record<string, unknown> | null>,
      []
    >();

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
            spokenLanguage: {
              findMany: spokenLanguageFindMany,
              findFirst: spokenLanguageFindFirst,
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
  });

  it('lists spoken languages without a publication filter', async () => {
    spokenLanguageFindMany.mockResolvedValue([{ code: 'en' }]);

    const result = await service.getPublicCollection('spokenLanguages');

    expect(result).toEqual([{ code: 'en' }]);
    expect(spokenLanguageFindMany).toHaveBeenCalledWith({
      orderBy: [{ sortOrder: 'asc' }, { code: 'asc' }],
      include: undefined,
    });
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

  it('throws when the public item does not exist', async () => {
    projectFindFirst.mockResolvedValue(null);

    await expect(
      service.getPublicItem('projects', 'missing-project'),
    ).rejects.toThrow('Public projects item not found.');
  });
});
