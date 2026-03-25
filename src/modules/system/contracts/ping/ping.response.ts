import { ApiProperty } from '@nestjs/swagger';

export class PingResponse {
  @ApiProperty({ example: 'Hans Portfolio API' })
  name!: string;

  @ApiProperty({ example: 'development' })
  environment!: string;

  @ApiProperty({ example: 'ok' })
  status!: 'ok';

  @ApiProperty({ example: '2026-03-24T22:15:00.000Z' })
  utcNow!: string;
}
