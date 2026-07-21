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
import {
  ApiContentCollectionQueries,
  ApiContentCreateBody,
  ApiContentUpdateBody,
} from '../../decorators/content-swagger.decorator';
import { ContentAdminService } from '../../services/content-admin/content-admin.service';
import { ContentReadService } from '../../services/content-read/content-read.service';
import { ApiRoutes } from '../../../../routing/api-routes';
import type { PaginatedContentCollection } from '../../types/content.types';

@ApiTags('Customers')
@Controller(ApiRoutes.content.customers)
export class CustomersController {
  /* c8 ignore next */
  constructor(private readonly contentReadService: ContentReadService) {}

  @Get()
  @ApiContentCollectionQueries('customers')
  getCustomers(
    /* c8 ignore next */
    @Query() query: ContentCollectionQueryRequest,
    /* c8 ignore next */
  ): Promise<PaginatedContentCollection> {
    return this.contentReadService.getPublicCollection('customers', query);
  }

  @Get(':slug')
  /* c8 ignore next */
  getCustomerBySlug(@Param('slug') slug: string): Promise<unknown> {
    return this.contentReadService.getPublicItem('customers', slug);
  }
}

@ApiTags('Customers')
@ApiBearerAuth()
@UseGuards(AdminJwtAuthGuard, AdminRoleGuard)
@Controller(`${ApiRoutes.admin.base}/${ApiRoutes.content.customers}`)
export class AdminCustomersController {
  /* c8 ignore next */
  constructor(private readonly contentAdminService: ContentAdminService) {}

  @Post()
  @ApiContentCreateBody('customers')
  /* c8 ignore next */
  createCustomer(@Body() body: CreateCustomerRequest): Promise<unknown> {
    return this.contentAdminService.createAdminItem('customers', body);
  }

  @Put(':id')
  @ApiContentUpdateBody('customers')
  updateCustomer(
    @Param('id', ParseUUIDPipe) id: string,
    /* c8 ignore next */
    @Body() body: UpdateCustomerRequest,
    /* c8 ignore next */
  ): Promise<unknown> {
    return this.contentAdminService.updateAdminItem('customers', id, body);
  }

  @Delete(':id')
  /* c8 ignore next */
  deleteCustomer(@Param('id', ParseUUIDPipe) id: string): Promise<unknown> {
    return this.contentAdminService.deleteAdminItem('customers', id);
  }
}
