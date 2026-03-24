using HansPortfolio.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HansPortfolio.Infrastructure.Data.Configurations;

internal sealed class ProjectTechnologyConfiguration : IEntityTypeConfiguration<ProjectTechnology>
{
    public void Configure(EntityTypeBuilder<ProjectTechnology> builder)
    {
        builder.ToTable("project_technologies");
        builder.HasKey(entity => new { entity.ProjectId, entity.TechnologyId });
        builder.HasOne(entity => entity.Project).WithMany(project => project.ProjectTechnologies).HasForeignKey(entity => entity.ProjectId);
        builder.HasOne(entity => entity.Technology).WithMany(technology => technology.ProjectTechnologies).HasForeignKey(entity => entity.TechnologyId);
    }
}

internal sealed class ExperienceTechnologyConfiguration : IEntityTypeConfiguration<ExperienceTechnology>
{
    public void Configure(EntityTypeBuilder<ExperienceTechnology> builder)
    {
        builder.ToTable("experience_technologies");
        builder.HasKey(entity => new { entity.ExperienceId, entity.TechnologyId });
        builder.HasOne(entity => entity.Experience).WithMany(experience => experience.ExperienceTechnologies).HasForeignKey(entity => entity.ExperienceId);
        builder.HasOne(entity => entity.Technology).WithMany(technology => technology.ExperienceTechnologies).HasForeignKey(entity => entity.TechnologyId);
    }
}

internal sealed class FormationTechnologyConfiguration : IEntityTypeConfiguration<FormationTechnology>
{
    public void Configure(EntityTypeBuilder<FormationTechnology> builder)
    {
        builder.ToTable("formation_technologies");
        builder.HasKey(entity => new { entity.FormationId, entity.TechnologyId });
        builder.HasOne(entity => entity.Formation).WithMany(formation => formation.FormationTechnologies).HasForeignKey(entity => entity.FormationId);
        builder.HasOne(entity => entity.Technology).WithMany(technology => technology.FormationTechnologies).HasForeignKey(entity => entity.TechnologyId);
    }
}

internal sealed class ProjectExperienceConfiguration : IEntityTypeConfiguration<ProjectExperience>
{
    public void Configure(EntityTypeBuilder<ProjectExperience> builder)
    {
        builder.ToTable("project_experiences");
        builder.HasKey(entity => new { entity.ProjectId, entity.ExperienceId });
        builder.HasOne(entity => entity.Project).WithMany(project => project.ProjectExperiences).HasForeignKey(entity => entity.ProjectId);
        builder.HasOne(entity => entity.Experience).WithMany(experience => experience.ProjectExperiences).HasForeignKey(entity => entity.ExperienceId);
    }
}

internal sealed class ExperienceCustomerConfiguration : IEntityTypeConfiguration<ExperienceCustomer>
{
    public void Configure(EntityTypeBuilder<ExperienceCustomer> builder)
    {
        builder.ToTable("experience_customers");
        builder.HasKey(entity => new { entity.ExperienceId, entity.CustomerId });
        builder.HasOne(entity => entity.Experience).WithMany(experience => experience.ExperienceCustomers).HasForeignKey(entity => entity.ExperienceId);
        builder.HasOne(entity => entity.Customer).WithMany(customer => customer.ExperienceCustomers).HasForeignKey(entity => entity.CustomerId);
    }
}

internal sealed class ExperienceJobConfiguration : IEntityTypeConfiguration<ExperienceJob>
{
    public void Configure(EntityTypeBuilder<ExperienceJob> builder)
    {
        builder.ToTable("experience_jobs");
        builder.HasKey(entity => new { entity.ExperienceId, entity.JobId });
        builder.HasOne(entity => entity.Experience).WithMany(experience => experience.ExperienceJobs).HasForeignKey(entity => entity.ExperienceId);
        builder.HasOne(entity => entity.Job).WithMany(job => job.ExperienceJobs).HasForeignKey(entity => entity.JobId);
    }
}

internal sealed class ProjectTagConfiguration : IEntityTypeConfiguration<ProjectTag>
{
    public void Configure(EntityTypeBuilder<ProjectTag> builder)
    {
        builder.ToTable("project_tags");
        builder.HasKey(entity => new { entity.ProjectId, entity.TagId });
        builder.HasOne(entity => entity.Project).WithMany(project => project.ProjectTags).HasForeignKey(entity => entity.ProjectId);
        builder.HasOne(entity => entity.Tag).WithMany(tag => tag.ProjectTags).HasForeignKey(entity => entity.TagId);
    }
}

