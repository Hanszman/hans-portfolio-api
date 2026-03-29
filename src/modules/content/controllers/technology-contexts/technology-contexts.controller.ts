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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AdminJwtAuthGuard } from '../../../auth/guards/admin-jwt-auth.guard';
import { AdminRoleGuard } from '../../../auth/guards/admin-role.guard';
import { ApiRoutes } from '../../../../routing/api-routes';
import { ContentCollectionQueryRequest } from '../../contracts/shared/content-query.request';
import { ApiContentCollectionQueries } from '../../decorators/content-swagger.decorator';
import {
  CreateTechnologyContextRequest,
  UpdateTechnologyContextRequest,
} from '../../contracts/technology-contexts/technology-contexts.request';
import {
  TechnologyContextCollectionResponse,
  TechnologyContextGroupResponse,
  TechnologyContextMutationResponse,
} from '../../contracts/technology-contexts/technology-contexts.response';
import { TechnologyContextsService } from '../../services/technology-contexts/technology-contexts.service';
import type { PaginatedContentCollection } from '../../types/content.types';

@ApiTags('Technology Contexts')
@Controller(ApiRoutes.content.technologyContexts)
export class TechnologyContextsController {
  constructor(
    private readonly technologyContextsService: TechnologyContextsService,
  ) {}

  @Get()
  @ApiContentCollectionQueries('technologies')
  @ApiQuery({
    name: 'highlight',
    required: false,
    type: Boolean,
    description: 'Filters highlighted technologies only.',
  })
  @ApiOkResponse({ type: TechnologyContextCollectionResponse })
  getTechnologyContexts(
    @Query() query: ContentCollectionQueryRequest,
  ): Promise<PaginatedContentCollection> {
    return this.technologyContextsService.getPublicCollection(query);
  }

  @Get(':slug')
  @ApiOkResponse({ type: TechnologyContextGroupResponse })
  getTechnologyContextsByTechnologySlug(
    @Param('slug') slug: string,
  ): Promise<TechnologyContextGroupResponse> {
    return this.technologyContextsService.getPublicItem(
      slug,
    ) as Promise<TechnologyContextGroupResponse>;
  }
}

@ApiTags('Technology Contexts')
@ApiBearerAuth()
@UseGuards(AdminJwtAuthGuard, AdminRoleGuard)
@Controller(`${ApiRoutes.admin.base}/${ApiRoutes.content.technologyContexts}`)
export class AdminTechnologyContextsController {
  constructor(
    private readonly technologyContextsService: TechnologyContextsService,
  ) {}

  @Post()
  @ApiBody({
    type: CreateTechnologyContextRequest,
    required: true,
    examples: {
      sample: {
        summary: 'Create technology context',
        value: {
          technologyId: '11111111-1111-4111-8111-111111111111',
          context: 'PROFESSIONAL',
          startedAt: '2020-01-01',
          endedAt: '2022-04-01',
        },
      },
    },
  })
  @ApiOkResponse({ type: TechnologyContextMutationResponse })
  createTechnologyContext(
    @Body() body: CreateTechnologyContextRequest,
  ): Promise<TechnologyContextMutationResponse> {
    return this.technologyContextsService.create(
      body,
    ) as Promise<TechnologyContextMutationResponse>;
  }

  @Put(':id')
  @ApiBody({
    type: UpdateTechnologyContextRequest,
    required: true,
    examples: {
      sample: {
        summary: 'Update technology context',
        value: {
          context: 'STUDY',
          startedAt: '2020-01-01',
          endedAt: null,
        },
      },
    },
  })
  @ApiOkResponse({ type: TechnologyContextMutationResponse })
  updateTechnologyContext(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateTechnologyContextRequest,
  ): Promise<TechnologyContextMutationResponse> {
    return this.technologyContextsService.update(
      id,
      body,
    ) as Promise<TechnologyContextMutationResponse>;
  }

  @Delete(':id')
  @ApiOkResponse({ type: TechnologyContextMutationResponse })
  deleteTechnologyContext(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<TechnologyContextMutationResponse> {
    return this.technologyContextsService.delete(
      id,
    ) as Promise<TechnologyContextMutationResponse>;
  }
}
