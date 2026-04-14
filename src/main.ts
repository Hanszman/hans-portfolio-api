import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { appEnvironment } from './config/app-environment';
import { ApiRoutes } from './routing/api-routes';

const SWAGGER_UI_DIST_VERSION = '5.31.0';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin: appEnvironment.corsAllowedOrigins,
  });

  const port = process.env.PORT ?? '3000';
  const swaggerPath = process.env.SWAGGER_PATH ?? ApiRoutes.swagger;
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle(process.env.APP_NAME ?? 'Hans Portfolio API')
      .setDescription('NestJS backend for the Hans Portfolio remake.')
      .setVersion('1.0.0')
      .addBearerAuth()
      .build(),
  );

  SwaggerModule.setup(swaggerPath, app, document, {
    customCssUrl: `https://unpkg.com/swagger-ui-dist@${SWAGGER_UI_DIST_VERSION}/swagger-ui.css`,
    customJs: [
      `https://unpkg.com/swagger-ui-dist@${SWAGGER_UI_DIST_VERSION}/swagger-ui-bundle.js`,
      `https://unpkg.com/swagger-ui-dist@${SWAGGER_UI_DIST_VERSION}/swagger-ui-standalone-preset.js`,
    ],
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  await app.listen(port);

  const localApplicationUrl = `http://localhost:${port}`;
  const localSwaggerUrl = `${localApplicationUrl}/${swaggerPath}`;

  Logger.log(`Application is running on: ${localApplicationUrl}`, 'Bootstrap');
  Logger.log(`Swagger is running on: ${localSwaggerUrl}`, 'Bootstrap');
  Logger.log(
    `Portfolio app base URL: ${appEnvironment.portfolioAppBaseUrl}`,
    'Bootstrap',
  );
  Logger.log(
    `Portfolio API base URL: ${appEnvironment.portfolioApiBaseUrl}`,
    'Bootstrap',
  );
  Logger.log(
    `CORS is enabled for: ${appEnvironment.corsAllowedOrigins.join(', ')}`,
    'Bootstrap',
  );
  Logger.log(
    `Health endpoint is available at: ${localApplicationUrl}/${ApiRoutes.health.alias}`,
    'Bootstrap',
  );
}

void bootstrap().catch((error: unknown) => {
  const errorMessage =
    error instanceof Error
      ? (error.stack ?? error.message)
      : 'Unknown bootstrap error.';

  Logger.error(errorMessage, undefined, 'Bootstrap');
  process.exitCode = 1;
});
