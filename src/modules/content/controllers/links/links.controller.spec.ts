import { Test } from '@nestjs/testing';
import { AdminLinksController, LinksController } from './links.controller';
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

describe('LinksController', () => {
  it('delegates public reads to the content read service', async () => {
    const getPublicCollection = jest.fn().mockResolvedValue({
      data: ['collection'],
      pagination: createPagination(),
    });
    const getPublicItem = jest.fn().mockResolvedValue({ detail: true });

    const moduleRef = await Test.createTestingModule({
      controllers: [LinksController],
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

    const controller = moduleRef.get(LinksController);

    await expect(controller.getLinks({} as never)).resolves.toEqual({
      data: ['collection'],
      pagination: createPagination(),
    });
    await expect(
      controller.getLinkById('4c00be28-b0d7-410f-90f8-0d88a8d15d2d'),
    ).resolves.toEqual({
      detail: true,
    });

    expect(getPublicCollection).toHaveBeenCalledWith('links', {});
    expect(getPublicItem).toHaveBeenCalledWith(
      'links',
      '4c00be28-b0d7-410f-90f8-0d88a8d15d2d',
    );
  });
});

describe('AdminLinksController', () => {
  it('delegates admin mutations to the content admin service', async () => {
    const createAdminItem = jest.fn().mockResolvedValue({ created: true });
    const updateAdminItem = jest.fn().mockResolvedValue({ updated: true });
    const deleteAdminItem = jest.fn().mockResolvedValue({ deleted: true });

    const moduleRef = await Test.createTestingModule({
      controllers: [AdminLinksController],
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

    const controller = moduleRef.get(AdminLinksController);
    const createBody = { url: 'https://example.com' };
    const updateBody = { labelEn: 'Repository' };
    const id = '4c00be28-b0d7-410f-90f8-0d88a8d15d2d';

    await expect(controller.createLink(createBody as never)).resolves.toEqual({
      created: true,
    });
    await expect(
      controller.updateLink(id, updateBody as never),
    ).resolves.toEqual({
      updated: true,
    });
    await expect(controller.deleteLink(id)).resolves.toEqual({
      deleted: true,
    });

    expect(createAdminItem).toHaveBeenCalledWith('links', createBody);
    expect(updateAdminItem).toHaveBeenCalledWith('links', id, updateBody);
    expect(deleteAdminItem).toHaveBeenCalledWith('links', id);
  });
});
