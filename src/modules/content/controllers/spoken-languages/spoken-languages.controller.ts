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
  CreateSpokenLanguageRequest,
  UpdateSpokenLanguageRequest,
} from '../../contracts/spoken-languages/spoken-languages.request';
import { ContentAdminService } from '../../services/content-admin/content-admin.service';
import { ContentReadService } from '../../services/content-read/content-read.service';
import { ApiRoutes } from '../../../../routing/api-routes';

@ApiTags('Spoken Languages')
@Controller(ApiRoutes.content.spokenLanguages)
export class SpokenLanguagesController {
  constructor(private readonly contentReadService: ContentReadService) {}

  @Get()
  getSpokenLanguages(): Promise<unknown[]> {
    return this.contentReadService.getPublicCollection('spokenLanguages');
  }

  @Get(':code')
  getSpokenLanguageByCode(@Param('code') code: string): Promise<unknown> {
    return this.contentReadService.getPublicItem('spokenLanguages', code);
  }
}

@ApiTags('Spoken Languages')
@ApiBearerAuth()
@UseGuards(AdminJwtAuthGuard, AdminRoleGuard)
@Controller(`${ApiRoutes.admin.base}/${ApiRoutes.content.spokenLanguages}`)
export class AdminSpokenLanguagesController {
  constructor(private readonly contentAdminService: ContentAdminService) {}

  @Get()
  getSpokenLanguages(): Promise<unknown[]> {
    return this.contentAdminService.getAdminCollection('spokenLanguages');
  }

  @Get(':id')
  getSpokenLanguageById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<unknown> {
    return this.contentAdminService.getAdminItemById('spokenLanguages', id);
  }

  @Post()
  createSpokenLanguage(
    @Body() body: CreateSpokenLanguageRequest,
  ): Promise<unknown> {
    return this.contentAdminService.createAdminItem('spokenLanguages', body);
  }

  @Put(':id')
  updateSpokenLanguage(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateSpokenLanguageRequest,
  ): Promise<unknown> {
    return this.contentAdminService.updateAdminItem(
      'spokenLanguages',
      id,
      body,
    );
  }

  @Delete(':id')
  deleteSpokenLanguage(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<unknown> {
    return this.contentAdminService.deleteAdminItem('spokenLanguages', id);
  }
}
