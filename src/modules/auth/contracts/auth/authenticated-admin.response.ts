import { UserRole } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class AuthenticatedAdminResponse {
  @ApiProperty({ example: '5f8e1e74-2d49-4b5c-9724-2e8c9c8b0e11' })
  id!: string;

  @ApiProperty({ example: 'victor@example.com' })
  email!: string;

  @ApiProperty({ example: 'Victor Hanszman' })
  name!: string;

  @ApiProperty({ enum: UserRole, example: UserRole.ADMIN })
  role!: UserRole;
}
