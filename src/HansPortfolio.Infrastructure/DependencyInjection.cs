using HansPortfolio.Application.Interfaces;
using HansPortfolio.Infrastructure.Data.Context;
using HansPortfolio.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace HansPortfolio.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = DatabaseConnectionStringFactory.Create(configuration);

        services.AddDbContext<PortfolioDbContext>(options =>
        {
            options.UseNpgsql(
                connectionString,
                npgsqlOptions =>
                {
                    npgsqlOptions.MigrationsAssembly(typeof(PortfolioDbContext).Assembly.FullName);
                    npgsqlOptions.MigrationsHistoryTable("__EFMigrationsHistory", "portfolio");
                });
        });

        services.AddHealthChecks()
            .AddDbContextCheck<PortfolioDbContext>(
                name: "portfolio-database",
                failureStatus: HealthStatus.Unhealthy,
                tags: ["db", "ready"]);

        services.AddScoped<IDatabaseDiagnosticsService, DatabaseDiagnosticsService>();

        return services;
    }
}
