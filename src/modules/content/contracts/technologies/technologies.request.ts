import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';
import { TechnologyCategory } from '@prisma/client';
import { PartialType } from '@nestjs/swagger';

export class CreateTechnologyRequest {
  @IsString()
  @IsNotEmpty()
  slug!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEnum(TechnologyCategory)
  category!: TechnologyCategory;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsUrl()
  officialUrl?: string;

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

export class UpdateTechnologyRequest extends PartialType(
  CreateTechnologyRequest,
) {}
