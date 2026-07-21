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
  /* c8 ignore next */
  constructor(private readonly contentReadService: ContentReadService) {}

  @Get()
  @ApiContentCollectionQueries('links')
  getLinks(
    /* c8 ignore next */
    @Query() query: ContentCollectionQueryRequest,
    /* c8 ignore next */
  ): Promise<PaginatedContentCollection> {
    return this.contentReadService.getPublicCollection('links', query);
  }

  @Get(':id')
  /* c8 ignore next */
  getLinkById(@Param('id', ParseUUIDPipe) id: string): Promise<unknown> {
    return this.contentReadService.getPublicItem('links', id);
  }
}

@ApiTags('Links')
@ApiBearerAuth()
@UseGuards(AdminJwtAuthGuard, AdminRoleGuard)
@Controller(`${ApiRoutes.admin.base}/${ApiRoutes.content.links}`)
export class AdminLinksController {
  /* c8 ignore next */
  constructor(private readonly contentAdminService: ContentAdminService) {}

  @Post()
  @ApiContentCreateBody('links')
  /* c8 ignore next */
  createLink(@Body() body: CreateLinkRequest): Promise<unknown> {
    return this.contentAdminService.createAdminItem('links', body);
  }

  @Put(':id')
  @ApiContentUpdateBody('links')
  updateLink(
    @Param('id', ParseUUIDPipe) id: string,
    /* c8 ignore next */
    @Body() body: UpdateLinkRequest,
    /* c8 ignore next */
  ): Promise<unknown> {
    return this.contentAdminService.updateAdminItem('links', id, body);
  }

  @Delete(':id')
  /* c8 ignore next */
  deleteLink(@Param('id', ParseUUIDPipe) id: string): Promise<unknown> {
    return this.contentAdminService.deleteAdminItem('links', id);
  }
}
