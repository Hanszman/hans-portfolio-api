import { Type } from 'class-transformer';
import { ImageAssetKind } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateImageAssetRequest {
  @IsString()
  @IsNotEmpty()
  fileName!: string;

  @IsString()
  @IsNotEmpty()
  filePath!: string;

  @IsString()
  @IsNotEmpty()
  folder!: string;

  @IsOptional()
  @IsEnum(ImageAssetKind)
  kind?: ImageAssetKind;

  @IsOptional()
  @IsString()
  altPt?: string;

  @IsOptional()
  @IsString()
  altEn?: string;

  @IsOptional()
  @IsString()
  captionPt?: string;

  @IsOptional()
  @IsString()
  captionEn?: string;

  @IsOptional()
  @IsString()
  mimeType?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  width?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  height?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

export class UpdateImageAssetRequest extends PartialType(
  CreateImageAssetRequest,
) {}
