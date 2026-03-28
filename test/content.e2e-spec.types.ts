export type LoginEndpointResponse = {
  accessToken: string;
};

export type TagRecord = {
  id: string;
  slug: string;
  namePt: string;
  nameEn: string;
  type: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

export type TechnologyRecord = {
  id: string;
  slug: string;
  name: string;
  projectUsages: Array<{
    startedAt: string | null;
    endedAt: string | null;
    contexts: string[];
  }>;
  experienceUses: Array<{
    startedAt: string | null;
    endedAt: string | null;
    contexts: string[];
  }>;
  formationUses: Array<{
    startedAt: string | null;
    endedAt: string | null;
    contexts: string[];
  }>;
};
