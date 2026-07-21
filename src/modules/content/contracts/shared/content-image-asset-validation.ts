import { Matches, ValidationOptions } from 'class-validator';

export const CONTENT_IMAGE_ASSET_IDENTIFIER_PATTERN =
  /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;

export const CONTENT_IMAGE_ASSET_IDENTIFIER_MESSAGE =
  'each value in imageAssetIds must be a UUID';

export function IsContentImageAssetIdArray(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return Matches(CONTENT_IMAGE_ASSET_IDENTIFIER_PATTERN, {
    each: true,
    message: CONTENT_IMAGE_ASSET_IDENTIFIER_MESSAGE,
    ...validationOptions,
  });
}
