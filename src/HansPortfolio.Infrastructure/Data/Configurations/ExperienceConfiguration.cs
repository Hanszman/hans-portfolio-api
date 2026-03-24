using HansPortfolio.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HansPortfolio.Infrastructure.Data.Configurations;

internal sealed class ExperienceConfiguration : IEntityTypeConfiguration<Experience>
{
    public void Configure(EntityTypeBuilder<Experience> builder)
    {
        builder.ToTable("experiences");

        builder.HasKey(entity => entity.Id);

        builder.Property(entity => entity.Slug)
            .HasMaxLength(150)
            .IsRequired();

        builder.Property(entity => entity.CompanyName)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(entity => entity.TitlePt)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(entity => entity.TitleEn)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(entity => entity.SummaryPt)
            .HasMaxLength(500)
            .IsRequired();

        builder.Property(entity => entity.SummaryEn)
            .HasMaxLength(500)
            .IsRequired();

        builder.Property(entity => entity.DescriptionPt)
            .HasColumnType("text");

        builder.Property(entity => entity.DescriptionEn)
            .HasColumnType("text");

        builder.Property(entity => entity.SortOrder)
            .IsRequired();

        builder.Property(entity => entity.IsPublished)
            .IsRequired();

        builder.ConfigureAuditableEntity();

        builder.HasIndex(entity => entity.Slug)
            .IsUnique();
    }
}
