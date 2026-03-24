using HansPortfolio.Api.Tests.Support;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Options;

namespace HansPortfolio.Api.Tests.Support;

public sealed class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    public TestHealthCheckState HealthState { get; } = new();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        Environment.SetEnvironmentVariable(
            "ConnectionStrings__PortfolioDatabase",
            "Host=localhost;Port=5432;Database=hans-portfolio-tests;Username=test;Password=test");

        builder.UseEnvironment("Testing");

        builder.ConfigureAppConfiguration((_, configurationBuilder) =>
        {
            configurationBuilder.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Application:Name"] = "Hans Portfolio API",
                ["Application:Description"] = "Test host for Hans Portfolio API."
            });
        });

        builder.ConfigureServices(services =>
        {
            services.AddSingleton(HealthState);

            services.AddSingleton<IConfigureOptions<HealthCheckServiceOptions>>(
                new ConfigureNamedOptions<HealthCheckServiceOptions>(
                    Options.DefaultName,
                    options =>
                    {
                        options.Registrations.Clear();
                        options.Registrations.Add(
                            new HealthCheckRegistration(
                                "test-health",
                                serviceProvider => new StatefulHealthCheck(serviceProvider.GetRequiredService<TestHealthCheckState>()),
                                failureStatus: null,
                                tags: ["test"]));
                    }));
        });
    }
}
