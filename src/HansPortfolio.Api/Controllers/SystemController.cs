using HansPortfolio.Api.Contracts.Responses;
using Microsoft.AspNetCore.Mvc;

namespace HansPortfolio.Api.Controllers;

[ApiController]
[Route("api/system")]
public sealed class SystemController(IConfiguration configuration, IHostEnvironment environment) : ControllerBase
{
    [HttpGet("ping")]
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
