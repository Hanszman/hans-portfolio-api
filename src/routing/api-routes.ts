export const ApiRoutes = {
  root: '',
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