internal sealed class TechnologyTagConfiguration : IEntityTypeConfiguration<TechnologyTag>
{
    public void Configure(EntityTypeBuilder<TechnologyTag> builder)
    {
        builder.ToTable("technology_tags");
        builder.HasKey(entity => new { entity.TechnologyId, entity.TagId });
        builder.HasOne(entity => entity.Technology).WithMany(technology => technology.TechnologyTags).HasForeignKey(entity => entity.TechnologyId);
        builder.HasOne(entity => entity.Tag).WithMany(tag => tag.TechnologyTags).HasForeignKey(entity => entity.TagId);
    }
}

internal sealed class ProjectLinkConfiguration : IEntityTypeConfiguration<ProjectLink>
{
    public void Configure(EntityTypeBuilder<ProjectLink> builder)
    {
        builder.ToTable("project_links");
        builder.HasKey(entity => new { entity.ProjectId, entity.LinkId });
        builder.HasOne(entity => entity.Project).WithMany(project => project.ProjectLinks).HasForeignKey(entity => entity.ProjectId);
        builder.HasOne(entity => entity.Link).WithMany(link => link.ProjectLinks).HasForeignKey(entity => entity.LinkId);
    }
}

internal sealed class ExperienceLinkConfiguration : IEntityTypeConfiguration<ExperienceLink>
{
    public void Configure(EntityTypeBuilder<ExperienceLink> builder)
    {
        builder.ToTable("experience_links");
        builder.HasKey(entity => new { entity.ExperienceId, entity.LinkId });
        builder.HasOne(entity => entity.Experience).WithMany(experience => experience.ExperienceLinks).HasForeignKey(entity => entity.ExperienceId);
        builder.HasOne(entity => entity.Link).WithMany(link => link.ExperienceLinks).HasForeignKey(entity => entity.LinkId);
    }
}

internal sealed class FormationLinkConfiguration : IEntityTypeConfiguration<FormationLink>
{
    public void Configure(EntityTypeBuilder<FormationLink> builder)
    {
        builder.ToTable("formation_links");
        builder.HasKey(entity => new { entity.FormationId, entity.LinkId });
        builder.HasOne(entity => entity.Formation).WithMany(formation => formation.FormationLinks).HasForeignKey(entity => entity.FormationId);
        builder.HasOne(entity => entity.Link).WithMany(link => link.FormationLinks).HasForeignKey(entity => entity.LinkId);
    }
}

internal sealed class ProjectImageAssetConfiguration : IEntityTypeConfiguration<ProjectImageAsset>
{
    public void Configure(EntityTypeBuilder<ProjectImageAsset> builder)
    {
        builder.ToTable("project_image_assets");
        builder.HasKey(entity => new { entity.ProjectId, entity.ImageAssetId });
        builder.HasOne(entity => entity.Project).WithMany(project => project.ProjectImageAssets).HasForeignKey(entity => entity.ProjectId);
        builder.HasOne(entity => entity.ImageAsset).WithMany(imageAsset => imageAsset.ProjectImageAssets).HasForeignKey(entity => entity.ImageAssetId);
    }
}

internal sealed class ExperienceImageAssetConfiguration : IEntityTypeConfiguration<ExperienceImageAsset>
{
    public void Configure(EntityTypeBuilder<ExperienceImageAsset> builder)
    {
        builder.ToTable("experience_image_assets");
        builder.HasKey(entity => new { entity.ExperienceId, entity.ImageAssetId });
        builder.HasOne(entity => entity.Experience).WithMany(experience => experience.ExperienceImageAssets).HasForeignKey(entity => entity.ExperienceId);
        builder.HasOne(entity => entity.ImageAsset).WithMany(imageAsset => imageAsset.ExperienceImageAssets).HasForeignKey(entity => entity.ImageAssetId);
    }
}

internal sealed class FormationImageAssetConfiguration : IEntityTypeConfiguration<FormationImageAsset>
{
    public void Configure(EntityTypeBuilder<FormationImageAsset> builder)
    {
        builder.ToTable("formation_image_assets");
        builder.HasKey(entity => new { entity.FormationId, entity.ImageAssetId });
        builder.HasOne(entity => entity.Formation).WithMany(formation => formation.FormationImageAssets).HasForeignKey(entity => entity.FormationId);
        builder.HasOne(entity => entity.ImageAsset).WithMany(imageAsset => imageAsset.FormationImageAssets).HasForeignKey(entity => entity.ImageAssetId);
    }
}
