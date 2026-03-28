import { ApiRoutes } from '../../routing/api-routes';
import {
  CreateCustomerRequest,
  UpdateCustomerRequest,
} from './contracts/customers/customers.request';
import {
  CreateExperienceRequest,
  UpdateExperienceRequest,
} from './contracts/experiences/experiences.request';
import {
  CreateFormationRequest,
  UpdateFormationRequest,
} from './contracts/formations/formations.request';
import {
  CreateImageAssetRequest,
  UpdateImageAssetRequest,
} from './contracts/image-assets/image-assets.request';
import {
  CreateJobRequest,
  UpdateJobRequest,
} from './contracts/jobs/jobs.request';
import {
  CreateLinkRequest,
  UpdateLinkRequest,
} from './contracts/links/links.request';
import {
  CreatePortfolioSettingRequest,
  UpdatePortfolioSettingRequest,
} from './contracts/portfolio-settings/portfolio-settings.request';
import {
  CreateProjectRequest,
  UpdateProjectRequest,
} from './contracts/projects/projects.request';
import {
  CreateSpokenLanguageRequest,
  UpdateSpokenLanguageRequest,
} from './contracts/spoken-languages/spoken-languages.request';
import {
  CreateTagRequest,
  UpdateTagRequest,
} from './contracts/tags/tags.request';
import {
  CreateTechnologyRequest,
  UpdateTechnologyRequest,
} from './contracts/technologies/technologies.request';
import type {
  ContentQueryInclude,
  ContentResourceConfig,
  ContentResourceKey,
} from './types/content.types';

const PROJECT_INCLUDE: ContentQueryInclude = {
  technologies: {
    include: {
      technology: true,
    },
  },
  experiences: {
    include: {
      experience: true,
    },
    orderBy: {
      sortOrder: 'asc',
    },
  },
  tags: {
    include: {
      tag: true,
    },
  },
  links: {
    include: {
      link: true,
    },
    orderBy: {
      sortOrder: 'asc',
    },
  },
  imageAssets: {
    include: {
      imageAsset: true,
    },
    orderBy: {
      sortOrder: 'asc',
    },
  },
};

const EXPERIENCE_INCLUDE: ContentQueryInclude = {
  technologies: {
    include: {
      technology: true,
    },
  },
  projects: {
    include: {
      project: true,
    },
    orderBy: {
      sortOrder: 'asc',
    },
  },
  customers: {
    include: {
      customer: true,
    },
    orderBy: {
      sortOrder: 'asc',
    },
  },
  jobs: {
    include: {
      job: true,
    },
    orderBy: {
      sortOrder: 'asc',
    },
  },
  links: {
    include: {
      link: true,
    },
    orderBy: {
      sortOrder: 'asc',
    },
  },
  imageAssets: {
    include: {
      imageAsset: true,
    },
    orderBy: {
      sortOrder: 'asc',
    },
  },
};

const TECHNOLOGY_INCLUDE: ContentQueryInclude = {
  projectUsages: {
    include: {
      project: true,
    },
  },
  experienceUses: {
    include: {
      experience: true,
    },
  },
  formationUses: {
    include: {
      formation: true,
    },
  },
  tags: {
    include: {
      tag: true,
    },
  },
  imageAssets: {
    include: {
      imageAsset: true,
    },
    orderBy: {
      sortOrder: 'asc',
    },
  },
};

const FORMATION_INCLUDE: ContentQueryInclude = {
  technologies: {
    include: {
      technology: true,
    },
  },
  links: {
    include: {
      link: true,
    },
    orderBy: {
      sortOrder: 'asc',
    },
  },
  imageAssets: {
    include: {
      imageAsset: true,
    },
    orderBy: {
      sortOrder: 'asc',
    },
  },
};

const CUSTOMER_INCLUDE: ContentQueryInclude = {
  experiences: {
    include: {
      experience: true,
    },
    orderBy: {
      sortOrder: 'asc',
    },
  },
  imageAssets: {
    include: {
      imageAsset: true,
    },
    orderBy: {
      sortOrder: 'asc',
    },
  },
};

