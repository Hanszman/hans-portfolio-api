import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import {
  TechnologyCategory,
  TechnologyLevel,
  TechnologyUsageContext,
  TechnologyUsageFrequency,
} from '@prisma/client';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ContentReadService } from '../content-read/content-read.service';
import { TechnologyContextsService } from './technology-contexts.service';

describe('TechnologyContextsService', () => {
  let service: TechnologyContextsService;
  let prismaService: {
    technologyContext: {
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };
  let contentReadService: {
    getPublicCollection: jest.Mock;
    getPublicItem: jest.Mock;
  };

  beforeEach(async () => {
    prismaService = {
      technologyContext: {
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };
    contentReadService = {
      getPublicCollection: jest.fn(),
      getPublicItem: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        TechnologyContextsService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
        {
          provide: ContentReadService,
          useValue: contentReadService,
        },
      ],
    }).compile();

    service = moduleRef.get(TechnologyContextsService);
  });

  it('returns grouped public technology contexts through the technologies collection abstraction', async () => {
    contentReadService.getPublicCollection.mockResolvedValue({
      data: [
        {
          id: 'technology-1',
          slug: 'typescript',
          name: 'TypeScript',
          category: TechnologyCategory.LANGUAGE,
          level: TechnologyLevel.ADVANCED,
          frequency: TechnologyUsageFrequency.FREQUENT,
          technologyContexts: [
            {
              id: 'context-1',
              context: TechnologyUsageContext.PROFESSIONAL,
              startedAt: '2020-01-01',
              endedAt: '2024-04-01',
            },
          ],
          experienceMetrics: {
            total: {
              totalMonths: 52,
              years: 4,
              months: 4,
              label: '4 years 4 months',
              startedAt: '2020-01-01',
              endedAt: '2024-04-01',
            },
            byContext: {
              PROFESSIONAL: {
                totalMonths: 52,
                years: 4,
                months: 4,
                label: '4 years 4 months',
                startedAt: '2020-01-01',
                endedAt: '2024-04-01',
              },
              PERSONAL: {
                totalMonths: 0,
                years: 0,
                months: 0,
                label: '0 months',
                startedAt: null,
                endedAt: null,
              },
              ACADEMIC: {
                totalMonths: 0,
                years: 0,
                months: 0,
                label: '0 months',
                startedAt: null,
                endedAt: null,
              },
              STUDY: {
                totalMonths: 0,
                years: 0,
                months: 0,
                label: '0 months',
                startedAt: null,
                endedAt: null,
              },
            },
          },
        },
      ],
      pagination: {
        page: 1,
        pageSize: 12,
        totalItems: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    });

    const result = await service.getPublicCollection({
      page: 1,
      pageSize: 12,
      highlight: true,
    });

    expect(contentReadService.getPublicCollection).toHaveBeenCalledWith(
      'technologies',
      {
        page: 1,
        pageSize: 12,
        highlight: true,
      },
    );
    expect(result.pagination).toEqual({
      page: 1,
      pageSize: 12,
      totalItems: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    });
    expect(result.data).toHaveLength(1);
    expect(result.data[0]).toEqual(
      expect.objectContaining({
        technologyId: 'technology-1',
        slug: 'typescript',
        name: 'TypeScript',
        category: TechnologyCategory.LANGUAGE,
        level: TechnologyLevel.ADVANCED,
        frequency: TechnologyUsageFrequency.FREQUENT,
        technologyContexts: [
          {
            id: 'context-1',
            context: TechnologyUsageContext.PROFESSIONAL,
            startedAt: '2020-01-01',
            endedAt: '2024-04-01',
          },
        ],
      }),
    );
    const [firstItem] = result.data as Array<{
      experienceMetrics: {
        total: {
          totalMonths: number;
        };
      };
    }>;
    expect(firstItem?.experienceMetrics.total.totalMonths).toBe(52);
  });

  it('returns one grouped public technology context item by technology slug', async () => {
    contentReadService.getPublicItem.mockResolvedValue({
      id: 'technology-1',
      slug: 'typescript',
      name: 'TypeScript',
      category: TechnologyCategory.LANGUAGE,
      level: TechnologyLevel.ADVANCED,
      frequency: TechnologyUsageFrequency.FREQUENT,
      technologyContexts: [
        {
          id: 'context-1',
          context: TechnologyUsageContext.PROFESSIONAL,
          startedAt: '2020-01-01',
          endedAt: '2024-04-01',
        },
      ],
      experienceMetrics: {
        total: {
          totalMonths: 52,
          years: 4,
          months: 4,
          label: '4 years 4 months',
          startedAt: '2020-01-01',
          endedAt: '2024-04-01',
        },
        byContext: {
          PROFESSIONAL: {
            totalMonths: 52,
            years: 4,
            months: 4,
            label: '4 years 4 months',
            startedAt: '2020-01-01',
            endedAt: '2024-04-01',
          },
          PERSONAL: {
            totalMonths: 0,
            years: 0,
            months: 0,
            label: '0 months',
            startedAt: null,
            endedAt: null,
          },
          ACADEMIC: {
            totalMonths: 0,
            years: 0,
            months: 0,
            label: '0 months',
            startedAt: null,
            endedAt: null,
          },
          STUDY: {
            totalMonths: 0,
            years: 0,
            months: 0,
            label: '0 months',
            startedAt: null,
            endedAt: null,
          },
        },
      },
    });

    await expect(service.getPublicItem('typescript')).resolves.toEqual(
      expect.objectContaining({
        technologyId: 'technology-1',
        slug: 'typescript',
      }),
    );
    expect(contentReadService.getPublicItem).toHaveBeenCalledWith(
      'technologies',
      'typescript',
    );
  });

  it('falls back to the root id and an empty contexts array when the content read item has no grouped aliases yet', async () => {
    contentReadService.getPublicItem.mockResolvedValue({
      id: 'technology-2',
      slug: 'nestjs',
      name: 'NestJS',
      category: TechnologyCategory.FRAMEWORK,
      level: null,
      frequency: null,
      experienceMetrics: {
        total: {
          totalMonths: 0,
          years: 0,
          months: 0,
          label: '0 months',
          startedAt: null,
          endedAt: null,
        },
        byContext: {
          PROFESSIONAL: {
            totalMonths: 0,
            years: 0,
            months: 0,
            label: '0 months',
            startedAt: null,
            endedAt: null,
          },
          PERSONAL: {
            totalMonths: 0,
            years: 0,
            months: 0,
            label: '0 months',
            startedAt: null,
            endedAt: null,
          },
          ACADEMIC: {
            totalMonths: 0,
            years: 0,
            months: 0,
            label: '0 months',
            startedAt: null,
            endedAt: null,
          },
          STUDY: {
            totalMonths: 0,
            years: 0,
            months: 0,
            label: '0 months',
            startedAt: null,
            endedAt: null,
          },
        },
      },
    });

    await expect(service.getPublicItem('nestjs')).resolves.toEqual(
      expect.objectContaining({
        technologyId: 'technology-2',
        technologyContexts: [],
      }),
    );
  });

  it('keeps the explicit technologyId when the grouped payload already provides it', async () => {
    contentReadService.getPublicItem.mockResolvedValue({
      technologyId: 'technology-1',
      id: 'technology-legacy-id',
      slug: 'typescript',
      name: 'TypeScript',
      category: TechnologyCategory.LANGUAGE,
      level: TechnologyLevel.ADVANCED,
      frequency: TechnologyUsageFrequency.FREQUENT,
      technologyContexts: [],
      experienceMetrics: {
        total: {
          totalMonths: 0,
          years: 0,
          months: 0,
          label: '0 months',
          startedAt: null,
          endedAt: null,
        },
        byContext: {
          PROFESSIONAL: {
            totalMonths: 0,
            years: 0,
            months: 0,
            label: '0 months',
            startedAt: null,
            endedAt: null,
          },
          PERSONAL: {
            totalMonths: 0,
            years: 0,
            months: 0,
            label: '0 months',
            startedAt: null,
            endedAt: null,
          },
          ACADEMIC: {
            totalMonths: 0,
            years: 0,
            months: 0,
            label: '0 months',
            startedAt: null,
            endedAt: null,
          },
          STUDY: {
            totalMonths: 0,
            years: 0,
            months: 0,
            label: '0 months',
            startedAt: null,
            endedAt: null,
          },
        },
      },
    });

    await expect(service.getPublicItem('typescript')).resolves.toEqual(
      expect.objectContaining({
        technologyId: 'technology-1',
      }),
    );
  });

  it('throws when the mapped public item is not an object', async () => {
    contentReadService.getPublicItem.mockResolvedValue(null);

    await expect(service.getPublicItem('typescript')).rejects.toThrow(
      new NotFoundException('Technology context group was not found.'),
    );
  });

  it('creates a technology context record', async () => {
    prismaService.technologyContext.create.mockResolvedValue({
      id: 'context-1',
      technologyId: 'technology-1',
      context: TechnologyUsageContext.PROFESSIONAL,
      startedAt: '2020-01-01',
      endedAt: '2024-04-01',
      technology: {
        id: 'technology-1',
        slug: 'typescript',
        name: 'TypeScript',
        category: TechnologyCategory.LANGUAGE,
        level: TechnologyLevel.ADVANCED,
        frequency: TechnologyUsageFrequency.FREQUENT,
      },
    });

    await expect(
      service.create({
        technologyId: 'technology-1',
        context: TechnologyUsageContext.PROFESSIONAL,
        startedAt: '2020-01-01',
        endedAt: '2024-04-01',
      }),
    ).resolves.toEqual(
      expect.objectContaining({
        id: 'context-1',
        technologyId: 'technology-1',
      }),
    );

    expect(prismaService.technologyContext.create).toHaveBeenCalledWith({
      data: {
        technology: {
          connect: {
            id: 'technology-1',
          },
        },
        context: TechnologyUsageContext.PROFESSIONAL,
        startedAt: '2020-01-01',
        endedAt: '2024-04-01',
      },
      include: {
        technology: {
          select: {
            id: true,
            slug: true,
            name: true,
            category: true,
            level: true,
            frequency: true,
          },
        },
      },
    });
  });

  it('defaults endedAt to null when creating an open-ended technology context', async () => {
    prismaService.technologyContext.create.mockResolvedValue({
      id: 'context-2',
      technologyId: 'technology-1',
      context: TechnologyUsageContext.STUDY,
      startedAt: '2025-01-01',
      endedAt: null,
      technology: {
        id: 'technology-1',
        slug: 'typescript',
        name: 'TypeScript',
        category: TechnologyCategory.LANGUAGE,
        level: TechnologyLevel.ADVANCED,
        frequency: TechnologyUsageFrequency.FREQUENT,
      },
    });

    await service.create({
      technologyId: 'technology-1',
      context: TechnologyUsageContext.STUDY,
      startedAt: '2025-01-01',
    });

    expect(prismaService.technologyContext.create).toHaveBeenCalledWith({
      data: {
        technology: {
          connect: {
            id: 'technology-1',
          },
        },
        context: TechnologyUsageContext.STUDY,
        startedAt: '2025-01-01',
        endedAt: null,
      },
      include: {
        technology: {
          select: {
            id: true,
            slug: true,
            name: true,
            category: true,
            level: true,
            frequency: true,
          },
        },
      },
    });
  });

  it('updates only the provided technology context fields', async () => {
    prismaService.technologyContext.update.mockResolvedValue({
      id: 'context-1',
      technologyId: 'technology-1',
      context: TechnologyUsageContext.STUDY,
      startedAt: '2021-01-01',
      endedAt: null,
      technology: {
        id: 'technology-1',
        slug: 'typescript',
        name: 'TypeScript',
        category: TechnologyCategory.LANGUAGE,
        level: TechnologyLevel.ADVANCED,
        frequency: TechnologyUsageFrequency.FREQUENT,
      },
    });

    await expect(
      service.update('context-1', {
        context: TechnologyUsageContext.STUDY,
        endedAt: null,
      }),
    ).resolves.toEqual(
      expect.objectContaining({
        id: 'context-1',
        context: TechnologyUsageContext.STUDY,
      }),
    );

    expect(prismaService.technologyContext.update).toHaveBeenCalledWith({
      where: { id: 'context-1' },
      data: {
        context: TechnologyUsageContext.STUDY,
        endedAt: null,
      },
      include: {
        technology: {
          select: {
            id: true,
            slug: true,
            name: true,
            category: true,
            level: true,
            frequency: true,
          },
        },
      },
    });
  });

  it('updates the linked technology when a new technologyId is provided', async () => {
    prismaService.technologyContext.update.mockResolvedValue({
      id: 'context-1',
      technologyId: 'technology-2',
      context: TechnologyUsageContext.PERSONAL,
      startedAt: '2024-01-01',
      endedAt: null,
      technology: {
        id: 'technology-2',
        slug: 'nestjs',
        name: 'NestJS',
        category: TechnologyCategory.FRAMEWORK,
        level: TechnologyLevel.INTERMEDIATE,
        frequency: TechnologyUsageFrequency.OCCASIONAL,
      },
    });

    await service.update('context-1', {
      technologyId: 'technology-2',
      startedAt: '2024-01-01',
    });

    expect(prismaService.technologyContext.update).toHaveBeenCalledWith({
      where: { id: 'context-1' },
      data: {
        technology: {
          connect: {
            id: 'technology-2',
          },
        },
        startedAt: '2024-01-01',
      },
      include: {
        technology: {
          select: {
            id: true,
            slug: true,
            name: true,
            category: true,
            level: true,
            frequency: true,
          },
        },
      },
    });
  });

  it('deletes a technology context record', async () => {
    prismaService.technologyContext.delete.mockResolvedValue({
      id: 'context-1',
      technologyId: 'technology-1',
      context: TechnologyUsageContext.PERSONAL,
      startedAt: '2024-01-01',
      endedAt: null,
      technology: {
        id: 'technology-1',
        slug: 'typescript',
        name: 'TypeScript',
        category: TechnologyCategory.LANGUAGE,
        level: TechnologyLevel.ADVANCED,
        frequency: TechnologyUsageFrequency.FREQUENT,
      },
    });

    await expect(service.delete('context-1')).resolves.toEqual(
      expect.objectContaining({
        id: 'context-1',
      }),
    );

    expect(prismaService.technologyContext.delete).toHaveBeenCalledWith({
      where: { id: 'context-1' },
      include: {
        technology: {
          select: {
            id: true,
            slug: true,
            name: true,
            category: true,
            level: true,
            frequency: true,
          },
        },
      },
    });
  });
});
