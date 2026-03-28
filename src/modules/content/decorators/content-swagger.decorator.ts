import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiQuery } from '@nestjs/swagger';
import { CONTENT_RESOURCE_CONFIGS } from '../content-resource.config';
import type {
  ContentFilterQueryKey,
  ContentResourceKey,
} from '../types/content.types';

const QUERY_PARAM_METADATA: Record<
  ContentFilterQueryKey,
  {
    example: string | boolean;
    description: string;
    type: StringConstructor | BooleanConstructor;
  }
> = {
  search: {
    example: 'portfolio',
    description:
      'Case-insensitive text search across the configured fields of the resource.',
    type: String,
  },
  slug: {
    example: 'portfolio-remake',
    description: 'Filters by the resource slug.',
    type: String,
  },
  name: {
    example: 'TypeScript',
    description: 'Filters by a name field when the resource exposes one.',
    type: String,
  },
  code: {
    example: 'en',
    description: 'Filters by the language/code field.',
    type: String,
  },
  key: {
    example: 'hero',
    description: 'Filters by the setting key.',
    type: String,
  },
  featured: {
    example: true,
    description: 'Filters featured items only.',
    type: Boolean,
  },
  highlight: {
    example: true,
    description: 'Filters highlighted items only.',
    type: Boolean,
  },
  isCurrent: {
    example: true,
    description: 'Filters current experiences only.',
    type: Boolean,
  },
  category: {
    example: 'LANGUAGE',
    description: 'Filters by the technology category.',
    type: String,
  },
  context: {
    example: 'PERSONAL',
    description: 'Filters by the project context.',
    type: String,
  },
  status: {
    example: 'COMPLETED',
    description: 'Filters by the project status.',
    type: String,
  },
  environment: {
    example: 'FULLSTACK',
    description: 'Filters by the project environment.',
    type: String,
  },
  degreeType: {
    example: 'BACHELOR',
    description: 'Filters by the formation degree type.',
    type: String,
  },
  proficiency: {
    example: 'FLUENT',
    description: 'Filters by the spoken language proficiency.',
    type: String,
  },
  type: {
    example: 'STACK',
    description: 'Filters by the link or tag type.',
    type: String,
  },
  kind: {
    example: 'ICON',
    description: 'Filters by the image asset kind.',
    type: String,
  },
  folder: {
    example: 'skills',
    description: 'Filters by the image asset folder.',
    type: String,
  },
  companyName: {
    example: 'PagBank',
    description: 'Filters experiences by company name.',
    type: String,
  },
  institution: {
    example: 'FATEC',
    description: 'Filters formations by institution.',
    type: String,
  },
  url: {
    example: 'github.com',
    description: 'Filters links by URL.',
    type: String,
  },
  fileName: {
    example: 'typescript.svg',
    description: 'Filters image assets by file name.',
    type: String,
  },
};

const CONTENT_SWAGGER_EXAMPLES: Record<
  ContentResourceKey,
  {
    collectionQuery: Record<string, unknown>;
    createBody: Record<string, unknown>;
    updateBody: Record<string, unknown>;
  }
