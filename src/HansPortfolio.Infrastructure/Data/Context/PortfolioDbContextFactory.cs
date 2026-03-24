using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using HansPortfolio.Infrastructure.Configuration;

namespace HansPortfolio.Infrastructure.Data.Context;

public sealed class PortfolioDbContextFactory : IDesignTimeDbContextFactory<PortfolioDbContext>
{
    public PortfolioDbContext CreateDbContext(string[] args)
    {
        EnvironmentFileLoader.Load();

        var apiProjectPath = Path.GetFullPath(
            Path.Combine(Directory.GetCurrentDirectory(), "..", "HansPortfolio.Api"));

        var environmentName = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development";

        var configuration = new ConfigurationBuilder()
            .SetBasePath(apiProjectPath)
            .AddJsonFile("appsettings.json", optional: false)
            .AddJsonFile($"appsettings.{environmentName}.json", optional: true)
            .AddEnvironmentVariables()
            .Build();

        var optionsBuilder = new DbContextOptionsBuilder<PortfolioDbContext>();

        optionsBuilder.UseNpgsql(
            DatabaseConnectionStringFactory.Create(configuration),
            npgsqlOptions =>
            {
                npgsqlOptions.MigrationsAssembly(typeof(PortfolioDbContext).Assembly.FullName);
                npgsqlOptions.MigrationsHistoryTable("__EFMigrationsHistory", "portfolio");
            });

        return new PortfolioDbContext(optionsBuilder.Options);
    }
}
