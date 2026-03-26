import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../../prisma/prisma.module';
import {
  AdminCustomersController,
  CustomersController,
} from './controllers/customers/customers.controller';
import {
  AdminExperiencesController,
  ExperiencesController,
} from './controllers/experiences/experiences.controller';
import {
  AdminFormationsController,
  FormationsController,
} from './controllers/formations/formations.controller';
import {
  AdminImageAssetsController,
  ImageAssetsController,
} from './controllers/image-assets/image-assets.controller';
import {
  AdminJobsController,
  JobsController,
} from './controllers/jobs/jobs.controller';
import {
  AdminLinksController,
  LinksController,
} from './controllers/links/links.controller';
import {
  AdminPortfolioSettingsController,
  PortfolioSettingsController,
} from './controllers/portfolio-settings/portfolio-settings.controller';
import {
  AdminProjectsController,
  ProjectsController,
} from './controllers/projects/projects.controller';
import {
  AdminSpokenLanguagesController,
  SpokenLanguagesController,
} from './controllers/spoken-languages/spoken-languages.controller';
import {
  AdminTagsController,
  TagsController,
} from './controllers/tags/tags.controller';
import {
  AdminTechnologiesController,
  TechnologiesController,
} from './controllers/technologies/technologies.controller';
import { ContentAdminService } from './services/content-admin/content-admin.service';
import { ContentReadService } from './services/content-read/content-read.service';
import { ContentResourceRegistryService } from './services/content-resource-registry/content-resource-registry.service';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [
    ProjectsController,
    AdminProjectsController,
    ExperiencesController,
    AdminExperiencesController,
    TechnologiesController,
    AdminTechnologiesController,
    FormationsController,
    AdminFormationsController,
    SpokenLanguagesController,
    AdminSpokenLanguagesController,
    CustomersController,
    AdminCustomersController,
    JobsController,
    AdminJobsController,
    LinksController,
    AdminLinksController,
    ImageAssetsController,
    AdminImageAssetsController,
    TagsController,
    AdminTagsController,
    PortfolioSettingsController,
    AdminPortfolioSettingsController,
  ],
  providers: [
    ContentResourceRegistryService,
    ContentReadService,
    ContentAdminService,
  ],
  exports: [
    ContentResourceRegistryService,
    ContentReadService,
    ContentAdminService,
  ],
})
export class ContentModule {}
