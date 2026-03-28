import { Test } from '@nestjs/testing';
import { ContentAdminService } from '../services/content-admin/content-admin.service';
import { ContentReadService } from '../services/content-read/content-read.service';
import type {
  AdminControllerCase,
  PublicControllerCase,
} from './content.controllers.spec.types';
import {
  AdminCustomersController,
  CustomersController,
} from './customers/customers.controller';
import {
  AdminExperiencesController,
  ExperiencesController,
} from './experiences/experiences.controller';
import {
  AdminFormationsController,
  FormationsController,
} from './formations/formations.controller';
import {
  AdminImageAssetsController,
  ImageAssetsController,
} from './image-assets/image-assets.controller';
import { AdminJobsController, JobsController } from './jobs/jobs.controller';
import {
  AdminLinksController,
  LinksController,
} from './links/links.controller';
import {
  AdminPortfolioSettingsController,
  PortfolioSettingsController,
} from './portfolio-settings/portfolio-settings.controller';
import {
  AdminProjectsController,
  ProjectsController,
} from './projects/projects.controller';
import {
  AdminSpokenLanguagesController,
  SpokenLanguagesController,
} from './spoken-languages/spoken-languages.controller';
import { AdminTagsController, TagsController } from './tags/tags.controller';
import {
  AdminTechnologiesController,
  TechnologiesController,
} from './technologies/technologies.controller';

const PUBLIC_CONTROLLER_CASES: PublicControllerCase<object>[] = [
  {
    label: 'ProjectsController',
    resource: 'projects',
    controller: ProjectsController,
    lookupValue: 'portfolio-remake',
    invokeList: (controller, query) =>
      (controller as ProjectsController).getProjects(query as never),
    invokeDetail: (controller, lookupValue) =>
      (controller as ProjectsController).getProjectBySlug(lookupValue),
  },
  {
    label: 'ExperiencesController',
    resource: 'experiences',
    controller: ExperiencesController,
    lookupValue: 'pagbank',
    invokeList: (controller, query) =>
      (controller as ExperiencesController).getExperiences(query as never),
    invokeDetail: (controller, lookupValue) =>
      (controller as ExperiencesController).getExperienceBySlug(lookupValue),
  },
  {
    label: 'TechnologiesController',
    resource: 'technologies',
    controller: TechnologiesController,
    lookupValue: 'typescript',
    invokeList: (controller, query) =>
      (controller as TechnologiesController).getTechnologies(query as never),
    invokeDetail: (controller, lookupValue) =>
      (controller as TechnologiesController).getTechnologyBySlug(lookupValue),
  },
  {
    label: 'FormationsController',
    resource: 'formations',
    controller: FormationsController,
    lookupValue: 'fatec',
    invokeList: (controller, query) =>
      (controller as FormationsController).getFormations(query as never),
    invokeDetail: (controller, lookupValue) =>
      (controller as FormationsController).getFormationBySlug(lookupValue),
  },
  {
    label: 'SpokenLanguagesController',
    resource: 'spokenLanguages',
    controller: SpokenLanguagesController,
    lookupValue: 'en',
    invokeList: (controller, query) =>
      (controller as SpokenLanguagesController).getSpokenLanguages(
        query as never,
      ),
    invokeDetail: (controller, lookupValue) =>
      (controller as SpokenLanguagesController).getSpokenLanguageByCode(
        lookupValue,
      ),
  },
  {
    label: 'CustomersController',
    resource: 'customers',
    controller: CustomersController,
    lookupValue: 'pagbank',
    invokeList: (controller, query) =>
      (controller as CustomersController).getCustomers(query as never),
    invokeDetail: (controller, lookupValue) =>
      (controller as CustomersController).getCustomerBySlug(lookupValue),
  },
  {
    label: 'JobsController',
    resource: 'jobs',
    controller: JobsController,
    lookupValue: 'frontend-engineer',
    invokeList: (controller, query) =>
      (controller as JobsController).getJobs(query as never),
    invokeDetail: (controller, lookupValue) =>
      (controller as JobsController).getJobBySlug(lookupValue),
  },
  {
    label: 'LinksController',
    resource: 'links',
    controller: LinksController,
    lookupValue: '4c00be28-b0d7-410f-90f8-0d88a8d15d2d',
    invokeList: (controller, query) =>
      (controller as LinksController).getLinks(query as never),
    invokeDetail: (controller, lookupValue) =>
      (controller as LinksController).getLinkById(lookupValue),
  },
  {
    label: 'ImageAssetsController',
    resource: 'imageAssets',
    controller: ImageAssetsController,
    lookupValue: '4c00be28-b0d7-410f-90f8-0d88a8d15d2d',
    invokeList: (controller, query) =>
      (controller as ImageAssetsController).getImageAssets(query as never),
    invokeDetail: (controller, lookupValue) =>
      (controller as ImageAssetsController).getImageAssetById(lookupValue),
  },
  {
    label: 'TagsController',
    resource: 'tags',
    controller: TagsController,
    lookupValue: 'frontend',
    invokeList: (controller, query) =>
      (controller as TagsController).getTags(query as never),
    invokeDetail: (controller, lookupValue) =>
      (controller as TagsController).getTagBySlug(lookupValue),
  },
  {
    label: 'PortfolioSettingsController',
    resource: 'portfolioSettings',
    controller: PortfolioSettingsController,
    lookupValue: 'hero',
    invokeList: (controller, query) =>
      (controller as PortfolioSettingsController).getPortfolioSettings(
        query as never,
      ),
    invokeDetail: (controller, lookupValue) =>
      (controller as PortfolioSettingsController).getPortfolioSettingByKey(
        lookupValue,
      ),
  },
];

