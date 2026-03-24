using HansPortfolio.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HansPortfolio.Infrastructure.Data.Configurations;

internal sealed class FormationConfiguration : IEntityTypeConfiguration<Formation>
{
    public void Configure(EntityTypeBuilder<Formation> builder)
    {
        builder.ToTable("formations");

        builder.HasKey(entity => entity.Id);

        builder.Property(entity => entity.Slug)
            .HasMaxLength(150)
            .IsRequired();

        builder.Property(entity => entity.Institution)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(entity => entity.TitlePt)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(entity => entity.TitleEn)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(entity => entity.DegreeType)
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(entity => entity.SummaryPt)
            .HasMaxLength(500)
            .IsRequired();

        builder.Property(entity => entity.SummaryEn)
            .HasMaxLength(500)
            .IsRequired();

        builder.Property(entity => entity.SortOrder)
            .IsRequired();

        builder.Property(entity => entity.IsPublished)
            .IsRequired();

        builder.ConfigureAuditableEntity();

        builder.HasIndex(entity => entity.Slug)
            .IsUnique();
    }
}
