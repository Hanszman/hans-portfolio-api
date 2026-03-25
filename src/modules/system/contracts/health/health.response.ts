import { ApiProperty } from '@nestjs/swagger';

class HealthChecksResponse {
  @ApiProperty({ example: 'up' })
  database!: 'up';
}

export class HealthResponse {
  @ApiProperty({ example: 'healthy' })
  status!: 'healthy';

  @ApiProperty({ type: HealthChecksResponse })
  checks!: HealthChecksResponse;

  @ApiProperty({ example: '2026-03-24T22:15:00.000Z' })
  checkedAtUtc!: string;
}
