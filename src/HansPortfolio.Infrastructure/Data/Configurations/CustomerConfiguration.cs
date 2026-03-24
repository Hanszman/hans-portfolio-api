using HansPortfolio.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HansPortfolio.Infrastructure.Data.Configurations;

internal sealed class CustomerConfiguration : IEntityTypeConfiguration<Customer>
{
    public void Configure(EntityTypeBuilder<Customer> builder)
    {
        builder.ToTable("customers");

        builder.HasKey(entity => entity.Id);

        builder.Property(entity => entity.Slug)
            .HasMaxLength(150)
            .IsRequired();

        builder.Property(entity => entity.Name)
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
