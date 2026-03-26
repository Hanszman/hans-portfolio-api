import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateCustomerRequest {
  @IsString()
  @IsNotEmpty()
  slug!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  summaryPt!: string;

  @IsString()
  @IsNotEmpty()
  summaryEn!: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsBoolean()
  highlight?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

export class UpdateCustomerRequest extends PartialType(CreateCustomerRequest) {}
