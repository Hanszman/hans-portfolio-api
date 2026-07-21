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
  CreatePortfolioSettingRequest,
  UpdatePortfolioSettingRequest,
} from '../../contracts/portfolio-settings/portfolio-settings.request';
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

@ApiTags('Portfolio Settings')
@Controller(ApiRoutes.content.portfolioSettings)
export class PortfolioSettingsController {
  /* c8 ignore next */
  constructor(private readonly contentReadService: ContentReadService) {}

  @Get()
  @ApiContentCollectionQueries('portfolioSettings')
  getPortfolioSettings(
    /* c8 ignore next */
    @Query() query: ContentCollectionQueryRequest,
    /* c8 ignore next */
  ): Promise<PaginatedContentCollection> {
    return this.contentReadService.getPublicCollection(
      'portfolioSettings',
      query,
    );
  }

  @Get(':key')
  /* c8 ignore next */
  getPortfolioSettingByKey(@Param('key') key: string): Promise<unknown> {
    return this.contentReadService.getPublicItem('portfolioSettings', key);
  }
}

@ApiTags('Portfolio Settings')
@ApiBearerAuth()
@UseGuards(AdminJwtAuthGuard, AdminRoleGuard)
@Controller(`${ApiRoutes.admin.base}/${ApiRoutes.content.portfolioSettings}`)
export class AdminPortfolioSettingsController {
  /* c8 ignore next */
  constructor(private readonly contentAdminService: ContentAdminService) {}

  @Post()
  @ApiContentCreateBody('portfolioSettings')
  createPortfolioSetting(
    /* c8 ignore next */
    @Body() body: CreatePortfolioSettingRequest,
    /* c8 ignore next */
  ): Promise<unknown> {
    return this.contentAdminService.createAdminItem('portfolioSettings', body);
  }

  @Put(':id')
  @ApiContentUpdateBody('portfolioSettings')
  updatePortfolioSetting(
    @Param('id', ParseUUIDPipe) id: string,
    /* c8 ignore next */
    @Body() body: UpdatePortfolioSettingRequest,
    /* c8 ignore next */
  ): Promise<unknown> {
    return this.contentAdminService.updateAdminItem(
      'portfolioSettings',
      id,
      body,
    );
  }

  @Delete(':id')
  deletePortfolioSetting(
    @Param('id', ParseUUIDPipe) id: string,
    /* c8 ignore next */
  ): Promise<unknown> {
    return this.contentAdminService.deleteAdminItem('portfolioSettings', id);
  }
}
