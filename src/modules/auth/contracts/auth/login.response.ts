import { ApiProperty } from '@nestjs/swagger';
import { AuthenticatedAdminResponse } from './authenticated-admin.response';

export class LoginResponse {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken!: string;

  @ApiProperty({ example: 'Bearer' })
  tokenType!: 'Bearer';

  @ApiProperty({ example: '1d' })
  expiresIn!: string;

  @ApiProperty({ type: AuthenticatedAdminResponse })
  user!: AuthenticatedAdminResponse;
}
