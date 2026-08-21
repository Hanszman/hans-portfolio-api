export type LoginEndpointResponse = {
  accessToken: string;
};

export type TechnologyRecord = {
  id: string;
  slug: string;
  name: string;
  type?: string;
  level?: string | null;
  frequency?: string | null;
  technologyContexts: Array<{
    id: string;
    context: string;
    startedAt: string | null;
    endedAt: string | null;
  }>;
};

export type TechnologyContextRecord = {
  id: string;
  technologyId: string;
  projectId?: string | null;
  context: string;
  startedAt: string;
  endedAt: string | null;
  technology: {
    id: string;
    slug: string;
    name: string;
    type: string;
    level: string | null;
    frequency: string | null;
  };
};

export type ProjectFixture = {
  id: string;
  slug?: string;
  titlePt?: string;
  context?: string;
  startDate?: string;
  endDate?: string | null;
  sortOrder?: number;
  technologyIds?: string[];
};
