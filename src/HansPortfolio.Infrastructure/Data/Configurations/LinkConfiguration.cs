using HansPortfolio.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HansPortfolio.Infrastructure.Data.Configurations;

internal sealed class LinkConfiguration : IEntityTypeConfiguration<Link>
{
    public void Configure(EntityTypeBuilder<Link> builder)
    {
        builder.ToTable("links");

        builder.HasKey(entity => entity.Id);

        builder.Property(entity => entity.Url)
            .HasMaxLength(500)
            .IsRequired();

        builder.Property(entity => entity.LabelPt)
            .HasMaxLength(150)
            .IsRequired();

        builder.Property(entity => entity.LabelEn)
            .HasMaxLength(150)
            .IsRequired();

        builder.Property(entity => entity.DescriptionPt)
            .HasMaxLength(500);

        builder.Property(entity => entity.DescriptionEn)
            .HasMaxLength(500);

        builder.Property(entity => entity.Type)
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(entity => entity.SortOrder)
            .IsRequired();

        builder.Property(entity => entity.IsPublished)
            .IsRequired();

        builder.ConfigureAuditableEntity();
    }
}
