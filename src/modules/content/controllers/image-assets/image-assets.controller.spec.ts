import { Test } from '@nestjs/testing';
import {
  AdminImageAssetsController,
  ImageAssetsController,
} from './image-assets.controller';
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

describe('ImageAssetsController', () => {
  it('delegates public reads to the content read service', async () => {
    const getPublicCollection = jest.fn().mockResolvedValue({
      data: ['collection'],
      pagination: createPagination(),
    });
    const getPublicItem = jest.fn().mockResolvedValue({ detail: true });

    const moduleRef = await Test.createTestingModule({
      controllers: [ImageAssetsController],
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

    const controller = moduleRef.get(ImageAssetsController);

    await expect(controller.getImageAssets({} as never)).resolves.toEqual({
      data: ['collection'],
      pagination: createPagination(),
    });
    await expect(
      controller.getImageAssetById('4c00be28-b0d7-410f-90f8-0d88a8d15d2d'),
    ).resolves.toEqual({
      detail: true,
    });

    expect(getPublicCollection).toHaveBeenCalledWith('imageAssets', {});
    expect(getPublicItem).toHaveBeenCalledWith(
      'imageAssets',
      '4c00be28-b0d7-410f-90f8-0d88a8d15d2d',
    );
  });
});

describe('AdminImageAssetsController', () => {
  it('delegates admin mutations to the content admin service', async () => {
    const createAdminItem = jest.fn().mockResolvedValue({ created: true });
    const updateAdminItem = jest.fn().mockResolvedValue({ updated: true });
    const deleteAdminItem = jest.fn().mockResolvedValue({ deleted: true });

    const moduleRef = await Test.createTestingModule({
      controllers: [AdminImageAssetsController],
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

    const controller = moduleRef.get(AdminImageAssetsController);
    const createBody = { filePath: '/assets/img/test.png' };
    const updateBody = { fileName: 'test.png' };
    const id = '4c00be28-b0d7-410f-90f8-0d88a8d15d2d';

    await expect(
      controller.createImageAsset(createBody as never),
    ).resolves.toEqual({
      created: true,
    });
    await expect(
      controller.updateImageAsset(id, updateBody as never),
    ).resolves.toEqual({
      updated: true,
    });
    await expect(controller.deleteImageAsset(id)).resolves.toEqual({
      deleted: true,
    });

    expect(createAdminItem).toHaveBeenCalledWith('imageAssets', createBody);
    expect(updateAdminItem).toHaveBeenCalledWith('imageAssets', id, updateBody);
    expect(deleteAdminItem).toHaveBeenCalledWith('imageAssets', id);
  });
});
