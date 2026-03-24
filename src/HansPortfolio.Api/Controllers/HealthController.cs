using HansPortfolio.Api.Contracts.Responses;
using HansPortfolio.Api.Routing;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace HansPortfolio.Api.Controllers;

[ApiController]
[AllowAnonymous]
[Tags(ApiRoutes.Diagnostics.Tag)]
[Route(ApiRoutes.Diagnostics.Health)]
public sealed class HealthController(HealthCheckService healthCheckService) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(HealthStatusResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(HealthStatusResponse), StatusCodes.Status503ServiceUnavailable)]
    public async Task<ActionResult<HealthStatusResponse>> Get(CancellationToken cancellationToken)
    {
        var report = await healthCheckService.CheckHealthAsync(cancellationToken);

        var response = new HealthStatusResponse(
            report.Status.ToString(),
            report.TotalDuration.TotalMilliseconds,
            report.Entries.Select(entry => new HealthCheckEntryResponse(
                entry.Key,
                entry.Value.Status.ToString(),
                entry.Value.Description,
                entry.Value.Duration.TotalMilliseconds,
                entry.Value.Exception?.Message))
            .ToArray());

        return report.Status == HealthStatus.Healthy
            ? Ok(response)
            : StatusCode(StatusCodes.Status503ServiceUnavailable, response);
    }
}
