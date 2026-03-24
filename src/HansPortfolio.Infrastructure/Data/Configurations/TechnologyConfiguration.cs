using HansPortfolio.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HansPortfolio.Infrastructure.Data.Configurations;

internal sealed class TechnologyConfiguration : IEntityTypeConfiguration<Technology>
{
    public void Configure(EntityTypeBuilder<Technology> builder)
    {
        builder.ToTable("technologies");

        builder.HasKey(entity => entity.Id);

        builder.Property(entity => entity.Slug)
            .HasMaxLength(150)
            .IsRequired();

        builder.Property(entity => entity.Name)
            .HasMaxLength(150)
            .IsRequired();

        builder.Property(entity => entity.Category)
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(entity => entity.Icon)
            .HasMaxLength(250);

        builder.Property(entity => entity.OfficialUrl)
            .HasMaxLength(500);

        builder.Property(entity => entity.Level)
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(entity => entity.UsageFrequency)
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(entity => entity.UsageContexts)
            .HasConversion<int>()
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
