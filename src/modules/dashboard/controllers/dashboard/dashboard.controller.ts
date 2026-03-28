import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiRoutes } from '../../../../routing/api-routes';
import {
  DashboardHighlightsResponse,
  DashboardOverviewResponse,
  DashboardProfessionalTimelineResponse,
  DashboardProjectContextsResponse,
  DashboardStackDistributionResponse,
  DashboardTechnologyUsageResponse,
} from '../../contracts/dashboard/dashboard.response';
import { DashboardService } from '../../services/dashboard/dashboard.service';

@ApiTags('Dashboard')
@Controller(ApiRoutes.dashboard.base)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({
    summary: 'Returns the full dashboard analytics payload for the portfolio.',
  })
  @ApiOkResponse({ type: DashboardOverviewResponse })
  getDashboardOverview(): Promise<DashboardOverviewResponse> {
    return this.dashboardService.getDashboardOverview();
  }

  @Get(ApiRoutes.dashboard.stackDistribution)
  @ApiOperation({
    summary: 'Returns the stack distribution based on stack tags.',
  })
  @ApiOkResponse({ type: DashboardStackDistributionResponse })
  getStackDistribution(): Promise<DashboardStackDistributionResponse> {
    return this.dashboardService.getStackDistribution();
  }

  @Get(ApiRoutes.dashboard.projectContexts)
  @ApiOperation({
    summary:
      'Returns the published project distribution by context and environment.',
  })
  @ApiOkResponse({ type: DashboardProjectContextsResponse })
  getProjectContexts(): Promise<DashboardProjectContextsResponse> {
    return this.dashboardService.getProjectContexts();
  }

  @Get(ApiRoutes.dashboard.technologyUsage)
  @ApiOperation({
    summary:
      'Returns technology usage distributions by level, frequency, context, and source.',
  })
  @ApiOkResponse({ type: DashboardTechnologyUsageResponse })
  getTechnologyUsage(): Promise<DashboardTechnologyUsageResponse> {
    return this.dashboardService.getTechnologyUsage();
  }

  @Get(ApiRoutes.dashboard.professionalTimeline)
  @ApiOperation({
    summary:
      'Returns the published professional timeline derived from experiences.',
  })
  @ApiOkResponse({ type: DashboardProfessionalTimelineResponse })
  getProfessionalTimeline(): Promise<DashboardProfessionalTimelineResponse> {
    return this.dashboardService.getProfessionalTimeline();
  }

  @Get(ApiRoutes.dashboard.highlights)
  @ApiOperation({
    summary:
      'Returns the highlighted portfolio items across the main entities.',
  })
  @ApiOkResponse({ type: DashboardHighlightsResponse })
  getHighlights(): Promise<DashboardHighlightsResponse> {
    return this.dashboardService.getHighlights();
  }
}
