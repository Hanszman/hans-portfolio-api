using HansPortfolio.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HansPortfolio.Infrastructure.Data.Configurations;

internal sealed class ImageAssetConfiguration : IEntityTypeConfiguration<ImageAsset>
{
    public void Configure(EntityTypeBuilder<ImageAsset> builder)
    {
        builder.ToTable("image_assets");

        builder.HasKey(entity => entity.Id);

        builder.Property(entity => entity.FileName)
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(entity => entity.FilePath)
            .HasMaxLength(500)
            .IsRequired();

        builder.Property(entity => entity.AltPt)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(entity => entity.AltEn)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(entity => entity.CaptionPt)
            .HasMaxLength(500);

        builder.Property(entity => entity.CaptionEn)
            .HasMaxLength(500);

        builder.Property(entity => entity.MimeType)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(entity => entity.Width)
            .IsRequired();

        builder.Property(entity => entity.Height)
            .IsRequired();

        builder.Property(entity => entity.SortOrder)
            .IsRequired();

        builder.Property(entity => entity.IsPublished)
            .IsRequired();

        builder.ConfigureAuditableEntity();
    }
}
