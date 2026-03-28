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
  CreateLinkRequest,
  UpdateLinkRequest,
} from '../../contracts/links/links.request';
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

@ApiTags('Links')
@Controller(ApiRoutes.content.links)
export class LinksController {
  constructor(private readonly contentReadService: ContentReadService) {}

  @Get()
  @ApiContentCollectionQueries('links')
  getLinks(
    @Query() query: ContentCollectionQueryRequest,
  ): Promise<PaginatedContentCollection> {
    return this.contentReadService.getPublicCollection('links', query);
  }

  @Get(':id')
  getLinkById(@Param('id', ParseUUIDPipe) id: string): Promise<unknown> {
    return this.contentReadService.getPublicItem('links', id);
  }
}

@ApiTags('Links')
@ApiBearerAuth()
@UseGuards(AdminJwtAuthGuard, AdminRoleGuard)
@Controller(`${ApiRoutes.admin.base}/${ApiRoutes.content.links}`)
export class AdminLinksController {
  constructor(private readonly contentAdminService: ContentAdminService) {}

  @Post()
  @ApiContentCreateBody('links')
  createLink(@Body() body: CreateLinkRequest): Promise<unknown> {
    return this.contentAdminService.createAdminItem('links', body);
  }

  @Put(':id')
  @ApiContentUpdateBody('links')
  updateLink(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateLinkRequest,
  ): Promise<unknown> {
    return this.contentAdminService.updateAdminItem('links', id, body);
  }

  @Delete(':id')
  deleteLink(@Param('id', ParseUUIDPipe) id: string): Promise<unknown> {
    return this.contentAdminService.deleteAdminItem('links', id);
  }
}
