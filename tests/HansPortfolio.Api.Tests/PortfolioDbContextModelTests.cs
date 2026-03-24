using HansPortfolio.Domain.Entities;
using HansPortfolio.Infrastructure.Data.Context;
using Microsoft.EntityFrameworkCore;

namespace HansPortfolio.Api.Tests;

public sealed class PortfolioDbContextModelTests
{
    private static readonly string[] ExpectedTableNames =
    [
        "customers",
        "experience_customers",
        "experience_image_assets",
        "experience_jobs",
        "experience_links",
        "experience_technologies",
        "experiences",
        "formation_image_assets",
        "formation_links",
        "formation_technologies",
        "formations",
        "image_assets",
        "jobs",
        "links",
        "portfolio_settings",
        "project_experiences",
        "project_image_assets",
        "project_links",
        "project_tags",
        "project_technologies",
        "projects",
        "spoken_languages",
        "tags",
        "technologies",
        "technology_tags",
        "users"
    ];

    [Fact]
    public void Model_UsesPortfolioSchema_AndRegistersExpectedTables()
    {
        using var context = CreateContext();

        var tableNames = context.Model.GetEntityTypes()
            .Select(entityType => entityType.GetTableName())
            .Where(tableName => tableName is not null)
            .Cast<string>()
            .OrderBy(tableName => tableName)
            .ToArray();

        Assert.Equal("portfolio", context.Model.GetDefaultSchema());
        Assert.Equal(ExpectedTableNames, tableNames);
    }

    [Fact]
    public void DbSets_AreAvailable_ForAllSprintB2Entities()
    {
        using var context = CreateContext();

        Assert.NotNull(context.Users);
        Assert.NotNull(context.Projects);
        Assert.NotNull(context.Experiences);
        Assert.NotNull(context.Technologies);
        Assert.NotNull(context.Formations);
        Assert.NotNull(context.SpokenLanguages);
        Assert.NotNull(context.Customers);
        Assert.NotNull(context.Jobs);
        Assert.NotNull(context.Links);
        Assert.NotNull(context.ImageAssets);
        Assert.NotNull(context.Tags);
        Assert.NotNull(context.PortfolioSettings);
        Assert.NotNull(context.ProjectTechnologies);
        Assert.NotNull(context.ExperienceTechnologies);
        Assert.NotNull(context.FormationTechnologies);
        Assert.NotNull(context.ProjectExperiences);
        Assert.NotNull(context.ExperienceCustomers);
        Assert.NotNull(context.ExperienceJobs);
        Assert.NotNull(context.ProjectTags);
        Assert.NotNull(context.TechnologyTags);
        Assert.NotNull(context.ProjectLinks);
        Assert.NotNull(context.ExperienceLinks);
        Assert.NotNull(context.FormationLinks);
        Assert.NotNull(context.ProjectImageAssets);
        Assert.NotNull(context.ExperienceImageAssets);
        Assert.NotNull(context.FormationImageAssets);
    }

    [Fact]
    public void ProjectEntity_HasExpectedTableShape_Indexes_AndRelationships()
    {
        using var context = CreateContext();

        var entityType = AssertEntityType<Project>(context);
        var slugProperty = AssertProperty(entityType, nameof(Project.Slug), "character varying(150)");
        var contextProperty = AssertProperty(entityType, nameof(Project.Context), "character varying(50)");
        var statusProperty = AssertProperty(entityType, nameof(Project.Status), "character varying(50)");
        var environmentProperty = AssertProperty(entityType, nameof(Project.Environment), "character varying(50)");

        Assert.Contains(entityType.GetIndexes(), index => index.IsUnique && index.Properties.Single().Name == nameof(Project.Slug));
        Assert.Equal(typeof(string), contextProperty.GetTypeMapping().Converter?.ProviderClrType);
        Assert.Equal(typeof(string), statusProperty.GetTypeMapping().Converter?.ProviderClrType);
        Assert.Equal(typeof(string), environmentProperty.GetTypeMapping().Converter?.ProviderClrType);
        var projectTechnologiesNavigation = entityType.FindNavigation(nameof(Project.ProjectTechnologies));
        var projectExperiencesNavigation = entityType.FindNavigation(nameof(Project.ProjectExperiences));
        var projectTagsNavigation = entityType.FindNavigation(nameof(Project.ProjectTags));
        var projectLinksNavigation = entityType.FindNavigation(nameof(Project.ProjectLinks));
        var projectImageAssetsNavigation = entityType.FindNavigation(nameof(Project.ProjectImageAssets));

        Assert.NotNull(projectTechnologiesNavigation);
        Assert.NotNull(projectExperiencesNavigation);
        Assert.NotNull(projectTagsNavigation);
        Assert.NotNull(projectLinksNavigation);
        Assert.NotNull(projectImageAssetsNavigation);
        Assert.Equal(nameof(Project.ProjectTechnologies), projectTechnologiesNavigation.Name);
        Assert.Equal(nameof(Project.ProjectExperiences), projectExperiencesNavigation.Name);
        Assert.Equal(nameof(Project.ProjectTags), projectTagsNavigation.Name);
        Assert.Equal(nameof(Project.ProjectLinks), projectLinksNavigation.Name);
        Assert.Equal(nameof(Project.ProjectImageAssets), projectImageAssetsNavigation.Name);
        Assert.Equal(nameof(Project.Slug), slugProperty.Name);
    }

