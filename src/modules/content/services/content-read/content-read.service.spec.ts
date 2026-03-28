import { Test } from '@nestjs/testing';
import { PrismaService } from '../../../../prisma/prisma.service';
import type {
  ContentCountArgs,
  ContentFilterDefinition,
  ContentFindManyArgs,
} from '../../types/content.types';
import { ContentCollectionQueryRequest } from '../../contracts/shared/content-query.request';
import { ContentResourceRegistryService } from '../content-resource-registry/content-resource-registry.service';
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
    customerCount = jest.fn<Promise<number>, [ContentCountArgs?]>();
    jobFindMany = jest.fn<Promise<unknown[]>, [ContentFindManyArgs?]>();
    jobCount = jest.fn<Promise<number>, [ContentCountArgs?]>();

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
              count: projectCount,
            },
            experience: {
              findMany: experienceFindMany,
              findFirst: jest.fn(),
              count: experienceCount,
            },
            technology: {
              findMany: technologyFindMany,
              findFirst: jest.fn(),
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
              findFirst: jest.fn(),
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

  it('lists only published projects with pagination, include, and ordering', async () => {
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
    expect(findManyArgs.where).toEqual({ isPublished: true });
    expect(findManyArgs.orderBy).toEqual([
      { sortOrder: 'asc' },
      { slug: 'asc' },
    ]);
    expect(findManyArgs.skip).toBe(5);
    expect(findManyArgs.take).toBe(5);
    expect(findManyArgs.include).toBeDefined();
    expect(findManyArgs.include).not.toBeNull();
    expect('technologies' in (findManyArgs.include ?? {})).toBe(true);
    expect(
      'orderBy' in
        ((findManyArgs.include as { technologies?: Record<string, unknown> })
          .technologies ?? {}),
    ).toBe(false);
    expect(countArgs).toEqual({
      where: { isPublished: true },
    });
  });

  it('uses default pagination values when query parameters are missing', async () => {
    projectFindMany.mockResolvedValue([{ id: 'project-1' }]);
    projectCount.mockResolvedValue(1);

    const result = await service.getPublicCollection('projects', {});
    const findManyArgs =
      getFirstMockArgument<ContentFindManyArgs>(projectFindMany);

    expect(result.pagination).toEqual({
      page: 1,
      pageSize: 12,
      totalItems: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    });
    expect(findManyArgs.skip).toBe(0);
    expect(findManyArgs.take).toBe(12);
  });

  it('caps the collection page size at 100', async () => {
    projectFindMany.mockResolvedValue([{ id: 'project-1' }]);
    projectCount.mockResolvedValue(150);

    const result = await service.getPublicCollection('projects', {
      pageSize: 500,
    });
    const findManyArgs =
      getFirstMockArgument<ContentFindManyArgs>(projectFindMany);

    expect(result.pagination.pageSize).toBe(100);
    expect(findManyArgs.take).toBe(100);
  });

  it('lists published experiences without using an invalid sortOrder on the technology join table', async () => {
    experienceFindMany.mockResolvedValue([{ id: 'experience-1' }]);
    experienceCount.mockResolvedValue(1);

    const result = await service.getPublicCollection('experiences', {});
    const findManyArgs =
      getFirstMockArgument<ContentFindManyArgs>(experienceFindMany);

    expect(result.data).toEqual([{ id: 'experience-1' }]);
    expect(findManyArgs.where).toEqual({ isPublished: true });
    expect(
      'orderBy' in
        ((findManyArgs.include as { technologies?: Record<string, unknown> })
          .technologies ?? {}),
    ).toBe(false);
  });

  it('lists published technologies with image assets included for icon metadata', async () => {
    technologyFindMany.mockResolvedValue([{ id: 'technology-1' }]);
    technologyCount.mockResolvedValue(1);

    const result = await service.getPublicCollection('technologies', {});
    const findManyArgs =
      getFirstMockArgument<ContentFindManyArgs>(technologyFindMany);

    expect(result.data).toEqual([{ id: 'technology-1' }]);
    expect(findManyArgs.where).toEqual({ isPublished: true });
    expect(findManyArgs.include).toBeDefined();
    expect(findManyArgs.include).not.toBeNull();
    expect('imageAssets' in (findManyArgs.include ?? {})).toBe(true);
  });

  it('lists published formations without using an invalid sortOrder on the technology join table', async () => {
    formationFindMany.mockResolvedValue([{ id: 'formation-1' }]);
    formationCount.mockResolvedValue(1);

    const result = await service.getPublicCollection('formations', {});
    const findManyArgs =
      getFirstMockArgument<ContentFindManyArgs>(formationFindMany);

    expect(result.data).toEqual([{ id: 'formation-1' }]);
    expect(findManyArgs.where).toEqual({ isPublished: true });
    expect(
      'orderBy' in
        ((findManyArgs.include as { technologies?: Record<string, unknown> })
          .technologies ?? {}),
    ).toBe(false);
  });

  it('lists spoken languages without a publication filter', async () => {
    spokenLanguageFindMany.mockResolvedValue([{ code: 'en' }]);
    spokenLanguageCount.mockResolvedValue(2);

    const result = await service.getPublicCollection('spokenLanguages', {});
    const findManyArgs = getFirstMockArgument<ContentFindManyArgs>(
      spokenLanguageFindMany,
    );
    const countArgs =
      getFirstMockArgument<ContentCountArgs>(spokenLanguageCount);

    expect(result.data).toEqual([{ code: 'en' }]);
    expect(findManyArgs.orderBy).toEqual([
      { sortOrder: 'asc' },
      { code: 'asc' },
    ]);
    expect(findManyArgs.include).toBeDefined();
    expect(findManyArgs.include).not.toBeNull();
    expect('imageAssets' in (findManyArgs.include ?? {})).toBe(true);
    expect(countArgs).toEqual({
      where: undefined,
    });
  });

  it('returns a published project item by slug', async () => {
    projectFindFirst.mockResolvedValue({ slug: 'portfolio-remake' });

    const result = await service.getPublicItem('projects', 'portfolio-remake');
    const findFirstArgs =
      getFirstMockArgument<ContentFindManyArgs>(projectFindFirst);

    expect(result).toEqual({ slug: 'portfolio-remake' });
    expect(findFirstArgs.where).toEqual({
      slug: 'portfolio-remake',
      isPublished: true,
    });
  });

  it('returns a spoken language item without a publication filter', async () => {
    spokenLanguageFindFirst.mockResolvedValue({ code: 'en' });

    const result = await service.getPublicItem('spokenLanguages', 'en');
    const findFirstArgs = getFirstMockArgument<ContentFindManyArgs>(
      spokenLanguageFindFirst,
    );

    expect(result).toEqual({ code: 'en' });
    expect(findFirstArgs.where).toEqual({
      code: 'en',
    });
  });

  it('lists published customers with image assets included', async () => {
    customerFindMany.mockResolvedValue([{ id: 'customer-1' }]);
    customerCount.mockResolvedValue(1);

    const result = await service.getPublicCollection('customers', {});
    const findManyArgs =
      getFirstMockArgument<ContentFindManyArgs>(customerFindMany);

    expect(result.data).toEqual([{ id: 'customer-1' }]);
    expect(findManyArgs.where).toEqual({ isPublished: true });
    expect('imageAssets' in (findManyArgs.include ?? {})).toBe(true);
  });

  it('lists published jobs with image assets included', async () => {
    jobFindMany.mockResolvedValue([{ id: 'job-1' }]);
    jobCount.mockResolvedValue(1);

    const result = await service.getPublicCollection('jobs', {});
    const findManyArgs = getFirstMockArgument<ContentFindManyArgs>(jobFindMany);

    expect(result.data).toEqual([{ id: 'job-1' }]);
    expect(findManyArgs.where).toEqual({ isPublished: true });
    expect('imageAssets' in (findManyArgs.include ?? {})).toBe(true);
  });

  it('throws when the public item does not exist', async () => {
    projectFindFirst.mockResolvedValue(null);

    await expect(
      service.getPublicItem('projects', 'missing-project'),
    ).rejects.toThrow('Public projects item not found.');
  });

  it('applies configured project filters and search terms to public collections', async () => {
    projectFindMany.mockResolvedValue([{ id: 'project-1' }]);
    projectCount.mockResolvedValue(1);

    await service.getPublicCollection('projects', {
      search: 'portfolio',
      context: 'PERSONAL',
      environment: 'FULLSTACK',
      featured: true,
    });
    const findManyArgs =
      getFirstMockArgument<ContentFindManyArgs>(projectFindMany);
    const countArgs = getFirstMockArgument<ContentCountArgs>(projectCount);

    expect(findManyArgs.where).toEqual({
      isPublished: true,
      context: 'PERSONAL',
      environment: 'FULLSTACK',
      featured: true,
      OR: [
        {
          slug: {
            contains: 'portfolio',
            mode: 'insensitive',
          },
        },
        {
          titlePt: {
            contains: 'portfolio',
            mode: 'insensitive',
          },
        },
        {
          titleEn: {
            contains: 'portfolio',
            mode: 'insensitive',
          },
        },
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
    expect(countArgs).toEqual({
      where: findManyArgs.where,
    });
  });

  it('applies contains filters to technology collections', async () => {
    technologyFindMany.mockResolvedValue([{ id: 'technology-1' }]);
    technologyCount.mockResolvedValue(1);

    await service.getPublicCollection('technologies', {
      name: 'Type',
      category: 'LANGUAGE',
    });
    const findManyArgs =
      getFirstMockArgument<ContentFindManyArgs>(technologyFindMany);

    expect(findManyArgs.where).toEqual({
      isPublished: true,
      name: {
        contains: 'Type',
        mode: 'insensitive',
      },
      category: 'LANGUAGE',
    });
  });

  it('returns undefined when an internal collection config has no publication flag, filters, or search fields', () => {
    const buildPublicWhere = (
      service as unknown as {
        buildPublicWhere(
          query: ContentCollectionQueryRequest,
          config: {
            hasPublishedFlag: boolean;
            searchFields?: string[];
            filterDefinitions?: ContentFilterDefinition[];
          },
        ): Record<string, unknown> | undefined;
      }
    ).buildPublicWhere.bind(service);

    expect(buildPublicWhere({}, { hasPublishedFlag: false })).toBeUndefined();
  });
});
