import { Test } from '@nestjs/testing';
import {
  AdminFormationsController,
  FormationsController,
} from './formations.controller';
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

describe('FormationsController', () => {
  it('delegates public reads to the content read service', async () => {
    const getPublicCollection = jest.fn().mockResolvedValue({
      data: ['collection'],
      pagination: createPagination(),
    });
    const getPublicItem = jest.fn().mockResolvedValue({ detail: true });

    const moduleRef = await Test.createTestingModule({
      controllers: [FormationsController],
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

    const controller = moduleRef.get(FormationsController);

    await expect(controller.getFormations({} as never)).resolves.toEqual({
      data: ['collection'],
      pagination: createPagination(),
    });
    await expect(controller.getFormationBySlug('fatec')).resolves.toEqual({
      detail: true,
    });

    expect(getPublicCollection).toHaveBeenCalledWith('formations', {});
    expect(getPublicItem).toHaveBeenCalledWith('formations', 'fatec');
  });
});

describe('AdminFormationsController', () => {
  it('delegates admin mutations to the content admin service', async () => {
    const createAdminItem = jest.fn().mockResolvedValue({ created: true });
    const updateAdminItem = jest.fn().mockResolvedValue({ updated: true });
    const deleteAdminItem = jest.fn().mockResolvedValue({ deleted: true });

    const moduleRef = await Test.createTestingModule({
      controllers: [AdminFormationsController],
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

    const controller = moduleRef.get(AdminFormationsController);
    const createBody = { slug: 'fatec' };
    const updateBody = { institution: 'Fatec' };
    const id = '4c00be28-b0d7-410f-90f8-0d88a8d15d2d';

    await expect(
      controller.createFormation(createBody as never),
    ).resolves.toEqual({
      created: true,
    });
    await expect(
      controller.updateFormation(id, updateBody as never),
    ).resolves.toEqual({
      updated: true,
    });
    await expect(controller.deleteFormation(id)).resolves.toEqual({
      deleted: true,
    });

    expect(createAdminItem).toHaveBeenCalledWith('formations', createBody);
    expect(updateAdminItem).toHaveBeenCalledWith('formations', id, updateBody);
    expect(deleteAdminItem).toHaveBeenCalledWith('formations', id);
  });
});