    [Fact]
    public void TechnologyEntity_StoresEnumsAndFlags_WithExpectedProviderTypes()
    {
        using var context = CreateContext();

        var entityType = AssertEntityType<Technology>(context);
        var categoryProperty = AssertProperty(entityType, nameof(Technology.Category), "character varying(50)");
        var levelProperty = AssertProperty(entityType, nameof(Technology.Level), "character varying(50)");
        var usageFrequencyProperty = AssertProperty(entityType, nameof(Technology.UsageFrequency), "character varying(50)");
        var usageContextsProperty = AssertProperty(entityType, nameof(Technology.UsageContexts), "integer");

        Assert.Equal(typeof(string), categoryProperty.GetTypeMapping().Converter?.ProviderClrType);
        Assert.Equal(typeof(string), levelProperty.GetTypeMapping().Converter?.ProviderClrType);
        Assert.Equal(typeof(string), usageFrequencyProperty.GetTypeMapping().Converter?.ProviderClrType);
        Assert.Equal(typeof(int), usageContextsProperty.GetTypeMapping().Converter?.ProviderClrType);
        Assert.Contains(entityType.GetIndexes(), index => index.IsUnique && index.Properties.Single().Name == nameof(Technology.Slug));
    }

    [Fact]
    public void RelationshipEntities_UseCompositeKeys_AndExpectedJoinTables()
    {
        using var context = CreateContext();

        AssertCompositeKey<ProjectTechnology>(context, "project_technologies", nameof(ProjectTechnology.ProjectId), nameof(ProjectTechnology.TechnologyId));
        AssertCompositeKey<ExperienceTechnology>(context, "experience_technologies", nameof(ExperienceTechnology.ExperienceId), nameof(ExperienceTechnology.TechnologyId));
        AssertCompositeKey<FormationTechnology>(context, "formation_technologies", nameof(FormationTechnology.FormationId), nameof(FormationTechnology.TechnologyId));
        AssertCompositeKey<ProjectExperience>(context, "project_experiences", nameof(ProjectExperience.ProjectId), nameof(ProjectExperience.ExperienceId));
        AssertCompositeKey<ExperienceCustomer>(context, "experience_customers", nameof(ExperienceCustomer.ExperienceId), nameof(ExperienceCustomer.CustomerId));
        AssertCompositeKey<ExperienceJob>(context, "experience_jobs", nameof(ExperienceJob.ExperienceId), nameof(ExperienceJob.JobId));
        AssertCompositeKey<ProjectTag>(context, "project_tags", nameof(ProjectTag.ProjectId), nameof(ProjectTag.TagId));
        AssertCompositeKey<TechnologyTag>(context, "technology_tags", nameof(TechnologyTag.TechnologyId), nameof(TechnologyTag.TagId));
        AssertCompositeKey<ProjectLink>(context, "project_links", nameof(ProjectLink.ProjectId), nameof(ProjectLink.LinkId));
        AssertCompositeKey<ExperienceLink>(context, "experience_links", nameof(ExperienceLink.ExperienceId), nameof(ExperienceLink.LinkId));
        AssertCompositeKey<FormationLink>(context, "formation_links", nameof(FormationLink.FormationId), nameof(FormationLink.LinkId));
        AssertCompositeKey<ProjectImageAsset>(context, "project_image_assets", nameof(ProjectImageAsset.ProjectId), nameof(ProjectImageAsset.ImageAssetId));
        AssertCompositeKey<ExperienceImageAsset>(context, "experience_image_assets", nameof(ExperienceImageAsset.ExperienceId), nameof(ExperienceImageAsset.ImageAssetId));
        AssertCompositeKey<FormationImageAsset>(context, "formation_image_assets", nameof(FormationImageAsset.FormationId), nameof(FormationImageAsset.ImageAssetId));
    }

