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
  CreateTechnologyRequest,
  UpdateTechnologyRequest,
} from '../../contracts/technologies/technologies.request';
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

@ApiTags('Technologies')
@Controller(ApiRoutes.content.technologies)
export class TechnologiesController {
  /* c8 ignore next */
  constructor(private readonly contentReadService: ContentReadService) {}

  @Get()
  @ApiContentCollectionQueries('technologies')
  getTechnologies(
    /* c8 ignore next */
    @Query() query: ContentCollectionQueryRequest,
    /* c8 ignore next */
  ): Promise<PaginatedContentCollection> {
    return this.contentReadService.getPublicCollection('technologies', query);
  }

  @Get(':slug')
  /* c8 ignore next */
  getTechnologyBySlug(@Param('slug') slug: string): Promise<unknown> {
    return this.contentReadService.getPublicItem('technologies', slug);
  }
}

@ApiTags('Technologies')
@ApiBearerAuth()
@UseGuards(AdminJwtAuthGuard, AdminRoleGuard)
@Controller(`${ApiRoutes.admin.base}/${ApiRoutes.content.technologies}`)
export class AdminTechnologiesController {
  /* c8 ignore next */
  constructor(private readonly contentAdminService: ContentAdminService) {}

  @Post()
  @ApiContentCreateBody('technologies')
  /* c8 ignore next */
  createTechnology(@Body() body: CreateTechnologyRequest): Promise<unknown> {
    return this.contentAdminService.createAdminItem('technologies', body);
  }

  @Put(':id')
  @ApiContentUpdateBody('technologies')
  updateTechnology(
    @Param('id', ParseUUIDPipe) id: string,
    /* c8 ignore next */
    @Body() body: UpdateTechnologyRequest,
    /* c8 ignore next */
  ): Promise<unknown> {
    return this.contentAdminService.updateAdminItem('technologies', id, body);
  }

  @Delete(':id')
  /* c8 ignore next */
  deleteTechnology(@Param('id', ParseUUIDPipe) id: string): Promise<unknown> {
    return this.contentAdminService.deleteAdminItem('technologies', id);
  }
}
