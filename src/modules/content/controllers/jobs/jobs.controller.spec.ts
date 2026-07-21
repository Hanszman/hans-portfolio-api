import { Test } from '@nestjs/testing';
import { AdminJobsController, JobsController } from './jobs.controller';
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

describe('JobsController', () => {
  it('delegates public reads to the content read service', async () => {
    const getPublicCollection = jest.fn().mockResolvedValue({
      data: ['collection'],
      pagination: createPagination(),
    });
    const getPublicItem = jest.fn().mockResolvedValue({ detail: true });

    const moduleRef = await Test.createTestingModule({
      controllers: [JobsController],
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

    const controller = moduleRef.get(JobsController);

    await expect(controller.getJobs({} as never)).resolves.toEqual({
      data: ['collection'],
      pagination: createPagination(),
    });
    await expect(controller.getJobBySlug('frontend-engineer')).resolves.toEqual(
      {
        detail: true,
      },
    );

    expect(getPublicCollection).toHaveBeenCalledWith('jobs', {});
    expect(getPublicItem).toHaveBeenCalledWith('jobs', 'frontend-engineer');
  });
});

describe('AdminJobsController', () => {
  it('delegates admin mutations to the content admin service', async () => {
    const createAdminItem = jest.fn().mockResolvedValue({ created: true });
    const updateAdminItem = jest.fn().mockResolvedValue({ updated: true });
    const deleteAdminItem = jest.fn().mockResolvedValue({ deleted: true });

    const moduleRef = await Test.createTestingModule({
      controllers: [AdminJobsController],
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

    const controller = moduleRef.get(AdminJobsController);
    const createBody = { slug: 'frontend-engineer' };
    const updateBody = { nameEn: 'Frontend Engineer' };
    const id = '4c00be28-b0d7-410f-90f8-0d88a8d15d2d';

    await expect(controller.createJob(createBody as never)).resolves.toEqual({
      created: true,
    });
    await expect(
      controller.updateJob(id, updateBody as never),
    ).resolves.toEqual({
      updated: true,
    });
    await expect(controller.deleteJob(id)).resolves.toEqual({
      deleted: true,
    });

    expect(createAdminItem).toHaveBeenCalledWith('jobs', createBody);
    expect(updateAdminItem).toHaveBeenCalledWith('jobs', id, updateBody);
    expect(deleteAdminItem).toHaveBeenCalledWith('jobs', id);
  });
});