const JOB_INCLUDE: ContentQueryInclude = {
  experiences: {
    include: {
      experience: true,
    },
    orderBy: {
      sortOrder: 'asc',
    },
  },
  imageAssets: {
    include: {
      imageAsset: true,
    },
    orderBy: {
      sortOrder: 'asc',
    },
  },
};

const SPOKEN_LANGUAGE_INCLUDE: ContentQueryInclude = {
  imageAssets: {
    include: {
      imageAsset: true,
    },
    orderBy: {
      sortOrder: 'asc',
    },
  },
};

const LINK_INCLUDE: ContentQueryInclude = {
  projects: {
    include: {
      project: true,
    },
    orderBy: {
      sortOrder: 'asc',
    },
  },
  experiences: {
    include: {
      experience: true,
    },
    orderBy: {
      sortOrder: 'asc',
    },
  },
  formations: {
    include: {
      formation: true,
    },
    orderBy: {
      sortOrder: 'asc',
    },
  },
};

const IMAGE_ASSET_INCLUDE: ContentQueryInclude = {
  projects: {
    include: {
      project: true,
    },
    orderBy: {
      sortOrder: 'asc',
    },
  },
  experiences: {
    include: {
      experience: true,
    },
    orderBy: {
      sortOrder: 'asc',
    },
  },
  formations: {
    include: {
      formation: true,
    },
    orderBy: {
      sortOrder: 'asc',
    },
  },
  technologies: {
    include: {
      technology: true,
    },
    orderBy: {
      sortOrder: 'asc',
    },
  },
  spokenLanguages: {
    include: {
      spokenLanguage: true,
    },
    orderBy: {
      sortOrder: 'asc',
    },
  },
  customers: {
    include: {
      customer: true,
    },
    orderBy: {
      sortOrder: 'asc',
    },
  },
  jobs: {
    include: {
      job: true,
    },
    orderBy: {
      sortOrder: 'asc',
    },
  },
};

const TAG_INCLUDE: ContentQueryInclude = {
  projects: {
    include: {
      project: true,
    },
  },
  technologies: {
    include: {
      technology: true,
    },
  },
};

