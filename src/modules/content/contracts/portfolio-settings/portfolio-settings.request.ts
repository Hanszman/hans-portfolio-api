import { Type } from 'class-transformer';
import { IsDefined, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreatePortfolioSettingRequest {
  @IsString()
  @IsNotEmpty()
  key!: string;

  @IsDefined()
  @Type(() => Object)
  value!: unknown;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdatePortfolioSettingRequest extends PartialType(
  CreatePortfolioSettingRequest,
) {}
