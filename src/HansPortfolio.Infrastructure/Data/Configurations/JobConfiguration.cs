using HansPortfolio.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HansPortfolio.Infrastructure.Data.Configurations;

internal sealed class JobConfiguration : IEntityTypeConfiguration<Job>
{
    public void Configure(EntityTypeBuilder<Job> builder)
    {
        builder.ToTable("jobs");

        builder.HasKey(entity => entity.Id);

        builder.Property(entity => entity.Slug)
            .HasMaxLength(150)
            .IsRequired();

        builder.Property(entity => entity.NamePt)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(entity => entity.NameEn)
            .HasMaxLength(200)
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

        builder.HasIndex(entity => entity.Slug)
            .IsUnique();
    }
}
