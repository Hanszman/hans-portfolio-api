import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminJwtAuthGuard } from '../../../auth/guards/admin-jwt-auth.guard';
import { AdminRoleGuard } from '../../../auth/guards/admin-role.guard';
import {
  CreateCustomerRequest,
  UpdateCustomerRequest,
} from '../../contracts/customers/customers.request';
import { ContentCollectionQueryRequest } from '../../contracts/shared/content-query.request';
import { ContentAdminService } from '../../services/content-admin/content-admin.service';
import { ContentReadService } from '../../services/content-read/content-read.service';
import { ApiRoutes } from '../../../../routing/api-routes';
import type { PaginatedContentCollection } from '../../types/content.types';

@ApiTags('Customers')
@Controller(ApiRoutes.content.customers)
export class CustomersController {
  constructor(private readonly contentReadService: ContentReadService) {}

  @Get()
  getCustomers(
    @Query() query: ContentCollectionQueryRequest,
  ): Promise<PaginatedContentCollection> {
    return this.contentReadService.getPublicCollection('customers', query);
  }

  @Get(':slug')
  getCustomerBySlug(@Param('slug') slug: string): Promise<unknown> {
    return this.contentReadService.getPublicItem('customers', slug);
  }
}

@ApiTags('Customers')
@ApiBearerAuth()
@UseGuards(AdminJwtAuthGuard, AdminRoleGuard)
@Controller(`${ApiRoutes.admin.base}/${ApiRoutes.content.customers}`)
export class AdminCustomersController {
  constructor(private readonly contentAdminService: ContentAdminService) {}

  @Post()
  createCustomer(@Body() body: CreateCustomerRequest): Promise<unknown> {
    return this.contentAdminService.createAdminItem('customers', body);
  }

  @Put(':id')
  updateCustomer(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateCustomerRequest,
  ): Promise<unknown> {
    return this.contentAdminService.updateAdminItem('customers', id, body);
  }

  @Delete(':id')
  deleteCustomer(@Param('id', ParseUUIDPipe) id: string): Promise<unknown> {
    return this.contentAdminService.deleteAdminItem('customers', id);
  }
}
