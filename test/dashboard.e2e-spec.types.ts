export type DashboardOverviewStub = {
  generatedAtUtc: string;
  summary: {
    projects: number;
    experiences: number;
    technologies: number;
    formations: number;
    customers: number;
    jobs: number;
    spokenLanguages: number;
  };
};

export type SwaggerDocumentResponse = {
  paths: Record<string, unknown>;
};