const ADMIN_CONTROLLER_CASES: AdminControllerCase<object>[] = [
  {
    label: 'AdminProjectsController',
    resource: 'projects',
    controller: AdminProjectsController,
    id: '4c00be28-b0d7-410f-90f8-0d88a8d15d2d',
    createBody: { slug: 'portfolio-remake' },
    updateBody: { titlePt: 'Portfolio Remake' },
    invokeCreate: (controller, body) =>
      (controller as AdminProjectsController).createProject(body as never),
    invokeUpdate: (controller, id, body) =>
      (controller as AdminProjectsController).updateProject(id, body as never),
    invokeDelete: (controller, id) =>
      (controller as AdminProjectsController).deleteProject(id),
  },
  {
    label: 'AdminExperiencesController',
    resource: 'experiences',
    controller: AdminExperiencesController,
    id: '4c00be28-b0d7-410f-90f8-0d88a8d15d2d',
    createBody: { slug: 'pagbank' },
    updateBody: { titlePt: 'PagBank' },
    invokeCreate: (controller, body) =>
      (controller as AdminExperiencesController).createExperience(
        body as never,
      ),
    invokeUpdate: (controller, id, body) =>
      (controller as AdminExperiencesController).updateExperience(
        id,
        body as never,
      ),
    invokeDelete: (controller, id) =>
      (controller as AdminExperiencesController).deleteExperience(id),
  },
  {
    label: 'AdminTechnologiesController',
    resource: 'technologies',
    controller: AdminTechnologiesController,
    id: '4c00be28-b0d7-410f-90f8-0d88a8d15d2d',
    createBody: { slug: 'typescript' },
    updateBody: { name: 'TypeScript' },
    invokeCreate: (controller, body) =>
      (controller as AdminTechnologiesController).createTechnology(
        body as never,
      ),
    invokeUpdate: (controller, id, body) =>
      (controller as AdminTechnologiesController).updateTechnology(
        id,
        body as never,
      ),
    invokeDelete: (controller, id) =>
      (controller as AdminTechnologiesController).deleteTechnology(id),
  },
  {
    label: 'AdminFormationsController',
    resource: 'formations',
    controller: AdminFormationsController,
    id: '4c00be28-b0d7-410f-90f8-0d88a8d15d2d',
    createBody: { slug: 'fatec' },
    updateBody: { institution: 'Fatec' },
    invokeCreate: (controller, body) =>
      (controller as AdminFormationsController).createFormation(body as never),
    invokeUpdate: (controller, id, body) =>
      (controller as AdminFormationsController).updateFormation(
        id,
        body as never,
      ),
    invokeDelete: (controller, id) =>
      (controller as AdminFormationsController).deleteFormation(id),
  },
  {
    label: 'AdminSpokenLanguagesController',
    resource: 'spokenLanguages',
    controller: AdminSpokenLanguagesController,
    id: '4c00be28-b0d7-410f-90f8-0d88a8d15d2d',
    createBody: { code: 'en' },
    updateBody: { nameEn: 'English' },
    invokeCreate: (controller, body) =>
      (controller as AdminSpokenLanguagesController).createSpokenLanguage(
        body as never,
      ),
    invokeUpdate: (controller, id, body) =>
      (controller as AdminSpokenLanguagesController).updateSpokenLanguage(
        id,
        body as never,
      ),
    invokeDelete: (controller, id) =>
      (controller as AdminSpokenLanguagesController).deleteSpokenLanguage(id),
  },
  {
    label: 'AdminCustomersController',
    resource: 'customers',
    controller: AdminCustomersController,
    id: '4c00be28-b0d7-410f-90f8-0d88a8d15d2d',
    createBody: { slug: 'pagbank' },
    updateBody: { name: 'PagBank' },
    invokeCreate: (controller, body) =>
      (controller as AdminCustomersController).createCustomer(body as never),
    invokeUpdate: (controller, id, body) =>
      (controller as AdminCustomersController).updateCustomer(
        id,
        body as never,
      ),
    invokeDelete: (controller, id) =>
      (controller as AdminCustomersController).deleteCustomer(id),
  },
  {
    label: 'AdminJobsController',
    resource: 'jobs',
    controller: AdminJobsController,
    id: '4c00be28-b0d7-410f-90f8-0d88a8d15d2d',
    createBody: { slug: 'frontend-engineer' },
    updateBody: { nameEn: 'Frontend Engineer' },
    invokeCreate: (controller, body) =>
      (controller as AdminJobsController).createJob(body as never),
    invokeUpdate: (controller, id, body) =>
      (controller as AdminJobsController).updateJob(id, body as never),
    invokeDelete: (controller, id) =>
      (controller as AdminJobsController).deleteJob(id),
  },
  {
    label: 'AdminLinksController',
    resource: 'links',
    controller: AdminLinksController,
    id: '4c00be28-b0d7-410f-90f8-0d88a8d15d2d',
    createBody: { url: 'https://example.com' },
    updateBody: { labelEn: 'Repository' },
    invokeCreate: (controller, body) =>
      (controller as AdminLinksController).createLink(body as never),
    invokeUpdate: (controller, id, body) =>
      (controller as AdminLinksController).updateLink(id, body as never),
    invokeDelete: (controller, id) =>
      (controller as AdminLinksController).deleteLink(id),
  },
  {
    label: 'AdminImageAssetsController',
    resource: 'imageAssets',
    controller: AdminImageAssetsController,
    id: '4c00be28-b0d7-410f-90f8-0d88a8d15d2d',
    createBody: { filePath: '/assets/img/test.png' },
    updateBody: { fileName: 'test.png' },
    invokeCreate: (controller, body) =>
      (controller as AdminImageAssetsController).createImageAsset(
        body as never,
      ),
    invokeUpdate: (controller, id, body) =>
      (controller as AdminImageAssetsController).updateImageAsset(
        id,
        body as never,
      ),
    invokeDelete: (controller, id) =>
      (controller as AdminImageAssetsController).deleteImageAsset(id),
  },
  {
    label: 'AdminTagsController',
    resource: 'tags',
    controller: AdminTagsController,
    id: '4c00be28-b0d7-410f-90f8-0d88a8d15d2d',
    createBody: { slug: 'frontend' },
    updateBody: { nameEn: 'Frontend' },
    invokeCreate: (controller, body) =>
      (controller as AdminTagsController).createTag(body as never),
    invokeUpdate: (controller, id, body) =>
      (controller as AdminTagsController).updateTag(id, body as never),
    invokeDelete: (controller, id) =>
      (controller as AdminTagsController).deleteTag(id),
  },
  {
    label: 'AdminPortfolioSettingsController',
    resource: 'portfolioSettings',
    controller: AdminPortfolioSettingsController,
    id: '4c00be28-b0d7-410f-90f8-0d88a8d15d2d',
    createBody: { key: 'hero' },
    updateBody: { description: 'Hero section' },
    invokeCreate: (controller, body) =>
      (controller as AdminPortfolioSettingsController).createPortfolioSetting(
        body as never,
      ),
    invokeUpdate: (controller, id, body) =>
      (controller as AdminPortfolioSettingsController).updatePortfolioSetting(
        id,
        body as never,
      ),
    invokeDelete: (controller, id) =>
      (controller as AdminPortfolioSettingsController).deletePortfolioSetting(
        id,
      ),
  },
];

