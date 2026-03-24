using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace HansPortfolio.Api.Tests.Support;

public sealed class StatefulHealthCheck(TestHealthCheckState state) : IHealthCheck
{
    public Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        var result = state.Status switch
        {
            HealthStatus.Healthy => HealthCheckResult.Healthy(state.Description),
            HealthStatus.Degraded => HealthCheckResult.Degraded(state.Description),
            _ => HealthCheckResult.Unhealthy(state.Description)
        };

        return Task.FromResult(result);
    }
}
