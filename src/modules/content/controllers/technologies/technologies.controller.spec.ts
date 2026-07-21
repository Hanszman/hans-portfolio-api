import { Test } from '@nestjs/testing';
import {
  AdminTechnologiesController,
  TechnologiesController,
} from './technologies.controller';
import { ContentAdminService } from '../../services/content-admin/content-admin.service';
import { ContentReadService } from '../../services/content-read/content-read.service';

const createPagination = () => ({
  page: 1,
  pageSize: 12,
  totalItems: 1,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
});

describe('TechnologiesController', () => {
  it('delegates public reads to the content read service', async () => {
    const getPublicCollection = jest.fn().mockResolvedValue({
      data: ['collection'],
      pagination: createPagination(),
    });
    const getPublicItem = jest.fn().mockResolvedValue({ detail: true });

    const moduleRef = await Test.createTestingModule({
      controllers: [TechnologiesController],
      providers: [
        {
          provide: ContentReadService,
          useValue: {
            getPublicCollection,
            getPublicItem,
          },
        },
      ],
    }).compile();

    const controller = moduleRef.get(TechnologiesController);

    await expect(controller.getTechnologies({} as never)).resolves.toEqual({
      data: ['collection'],
      pagination: createPagination(),
    });
    await expect(controller.getTechnologyBySlug('typescript')).resolves.toEqual(
      {
        detail: true,
      },
    );

    expect(getPublicCollection).toHaveBeenCalledWith('technologies', {});
    expect(getPublicItem).toHaveBeenCalledWith('technologies', 'typescript');
  });
});

describe('AdminTechnologiesController', () => {
  it('delegates admin mutations to the content admin service', async () => {
    const createAdminItem = jest.fn().mockResolvedValue({ created: true });
    const updateAdminItem = jest.fn().mockResolvedValue({ updated: true });
    const deleteAdminItem = jest.fn().mockResolvedValue({ deleted: true });

    const moduleRef = await Test.createTestingModule({
      controllers: [AdminTechnologiesController],
      providers: [
        {
          provide: ContentAdminService,
          useValue: {
            createAdminItem,
            updateAdminItem,
            deleteAdminItem,
          },
        },
      ],
    }).compile();

    const controller = moduleRef.get(AdminTechnologiesController);
    const createBody = { slug: 'typescript' };
    const updateBody = { name: 'TypeScript' };
    const id = '4c00be28-b0d7-410f-90f8-0d88a8d15d2d';

    await expect(
      controller.createTechnology(createBody as never),
    ).resolves.toEqual({
      created: true,
    });
    await expect(
      controller.updateTechnology(id, updateBody as never),
    ).resolves.toEqual({
      updated: true,
    });
    await expect(controller.deleteTechnology(id)).resolves.toEqual({
      deleted: true,
    });

    expect(createAdminItem).toHaveBeenCalledWith('technologies', createBody);
    expect(updateAdminItem).toHaveBeenCalledWith(
      'technologies',
      id,
      updateBody,
    );
    expect(deleteAdminItem).toHaveBeenCalledWith('technologies', id);
  });
});
