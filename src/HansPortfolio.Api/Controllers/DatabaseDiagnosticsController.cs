using HansPortfolio.Api.Contracts.Responses;
using HansPortfolio.Application.DTOs;
using HansPortfolio.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HansPortfolio.Api.Controllers;

[ApiController]
[AllowAnonymous]
[Route("api/system/database")]
public sealed class DatabaseDiagnosticsController(IDatabaseDiagnosticsService databaseDiagnosticsService) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(DatabaseConnectionResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status503ServiceUnavailable)]
    public async Task<ActionResult<DatabaseConnectionResponse>> Get(CancellationToken cancellationToken)
    {
        DatabaseDiagnosticsDto diagnostics = await databaseDiagnosticsService.GetDiagnosticsAsync(cancellationToken);

        var response = new DatabaseConnectionResponse(
            diagnostics.IsConnected,
            diagnostics.Probe,
            diagnostics.DatabaseName,
            diagnostics.CurrentSchema,
            diagnostics.ServerVersion,
            diagnostics.ExecutedAtUtc);

        return Ok(response);
    }
}
