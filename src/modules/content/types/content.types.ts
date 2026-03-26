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
  publicInclude?: ContentQueryInclude;
  adminInclude?: ContentQueryInclude;
  createRequestDto: ContentDtoClass;
  updateRequestDto: ContentDtoClass;
};

export type ContentFindManyArgs = {
  where?: Record<string, unknown>;
  include?: Record<string, unknown>;
  orderBy?: ReadonlyArray<Record<string, unknown>>;
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
};