> = {
  projects: {
    collectionQuery: {
      page: 1,
      pageSize: 12,
      search: 'portfolio',
      featured: true,
      sortBy: 'titleEn',
      sortDirection: 'asc',
    },
    createBody: {
      slug: 'portfolio-remake',
      titlePt: 'Remake do Portfolio',
      titleEn: 'Portfolio Remake',
      shortDescriptionPt: 'Nova versao do portfolio pessoal.',
      shortDescriptionEn: 'New personal portfolio version.',
      fullDescriptionPt:
        'Projeto full stack para apresentar carreira, cases e dashboard.',
      fullDescriptionEn:
        'Full-stack project to present career, case studies, and dashboard.',
      context: 'PERSONAL',
      status: 'IN_PROGRESS',
      environment: 'FULLSTACK',
      featured: true,
      highlight: true,
      technologyRelations: [],
      tagIds: [],
      linkIds: [],
      imageAssetIds: [],
    },
    updateBody: {
      titleEn: 'Portfolio Remake',
      featured: true,
      sortOrder: 1,
    },
  },
  experiences: {
    collectionQuery: {
      page: 1,
      pageSize: 10,
      companyName: 'Pag',
      isCurrent: true,
      sortBy: 'startDate',
      sortDirection: 'desc',
    },
    createBody: {
      slug: 'pagbank',
      companyName: 'PagBank',
      titlePt: 'Engenheiro de Software',
      titleEn: 'Software Engineer',
      summaryPt: 'Atuacao em produtos financeiros.',
      summaryEn: 'Work on financial products.',
      descriptionPt: 'Desenvolvimento frontend e integracoes.',
      descriptionEn: 'Frontend development and integrations.',
      startDate: '2023-01-01',
      isCurrent: true,
      technologyRelations: [],
      customerIds: [],
      jobIds: [],
      imageAssetIds: [],
    },
    updateBody: {
      titleEn: 'Senior Software Engineer',
      highlight: true,
    },
  },
  technologies: {
    collectionQuery: {
      page: 1,
      pageSize: 20,
      category: 'LANGUAGE',
      search: 'type',
      sortBy: 'name',
      sortDirection: 'asc',
    },
    createBody: {
      slug: 'typescript',
      name: 'TypeScript',
      category: 'LANGUAGE',
      officialUrl: 'https://www.typescriptlang.org/',
      highlight: true,
      tagIds: [],
      imageAssetIds: [],
    },
    updateBody: {
      officialUrl: 'https://www.typescriptlang.org/',
      highlight: true,
    },
  },
  formations: {
    collectionQuery: {
      page: 1,
      pageSize: 10,
      institution: 'FATEC',
      degreeType: 'BACHELOR',
      sortBy: 'startDate',
      sortDirection: 'desc',
    },
    createBody: {
      slug: 'fatec-ads',
      institution: 'FATEC',
      titlePt: 'Analise e Desenvolvimento de Sistemas',
      titleEn: 'Systems Analysis and Development',
      degreeType: 'BACHELOR',
      summaryPt: 'Graduacao em tecnologia.',
      summaryEn: 'Technology degree.',
      startDate: '2017-01-01',
      technologyRelations: [],
      linkIds: [],
      imageAssetIds: [],
    },
    updateBody: {
      highlight: true,
      endDate: '2020-12-01',
    },
  },
  spokenLanguages: {
    collectionQuery: {
      page: 1,
      pageSize: 10,
      proficiency: 'FLUENT',
      sortBy: 'sortOrder',
      sortDirection: 'asc',
    },
    createBody: {
      code: 'en',
      namePt: 'Ingles',
      nameEn: 'English',
      proficiency: 'FLUENT',
      imageAssetIds: [],
    },
    updateBody: {
      highlight: true,
    },
  },
  customers: {
    collectionQuery: {
      page: 1,
      pageSize: 10,
      name: 'Pag',
      highlight: true,
      sortBy: 'name',
      sortDirection: 'asc',
    },
    createBody: {
      slug: 'pagbank',
      name: 'PagBank',
      summaryPt: 'Cliente do setor financeiro.',
      summaryEn: 'Financial sector client.',
      experienceIds: [],
      imageAssetIds: [],
    },
    updateBody: {
      highlight: true,
      sortOrder: 1,
    },
  },
  jobs: {
    collectionQuery: {
      page: 1,
      pageSize: 10,
      slug: 'frontend-engineer',
      highlight: true,
      sortBy: 'nameEn',
      sortDirection: 'asc',
    },
    createBody: {
      slug: 'frontend-engineer',
      namePt: 'Engenheiro Frontend',
      nameEn: 'Frontend Engineer',
      summaryPt: 'Atuacao principal em frontend.',
      summaryEn: 'Main frontend role.',
      experienceIds: [],
      imageAssetIds: [],
    },
    updateBody: {
      nameEn: 'Senior Frontend Engineer',
    },
  },
  links: {
    collectionQuery: {
      page: 1,
      pageSize: 10,
      type: 'GITHUB',
      sortBy: 'labelEn',
      sortDirection: 'asc',
    },
    createBody: {
      url: 'https://github.com/Hanszman/hans-portfolio-api',
      labelPt: 'Repositorio',
      labelEn: 'Repository',
      type: 'GITHUB',
      projectIds: [],
    },
    updateBody: {
      labelEn: 'API Repository',
    },
  },
  imageAssets: {
    collectionQuery: {
      page: 1,
      pageSize: 20,
      folder: 'projects',
      kind: 'SCREENSHOT',
      sortBy: 'fileName',
      sortDirection: 'asc',
    },
    createBody: {
      fileName: 'portfolio-remake.png',
      filePath: '/assets/img/projects/portfolio-remake.png',
      folder: 'projects',
      kind: 'SCREENSHOT',
      projectIds: [],
    },
    updateBody: {
      altEn: 'Portfolio remake screenshot',
      captionEn: 'Main project preview',
    },
  },
  tags: {
    collectionQuery: {
      page: 1,
      pageSize: 20,
      type: 'STACK',
      sortBy: 'nameEn',
      sortDirection: 'asc',
    },
    createBody: {
      slug: 'frontend',
      namePt: 'Frontend',
      nameEn: 'Frontend',
      type: 'STACK',
      projectIds: [],
      technologyIds: [],
    },
    updateBody: {
      nameEn: 'Frontend Stack',
    },
  },
  portfolioSettings: {
    collectionQuery: {
      page: 1,
      pageSize: 10,
      key: 'hero',
      sortBy: 'key',
      sortDirection: 'asc',
    },
    createBody: {
      key: 'hero',
      value: {
        title: 'Victor Hanszman',
        subtitle: 'Full Stack Software Engineer',
      },
      description: 'Hero section configuration.',
    },
    updateBody: {
      description: 'Updated hero section configuration.',
    },
  },
};

