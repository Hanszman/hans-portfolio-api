import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import {
  CONTENT_IMAGE_ASSET_IDENTIFIER_MESSAGE,
  CONTENT_IMAGE_ASSET_IDENTIFIER_PATTERN,
  IsContentImageAssetIdArray,
} from './content-image-asset-validation';

class ImageAssetValidationHarness {
  @IsContentImageAssetIdArray()
  imageAssetIds!: string[];
}

describe('content image asset validation', () => {
  it('matches the persisted identifier pattern', () => {
    expect(
      CONTENT_IMAGE_ASSET_IDENTIFIER_PATTERN.test(
        '9b8d8895-35fb-ecd8-30cd-d3f0df4f7927',
      ),
    ).toBe(true);
    expect(CONTENT_IMAGE_ASSET_IDENTIFIER_PATTERN.test('ajax.png')).toBe(false);
  });

  it('validates image asset arrays with the shared decorator', () => {
    const valid = plainToInstance(ImageAssetValidationHarness, {
      imageAssetIds: ['9b8d8895-35fb-ecd8-30cd-d3f0df4f7927'],
    });
    const invalid = plainToInstance(ImageAssetValidationHarness, {
      imageAssetIds: ['ajax.png'],
    });

    expect(validateSync(valid)).toEqual([]);
    expect(validateSync(invalid)[0]?.constraints?.matches).toBe(
      CONTENT_IMAGE_ASSET_IDENTIFIER_MESSAGE,
    );
  });
});
