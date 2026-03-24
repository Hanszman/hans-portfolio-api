using HansPortfolio.Api.Controllers;
using HansPortfolio.Api.Tests.Support;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Mvc;

namespace HansPortfolio.Api.Tests;

public sealed class SystemControllerTests
{
    [Fact]
    public void Ping_UsesFallbackApplicationName_WhenConfigurationValueIsMissing()
    {
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>())
            .Build();

        var controller = new SystemController(configuration, new FakeHostEnvironment());

        var actionResult = controller.Ping();
        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var payload = Assert.IsType<Contracts.Responses.ApiStatusResponse>(okResult.Value);

        Assert.Equal("Hans Portfolio API", payload.Name);
        Assert.Equal("Testing", payload.Environment);
        Assert.Equal("ok", payload.Status);
    }
}
