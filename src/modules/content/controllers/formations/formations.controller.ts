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
  CreateFormationRequest,
  UpdateFormationRequest,
} from '../../contracts/formations/formations.request';
import { ContentAdminService } from '../../services/content-admin/content-admin.service';
import { ContentReadService } from '../../services/content-read/content-read.service';
import { ApiRoutes } from '../../../../routing/api-routes';

@ApiTags('Formations')
@Controller(ApiRoutes.content.formations)
export class FormationsController {
  constructor(private readonly contentReadService: ContentReadService) {}

  @Get()
  getFormations(): Promise<unknown[]> {
    return this.contentReadService.getPublicCollection('formations');
  }

  @Get(':slug')
  getFormationBySlug(@Param('slug') slug: string): Promise<unknown> {
    return this.contentReadService.getPublicItem('formations', slug);
  }
}

@ApiTags('Formations')
@ApiBearerAuth()
@UseGuards(AdminJwtAuthGuard, AdminRoleGuard)
@Controller(`${ApiRoutes.admin.base}/${ApiRoutes.content.formations}`)
export class AdminFormationsController {
  constructor(private readonly contentAdminService: ContentAdminService) {}

  @Get()
  getFormations(): Promise<unknown[]> {
    return this.contentAdminService.getAdminCollection('formations');
  }

  @Get(':id')
  getFormationById(@Param('id', ParseUUIDPipe) id: string): Promise<unknown> {
    return this.contentAdminService.getAdminItemById('formations', id);
  }

  @Post()
  createFormation(@Body() body: CreateFormationRequest): Promise<unknown> {
    return this.contentAdminService.createAdminItem('formations', body);
  }

  @Put(':id')
  updateFormation(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateFormationRequest,
  ): Promise<unknown> {
    return this.contentAdminService.updateAdminItem('formations', id, body);
  }

  @Delete(':id')
  deleteFormation(@Param('id', ParseUUIDPipe) id: string): Promise<unknown> {
    return this.contentAdminService.deleteAdminItem('formations', id);
  }
}
