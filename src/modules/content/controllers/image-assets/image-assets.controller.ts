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
  CreateImageAssetRequest,
  UpdateImageAssetRequest,
} from '../../contracts/image-assets/image-assets.request';
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

@ApiTags('Image Assets')
@Controller(ApiRoutes.content.imageAssets)
export class ImageAssetsController {
  /* c8 ignore next */
  constructor(private readonly contentReadService: ContentReadService) {}

  @Get()
  @ApiContentCollectionQueries('imageAssets')
  getImageAssets(
    /* c8 ignore next */
    @Query() query: ContentCollectionQueryRequest,
    /* c8 ignore next */
  ): Promise<PaginatedContentCollection> {
    return this.contentReadService.getPublicCollection('imageAssets', query);
  }

  @Get(':id')
  /* c8 ignore next */
  getImageAssetById(@Param('id', ParseUUIDPipe) id: string): Promise<unknown> {
    return this.contentReadService.getPublicItem('imageAssets', id);
  }
}

@ApiTags('Image Assets')
@ApiBearerAuth()
@UseGuards(AdminJwtAuthGuard, AdminRoleGuard)
@Controller(`${ApiRoutes.admin.base}/${ApiRoutes.content.imageAssets}`)
export class AdminImageAssetsController {
  /* c8 ignore next */
  constructor(private readonly contentAdminService: ContentAdminService) {}

  @Post()
  @ApiContentCreateBody('imageAssets')
  /* c8 ignore next */
  createImageAsset(@Body() body: CreateImageAssetRequest): Promise<unknown> {
    return this.contentAdminService.createAdminItem('imageAssets', body);
  }

  @Put(':id')
  @ApiContentUpdateBody('imageAssets')
  updateImageAsset(
    @Param('id', ParseUUIDPipe) id: string,
    /* c8 ignore next */
    @Body() body: UpdateImageAssetRequest,
    /* c8 ignore next */
  ): Promise<unknown> {
    return this.contentAdminService.updateAdminItem('imageAssets', id, body);
  }

  @Delete(':id')
  /* c8 ignore next */
  deleteImageAsset(@Param('id', ParseUUIDPipe) id: string): Promise<unknown> {
    return this.contentAdminService.deleteAdminItem('imageAssets', id);
  }
}
