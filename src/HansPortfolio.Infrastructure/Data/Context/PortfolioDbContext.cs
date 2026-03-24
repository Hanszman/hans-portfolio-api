using HansPortfolio.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace HansPortfolio.Infrastructure.Data.Context;

public sealed class PortfolioDbContext(DbContextOptions<PortfolioDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();

    public DbSet<Project> Projects => Set<Project>();

    public DbSet<Experience> Experiences => Set<Experience>();

    public DbSet<Technology> Technologies => Set<Technology>();

    public DbSet<Formation> Formations => Set<Formation>();

    public DbSet<SpokenLanguage> SpokenLanguages => Set<SpokenLanguage>();

    public DbSet<Customer> Customers => Set<Customer>();

    public DbSet<Job> Jobs => Set<Job>();

    public DbSet<Link> Links => Set<Link>();

    public DbSet<ImageAsset> ImageAssets => Set<ImageAsset>();

    public DbSet<Tag> Tags => Set<Tag>();

    public DbSet<PortfolioSetting> PortfolioSettings => Set<PortfolioSetting>();

    public DbSet<ProjectTechnology> ProjectTechnologies => Set<ProjectTechnology>();

    public DbSet<ExperienceTechnology> ExperienceTechnologies => Set<ExperienceTechnology>();

    public DbSet<FormationTechnology> FormationTechnologies => Set<FormationTechnology>();

    public DbSet<ProjectExperience> ProjectExperiences => Set<ProjectExperience>();

    public DbSet<ExperienceCustomer> ExperienceCustomers => Set<ExperienceCustomer>();

    public DbSet<ExperienceJob> ExperienceJobs => Set<ExperienceJob>();

    public DbSet<ProjectTag> ProjectTags => Set<ProjectTag>();

    public DbSet<TechnologyTag> TechnologyTags => Set<TechnologyTag>();

    public DbSet<ProjectLink> ProjectLinks => Set<ProjectLink>();

    public DbSet<ExperienceLink> ExperienceLinks => Set<ExperienceLink>();

    public DbSet<FormationLink> FormationLinks => Set<FormationLink>();

    public DbSet<ProjectImageAsset> ProjectImageAssets => Set<ProjectImageAsset>();

    public DbSet<ExperienceImageAsset> ExperienceImageAssets => Set<ExperienceImageAsset>();

    public DbSet<FormationImageAsset> FormationImageAssets => Set<FormationImageAsset>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("portfolio");
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(PortfolioDbContext).Assembly);

        base.OnModelCreating(modelBuilder);
    }
}
