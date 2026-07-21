import 'reflect-metadata';
import { CONTENT_RESOURCE_CONFIGS } from '../content-resource.config';

type DecoratorFactoryOptions = Record<string, unknown>;
type DecoratorFactoryResult = {
  kind: 'body' | 'query';
  options: DecoratorFactoryOptions;
};

const applyDecoratorsMock = jest.fn<() => MethodDecorator, MethodDecorator[]>(
  () => jest.fn() as MethodDecorator,
);
const apiBodyMock = jest.fn<
  (options: DecoratorFactoryOptions) => DecoratorFactoryResult,
  [DecoratorFactoryOptions]
>((options: DecoratorFactoryOptions) => ({ kind: 'body', options }));
const apiQueryMock = jest.fn<
  (options: DecoratorFactoryOptions) => DecoratorFactoryResult,
  [DecoratorFactoryOptions]
>((options: DecoratorFactoryOptions) => ({ kind: 'query', options }));

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
} from './content-swagger.decorator';

function getQueryOptions(): DecoratorFactoryOptions[] {
  return apiQueryMock.mock.calls.map(([options]) => options);
}

describe('content swagger decorators', () => {
  afterEach(() => {
    applyDecoratorsMock.mockClear();
    apiBodyMock.mockClear();
    apiQueryMock.mockClear();
    CONTENT_RESOURCE_CONFIGS.portfolioSettings.searchFields = [
      'key',
      'description',
    ];
    CONTENT_RESOURCE_CONFIGS.portfolioSettings.filterDefinitions = [
      { queryKey: 'key' },
    ];
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
    CONTENT_RESOURCE_CONFIGS.portfolioSettings.searchFields =
      undefined as never;
    CONTENT_RESOURCE_CONFIGS.portfolioSettings.filterDefinitions =
      undefined as never;

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
