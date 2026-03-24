using HansPortfolio.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HansPortfolio.Infrastructure.Data.Configurations;

internal sealed class ProjectConfiguration : IEntityTypeConfiguration<Project>
{
    public void Configure(EntityTypeBuilder<Project> builder)
    {
        builder.ToTable("projects");

        builder.HasKey(entity => entity.Id);

        builder.Property(entity => entity.Slug)
            .HasMaxLength(150)
            .IsRequired();

        builder.Property(entity => entity.TitlePt)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(entity => entity.TitleEn)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(entity => entity.ShortDescriptionPt)
            .HasMaxLength(500)
            .IsRequired();

        builder.Property(entity => entity.ShortDescriptionEn)
            .HasMaxLength(500)
            .IsRequired();

        builder.Property(entity => entity.FullDescriptionPt)
            .HasColumnType("text");

        builder.Property(entity => entity.FullDescriptionEn)
            .HasColumnType("text");

        builder.Property(entity => entity.Context)
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(entity => entity.Status)
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(entity => entity.Environment)
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(entity => entity.RepositoryUrl)
            .HasMaxLength(500);

        builder.Property(entity => entity.DeployUrl)
            .HasMaxLength(500);

        builder.Property(entity => entity.DocsUrl)
            .HasMaxLength(500);

        builder.Property(entity => entity.NpmUrl)
            .HasMaxLength(500);

        builder.Property(entity => entity.SortOrder)
            .IsRequired();

        builder.Property(entity => entity.IsPublished)
            .IsRequired();

        builder.ConfigureAuditableEntity();

        builder.HasIndex(entity => entity.Slug)
            .IsUnique();
    }
}
