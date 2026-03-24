using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace HansPortfolio.Api.Tests.Support;

public sealed class TestHealthCheckState
{
    public HealthStatus Status { get; set; } = HealthStatus.Healthy;

    public string Description { get; set; } = "Test health check is healthy.";
}
