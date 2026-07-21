import { Test } from '@nestjs/testing';
import { AdminTagsController, TagsController } from './tags.controller';
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

describe('TagsController', () => {
  it('delegates public reads to the content read service', async () => {
    const getPublicCollection = jest.fn().mockResolvedValue({
      data: ['collection'],
      pagination: createPagination(),
    });
    const getPublicItem = jest.fn().mockResolvedValue({ detail: true });

    const moduleRef = await Test.createTestingModule({
      controllers: [TagsController],
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

    const controller = moduleRef.get(TagsController);

    await expect(controller.getTags({} as never)).resolves.toEqual({
      data: ['collection'],
      pagination: createPagination(),
    });
    await expect(controller.getTagBySlug('frontend')).resolves.toEqual({
      detail: true,
    });

    expect(getPublicCollection).toHaveBeenCalledWith('tags', {});
    expect(getPublicItem).toHaveBeenCalledWith('tags', 'frontend');
  });
});

describe('AdminTagsController', () => {
  it('delegates admin mutations to the content admin service', async () => {
    const createAdminItem = jest.fn().mockResolvedValue({ created: true });
    const updateAdminItem = jest.fn().mockResolvedValue({ updated: true });
    const deleteAdminItem = jest.fn().mockResolvedValue({ deleted: true });

    const moduleRef = await Test.createTestingModule({
      controllers: [AdminTagsController],
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

    const controller = moduleRef.get(AdminTagsController);
    const createBody = { slug: 'frontend' };
    const updateBody = { nameEn: 'Frontend' };
    const id = '4c00be28-b0d7-410f-90f8-0d88a8d15d2d';

    await expect(controller.createTag(createBody as never)).resolves.toEqual({
      created: true,
    });
    await expect(
      controller.updateTag(id, updateBody as never),
    ).resolves.toEqual({
      updated: true,
    });
    await expect(controller.deleteTag(id)).resolves.toEqual({
      deleted: true,
    });

    expect(createAdminItem).toHaveBeenCalledWith('tags', createBody);
    expect(updateAdminItem).toHaveBeenCalledWith('tags', id, updateBody);
    expect(deleteAdminItem).toHaveBeenCalledWith('tags', id);
  });
});
