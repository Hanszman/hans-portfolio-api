import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { TagType } from '@prisma/client';
import { PartialType } from '@nestjs/swagger';

export class CreateTagRequest {
  @IsString()
  @IsNotEmpty()
  slug!: string;

  @IsString()
  @IsNotEmpty()
  namePt!: string;

  @IsString()
  @IsNotEmpty()
  nameEn!: string;

  @IsEnum(TagType)
  type!: TagType;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder?: number;
}

export class UpdateTagRequest extends PartialType(CreateTagRequest) {}
