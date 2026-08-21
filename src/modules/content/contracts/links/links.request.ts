import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Min,
} from 'class-validator';
import { LinkType } from '@prisma/client';
import { PartialType } from '@nestjs/swagger';

export class CreateLinkRequest {
  @IsUrl()
  url!: string;

  @IsString()
  @IsNotEmpty()
  labelPt!: string;

  @IsString()
  @IsNotEmpty()
  labelEn!: string;

  @IsString()
  @IsNotEmpty()
  labelEs!: string;

  @IsEnum(LinkType)
  /* c8 ignore next */
  type!: LinkType;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  projectIds?: string[];
}

export class UpdateLinkRequest extends PartialType(CreateLinkRequest) {}
