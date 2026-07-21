import { Test } from '@nestjs/testing';
import {
  AdminSpokenLanguagesController,
  SpokenLanguagesController,
} from './spoken-languages.controller';
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

describe('SpokenLanguagesController', () => {
  it('delegates public reads to the content read service', async () => {
    const getPublicCollection = jest.fn().mockResolvedValue({
      data: ['collection'],
      pagination: createPagination(),
    });
    const getPublicItem = jest.fn().mockResolvedValue({ detail: true });

    const moduleRef = await Test.createTestingModule({
      controllers: [SpokenLanguagesController],
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

    const controller = moduleRef.get(SpokenLanguagesController);

    await expect(controller.getSpokenLanguages({} as never)).resolves.toEqual({
      data: ['collection'],
      pagination: createPagination(),
    });
    await expect(controller.getSpokenLanguageByCode('en')).resolves.toEqual({
      detail: true,
    });

    expect(getPublicCollection).toHaveBeenCalledWith('spokenLanguages', {});
    expect(getPublicItem).toHaveBeenCalledWith('spokenLanguages', 'en');
  });
});

describe('AdminSpokenLanguagesController', () => {
  it('delegates admin mutations to the content admin service', async () => {
    const createAdminItem = jest.fn().mockResolvedValue({ created: true });
    const updateAdminItem = jest.fn().mockResolvedValue({ updated: true });
    const deleteAdminItem = jest.fn().mockResolvedValue({ deleted: true });

    const moduleRef = await Test.createTestingModule({
      controllers: [AdminSpokenLanguagesController],
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

    const controller = moduleRef.get(AdminSpokenLanguagesController);
    const createBody = { code: 'en' };
    const updateBody = { nameEn: 'English' };
    const id = '4c00be28-b0d7-410f-90f8-0d88a8d15d2d';

    await expect(
      controller.createSpokenLanguage(createBody as never),
    ).resolves.toEqual({
      created: true,
    });
    await expect(
      controller.updateSpokenLanguage(id, updateBody as never),
    ).resolves.toEqual({
      updated: true,
    });
    await expect(controller.deleteSpokenLanguage(id)).resolves.toEqual({
      deleted: true,
    });

    expect(createAdminItem).toHaveBeenCalledWith('spokenLanguages', createBody);
    expect(updateAdminItem).toHaveBeenCalledWith(
      'spokenLanguages',
      id,
      updateBody,
    );
    expect(deleteAdminItem).toHaveBeenCalledWith('spokenLanguages', id);
  });
});
