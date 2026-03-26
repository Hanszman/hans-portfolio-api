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
  CreateExperienceRequest,
  UpdateExperienceRequest,
} from '../../contracts/experiences/experiences.request';
import { ContentAdminService } from '../../services/content-admin/content-admin.service';
import { ContentReadService } from '../../services/content-read/content-read.service';
import { ApiRoutes } from '../../../../routing/api-routes';

@ApiTags('Experiences')
@Controller(ApiRoutes.content.experiences)
export class ExperiencesController {
  constructor(private readonly contentReadService: ContentReadService) {}

  @Get()
  getExperiences(): Promise<unknown[]> {
    return this.contentReadService.getPublicCollection('experiences');
  }

  @Get(':slug')
  getExperienceBySlug(@Param('slug') slug: string): Promise<unknown> {
    return this.contentReadService.getPublicItem('experiences', slug);
  }
}

@ApiTags('Experiences')
@ApiBearerAuth()
@UseGuards(AdminJwtAuthGuard, AdminRoleGuard)
@Controller(`${ApiRoutes.admin.base}/${ApiRoutes.content.experiences}`)
export class AdminExperiencesController {
  constructor(private readonly contentAdminService: ContentAdminService) {}

  @Post()
  createExperience(@Body() body: CreateExperienceRequest): Promise<unknown> {
    return this.contentAdminService.createAdminItem('experiences', body);
  }

  @Put(':id')
  updateExperience(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateExperienceRequest,
  ): Promise<unknown> {
    return this.contentAdminService.updateAdminItem('experiences', id, body);
  }

  @Delete(':id')
  deleteExperience(@Param('id', ParseUUIDPipe) id: string): Promise<unknown> {
    return this.contentAdminService.deleteAdminItem('experiences', id);
  }
}
