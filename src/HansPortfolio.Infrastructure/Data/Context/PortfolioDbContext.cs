using Microsoft.EntityFrameworkCore;

namespace HansPortfolio.Infrastructure.Data.Context;

public sealed class PortfolioDbContext(DbContextOptions<PortfolioDbContext> options) : DbContext(options)
{
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("portfolio");
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(PortfolioDbContext).Assembly);

        base.OnModelCreating(modelBuilder);
    }
}
