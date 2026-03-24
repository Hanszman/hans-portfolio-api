using HansPortfolio.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HansPortfolio.Infrastructure.Data.Configurations;

internal sealed class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("users");

        builder.HasKey(entity => entity.Id);

        builder.Property(entity => entity.Name)
            .HasMaxLength(150)
            .IsRequired();

        builder.Property(entity => entity.Email)
            .HasMaxLength(320)
            .IsRequired();

        builder.Property(entity => entity.PasswordHash)
            .HasMaxLength(500)
            .IsRequired();

        builder.Property(entity => entity.Role)
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(entity => entity.IsActive)
            .IsRequired();

        builder.ConfigureAuditableEntity();

        builder.HasIndex(entity => entity.Email)
            .IsUnique();
    }
}
