import { ApiProperty } from '@nestjs/swagger';

export class SystemResponse {
  @ApiProperty({ example: 'Hans Portfolio API' })
  name!: string;

  @ApiProperty({ example: 'system' })
  module!: 'system';

  @ApiProperty({ example: 'operational' })
  status!: 'operational';

  @ApiProperty({
    example: [
      '/system/ping',
      '/system/database',
      '/system/health',
      '/health',
      '/swagger',
    ],
    type: [String],
  })
  routes!: string[];
}
