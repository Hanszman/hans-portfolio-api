using HansPortfolio.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HansPortfolio.Infrastructure.Data.Configurations;

internal sealed class TagConfiguration : IEntityTypeConfiguration<Tag>
{
    public void Configure(EntityTypeBuilder<Tag> builder)
    {
        builder.ToTable("tags");

        builder.HasKey(entity => entity.Id);

        builder.Property(entity => entity.Slug)
            .HasMaxLength(150)
            .IsRequired();

        builder.Property(entity => entity.NamePt)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(entity => entity.NameEn)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(entity => entity.Type)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(entity => entity.SortOrder)
            .IsRequired();

        builder.HasIndex(entity => entity.Slug)
            .IsUnique();
    }
}
