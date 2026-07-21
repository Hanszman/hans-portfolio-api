import 'reflect-metadata';
import { CONTENT_RESOURCE_CONFIGS } from '../content-resource.config';

type DecoratorFactoryOptions = Record<string, unknown>;
type DecoratorFactoryResult = {
  kind: 'body' | 'query';
  options: DecoratorFactoryOptions;
};

type PortfolioSettingsConfig =
  (typeof CONTENT_RESOURCE_CONFIGS)['portfolioSettings'];

const originalPortfolioSettingsConfig = {
  searchFields: CONTENT_RESOURCE_CONFIGS.portfolioSettings.searchFields,
  filterDefinitions:
    CONTENT_RESOURCE_CONFIGS.portfolioSettings.filterDefinitions,
};

const applyDecoratorsMock = jest.fn((...decorators: MethodDecorator[]) => {
  void decorators;
  return jest.fn() as MethodDecorator;
});
const apiBodyMock = jest.fn(
  (options: DecoratorFactoryOptions): DecoratorFactoryResult => ({
    kind: 'body',
    options,
  }),
);
const apiQueryMock = jest.fn(
  (options: DecoratorFactoryOptions): DecoratorFactoryResult => ({
    kind: 'query',
    options,
  }),
);

jest.mock('@nestjs/common', () => ({
  applyDecorators: (...decorators: MethodDecorator[]) =>
    applyDecoratorsMock(...decorators),
}));

jest.mock('@nestjs/swagger', () => ({
  ApiBody: (options: DecoratorFactoryOptions) => apiBodyMock(options),
  ApiQuery: (options: DecoratorFactoryOptions) => apiQueryMock(options),
  PartialType: <TInput extends object>(classRef: TInput): TInput => classRef,
}));

import {
  ApiContentCollectionQueries,
  ApiContentCreateBody,
  ApiContentUpdateBody,
  resolveSwaggerExample,
} from './content-swagger.decorator';

function getQueryOptions(): DecoratorFactoryOptions[] {
  return apiQueryMock.mock.calls.map(([options]) => options);
}

function overridePortfolioSettingsConfig(
  overrides: Partial<
    Pick<PortfolioSettingsConfig, 'searchFields' | 'filterDefinitions'>
  >,
): void {
  const searchFields =
    'searchFields' in overrides
      ? overrides.searchFields
      : originalPortfolioSettingsConfig.searchFields;
  const filterDefinitions =
    'filterDefinitions' in overrides
      ? overrides.filterDefinitions
      : originalPortfolioSettingsConfig.filterDefinitions;

  Object.defineProperties(CONTENT_RESOURCE_CONFIGS.portfolioSettings, {
    searchFields: {
      configurable: true,
      value: searchFields,
    },
    filterDefinitions: {
      configurable: true,
      value: filterDefinitions,
    },
  });
}

describe('content swagger decorators', () => {
  afterEach(() => {
    applyDecoratorsMock.mockClear();
    apiBodyMock.mockClear();
    apiQueryMock.mockClear();
    overridePortfolioSettingsConfig({});
  });

  it('resolves explicit or fallback swagger examples', () => {
    expect(resolveSwaggerExample(5, 1)).toBe(5);
    expect(resolveSwaggerExample(undefined, 1)).toBe(1);
    expect(resolveSwaggerExample(null, 'asc')).toBe('asc');
  });

  it('builds collection query decorators for resources with configured search and filters', () => {
    ApiContentCollectionQueries('projects');

    const queryOptions = getQueryOptions();

    expect(apiQueryMock).toHaveBeenCalled();
    expect(applyDecoratorsMock).toHaveBeenCalledTimes(1);
    expect(queryOptions.some((options) => options['name'] === 'search')).toBe(
      true,
    );
    expect(queryOptions.some((options) => options['name'] === 'page')).toBe(
      true,
    );
  });

  it('builds collection query decorators when search and filters are absent', () => {
    overridePortfolioSettingsConfig({
      searchFields: undefined,
      filterDefinitions: undefined,
    });

    ApiContentCollectionQueries('portfolioSettings');

    const queryOptions = getQueryOptions();

    expect(queryOptions.some((options) => options['name'] === 'search')).toBe(
      false,
    );
    expect(queryOptions.some((options) => options['name'] === 'page')).toBe(
      true,
    );
  });

  it('builds create body metadata', () => {
    ApiContentCreateBody('projects');

    expect(apiBodyMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: CONTENT_RESOURCE_CONFIGS.projects.createRequestDto,
        required: true,
      }),
    );
  });

  it('builds update body metadata', () => {
    ApiContentUpdateBody('projects');

    expect(apiBodyMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: CONTENT_RESOURCE_CONFIGS.projects.updateRequestDto,
        required: true,
      }),
    );
  });
});
