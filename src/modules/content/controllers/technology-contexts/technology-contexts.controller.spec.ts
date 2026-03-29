import { Test } from '@nestjs/testing';
import { TechnologyUsageContext } from '@prisma/client';
import {
  AdminTechnologyContextsController,
  TechnologyContextsController,
} from './technology-contexts.controller';
import { TechnologyContextsService } from '../../services/technology-contexts/technology-contexts.service';

describe('TechnologyContextsController', () => {
  it('delegates public grouped reads to the technology contexts service', async () => {
    const getPublicCollection = jest.fn().mockResolvedValue({
      data: [],
      pagination: {
        page: 1,
        pageSize: 12,
        totalItems: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    });
    const getPublicItem = jest.fn().mockResolvedValue({
      technologyId: 'technology-1',
      slug: 'typescript',
    });

    const moduleRef = await Test.createTestingModule({
      controllers: [TechnologyContextsController],
      providers: [
        {
          provide: TechnologyContextsService,
          useValue: {
            getPublicCollection,
            getPublicItem,
          },
        },
      ],
    }).compile();

    const controller = moduleRef.get(TechnologyContextsController);

    await expect(
      controller.getTechnologyContexts({ page: 1, pageSize: 12 }),
    ).resolves.toEqual({
      data: [],
      pagination: {
        page: 1,
        pageSize: 12,
        totalItems: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    });
    await expect(
      controller.getTechnologyContextsByTechnologySlug('typescript'),
    ).resolves.toEqual({
      technologyId: 'technology-1',
      slug: 'typescript',
    });

    expect(getPublicCollection).toHaveBeenCalledWith({
      page: 1,
      pageSize: 12,
    });
    expect(getPublicItem).toHaveBeenCalledWith('typescript');
  });
});

describe('AdminTechnologyContextsController', () => {
  it('delegates admin mutations to the technology contexts service', async () => {
    const create = jest.fn().mockResolvedValue({ id: 'context-1' });
    const update = jest.fn().mockResolvedValue({ id: 'context-1' });
    const remove = jest.fn().mockResolvedValue({ id: 'context-1' });

    const moduleRef = await Test.createTestingModule({
      controllers: [AdminTechnologyContextsController],
      providers: [
        {
          provide: TechnologyContextsService,
          useValue: {
            create,
            update,
            delete: remove,
          },
        },
      ],
    }).compile();

    const controller = moduleRef.get(AdminTechnologyContextsController);
    const createBody = {
      technologyId: 'technology-1',
      context: TechnologyUsageContext.PROFESSIONAL,
      startedAt: '2020-01-01',
      endedAt: '2024-04-01',
    };
    const updateBody = {
      context: TechnologyUsageContext.STUDY,
      endedAt: null,
    };

    await expect(
      controller.createTechnologyContext(createBody),
    ).resolves.toEqual({ id: 'context-1' });
    await expect(
      controller.updateTechnologyContext('context-1', updateBody),
    ).resolves.toEqual({ id: 'context-1' });
    await expect(
      controller.deleteTechnologyContext('context-1'),
    ).resolves.toEqual({ id: 'context-1' });

    expect(create).toHaveBeenCalledWith(createBody);
    expect(update).toHaveBeenCalledWith('context-1', updateBody);
    expect(remove).toHaveBeenCalledWith('context-1');
  });
});
