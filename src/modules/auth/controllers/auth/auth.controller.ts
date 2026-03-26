import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiRoutes } from '../../../../routing/api-routes';
import { LoginRequest } from '../../contracts/auth/login.request';
import { LoginResponse } from '../../contracts/auth/login.response';
import { AuthService } from '../../services/auth/auth.service';

@ApiTags('Auth')
@Controller(ApiRoutes.auth.base)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(ApiRoutes.auth.login)
  @ApiOperation({ summary: 'Authenticates the admin user and returns a JWT.' })
  @ApiOkResponse({ type: LoginResponse })
  @ApiUnauthorizedResponse({ description: 'Invalid admin credentials.' })
  login(@Body() request: LoginRequest): Promise<LoginResponse> {
    return this.authService.login(request.email, request.password);
  }
}