    [Fact]
    public void SupportingEntities_HaveExpectedUniqueIndexes_AndEnumConversions()
    {
        using var context = CreateContext();

        Assert.Contains(AssertEntityType<User>(context).GetIndexes(), index => index.IsUnique && index.Properties.Single().Name == nameof(User.Email));
        Assert.Contains(AssertEntityType<Customer>(context).GetIndexes(), index => index.IsUnique && index.Properties.Single().Name == nameof(Customer.Slug));
        Assert.Contains(AssertEntityType<Job>(context).GetIndexes(), index => index.IsUnique && index.Properties.Single().Name == nameof(Job.Slug));
        Assert.Contains(AssertEntityType<Formation>(context).GetIndexes(), index => index.IsUnique && index.Properties.Single().Name == nameof(Formation.Slug));
        Assert.Contains(AssertEntityType<SpokenLanguage>(context).GetIndexes(), index => index.IsUnique && index.Properties.Single().Name == nameof(SpokenLanguage.Code));
        Assert.Contains(AssertEntityType<Tag>(context).GetIndexes(), index => index.IsUnique && index.Properties.Single().Name == nameof(Tag.Slug));
        Assert.Contains(AssertEntityType<PortfolioSetting>(context).GetIndexes(), index => index.IsUnique && index.Properties.Single().Name == nameof(PortfolioSetting.Key));

        var degreeTypeProperty = AssertProperty(AssertEntityType<Formation>(context), nameof(Formation.DegreeType), "character varying(50)");
        var proficiencyProperty = AssertProperty(AssertEntityType<SpokenLanguage>(context), nameof(SpokenLanguage.Proficiency), "character varying(50)");
        var roleProperty = AssertProperty(AssertEntityType<User>(context), nameof(User.Role), "character varying(50)");
        var linkTypeProperty = AssertProperty(AssertEntityType<Link>(context), nameof(Link.Type), "character varying(50)");

        Assert.Equal(typeof(string), degreeTypeProperty.GetTypeMapping().Converter?.ProviderClrType);
        Assert.Equal(typeof(string), proficiencyProperty.GetTypeMapping().Converter?.ProviderClrType);
        Assert.Equal(typeof(string), roleProperty.GetTypeMapping().Converter?.ProviderClrType);
        Assert.Equal(typeof(string), linkTypeProperty.GetTypeMapping().Converter?.ProviderClrType);
    }

    private static PortfolioDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<PortfolioDbContext>()
            .UseNpgsql("Host=localhost;Port=5432;Database=hans_portfolio_tests;Username=test;Password=test")
            .Options;

        return new PortfolioDbContext(options);
    }

    private static Microsoft.EntityFrameworkCore.Metadata.IEntityType AssertEntityType<TEntity>(PortfolioDbContext context)
    {
        var entityType = context.Model.FindEntityType(typeof(TEntity));

        Assert.NotNull(entityType);
        Assert.Equal("portfolio", entityType.GetSchema());

        return entityType;
    }

    private static Microsoft.EntityFrameworkCore.Metadata.IProperty AssertProperty(
        Microsoft.EntityFrameworkCore.Metadata.IEntityType entityType,
        string propertyName,
        string columnType)
    {
        var property = entityType.FindProperty(propertyName);

        Assert.NotNull(property);
        Assert.Equal(columnType, property.GetColumnType());

        return property;
    }

    private static void AssertCompositeKey<TEntity>(PortfolioDbContext context, string expectedTableName, params string[] expectedKeyProperties)
    {
        var entityType = AssertEntityType<TEntity>(context);
        var primaryKey = entityType.FindPrimaryKey();

        Assert.NotNull(primaryKey);
        Assert.Equal(expectedTableName, entityType.GetTableName());
        Assert.Equal(expectedKeyProperties, primaryKey.Properties.Select(property => property.Name).ToArray());
    }
}
