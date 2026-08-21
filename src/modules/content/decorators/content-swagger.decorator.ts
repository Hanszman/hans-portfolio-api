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
    description: string;
    type: StringConstructor | BooleanConstructor;
  }
> = {
  search: {
    description:
      'Case-insensitive text search across the configured fields of the resource.',
    type: String,
  },
  slug: {
    description: 'Filters by the resource slug.',
    type: String,
  },
  name: {
    description: 'Filters by a name field when the resource exposes one.',
    type: String,
  },
  code: {
    description: 'Filters by the language/code field.',
    type: String,
  },
  highlight: {
    description: 'Filters highlighted items only.',
    type: Boolean,
  },
  isCurrent: {
    description: 'Filters current experiences only.',
    type: Boolean,
  },
  stack: {
    description: 'Filters by the technology stack.',
    type: String,
  },
  level: {
    description: 'Filters by the current technology level.',
    type: String,
  },
  frequency: {
    description: 'Filters by the current technology usage frequency.',
    type: String,
  },
  context: {
    description: 'Filters by the project context.',
    type: String,
  },
  status: {
    description: 'Filters by the project status.',
    type: String,
  },
  environment: {
    description: 'Filters by the project environment.',
    type: String,
  },
  degreeType: {
    description: 'Filters by the formation degree type.',
    type: String,
  },
  proficiency: {
    description: 'Filters by the spoken language proficiency.',
    type: String,
  },
  type: {
    description: 'Filters by the link or technology taxonomy type.',
    type: String,
  },
  kind: {
    description: 'Filters by the image asset kind.',
    type: String,
  },
  companyName: {
    description: 'Filters experiences by company name.',
    type: String,
  },
  institution: {
    description: 'Filters formations by institution.',
    type: String,
  },
  url: {
    description: 'Filters links by URL.',
    type: String,
  },
  fileName: {
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
      highlight: true,
      sortBy: 'titleEn',
      sortDirection: 'asc',
    },
    createBody: {
      slug: 'portfolio-remake',
      titlePt: 'Remake do Portfolio',
      titleEn: 'Portfolio Remake',
      summaryPt: 'Nova versao do portfolio pessoal.',
      summaryEn: 'New personal portfolio version.',
      descriptionPt:
        'Projeto full stack para apresentar carreira, cases e dashboard.',
      descriptionEn:
        'Full-stack project to present career, case studies, and dashboard.',
      context: 'PERSONAL',
      status: 'IN_PROGRESS',
      environment: 'FULLSTACK',
      highlight: true,
      technologyRelations: [
        {
          technologyId: '11111111-1111-4111-8111-111111111111',
        },
      ],
      linkIds: [],
      imageAssetIds: [],
    },
    updateBody: {
      titleEn: 'Portfolio Remake',
      highlight: true,
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
      technologyRelations: [
        {
          technologyId: '11111111-1111-4111-8111-111111111111',
        },
      ],
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
      stack: 'FRONT_END',
      type: 'PROGRAMMING_LANGUAGES',
      search: 'type',
      sortBy: 'name',
      sortDirection: 'asc',
    },
    createBody: {
      slug: 'typescript',
      name: 'TypeScript',
      stack: 'FRONT_END',
      type: 'PROGRAMMING_LANGUAGES',
      level: 'ADVANCED',
      frequency: 'FREQUENT',
      highlight: true,
      projectRelations: [
        {
          projectId: '11111111-1111-4111-8111-111111111111',
        },
      ],
      technologyContexts: [
        {
          context: 'PROFESSIONAL',
          startedAt: '2020-01-01',
          endedAt: '2024-04-01',
        },
        {
          context: 'PERSONAL',
          startedAt: '2025-01-01',
          endedAt: null,
        },
      ],
      imageAssetIds: [],
    },
    updateBody: {
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
      technologyRelations: [
        {
          technologyId: '11111111-1111-4111-8111-111111111111',
        },
      ],
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
      startDate: '2021-09-23',
      endDate: null,
      experienceIds: [],
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
      kind: 'SCREENSHOT',
      sortBy: 'fileName',
      sortDirection: 'asc',
    },
    createBody: {
      fileName: 'portfolio-remake.png',
      filePath: '/assets/img/projects/portfolio-remake.png',
      kind: 'SCREENSHOT',
      projectIds: [],
    },
    updateBody: {
      altEn: 'Portfolio remake screenshot',
    },
  },
};

export function resolveSwaggerExample<T>(
  value: T | null | undefined,
  fallback: T,
): T {
  return value ?? fallback;
}

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
            description: `Case-insensitive search across: ${config.searchFields.join(
              ', ',
            )}.`,
          }),
        ]
      : [];
  const filterDecorators = (config.filterDefinitions ?? []).map((filter) => {
    const metadata =
      QUERY_PARAM_METADATA[
        filter.queryKey as keyof typeof QUERY_PARAM_METADATA
      ];

    return ApiQuery({
      name: filter.queryKey,
      required: false,
      type: metadata.type,
      description: metadata.description,
    });
  });

  return applyDecorators(
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      example: resolveSwaggerExample(examples.collectionQuery.page, 1),
      description: 'Page number starting at 1.',
    }),
    ApiQuery({
      name: 'pageSize',
      required: false,
      type: Number,
      example: resolveSwaggerExample(examples.collectionQuery.pageSize, 12),
      description: 'Number of items per page. Maximum: 100.',
    }),
    ApiQuery({
      name: 'sortBy',
      required: false,
      type: String,
      example: resolveSwaggerExample(
        examples.collectionQuery.sortBy,
        config.sortableFields[0],
      ),
      description: `Allowed sort fields: ${config.sortableFields.join(', ')}.`,
    }),
    ApiQuery({
      name: 'sortDirection',
      required: false,
      enum: ['asc', 'desc'],
      example: resolveSwaggerExample(
        examples.collectionQuery.sortDirection,
        'asc',
      ),
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
