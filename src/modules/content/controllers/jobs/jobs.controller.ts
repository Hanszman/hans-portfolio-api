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
  CreateJobRequest,
  UpdateJobRequest,
} from '../../contracts/jobs/jobs.request';
import { ContentAdminService } from '../../services/content-admin/content-admin.service';
import { ContentReadService } from '../../services/content-read/content-read.service';
import { ApiRoutes } from '../../../../routing/api-routes';

@ApiTags('Jobs')
@Controller(ApiRoutes.content.jobs)
export class JobsController {
  constructor(private readonly contentReadService: ContentReadService) {}

  @Get()
  getJobs(): Promise<unknown[]> {
    return this.contentReadService.getPublicCollection('jobs');
  }

  @Get(':slug')
  getJobBySlug(@Param('slug') slug: string): Promise<unknown> {
    return this.contentReadService.getPublicItem('jobs', slug);
  }
}

@ApiTags('Jobs')
@ApiBearerAuth()
@UseGuards(AdminJwtAuthGuard, AdminRoleGuard)
@Controller(`${ApiRoutes.admin.base}/${ApiRoutes.content.jobs}`)
export class AdminJobsController {
  constructor(private readonly contentAdminService: ContentAdminService) {}

  @Post()
  createJob(@Body() body: CreateJobRequest): Promise<unknown> {
    return this.contentAdminService.createAdminItem('jobs', body);
  }

  @Put(':id')
  updateJob(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateJobRequest,
  ): Promise<unknown> {
    return this.contentAdminService.updateAdminItem('jobs', id, body);
  }

  @Delete(':id')
  deleteJob(@Param('id', ParseUUIDPipe) id: string): Promise<unknown> {
    return this.contentAdminService.deleteAdminItem('jobs', id);
  }
}
