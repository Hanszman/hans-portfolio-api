import { Injectable } from '@nestjs/common';
import { CONTENT_RESOURCE_CONFIGS } from '../../content-resource.config';
import type {
  ContentResourceConfig,
  ContentResourceKey,
} from '../../types/content.types';

@Injectable()
export class ContentResourceRegistryService {
  getConfig(resource: ContentResourceKey): ContentResourceConfig {
    return CONTENT_RESOURCE_CONFIGS[resource];
  }

  getAllConfigs(): ContentResourceConfig[] {
    return Object.values(CONTENT_RESOURCE_CONFIGS);
  }
}
