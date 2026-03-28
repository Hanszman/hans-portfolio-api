export type ContentResourceKey =
  | 'projects'
  | 'experiences'
  | 'technologies'
  | 'formations'
  | 'spokenLanguages'
  | 'customers'
  | 'jobs'
  | 'links'
  | 'imageAssets'
  | 'tags'
  | 'portfolioSettings';

export type ContentDelegateName =
  | 'project'
  | 'experience'
  | 'technology'
  | 'formation'
  | 'spokenLanguage'
  | 'customer'
  | 'job'
  | 'link'
  | 'imageAsset'
  | 'tag'
  | 'portfolioSetting';

export type ContentLookupField = 'slug' | 'code' | 'key' | 'id';

export type ContentSortDirection = 'asc' | 'desc';

export type ContentOrderBy = ReadonlyArray<
  Record<string, ContentSortDirection>
>;

export type ContentQueryInclude = Readonly<Record<string, unknown>>;

export type ContentDtoClass = new (...args: never[]) => object;

export type ContentResourceConfig = {
  key: ContentResourceKey;
  tag: string;
  routePath: string;
  delegateName: ContentDelegateName;
  publicLookupField: ContentLookupField;
  publicLookupParam: string;
  adminLookupParam: 'id';
  hasPublishedFlag: boolean;
  defaultOrderBy: ContentOrderBy;
  sortableFields: string[];
  publicInclude?: ContentQueryInclude;
  adminInclude?: ContentQueryInclude;
  searchFields?: string[];
  filterDefinitions?: ContentFilterDefinition[];
  createRequestDto: ContentDtoClass;
  updateRequestDto: ContentDtoClass;
};

export type ContentFilterQueryKey =
  | 'search'
  | 'slug'
  | 'name'
  | 'code'
  | 'key'
  | 'featured'
  | 'highlight'
  | 'isCurrent'
  | 'category'
  | 'context'
  | 'status'
  | 'environment'
  | 'degreeType'
  | 'proficiency'
  | 'type'
  | 'kind'
  | 'folder'
  | 'companyName'
  | 'institution'
  | 'url'
  | 'fileName';

export type ContentFilterOperator = 'equals' | 'contains';

export type ContentFilterDefinition = {
  queryKey: ContentFilterQueryKey;
  field?: string;
  operator?: ContentFilterOperator;
};

export type ContentFindManyArgs = {
  where?: Record<string, unknown>;
  include?: Record<string, unknown>;
  orderBy?: ReadonlyArray<Record<string, unknown>>;
  skip?: number;
  take?: number;
};

export type ContentCountArgs = {
  where?: Record<string, unknown>;
};

export type ContentFindUniqueArgs = {
  where: Record<string, unknown>;
  include?: Record<string, unknown>;
};

export type ContentCreateArgs = {
  data: Record<string, unknown>;
  include?: Record<string, unknown>;
};

export type ContentUpdateArgs = {
  where: Record<string, unknown>;
  data: Record<string, unknown>;
  include?: Record<string, unknown>;
};

export type ContentDeleteArgs = {
  where: Record<string, unknown>;
  include?: Record<string, unknown>;
};

export type ContentDelegate = {
  findMany(args?: ContentFindManyArgs): Promise<unknown[]>;
  findFirst(args: ContentFindManyArgs): Promise<Record<string, unknown> | null>;
  findUnique(
    args: ContentFindUniqueArgs,
  ): Promise<Record<string, unknown> | null>;
  create(args: ContentCreateArgs): Promise<Record<string, unknown>>;
  update(args: ContentUpdateArgs): Promise<Record<string, unknown>>;
  delete(args: ContentDeleteArgs): Promise<Record<string, unknown>>;
  count(args?: ContentCountArgs): Promise<number>;
};

export type ContentPagination = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type PaginatedContentCollection = {
  data: unknown[];
  pagination: ContentPagination;
};
