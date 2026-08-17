export type LoginEndpointResponse = {
  accessToken: string;
};

export type TechnologyRecord = {
  id: string;
  slug: string;
  name: string;
  category?: string;
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
  context: string;
  startedAt: string;
  endedAt: string | null;
  technology: {
    id: string;
    slug: string;
    name: string;
    category: string;
    level: string | null;
    frequency: string | null;
  };
};
