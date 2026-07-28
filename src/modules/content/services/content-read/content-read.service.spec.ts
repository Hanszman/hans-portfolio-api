import { Test } from '@nestjs/testing';
import { PrismaService } from '../../../../prisma/prisma.service';
import type {
  ContentCountArgs,
  ContentFilterDefinition,
  ContentFindManyArgs,
} from '../../types/content.types';
import { ContentCollectionQueryRequest } from '../../contracts/shared/content-query.request';
import { ContentResourceRegistryService } from '../content-resource-registry/content-resource-registry.service';
import { TechnologyExperienceMetricsService } from '../technology-experience-metrics/technology-experience-metrics.service';
import { ContentReadService } from './content-read.service';

describe('ContentReadService', () => {
  let service: ContentReadService;
  let projectFindMany: jest.Mock<Promise<unknown[]>, [ContentFindManyArgs?]>;
  let projectFindFirst: jest.Mock<
    Promise<Record<string, unknown> | null>,
    [ContentFindManyArgs]
  >;
  let projectCount: jest.Mock<Promise<number>, [ContentCountArgs?]>;
  let experienceFindMany: jest.Mock<Promise<unknown[]>, [ContentFindManyArgs?]>;
  let experienceCount: jest.Mock<Promise<number>, [ContentCountArgs?]>;
  let technologyFindMany: jest.Mock<Promise<unknown[]>, [ContentFindManyArgs?]>;
  let technologyFindFirst: jest.Mock<
    Promise<Record<string, unknown> | null>,
    [ContentFindManyArgs]
  >;
  let technologyCount: jest.Mock<Promise<number>, [ContentCountArgs?]>;
  let formationFindMany: jest.Mock<Promise<unknown[]>, [ContentFindManyArgs?]>;
  let formationCount: jest.Mock<Promise<number>, [ContentCountArgs?]>;
  let spokenLanguageFindMany: jest.Mock<
    Promise<unknown[]>,
    [ContentFindManyArgs?]
  >;
  let spokenLanguageFindFirst: jest.Mock<
    Promise<Record<string, unknown> | null>,
    [ContentFindManyArgs]
  >;
  let spokenLanguageCount: jest.Mock<Promise<number>, [ContentCountArgs?]>;
  let customerFindMany: jest.Mock<Promise<unknown[]>, [ContentFindManyArgs?]>;
  let customerFindFirst: jest.Mock<
    Promise<Record<string, unknown> | null>,
    [ContentFindManyArgs]
  >;
  let customerCount: jest.Mock<Promise<number>, [ContentCountArgs?]>;
  let jobFindMany: jest.Mock<Promise<unknown[]>, [ContentFindManyArgs?]>;
  let jobCount: jest.Mock<Promise<number>, [ContentCountArgs?]>;

  const getFirstMockArgument = <TArg, TArgs extends [TArg?] = [TArg?]>(
    mockFn: jest.Mock<unknown, TArgs>,
  ): TArg => {
    const firstCall = mockFn.mock.calls[0];

    if (!firstCall) {
      throw new Error('Expected the mock to have been called at least once.');
    }

    const firstArgument = firstCall[0];

    if (firstArgument === undefined) {
      throw new Error('Expected the first mock call to receive an argument.');
    }

    return firstArgument;
  };

  beforeEach(async () => {
    projectFindMany = jest.fn<Promise<unknown[]>, [ContentFindManyArgs?]>();
    projectFindFirst = jest.fn<
      Promise<Record<string, unknown> | null>,
      [ContentFindManyArgs]
    >();
    projectCount = jest.fn<Promise<number>, [ContentCountArgs?]>();
    experienceFindMany = jest.fn<Promise<unknown[]>, [ContentFindManyArgs?]>();
    experienceCount = jest.fn<Promise<number>, [ContentCountArgs?]>();
    technologyFindMany = jest.fn<Promise<unknown[]>, [ContentFindManyArgs?]>();
    technologyFindFirst = jest.fn<
      Promise<Record<string, unknown> | null>,
      [ContentFindManyArgs]
    >();
    technologyCount = jest.fn<Promise<number>, [ContentCountArgs?]>();
    formationFindMany = jest.fn<Promise<unknown[]>, [ContentFindManyArgs?]>();
    formationCount = jest.fn<Promise<number>, [ContentCountArgs?]>();
    spokenLanguageFindMany = jest.fn<
      Promise<unknown[]>,
      [ContentFindManyArgs?]
    >();
    spokenLanguageFindFirst = jest.fn<
      Promise<Record<string, unknown> | null>,
      [ContentFindManyArgs]
    >();
    spokenLanguageCount = jest.fn<Promise<number>, [ContentCountArgs?]>();
    customerFindMany = jest.fn<Promise<unknown[]>, [ContentFindManyArgs?]>();
    customerFindFirst = jest.fn<
      Promise<Record<string, unknown> | null>,
      [ContentFindManyArgs]
    >();
    customerCount = jest.fn<Promise<number>, [ContentCountArgs?]>();
    jobFindMany = jest.fn<Promise<unknown[]>, [ContentFindManyArgs?]>();
    jobCount = jest.fn<Promise<number>, [ContentCountArgs?]>();

    const moduleRef = await Test.createTestingModule({
      providers: [
        ContentReadService,
        ContentResourceRegistryService,
        TechnologyExperienceMetricsService,
        {
          provide: PrismaService,
          useValue: {
            project: {
              findMany: projectFindMany,
              findFirst: projectFindFirst,
              count: projectCount,
            },
            experience: {
              findMany: experienceFindMany,
              findFirst: jest.fn(),
              count: experienceCount,
            },
            technology: {
              findMany: technologyFindMany,
              findFirst: technologyFindFirst,
              count: technologyCount,
            },
            formation: {
              findMany: formationFindMany,
              findFirst: jest.fn(),
              count: formationCount,
            },
            spokenLanguage: {
              findMany: spokenLanguageFindMany,
              findFirst: spokenLanguageFindFirst,
              count: spokenLanguageCount,
            },
            customer: {
              findMany: customerFindMany,
              findFirst: customerFindFirst,
              count: customerCount,
            },
            job: {
              findMany: jobFindMany,
              findFirst: jest.fn(),
              count: jobCount,
            },
          },
        },
      ],
    }).compile();

    service = moduleRef.get(ContentReadService);
  });

  it('lists projects with pagination, include, ordering and no publication filter', async () => {
    projectFindMany.mockResolvedValue([{ id: 'project-1' }]);
    projectCount.mockResolvedValue(25);

    const result = await service.getPublicCollection('projects', {
      page: 2,
      pageSize: 5,
    });
    const findManyArgs =
      getFirstMockArgument<ContentFindManyArgs>(projectFindMany);
    const countArgs = getFirstMockArgument<ContentCountArgs>(projectCount);

    expect(result).toEqual({
      data: [{ id: 'project-1' }],
      pagination: {
        page: 2,
        pageSize: 5,
        totalItems: 25,
        totalPages: 5,
        hasNextPage: true,
        hasPreviousPage: true,
      },
    });
    expect(findManyArgs.where).toBeUndefined();
    expect(findManyArgs.orderBy).toEqual([
      { sortOrder: 'asc' },
      { slug: 'asc' },
    ]);
    expect(findManyArgs.skip).toBe(5);
    expect(findManyArgs.take).toBe(5);
    expect(findManyArgs.include).toBeDefined();
    expect(findManyArgs.include).not.toBeNull();
    expect('technologies' in (findManyArgs.include ?? {})).toBe(true);
    expect(countArgs).toEqual({ where: undefined });
  });

  it('uses default pagination values and caps the page size at 100', async () => {
    projectFindMany.mockResolvedValue([{ id: 'project-1' }]);
    projectCount.mockResolvedValue(150);

    const defaultResult = await service.getPublicCollection('projects', {});
    const cappedResult = await service.getPublicCollection('projects', {
      pageSize: 500,
    });
    const firstCallArgs = projectFindMany.mock.calls[0]?.[0];
    const secondCallArgs = projectFindMany.mock.calls[1]?.[0];

    expect(defaultResult.pagination).toEqual({
      page: 1,
      pageSize: 12,
      totalItems: 150,
      totalPages: 13,
      hasNextPage: true,
      hasPreviousPage: false,
    });
    expect(cappedResult.pagination.pageSize).toBe(100);
    expect(firstCallArgs?.skip).toBe(0);
    expect(firstCallArgs?.take).toBe(12);
    expect(secondCallArgs?.take).toBe(100);
  });

  it('keeps experience and formation technology includes free from invalid join ordering', async () => {
    experienceFindMany.mockResolvedValue([{ id: 'experience-1' }]);
    experienceCount.mockResolvedValue(1);
    formationFindMany.mockResolvedValue([{ id: 'formation-1' }]);
    formationCount.mockResolvedValue(1);

    await service.getPublicCollection('experiences', {});
    await service.getPublicCollection('formations', {});

    const experienceArgs =
      getFirstMockArgument<ContentFindManyArgs>(experienceFindMany);
    const formationArgs =
      getFirstMockArgument<ContentFindManyArgs>(formationFindMany);

    expect(
      'orderBy' in
        ((experienceArgs.include as { technologies?: Record<string, unknown> })
          .technologies ?? {}),
    ).toBe(false);
    expect(
      'orderBy' in
        ((formationArgs.include as { technologies?: Record<string, unknown> })
          .technologies ?? {}),
    ).toBe(false);
  });

  it('enriches technology collections and items with experience metrics', async () => {
    technologyFindMany.mockResolvedValue([
      {
        id: 'technology-1',
        slug: 'typescript',
        technologyContexts: [
          {
            context: 'PERSONAL',
            startedAt: '2024-01-01',
            endedAt: '2024-03-01',
          },
        ],
      },
    ]);
    technologyCount.mockResolvedValue(1);
    technologyFindFirst.mockResolvedValue({
      slug: 'typescript',
      technologyContexts: [
        {
          context: 'PROFESSIONAL',
          startedAt: '2020-01-01',
          endedAt: '2024-04-01',
        },
      ],
    });

    const collectionResult = await service.getPublicCollection(
      'technologies',
      {},
    );
    const itemResult = (await service.getPublicItem(
      'technologies',
      'typescript',
    )) as {
      experienceMetrics: {
        total: {
          totalMonths: number;
          label: string;
        };
      };
    };
    const collectionArgs =
      getFirstMockArgument<ContentFindManyArgs>(technologyFindMany);
    const itemArgs =
      getFirstMockArgument<ContentFindManyArgs>(technologyFindFirst);

    expect((collectionResult.data[0] as { id: string }).id).toBe(
      'technology-1',
    );
    expect(itemResult.experienceMetrics.total).toEqual(
      expect.objectContaining({
        totalMonths: 51,
        label: '4 years 3 months',
      }),
    );
    expect(collectionArgs.where).toBeUndefined();
    expect(itemArgs.where).toEqual({ slug: 'typescript' });
  });

  it('supports spoken language and customer collections without publication filtering', async () => {
    spokenLanguageFindMany.mockResolvedValue([{ code: 'en' }]);
    spokenLanguageCount.mockResolvedValue(2);
    spokenLanguageFindFirst.mockResolvedValue({ code: 'en' });
    customerFindMany.mockResolvedValue([{ id: 'customer-1' }]);
    customerCount.mockResolvedValue(1);

    const spokenLanguagesResult = await service.getPublicCollection(
      'spokenLanguages',
      {},
    );
    const customerResult = await service.getPublicCollection('customers', {});
    const spokenLanguageItem = await service.getPublicItem(
      'spokenLanguages',
      'en',
    );
    const spokenLanguageArgs = getFirstMockArgument<ContentFindManyArgs>(
      spokenLanguageFindMany,
    );
    const customerArgs =
      getFirstMockArgument<ContentFindManyArgs>(customerFindMany);

    expect(spokenLanguagesResult.data).toEqual([{ code: 'en' }]);
    expect(customerResult.data).toEqual([{ id: 'customer-1' }]);
    expect(spokenLanguageItem).toEqual({ code: 'en' });
    expect(spokenLanguageArgs.where).toBeUndefined();
    expect(customerArgs.where).toBeUndefined();
    expect('imageAssets' in (customerArgs.include ?? {})).toBe(true);
  });

  it('throws when a public item does not exist', async () => {
    projectFindFirst.mockResolvedValue(null);

    await expect(
      service.getPublicItem('projects', 'missing-project'),
    ).rejects.toThrow('Public projects item not found.');
  });

  it('applies configured filters, search terms and custom ordering to collections', async () => {
    projectFindMany.mockResolvedValue([{ id: 'project-1' }]);
    projectCount.mockResolvedValue(1);
    technologyFindMany.mockResolvedValue([{ id: 'technology-1' }]);
    technologyCount.mockResolvedValue(1);

    await service.getPublicCollection('projects', {
      search: 'portfolio',
      context: 'PERSONAL',
      environment: 'FULLSTACK',
      featured: true,
      sortBy: 'titleEn',
      sortDirection: 'desc',
    });
    await service.getPublicCollection('technologies', {
      name: 'Type',
      category: 'LANGUAGE',
    });
    await service.getPublicCollection('projects', {
      sortBy: 'repositoryUrl',
      sortDirection: 'desc',
    });

    const filteredProjectArgs = projectFindMany.mock.calls[0]?.[0];
    const technologyArgs = technologyFindMany.mock.calls[0]?.[0];
    const fallbackProjectArgs = projectFindMany.mock.calls[1]?.[0];

    expect(filteredProjectArgs?.where).toEqual({
      context: 'PERSONAL',
      environment: 'FULLSTACK',
      featured: true,
      OR: [
        { slug: { contains: 'portfolio', mode: 'insensitive' } },
        { titlePt: { contains: 'portfolio', mode: 'insensitive' } },
        { titleEn: { contains: 'portfolio', mode: 'insensitive' } },
        {
          shortDescriptionPt: {
            contains: 'portfolio',
            mode: 'insensitive',
          },
        },
        {
          shortDescriptionEn: {
            contains: 'portfolio',
            mode: 'insensitive',
          },
        },
      ],
    });
    expect(filteredProjectArgs?.orderBy).toEqual([
      { titleEn: 'desc' },
      { sortOrder: 'asc' },
      { slug: 'asc' },
    ]);
    expect(technologyArgs?.where).toEqual({
      name: {
        contains: 'Type',
        mode: 'insensitive',
      },
      category: 'LANGUAGE',
    });
    expect(fallbackProjectArgs?.orderBy).toEqual([
      { sortOrder: 'asc' },
      { slug: 'asc' },
    ]);
  });

  it('returns undefined when an internal collection config has no filters or search fields', () => {
    const buildPublicWhere = (
      service as unknown as {
        buildPublicWhere(
          query: ContentCollectionQueryRequest,
          config: {
            searchFields?: string[];
            filterDefinitions?: ContentFilterDefinition[];
          },
        ): Record<string, unknown> | undefined;
      }
    ).buildPublicWhere.bind(service);

    expect(buildPublicWhere({}, {})).toBeUndefined();
  });
});
