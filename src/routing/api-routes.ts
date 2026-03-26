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