export function ApiContentCollectionQueries(
  resource: ContentResourceKey,
): MethodDecorator {
  const config = CONTENT_RESOURCE_CONFIGS[resource];
  const examples = CONTENT_SWAGGER_EXAMPLES[resource];
  const searchDecorator =
    config.searchFields && config.searchFields.length > 0
      ? [
          ApiQuery({
            name: 'search',
            required: false,
            type: String,
            example: examples.collectionQuery.search,
            description: `Case-insensitive search across: ${config.searchFields.join(
              ', ',
            )}.`,
          }),
        ]
      : [];
  const filterDecorators = (config.filterDefinitions ?? []).map((filter) => {
    const metadata = QUERY_PARAM_METADATA[filter.queryKey];

    return ApiQuery({
      name: filter.queryKey,
      required: false,
      type: metadata.type,
      example: examples.collectionQuery[filter.queryKey] ?? metadata.example,
      description: metadata.description,
    });
  });

  return applyDecorators(
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      example: examples.collectionQuery.page ?? 1,
      description: 'Page number starting at 1.',
    }),
    ApiQuery({
      name: 'pageSize',
      required: false,
      type: Number,
      example: examples.collectionQuery.pageSize ?? 12,
      description: 'Number of items per page. Maximum: 100.',
    }),
    ApiQuery({
      name: 'sortBy',
      required: false,
      type: String,
      example: examples.collectionQuery.sortBy ?? config.sortableFields[0],
      description: `Allowed sort fields: ${config.sortableFields.join(', ')}.`,
    }),
    ApiQuery({
      name: 'sortDirection',
      required: false,
      enum: ['asc', 'desc'],
      example: examples.collectionQuery.sortDirection ?? 'asc',
      description: 'Sort direction for the selected sortBy field.',
    }),
    ...searchDecorator,
    ...filterDecorators,
  );
}

export function ApiContentCreateBody(
  resource: ContentResourceKey,
): MethodDecorator {
  const config = CONTENT_RESOURCE_CONFIGS[resource];
  const examples = CONTENT_SWAGGER_EXAMPLES[resource];

  return ApiBody({
    type: config.createRequestDto,
    required: true,
    examples: {
      sample: {
        summary: `Create ${config.tag}`,
        value: examples.createBody,
      },
    },
  });
}

export function ApiContentUpdateBody(
  resource: ContentResourceKey,
): MethodDecorator {
  const config = CONTENT_RESOURCE_CONFIGS[resource];
  const examples = CONTENT_SWAGGER_EXAMPLES[resource];

  return ApiBody({
    type: config.updateRequestDto,
    required: true,
    examples: {
      sample: {
        summary: `Update ${config.tag}`,
        value: examples.updateBody,
      },
    },
  });
}
