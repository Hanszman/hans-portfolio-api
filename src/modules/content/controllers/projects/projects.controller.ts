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
  CreateProjectRequest,
  UpdateProjectRequest,
} from '../../contracts/projects/projects.request';
import { ContentCollectionQueryRequest } from '../../contracts/shared/content-query.request';
import { ContentAdminService } from '../../services/content-admin/content-admin.service';
import { ContentReadService } from '../../services/content-read/content-read.service';
import { ApiRoutes } from '../../../../routing/api-routes';
import type { PaginatedContentCollection } from '../../types/content.types';

@ApiTags('Projects')
@Controller(ApiRoutes.content.projects)
export class ProjectsController {
  constructor(private readonly contentReadService: ContentReadService) {}

  @Get()
  getProjects(
    @Query() query: ContentCollectionQueryRequest,
  ): Promise<PaginatedContentCollection> {
    return this.contentReadService.getPublicCollection('projects', query);
  }

  @Get(':slug')
  getProjectBySlug(@Param('slug') slug: string): Promise<unknown> {
    return this.contentReadService.getPublicItem('projects', slug);
  }
}

@ApiTags('Projects')
@ApiBearerAuth()
@UseGuards(AdminJwtAuthGuard, AdminRoleGuard)
@Controller(`${ApiRoutes.admin.base}/${ApiRoutes.content.projects}`)
export class AdminProjectsController {
  constructor(private readonly contentAdminService: ContentAdminService) {}

  @Post()
  createProject(@Body() body: CreateProjectRequest): Promise<unknown> {
    return this.contentAdminService.createAdminItem('projects', body);
  }

  @Put(':id')
  updateProject(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateProjectRequest,
  ): Promise<unknown> {
    return this.contentAdminService.updateAdminItem('projects', id, body);
  }

  @Delete(':id')
  deleteProject(@Param('id', ParseUUIDPipe) id: string): Promise<unknown> {
    return this.contentAdminService.deleteAdminItem('projects', id);
  }
}