describe('Content controllers', () => {
  describe.each(PUBLIC_CONTROLLER_CASES)(
    '$label',
    ({ controller, resource, lookupValue, invokeList, invokeDetail }) => {
      it('delegates public reads to the content read service', async () => {
        const getPublicCollection = jest.fn().mockResolvedValue({
          data: ['collection'],
          pagination: {
            page: 1,
            pageSize: 12,
            totalItems: 1,
            totalPages: 1,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        });
        const getPublicItem = jest.fn().mockResolvedValue({ detail: true });

        const moduleRef = await Test.createTestingModule({
          controllers: [controller],
          providers: [
            {
              provide: ContentReadService,
              useValue: {
                getPublicCollection,
                getPublicItem,
              },
            },
          ],
        }).compile();

        const controllerInstance = moduleRef.get(controller);

        await expect(invokeList(controllerInstance, {})).resolves.toEqual({
          data: ['collection'],
          pagination: {
            page: 1,
            pageSize: 12,
            totalItems: 1,
            totalPages: 1,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        });
        await expect(
          invokeDetail(controllerInstance, lookupValue),
        ).resolves.toEqual({
          detail: true,
        });

        expect(getPublicCollection).toHaveBeenCalledWith(resource, {});
        expect(getPublicItem).toHaveBeenCalledWith(resource, lookupValue);
      });
    },
  );

  describe.each(ADMIN_CONTROLLER_CASES)(
    '$label',
    ({
      controller,
      resource,
      id,
      createBody,
      updateBody,
      invokeCreate,
      invokeUpdate,
      invokeDelete,
    }) => {
      it('delegates admin mutation operations to the content admin service', async () => {
        const createAdminItem = jest.fn().mockResolvedValue({ created: true });
        const updateAdminItem = jest.fn().mockResolvedValue({ updated: true });
        const deleteAdminItem = jest.fn().mockResolvedValue({ deleted: true });

        const moduleRef = await Test.createTestingModule({
          controllers: [controller],
          providers: [
            {
              provide: ContentAdminService,
              useValue: {
                createAdminItem,
                updateAdminItem,
                deleteAdminItem,
              },
            },
          ],
        }).compile();

        const controllerInstance = moduleRef.get(controller);

        await expect(
          invokeCreate(controllerInstance, createBody),
        ).resolves.toEqual({
          created: true,
        });
        await expect(
          invokeUpdate(controllerInstance, id, updateBody),
        ).resolves.toEqual({
          updated: true,
        });
        await expect(invokeDelete(controllerInstance, id)).resolves.toEqual({
          deleted: true,
        });

        expect(createAdminItem).toHaveBeenCalledWith(resource, createBody);
        expect(updateAdminItem).toHaveBeenCalledWith(resource, id, updateBody);
        expect(deleteAdminItem).toHaveBeenCalledWith(resource, id);
      });
    },
  );

  it('delegates technology experience metrics reads to the content read service', async () => {
    const getTechnologyExperienceMetrics = jest.fn().mockResolvedValue({
      slug: 'typescript',
      name: 'TypeScript',
      experienceMetrics: {
        total: {
          totalMonths: 64,
        },
      },
    });

    const moduleRef = await Test.createTestingModule({
      controllers: [TechnologiesController],
      providers: [
        {
          provide: ContentReadService,
          useValue: {
            getPublicCollection: jest.fn(),
            getPublicItem: jest.fn(),
            getTechnologyExperienceMetrics,
          },
        },
      ],
    }).compile();

    const controllerInstance = moduleRef.get(TechnologiesController);

    await expect(
      controllerInstance.getTechnologyExperienceMetrics('typescript'),
    ).resolves.toEqual({
      slug: 'typescript',
      name: 'TypeScript',
      experienceMetrics: {
        total: {
          totalMonths: 64,
        },
      },
    });

    expect(getTechnologyExperienceMetrics).toHaveBeenCalledWith('typescript');
  });
});
