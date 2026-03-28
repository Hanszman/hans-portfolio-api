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
  constructor(private readonly contentReadService: ContentReadService) {}

  @Get()
  @ApiContentCollectionQueries('technologies')
  getTechnologies(
    @Query() query: ContentCollectionQueryRequest,
  ): Promise<PaginatedContentCollection> {
    return this.contentReadService.getPublicCollection('technologies', query);
  }

  @Get(':slug')
  getTechnologyBySlug(@Param('slug') slug: string): Promise<unknown> {
    return this.contentReadService.getPublicItem('technologies', slug);
  }
}

@ApiTags('Technologies')
@ApiBearerAuth()
@UseGuards(AdminJwtAuthGuard, AdminRoleGuard)
@Controller(`${ApiRoutes.admin.base}/${ApiRoutes.content.technologies}`)
export class AdminTechnologiesController {
  constructor(private readonly contentAdminService: ContentAdminService) {}

  @Post()
  @ApiContentCreateBody('technologies')
  createTechnology(@Body() body: CreateTechnologyRequest): Promise<unknown> {
    return this.contentAdminService.createAdminItem('technologies', body);
  }

  @Put(':id')
  @ApiContentUpdateBody('technologies')
  updateTechnology(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateTechnologyRequest,
  ): Promise<unknown> {
    return this.contentAdminService.updateAdminItem('technologies', id, body);
  }

  @Delete(':id')
  deleteTechnology(@Param('id', ParseUUIDPipe) id: string): Promise<unknown> {
    return this.contentAdminService.deleteAdminItem('technologies', id);
  }
}