export const CONTENT_RESOURCE_CONFIGS = {
  projects: {
    key: 'projects',
    tag: 'Projects',
    routePath: ApiRoutes.content.projects,
    delegateName: 'project',
    publicLookupField: 'slug',
    publicLookupParam: 'slug',
    adminLookupParam: 'id',
    hasPublishedFlag: true,
    defaultOrderBy: [{ sortOrder: 'asc' }, { slug: 'asc' }],
    publicInclude: PROJECT_INCLUDE,
    adminInclude: PROJECT_INCLUDE,
    searchFields: [
      'slug',
      'titlePt',
      'titleEn',
      'shortDescriptionPt',
      'shortDescriptionEn',
    ],
    filterDefinitions: [
      { queryKey: 'slug' },
      { queryKey: 'context' },
      { queryKey: 'status' },
      { queryKey: 'environment' },
      { queryKey: 'featured' },
      { queryKey: 'highlight' },
    ],
    createRequestDto: CreateProjectRequest,
    updateRequestDto: UpdateProjectRequest,
  },
  experiences: {
    key: 'experiences',
    tag: 'Experiences',
    routePath: ApiRoutes.content.experiences,
    delegateName: 'experience',
    publicLookupField: 'slug',
    publicLookupParam: 'slug',
    adminLookupParam: 'id',
    hasPublishedFlag: true,
    defaultOrderBy: [{ sortOrder: 'asc' }, { startDate: 'desc' }],
    publicInclude: EXPERIENCE_INCLUDE,
    adminInclude: EXPERIENCE_INCLUDE,
    searchFields: [
      'slug',
      'companyName',
      'titlePt',
      'titleEn',
      'summaryPt',
      'summaryEn',
    ],
    filterDefinitions: [
      { queryKey: 'slug' },
      { queryKey: 'companyName', operator: 'contains' },
      { queryKey: 'isCurrent' },
      { queryKey: 'highlight' },
    ],
    createRequestDto: CreateExperienceRequest,
    updateRequestDto: UpdateExperienceRequest,
  },
  technologies: {
    key: 'technologies',
    tag: 'Technologies',
    routePath: ApiRoutes.content.technologies,
    delegateName: 'technology',
    publicLookupField: 'slug',
    publicLookupParam: 'slug',
    adminLookupParam: 'id',
    hasPublishedFlag: true,
    defaultOrderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    publicInclude: TECHNOLOGY_INCLUDE,
    adminInclude: TECHNOLOGY_INCLUDE,
    searchFields: ['slug', 'name'],
    filterDefinitions: [
      { queryKey: 'slug' },
      { queryKey: 'name', operator: 'contains' },
      { queryKey: 'category' },
      { queryKey: 'highlight' },
    ],
    createRequestDto: CreateTechnologyRequest,
    updateRequestDto: UpdateTechnologyRequest,
  },
  formations: {
    key: 'formations',
    tag: 'Formations',
    routePath: ApiRoutes.content.formations,
    delegateName: 'formation',
    publicLookupField: 'slug',
    publicLookupParam: 'slug',
    adminLookupParam: 'id',
    hasPublishedFlag: true,
    defaultOrderBy: [{ sortOrder: 'asc' }, { startDate: 'desc' }],
    publicInclude: FORMATION_INCLUDE,
    adminInclude: FORMATION_INCLUDE,
    searchFields: ['slug', 'institution', 'titlePt', 'titleEn'],
    filterDefinitions: [
      { queryKey: 'slug' },
      { queryKey: 'institution', operator: 'contains' },
      { queryKey: 'degreeType' },
      { queryKey: 'highlight' },
    ],
    createRequestDto: CreateFormationRequest,
    updateRequestDto: UpdateFormationRequest,
  },
  spokenLanguages: {
    key: 'spokenLanguages',
    tag: 'Spoken Languages',
    routePath: ApiRoutes.content.spokenLanguages,
    delegateName: 'spokenLanguage',
    publicLookupField: 'code',
    publicLookupParam: 'code',
    adminLookupParam: 'id',
    hasPublishedFlag: false,
    defaultOrderBy: [{ sortOrder: 'asc' }, { code: 'asc' }],
    publicInclude: SPOKEN_LANGUAGE_INCLUDE,
    adminInclude: SPOKEN_LANGUAGE_INCLUDE,
    searchFields: ['code', 'namePt', 'nameEn'],
    filterDefinitions: [
      { queryKey: 'code' },
      { queryKey: 'proficiency' },
      { queryKey: 'highlight' },
    ],
    createRequestDto: CreateSpokenLanguageRequest,
    updateRequestDto: UpdateSpokenLanguageRequest,
  },
  customers: {
    key: 'customers',
    tag: 'Customers',
    routePath: ApiRoutes.content.customers,
    delegateName: 'customer',
    publicLookupField: 'slug',
    publicLookupParam: 'slug',
    adminLookupParam: 'id',
    hasPublishedFlag: true,
    defaultOrderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    publicInclude: CUSTOMER_INCLUDE,
    adminInclude: CUSTOMER_INCLUDE,
    searchFields: ['slug', 'name', 'summaryPt', 'summaryEn'],
    filterDefinitions: [
      { queryKey: 'slug' },
      { queryKey: 'name', operator: 'contains' },
      { queryKey: 'highlight' },
    ],
    createRequestDto: CreateCustomerRequest,
    updateRequestDto: UpdateCustomerRequest,
  },
  jobs: {
    key: 'jobs',
    tag: 'Jobs',
    routePath: ApiRoutes.content.jobs,
    delegateName: 'job',
    publicLookupField: 'slug',
    publicLookupParam: 'slug',
    adminLookupParam: 'id',
    hasPublishedFlag: true,
    defaultOrderBy: [{ sortOrder: 'asc' }, { slug: 'asc' }],
    publicInclude: JOB_INCLUDE,
    adminInclude: JOB_INCLUDE,
    searchFields: ['slug', 'namePt', 'nameEn', 'summaryPt', 'summaryEn'],
    filterDefinitions: [{ queryKey: 'slug' }, { queryKey: 'highlight' }],
    createRequestDto: CreateJobRequest,
    updateRequestDto: UpdateJobRequest,
  },
  links: {
    key: 'links',
    tag: 'Links',
    routePath: ApiRoutes.content.links,
    delegateName: 'link',
    publicLookupField: 'id',
    publicLookupParam: 'id',
    adminLookupParam: 'id',
    hasPublishedFlag: true,
    defaultOrderBy: [{ sortOrder: 'asc' }, { labelEn: 'asc' }],
    publicInclude: LINK_INCLUDE,
    adminInclude: LINK_INCLUDE,
    searchFields: [
      'url',
      'labelPt',
      'labelEn',
      'descriptionPt',
      'descriptionEn',
    ],
    filterDefinitions: [
      { queryKey: 'type' },
      { queryKey: 'url', operator: 'contains' },
    ],
    createRequestDto: CreateLinkRequest,
    updateRequestDto: UpdateLinkRequest,
  },
  imageAssets: {
    key: 'imageAssets',
    tag: 'Image Assets',
    routePath: ApiRoutes.content.imageAssets,
    delegateName: 'imageAsset',
    publicLookupField: 'id',
    publicLookupParam: 'id',
    adminLookupParam: 'id',
    hasPublishedFlag: true,
    defaultOrderBy: [{ sortOrder: 'asc' }, { filePath: 'asc' }],
    publicInclude: IMAGE_ASSET_INCLUDE,
    adminInclude: IMAGE_ASSET_INCLUDE,
    searchFields: [
      'fileName',
      'filePath',
      'folder',
      'altPt',
      'altEn',
      'captionPt',
      'captionEn',
    ],
    filterDefinitions: [
      { queryKey: 'fileName', operator: 'contains' },
      { queryKey: 'folder' },
      { queryKey: 'kind' },
    ],
    createRequestDto: CreateImageAssetRequest,
    updateRequestDto: UpdateImageAssetRequest,
  },
  tags: {
    key: 'tags',
    tag: 'Tags',
    routePath: ApiRoutes.content.tags,
    delegateName: 'tag',
    publicLookupField: 'slug',
    publicLookupParam: 'slug',
    adminLookupParam: 'id',
    hasPublishedFlag: false,
    defaultOrderBy: [{ sortOrder: 'asc' }, { slug: 'asc' }],
    publicInclude: TAG_INCLUDE,
    adminInclude: TAG_INCLUDE,
    searchFields: ['slug', 'namePt', 'nameEn'],
    filterDefinitions: [{ queryKey: 'slug' }, { queryKey: 'type' }],
    createRequestDto: CreateTagRequest,
    updateRequestDto: UpdateTagRequest,
  },
  portfolioSettings: {
    key: 'portfolioSettings',
    tag: 'Portfolio Settings',
    routePath: ApiRoutes.content.portfolioSettings,
    delegateName: 'portfolioSetting',
    publicLookupField: 'key',
    publicLookupParam: 'key',
    adminLookupParam: 'id',
    hasPublishedFlag: false,
    defaultOrderBy: [{ key: 'asc' }],
    searchFields: ['key', 'description'],
    filterDefinitions: [{ queryKey: 'key' }],
    createRequestDto: CreatePortfolioSettingRequest,
    updateRequestDto: UpdatePortfolioSettingRequest,
  },
} as const satisfies Record<ContentResourceKey, ContentResourceConfig>;
