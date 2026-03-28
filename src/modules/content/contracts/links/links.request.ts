import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
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

  @IsOptional()
  @IsString()
  descriptionPt?: string;

  @IsOptional()
  @IsString()
  descriptionEn?: string;

  @IsEnum(LinkType)
  type!: LinkType;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  projectIds?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  experienceIds?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  formationIds?: string[];
}

export class UpdateLinkRequest extends PartialType(CreateLinkRequest) {}
