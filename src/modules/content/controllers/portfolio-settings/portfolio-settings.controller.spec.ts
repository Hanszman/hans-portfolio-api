import { Test } from '@nestjs/testing';
import {
  AdminPortfolioSettingsController,
  PortfolioSettingsController,
} from './portfolio-settings.controller';
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

describe('PortfolioSettingsController', () => {
  it('delegates public reads to the content read service', async () => {
    const getPublicCollection = jest.fn().mockResolvedValue({
      data: ['collection'],
      pagination: createPagination(),
    });
    const getPublicItem = jest.fn().mockResolvedValue({ detail: true });

    const moduleRef = await Test.createTestingModule({
      controllers: [PortfolioSettingsController],
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

    const controller = moduleRef.get(PortfolioSettingsController);

    await expect(controller.getPortfolioSettings({} as never)).resolves.toEqual(
      {
        data: ['collection'],
        pagination: createPagination(),
      },
    );
    await expect(controller.getPortfolioSettingByKey('hero')).resolves.toEqual({
      detail: true,
    });

    expect(getPublicCollection).toHaveBeenCalledWith('portfolioSettings', {});
    expect(getPublicItem).toHaveBeenCalledWith('portfolioSettings', 'hero');
  });
});

describe('AdminPortfolioSettingsController', () => {
  it('delegates admin mutations to the content admin service', async () => {
    const createAdminItem = jest.fn().mockResolvedValue({ created: true });
    const updateAdminItem = jest.fn().mockResolvedValue({ updated: true });
    const deleteAdminItem = jest.fn().mockResolvedValue({ deleted: true });

    const moduleRef = await Test.createTestingModule({
      controllers: [AdminPortfolioSettingsController],
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

    const controller = moduleRef.get(AdminPortfolioSettingsController);
    const createBody = { key: 'hero' };
    const updateBody = { description: 'Hero section' };
    const id = '4c00be28-b0d7-410f-90f8-0d88a8d15d2d';

    await expect(
      controller.createPortfolioSetting(createBody as never),
    ).resolves.toEqual({
      created: true,
    });
    await expect(
      controller.updatePortfolioSetting(id, updateBody as never),
    ).resolves.toEqual({
      updated: true,
    });
    await expect(controller.deletePortfolioSetting(id)).resolves.toEqual({
      deleted: true,
    });

    expect(createAdminItem).toHaveBeenCalledWith(
      'portfolioSettings',
      createBody,
    );
    expect(updateAdminItem).toHaveBeenCalledWith(
      'portfolioSettings',
      id,
      updateBody,
    );
    expect(deleteAdminItem).toHaveBeenCalledWith('portfolioSettings', id);
  });
});
