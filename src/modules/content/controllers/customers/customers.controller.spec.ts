import { Test } from '@nestjs/testing';
import {
  AdminCustomersController,
  CustomersController,
} from './customers.controller';
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

describe('CustomersController', () => {
  it('delegates public reads to the content read service', async () => {
    const getPublicCollection = jest.fn().mockResolvedValue({
      data: ['collection'],
      pagination: createPagination(),
    });
    const getPublicItem = jest.fn().mockResolvedValue({ detail: true });

    const moduleRef = await Test.createTestingModule({
      controllers: [CustomersController],
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

    const controller = moduleRef.get(CustomersController);

    await expect(controller.getCustomers({} as never)).resolves.toEqual({
      data: ['collection'],
      pagination: createPagination(),
    });
    await expect(controller.getCustomerBySlug('pagbank')).resolves.toEqual({
      detail: true,
    });

    expect(getPublicCollection).toHaveBeenCalledWith('customers', {});
    expect(getPublicItem).toHaveBeenCalledWith('customers', 'pagbank');
  });
});

describe('AdminCustomersController', () => {
  it('delegates admin mutations to the content admin service', async () => {
    const createAdminItem = jest.fn().mockResolvedValue({ created: true });
    const updateAdminItem = jest.fn().mockResolvedValue({ updated: true });
    const deleteAdminItem = jest.fn().mockResolvedValue({ deleted: true });

    const moduleRef = await Test.createTestingModule({
      controllers: [AdminCustomersController],
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

    const controller = moduleRef.get(AdminCustomersController);
    const createBody = { slug: 'pagbank' };
    const updateBody = { name: 'PagBank' };
    const id = '4c00be28-b0d7-410f-90f8-0d88a8d15d2d';

    await expect(
      controller.createCustomer(createBody as never),
    ).resolves.toEqual({
      created: true,
    });
    await expect(
      controller.updateCustomer(id, updateBody as never),
    ).resolves.toEqual({
      updated: true,
    });
    await expect(controller.deleteCustomer(id)).resolves.toEqual({
      deleted: true,
    });

    expect(createAdminItem).toHaveBeenCalledWith('customers', createBody);
    expect(updateAdminItem).toHaveBeenCalledWith('customers', id, updateBody);
    expect(deleteAdminItem).toHaveBeenCalledWith('customers', id);
  });
});
