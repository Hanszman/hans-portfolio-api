import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminJwtAuthGuard } from '../../../auth/guards/admin-jwt-auth.guard';
import { AdminRoleGuard } from '../../../auth/guards/admin-role.guard';
import {
  CreatePortfolioSettingRequest,
  UpdatePortfolioSettingRequest,
} from '../../contracts/portfolio-settings/portfolio-settings.request';
import { ContentAdminService } from '../../services/content-admin/content-admin.service';
import { ContentReadService } from '../../services/content-read/content-read.service';
import { ApiRoutes } from '../../../../routing/api-routes';

@ApiTags('Portfolio Settings')
@Controller(ApiRoutes.content.portfolioSettings)
export class PortfolioSettingsController {
  constructor(private readonly contentReadService: ContentReadService) {}

  @Get()
  getPortfolioSettings(): Promise<unknown[]> {
    return this.contentReadService.getPublicCollection('portfolioSettings');
  }

  @Get(':key')
  getPortfolioSettingByKey(@Param('key') key: string): Promise<unknown> {
    return this.contentReadService.getPublicItem('portfolioSettings', key);
  }
}

@ApiTags('Portfolio Settings')
@ApiBearerAuth()
@UseGuards(AdminJwtAuthGuard, AdminRoleGuard)
@Controller(`${ApiRoutes.admin.base}/${ApiRoutes.content.portfolioSettings}`)
export class AdminPortfolioSettingsController {
  constructor(private readonly contentAdminService: ContentAdminService) {}

  @Post()
  createPortfolioSetting(
    @Body() body: CreatePortfolioSettingRequest,
  ): Promise<unknown> {
    return this.contentAdminService.createAdminItem('portfolioSettings', body);
  }

  @Put(':id')
  updatePortfolioSetting(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdatePortfolioSettingRequest,
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
  ): Promise<unknown> {
    return this.contentAdminService.deleteAdminItem('portfolioSettings', id);
  }
}
