import { Test } from '@nestjs/testing';
import {
  AdminExperiencesController,
  ExperiencesController,
} from './experiences.controller';
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

describe('ExperiencesController', () => {
  it('delegates public reads to the content read service', async () => {
    const getPublicCollection = jest.fn().mockResolvedValue({
      data: ['collection'],
      pagination: createPagination(),
    });
    const getPublicItem = jest.fn().mockResolvedValue({ detail: true });

    const moduleRef = await Test.createTestingModule({
      controllers: [ExperiencesController],
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

    const controller = moduleRef.get(ExperiencesController);

    await expect(controller.getExperiences({} as never)).resolves.toEqual({
      data: ['collection'],
      pagination: createPagination(),
    });
    await expect(controller.getExperienceBySlug('pagbank')).resolves.toEqual({
      detail: true,
    });

    expect(getPublicCollection).toHaveBeenCalledWith('experiences', {});
    expect(getPublicItem).toHaveBeenCalledWith('experiences', 'pagbank');
  });
});

describe('AdminExperiencesController', () => {
  it('delegates admin mutations to the content admin service', async () => {
    const createAdminItem = jest.fn().mockResolvedValue({ created: true });
    const updateAdminItem = jest.fn().mockResolvedValue({ updated: true });
    const deleteAdminItem = jest.fn().mockResolvedValue({ deleted: true });

    const moduleRef = await Test.createTestingModule({
      controllers: [AdminExperiencesController],
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

    const controller = moduleRef.get(AdminExperiencesController);
    const createBody = { slug: 'pagbank' };
    const updateBody = { titlePt: 'PagBank' };
    const id = '4c00be28-b0d7-410f-90f8-0d88a8d15d2d';

    await expect(
      controller.createExperience(createBody as never),
    ).resolves.toEqual({
      created: true,
    });
    await expect(
      controller.updateExperience(id, updateBody as never),
    ).resolves.toEqual({
      updated: true,
    });
    await expect(controller.deleteExperience(id)).resolves.toEqual({
      deleted: true,
    });

    expect(createAdminItem).toHaveBeenCalledWith('experiences', createBody);
    expect(updateAdminItem).toHaveBeenCalledWith('experiences', id, updateBody);
    expect(deleteAdminItem).toHaveBeenCalledWith('experiences', id);
  });
});
