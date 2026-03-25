import { ApiProperty } from '@nestjs/swagger';

export class DatabaseDiagnosticsResponse {
  @ApiProperty({ example: true })
  isConnected!: boolean;

  @ApiProperty({ example: 'postgresql' })
  probe!: string;

  @ApiProperty({ example: 'hans-portfolio-db' })
  databaseName!: string;

  @ApiProperty({ example: 'portfolio' })
  currentSchema!: string;

  @ApiProperty({ example: 'PostgreSQL 17.4 on x86_64-pc-linux-musl...' })
  serverVersion!: string;

  @ApiProperty({ example: '2026-03-24T22:15:00.000Z' })
  executedAtUtc!: string;
}
