using HansPortfolio.Domain.Entities;
using HansPortfolio.Domain.Enums;

namespace HansPortfolio.Api.Tests;

public sealed class PortfolioDomainEntityTests
{
    [Fact]
    public void BaseAndAuditableEntities_InitializeExpectedDefaults()
    {
        var beforeCreation = DateTimeOffset.UtcNow.AddSeconds(-2);

        var user = new User
        {
            Name = "Victor Hanszman",
            Email = "victor@example.com",
            PasswordHash = "hashed-password"
        };

        var setting = new PortfolioSetting
        {
            Key = "hero.title",
            Value = "Portfolio remake"
        };

        Assert.NotEqual(Guid.Empty, user.Id);
        Assert.NotEqual(Guid.Empty, setting.Id);
        Assert.InRange(user.CreatedAt, beforeCreation, DateTimeOffset.UtcNow.AddSeconds(2));
        Assert.InRange(user.UpdatedAt, beforeCreation, DateTimeOffset.UtcNow.AddSeconds(2));
        Assert.Equal(UserRole.Administrator, user.Role);
        Assert.True(user.IsActive);
        Assert.Equal("hero.title", setting.Key);
        Assert.Equal("Portfolio remake", setting.Value);
        Assert.Null(setting.Description);
    }

    [Fact]
    public void AggregateEntities_PreserveAssignedValues_AndInitializeNavigationCollections()
    {
        var project = new Project
        {
            Slug = "portfolio-remake",
            TitlePt = "Portfolio Remake",
            TitleEn = "Portfolio Remake",
            ShortDescriptionPt = "New portfolio in PT",
            ShortDescriptionEn = "New portfolio in EN",
            FullDescriptionPt = "Detailed PT description",
            FullDescriptionEn = "Detailed EN description",
            Context = ProjectContext.Personal,
            Status = ProjectStatus.InProgress,
            Environment = ProjectEnvironment.Fullstack,
            RepositoryUrl = "https://github.com/example/repo",
            DeployUrl = "https://example.com",
            DocsUrl = "https://docs.example.com",
            NpmUrl = "https://npmjs.com/package/example",
            Featured = true,
            Highlight = true,
            StartDate = new DateOnly(2026, 3, 1),
            EndDate = new DateOnly(2026, 12, 1),
            SortOrder = 1,
            IsPublished = true
        };

        var experience = new Experience
        {
            Slug = "consulting-project",
            CompanyName = "Hans Consulting",
            TitlePt = "Consultor",
            TitleEn = "Consultant",
            SummaryPt = "Resumo PT",
            SummaryEn = "Summary EN",
            DescriptionPt = "Descricao PT",
            DescriptionEn = "Description EN",
            StartDate = new DateOnly(2024, 1, 1),
            EndDate = new DateOnly(2025, 1, 1),
            IsCurrent = false,
            Highlight = true,
            SortOrder = 2,
            IsPublished = true
        };

        var technology = new Technology
        {
            Slug = "dotnet",
            Name = ".NET",
            Category = TechnologyCategory.Backend,
            Icon = "dotnet",
            OfficialUrl = "https://dotnet.microsoft.com",
            Highlight = true,
            Level = ProficiencyLevel.Advanced,
            UsageFrequency = UsageFrequency.Frequent,
            UsageContexts = UsageContext.Professional | UsageContext.Personal,
            SortOrder = 3,
            IsPublished = true
        };

        var formation = new Formation
        {
            Slug = "mba-software-architecture",
            Institution = "Example University",
            TitlePt = "MBA Arquitetura",
            TitleEn = "Software Architecture MBA",
            DegreeType = DegreeType.Mba,
            SummaryPt = "Resumo formacao PT",
            SummaryEn = "Formation summary EN",
            StartDate = new DateOnly(2023, 1, 1),
            EndDate = new DateOnly(2024, 12, 1),
            Highlight = true,
            SortOrder = 4,
            IsPublished = true
        };

        var link = new Link
        {
            Url = "https://github.com/example",
            LabelPt = "Repositorio",
            LabelEn = "Repository",
            DescriptionPt = "Descricao do link",
            DescriptionEn = "Link description",
            Type = LinkType.GitHub,
            SortOrder = 5,
            IsPublished = true
        };

        var imageAsset = new ImageAsset
        {
            FileName = "cover.png",
            FilePath = "/assets/cover.png",
            AltPt = "Capa do projeto",
            AltEn = "Project cover",
            CaptionPt = "Legenda PT",
            CaptionEn = "Caption EN",
            MimeType = "image/png",
            Width = 1920,
            Height = 1080,
            SortOrder = 6,
            IsPublished = true
        };

        Assert.Equal(ProjectContext.Personal, project.Context);
        Assert.Equal(ProjectStatus.InProgress, project.Status);
        Assert.Equal(ProjectEnvironment.Fullstack, project.Environment);
        Assert.True(project.Featured);
        Assert.True(project.Highlight);
        Assert.True(project.IsPublished);
        Assert.Empty(project.ProjectTechnologies);
        Assert.Empty(project.ProjectExperiences);
        Assert.Empty(project.ProjectTags);
        Assert.Empty(project.ProjectLinks);
        Assert.Empty(project.ProjectImageAssets);

        Assert.Equal("Hans Consulting", experience.CompanyName);
        Assert.Equal(new DateOnly(2024, 1, 1), experience.StartDate);
        Assert.Equal(new DateOnly(2025, 1, 1), experience.EndDate);
        Assert.Empty(experience.ExperienceTechnologies);
        Assert.Empty(experience.ProjectExperiences);
        Assert.Empty(experience.ExperienceCustomers);
        Assert.Empty(experience.ExperienceJobs);
        Assert.Empty(experience.ExperienceLinks);
        Assert.Empty(experience.ExperienceImageAssets);

        Assert.Equal(TechnologyCategory.Backend, technology.Category);
        Assert.Equal(ProficiencyLevel.Advanced, technology.Level);
        Assert.Equal(UsageFrequency.Frequent, technology.UsageFrequency);
        Assert.Equal(UsageContext.Professional | UsageContext.Personal, technology.UsageContexts);
        Assert.Empty(technology.ProjectTechnologies);
        Assert.Empty(technology.ExperienceTechnologies);
        Assert.Empty(technology.FormationTechnologies);
        Assert.Empty(technology.TechnologyTags);

        Assert.Equal(DegreeType.Mba, formation.DegreeType);
        Assert.Empty(formation.FormationTechnologies);
        Assert.Empty(formation.FormationLinks);
        Assert.Empty(formation.FormationImageAssets);

        Assert.Equal(LinkType.GitHub, link.Type);
        Assert.Empty(link.ProjectLinks);
        Assert.Empty(link.ExperienceLinks);
        Assert.Empty(link.FormationLinks);

        Assert.Equal("/assets/cover.png", imageAsset.FilePath);
        Assert.Equal("image/png", imageAsset.MimeType);
        Assert.Empty(imageAsset.ProjectImageAssets);
        Assert.Empty(imageAsset.ExperienceImageAssets);
        Assert.Empty(imageAsset.FormationImageAssets);
    }

