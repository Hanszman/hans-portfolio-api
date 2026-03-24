using HansPortfolio.Api.Contracts.Responses;
using HansPortfolio.Api.Routing;
using Microsoft.AspNetCore.Mvc;

namespace HansPortfolio.Api.Controllers;

[ApiController]
[Tags(ApiRoutes.System.Tag)]
[Route(ApiRoutes.System.Base)]
public sealed class SystemController(IConfiguration configuration, IHostEnvironment environment) : ControllerBase
{
    [HttpGet(ApiRoutes.System.Ping)]
    [ProducesResponseType(typeof(ApiStatusResponse), StatusCodes.Status200OK)]
    public ActionResult<ApiStatusResponse> Ping()
    {
        var response = new ApiStatusResponse(
            configuration["Application:Name"] ?? "Hans Portfolio API",
            environment.EnvironmentName,
            "ok",
            DateTimeOffset.UtcNow);

        return Ok(response);
    }
}
