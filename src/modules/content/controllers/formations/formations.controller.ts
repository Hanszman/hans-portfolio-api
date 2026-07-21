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
  CreateFormationRequest,
  UpdateFormationRequest,
} from '../../contracts/formations/formations.request';
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

@ApiTags('Formations')
@Controller(ApiRoutes.content.formations)
export class FormationsController {
  /* c8 ignore next */
  constructor(private readonly contentReadService: ContentReadService) {}

  @Get()
  @ApiContentCollectionQueries('formations')
  getFormations(
    /* c8 ignore next */
    @Query() query: ContentCollectionQueryRequest,
    /* c8 ignore next */
  ): Promise<PaginatedContentCollection> {
    return this.contentReadService.getPublicCollection('formations', query);
  }

  @Get(':slug')
  /* c8 ignore next */
  getFormationBySlug(@Param('slug') slug: string): Promise<unknown> {
    return this.contentReadService.getPublicItem('formations', slug);
  }
}

@ApiTags('Formations')
@ApiBearerAuth()
@UseGuards(AdminJwtAuthGuard, AdminRoleGuard)
@Controller(`${ApiRoutes.admin.base}/${ApiRoutes.content.formations}`)
export class AdminFormationsController {
  /* c8 ignore next */
  constructor(private readonly contentAdminService: ContentAdminService) {}

  @Post()
  @ApiContentCreateBody('formations')
  /* c8 ignore next */
  createFormation(@Body() body: CreateFormationRequest): Promise<unknown> {
    return this.contentAdminService.createAdminItem('formations', body);
  }

  @Put(':id')
  @ApiContentUpdateBody('formations')
  updateFormation(
    @Param('id', ParseUUIDPipe) id: string,
    /* c8 ignore next */
    @Body() body: UpdateFormationRequest,
    /* c8 ignore next */
  ): Promise<unknown> {
    return this.contentAdminService.updateAdminItem('formations', id, body);
  }

  @Delete(':id')
  /* c8 ignore next */
  deleteFormation(@Param('id', ParseUUIDPipe) id: string): Promise<unknown> {
    return this.contentAdminService.deleteAdminItem('formations', id);
  }
}
