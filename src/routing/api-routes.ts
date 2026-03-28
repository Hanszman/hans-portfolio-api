export const ApiRoutes = {
  root: '',
  auth: {
    base: 'auth',
    login: 'login',
  },
  admin: {
    base: 'admin',
    session: 'session',
  },
  content: {
    projects: 'projects',
    experiences: 'experiences',
    technologies: 'technologies',
    formations: 'formations',
    spokenLanguages: 'spoken-languages',
    customers: 'customers',
    jobs: 'jobs',
    links: 'links',
    imageAssets: 'image-assets',
    tags: 'tags',
    portfolioSettings: 'portfolio-settings',
  },
  dashboard: {
    base: 'dashboard',
    stackDistribution: 'stack-distribution',
    projectContexts: 'project-contexts',
    technologyUsage: 'technology-usage',
    professionalTimeline: 'professional-timeline',
    highlights: 'highlights',
  },
  system: {
    base: 'system',
    ping: 'ping',
    database: 'database',
    health: 'health',
  },
  health: {
    alias: 'health',
  },
  swagger: 'swagger',
} as const;