    [Fact]
    public void SupportingEntities_AndAssociations_LinkExpectedPortfolioConcepts()
    {
        var customer = new Customer
        {
            Slug = "customer-a",
            Name = "Customer A",
            SummaryPt = "Resumo customer PT",
            SummaryEn = "Customer summary EN",
            Highlight = true,
            SortOrder = 1,
            IsPublished = true
        };

        var job = new Job
        {
            Slug = "frontend-engineer",
            NamePt = "Engenheiro Frontend",
            NameEn = "Frontend Engineer",
            SummaryPt = "Resumo cargo PT",
            SummaryEn = "Job summary EN",
            Highlight = true,
            SortOrder = 2,
            IsPublished = true
        };

        var spokenLanguage = new SpokenLanguage
        {
            Code = "en-US",
            NamePt = "Ingles",
            NameEn = "English",
            Proficiency = SpokenLanguageProficiency.Fluent,
            Highlight = true,
            SortOrder = 3
        };

        var tag = new Tag
        {
            Slug = "featured",
            NamePt = "Destaque",
            NameEn = "Featured",
            Type = "project",
            SortOrder = 4
        };

        var project = new Project
        {
            Slug = "api-remake",
            TitlePt = "API Remake",
            TitleEn = "API Remake",
            ShortDescriptionPt = "Resumo API PT",
            ShortDescriptionEn = "API summary EN"
        };

        var experience = new Experience
        {
            Slug = "portfolio-experience",
            CompanyName = "Victor Labs",
            TitlePt = "Dev",
            TitleEn = "Developer",
            SummaryPt = "Resumo experiencia PT",
            SummaryEn = "Experience summary EN",
            StartDate = new DateOnly(2025, 1, 1)
        };

        var formation = new Formation
        {
            Slug = "computer-science",
            Institution = "Example College",
            TitlePt = "Ciencia da Computacao",
            TitleEn = "Computer Science",
            SummaryPt = "Resumo curso PT",
            SummaryEn = "Course summary EN"
        };

        var technology = new Technology
        {
            Slug = "postgresql",
            Name = "PostgreSQL"
        };

        var link = new Link
        {
            Url = "https://example.com/demo",
            LabelPt = "Demo",
            LabelEn = "Demo"
        };

        var imageAsset = new ImageAsset
        {
            FileName = "preview.webp",
            FilePath = "/assets/preview.webp",
            AltPt = "Preview PT",
            AltEn = "Preview EN",
            MimeType = "image/webp"
        };

        var projectTechnology = new ProjectTechnology { ProjectId = project.Id, TechnologyId = technology.Id, Project = project, Technology = technology };
        var experienceTechnology = new ExperienceTechnology { ExperienceId = experience.Id, TechnologyId = technology.Id, Experience = experience, Technology = technology };
        var formationTechnology = new FormationTechnology { FormationId = formation.Id, TechnologyId = technology.Id, Formation = formation, Technology = technology };
        var projectExperience = new ProjectExperience { ProjectId = project.Id, ExperienceId = experience.Id, Project = project, Experience = experience };
        var experienceCustomer = new ExperienceCustomer { ExperienceId = experience.Id, CustomerId = customer.Id, Experience = experience, Customer = customer };
        var experienceJob = new ExperienceJob { ExperienceId = experience.Id, JobId = job.Id, Experience = experience, Job = job };
        var projectTag = new ProjectTag { ProjectId = project.Id, TagId = tag.Id, Project = project, Tag = tag };
        var technologyTag = new TechnologyTag { TechnologyId = technology.Id, TagId = tag.Id, Technology = technology, Tag = tag };
        var projectLink = new ProjectLink { ProjectId = project.Id, LinkId = link.Id, Project = project, Link = link };
        var experienceLink = new ExperienceLink { ExperienceId = experience.Id, LinkId = link.Id, Experience = experience, Link = link };
        var formationLink = new FormationLink { FormationId = formation.Id, LinkId = link.Id, Formation = formation, Link = link };
        var projectImageAsset = new ProjectImageAsset { ProjectId = project.Id, ImageAssetId = imageAsset.Id, Project = project, ImageAsset = imageAsset };
        var experienceImageAsset = new ExperienceImageAsset { ExperienceId = experience.Id, ImageAssetId = imageAsset.Id, Experience = experience, ImageAsset = imageAsset };
        var formationImageAsset = new FormationImageAsset { FormationId = formation.Id, ImageAssetId = imageAsset.Id, Formation = formation, ImageAsset = imageAsset };

        Assert.True(customer.Highlight);
        Assert.True(customer.IsPublished);
        Assert.Empty(customer.ExperienceCustomers);

        Assert.True(job.Highlight);
        Assert.True(job.IsPublished);
        Assert.Empty(job.ExperienceJobs);

        Assert.Equal(SpokenLanguageProficiency.Fluent, spokenLanguage.Proficiency);
        Assert.True(spokenLanguage.Highlight);

        Assert.Equal("project", tag.Type);
        Assert.Empty(tag.ProjectTags);
        Assert.Empty(tag.TechnologyTags);

        Assert.Equal(project.Id, projectTechnology.ProjectId);
        Assert.Equal(technology.Id, projectTechnology.TechnologyId);
        Assert.Same(project, projectTechnology.Project);
        Assert.Same(technology, projectTechnology.Technology);

        Assert.Equal(experience.Id, experienceTechnology.ExperienceId);
        Assert.Equal(technology.Id, experienceTechnology.TechnologyId);
        Assert.Same(experience, experienceTechnology.Experience);
        Assert.Same(technology, experienceTechnology.Technology);

        Assert.Equal(formation.Id, formationTechnology.FormationId);
        Assert.Equal(technology.Id, formationTechnology.TechnologyId);
        Assert.Same(formation, formationTechnology.Formation);
        Assert.Same(technology, formationTechnology.Technology);

        Assert.Equal(project.Id, projectExperience.ProjectId);
        Assert.Equal(experience.Id, projectExperience.ExperienceId);
        Assert.Same(project, projectExperience.Project);
        Assert.Same(experience, projectExperience.Experience);

        Assert.Equal(experience.Id, experienceCustomer.ExperienceId);
        Assert.Equal(customer.Id, experienceCustomer.CustomerId);
        Assert.Same(experience, experienceCustomer.Experience);
        Assert.Same(customer, experienceCustomer.Customer);

        Assert.Equal(experience.Id, experienceJob.ExperienceId);
        Assert.Equal(job.Id, experienceJob.JobId);
        Assert.Same(experience, experienceJob.Experience);
        Assert.Same(job, experienceJob.Job);

        Assert.Equal(project.Id, projectTag.ProjectId);
        Assert.Equal(tag.Id, projectTag.TagId);
        Assert.Same(project, projectTag.Project);
        Assert.Same(tag, projectTag.Tag);

        Assert.Equal(technology.Id, technologyTag.TechnologyId);
        Assert.Equal(tag.Id, technologyTag.TagId);
        Assert.Same(technology, technologyTag.Technology);
        Assert.Same(tag, technologyTag.Tag);

        Assert.Equal(project.Id, projectLink.ProjectId);
        Assert.Equal(link.Id, projectLink.LinkId);
        Assert.Same(project, projectLink.Project);
        Assert.Same(link, projectLink.Link);

        Assert.Equal(experience.Id, experienceLink.ExperienceId);
        Assert.Equal(link.Id, experienceLink.LinkId);
        Assert.Same(experience, experienceLink.Experience);
        Assert.Same(link, experienceLink.Link);

        Assert.Equal(formation.Id, formationLink.FormationId);
        Assert.Equal(link.Id, formationLink.LinkId);
        Assert.Same(formation, formationLink.Formation);
        Assert.Same(link, formationLink.Link);

        Assert.Equal(project.Id, projectImageAsset.ProjectId);
        Assert.Equal(imageAsset.Id, projectImageAsset.ImageAssetId);
        Assert.Same(project, projectImageAsset.Project);
        Assert.Same(imageAsset, projectImageAsset.ImageAsset);

        Assert.Equal(experience.Id, experienceImageAsset.ExperienceId);
        Assert.Equal(imageAsset.Id, experienceImageAsset.ImageAssetId);
        Assert.Same(experience, experienceImageAsset.Experience);
        Assert.Same(imageAsset, experienceImageAsset.ImageAsset);

        Assert.Equal(formation.Id, formationImageAsset.FormationId);
        Assert.Equal(imageAsset.Id, formationImageAsset.ImageAssetId);
        Assert.Same(formation, formationImageAsset.Formation);
        Assert.Same(imageAsset, formationImageAsset.ImageAsset);
    }
}
