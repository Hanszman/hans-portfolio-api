using HansPortfolio.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HansPortfolio.Infrastructure.Data.Configurations;

internal sealed class SpokenLanguageConfiguration : IEntityTypeConfiguration<SpokenLanguage>
{
    public void Configure(EntityTypeBuilder<SpokenLanguage> builder)
    {
        builder.ToTable("spoken_languages");

        builder.HasKey(entity => entity.Id);

        builder.Property(entity => entity.Code)
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(entity => entity.NamePt)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(entity => entity.NameEn)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(entity => entity.Proficiency)
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(entity => entity.SortOrder)
            .IsRequired();

        builder.HasIndex(entity => entity.Code)
            .IsUnique();
    }
}
