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
  CreateExperienceRequest,
  UpdateExperienceRequest,
} from '../../contracts/experiences/experiences.request';
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

@ApiTags('Experiences')
@Controller(ApiRoutes.content.experiences)
export class ExperiencesController {
  /* c8 ignore next */
  constructor(private readonly contentReadService: ContentReadService) {}

  @Get()
  @ApiContentCollectionQueries('experiences')
  getExperiences(
    /* c8 ignore next */
    @Query() query: ContentCollectionQueryRequest,
    /* c8 ignore next */
  ): Promise<PaginatedContentCollection> {
    return this.contentReadService.getPublicCollection('experiences', query);
  }

  @Get(':slug')
  /* c8 ignore next */
  getExperienceBySlug(@Param('slug') slug: string): Promise<unknown> {
    return this.contentReadService.getPublicItem('experiences', slug);
  }
}

@ApiTags('Experiences')
@ApiBearerAuth()
@UseGuards(AdminJwtAuthGuard, AdminRoleGuard)
@Controller(`${ApiRoutes.admin.base}/${ApiRoutes.content.experiences}`)
export class AdminExperiencesController {
  /* c8 ignore next */
  constructor(private readonly contentAdminService: ContentAdminService) {}

  @Post()
  @ApiContentCreateBody('experiences')
  /* c8 ignore next */
  createExperience(@Body() body: CreateExperienceRequest): Promise<unknown> {
    return this.contentAdminService.createAdminItem('experiences', body);
  }

  @Put(':id')
  @ApiContentUpdateBody('experiences')
  updateExperience(
    @Param('id', ParseUUIDPipe) id: string,
    /* c8 ignore next */
    @Body() body: UpdateExperienceRequest,
    /* c8 ignore next */
  ): Promise<unknown> {
    return this.contentAdminService.updateAdminItem('experiences', id, body);
  }

  @Delete(':id')
  /* c8 ignore next */
  deleteExperience(@Param('id', ParseUUIDPipe) id: string): Promise<unknown> {
    return this.contentAdminService.deleteAdminItem('experiences', id);
  }
}
