import { readAppEnvironment } from './app-environment';

describe('readAppEnvironment', () => {
  it('should use the local defaults for development', () => {
    expect(readAppEnvironment({ NODE_ENV: 'development' })).toEqual({
      portfolioAppBaseUrl: 'http://localhost:4200',
      portfolioApiBaseUrl: 'http://localhost:3000',
      corsAllowedOrigins: ['http://localhost:4200', 'http://127.0.0.1:4200'],
    });
  });

  it('should use the production defaults when NODE_ENV is production', () => {
    expect(readAppEnvironment({ NODE_ENV: 'production' })).toEqual({
      portfolioAppBaseUrl: 'https://hans-portfolio-app.vercel.app',
      portfolioApiBaseUrl: 'https://hans-portfolio-api.vercel.app',
      corsAllowedOrigins: ['https://hans-portfolio-app.vercel.app'],
    });
  });

  it('should use the explicit environment URLs and merge additional CORS origins', () => {
    expect(
      readAppEnvironment({
        NODE_ENV: 'development',
        PORTFOLIO_APP_BASE_URL: 'http://localhost:4200/',
        PORTFOLIO_API_BASE_URL: 'http://localhost:3000/',
        CORS_ALLOWED_ORIGINS:
          'https://preview.hans.dev, https://staging.hans.dev/',
      }),
    ).toEqual({
      portfolioAppBaseUrl: 'http://localhost:4200',
      portfolioApiBaseUrl: 'http://localhost:3000',
      corsAllowedOrigins: [
        'http://localhost:4200',
        'http://127.0.0.1:4200',
        'https://preview.hans.dev',
        'https://staging.hans.dev',
      ],
    });
  });
});
