using HansPortfolio.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HansPortfolio.Infrastructure.Data.Configurations;

internal sealed class PortfolioSettingConfiguration : IEntityTypeConfiguration<PortfolioSetting>
{
    public void Configure(EntityTypeBuilder<PortfolioSetting> builder)
    {
        builder.ToTable("portfolio_settings");

        builder.HasKey(entity => entity.Id);

        builder.Property(entity => entity.Key)
            .HasMaxLength(150)
            .IsRequired();

        builder.Property(entity => entity.Value)
            .HasColumnType("text")
            .IsRequired();

        builder.Property(entity => entity.Description)
            .HasMaxLength(500);

        builder.HasIndex(entity => entity.Key)
            .IsUnique();
    }
}
