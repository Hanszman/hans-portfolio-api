import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiRoutes } from '../../../../routing/api-routes';
import { AdminSessionResponse } from '../../contracts/admin-session/admin-session.response';
import { AdminJwtAuthGuard } from '../../guards/admin-jwt-auth.guard';
import { AdminRoleGuard } from '../../guards/admin-role.guard';
import { AdminSessionService } from '../../services/admin-session/admin-session.service';
import type { AuthenticatedAdminRequest } from '../../types/admin-session.types';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller(ApiRoutes.admin.base)
export class AdminSessionController {
  constructor(private readonly adminSessionService: AdminSessionService) {}

  @Get(ApiRoutes.admin.session)
  @UseGuards(AdminJwtAuthGuard, AdminRoleGuard)
  @ApiOperation({
    summary: 'Returns the current authenticated admin session.',
  })
  @ApiOkResponse({ type: AdminSessionResponse })
  @ApiUnauthorizedResponse({ description: 'Admin authentication is required.' })
  getSession(@Req() request: AuthenticatedAdminRequest): AdminSessionResponse {
    return this.adminSessionService.getSession(request.user);
  }
}
