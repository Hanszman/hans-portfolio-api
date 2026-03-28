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
  CreateTagRequest,
  UpdateTagRequest,
} from '../../contracts/tags/tags.request';
import { ContentCollectionQueryRequest } from '../../contracts/shared/content-query.request';
import { ContentAdminService } from '../../services/content-admin/content-admin.service';
import { ContentReadService } from '../../services/content-read/content-read.service';
import { ApiRoutes } from '../../../../routing/api-routes';
import type { PaginatedContentCollection } from '../../types/content.types';

@ApiTags('Tags')
@Controller(ApiRoutes.content.tags)
export class TagsController {
  constructor(private readonly contentReadService: ContentReadService) {}

  @Get()
  getTags(
    @Query() query: ContentCollectionQueryRequest,
  ): Promise<PaginatedContentCollection> {
    return this.contentReadService.getPublicCollection('tags', query);
  }

  @Get(':slug')
  getTagBySlug(@Param('slug') slug: string): Promise<unknown> {
    return this.contentReadService.getPublicItem('tags', slug);
  }
}

@ApiTags('Tags')
@ApiBearerAuth()
@UseGuards(AdminJwtAuthGuard, AdminRoleGuard)
@Controller(`${ApiRoutes.admin.base}/${ApiRoutes.content.tags}`)
export class AdminTagsController {
  constructor(private readonly contentAdminService: ContentAdminService) {}

  @Post()
  createTag(@Body() body: CreateTagRequest): Promise<unknown> {
    return this.contentAdminService.createAdminItem('tags', body);
  }

  @Put(':id')
  updateTag(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateTagRequest,
  ): Promise<unknown> {
    return this.contentAdminService.updateAdminItem('tags', id, body);
  }

  @Delete(':id')
  deleteTag(@Param('id', ParseUUIDPipe) id: string): Promise<unknown> {
    return this.contentAdminService.deleteAdminItem('tags', id);
  }
}
