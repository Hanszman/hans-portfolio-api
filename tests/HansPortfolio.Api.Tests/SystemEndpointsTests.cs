using System.Net;
using System.Net.Http.Json;
using HansPortfolio.Api.Contracts.Responses;
using HansPortfolio.Api.Tests.Support;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace HansPortfolio.Api.Tests;

public sealed class SystemEndpointsTests(CustomWebApplicationFactory factory) : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client = factory.CreateClient();
    private readonly TestHealthCheckState _healthState = factory.Services.GetRequiredService<TestHealthCheckState>();

    [Fact]
    public async Task Ping_ReturnsApplicationStatus()
    {
        var response = await _client.GetAsync("/api/system/ping");

        response.EnsureSuccessStatusCode();

        var payload = await response.Content.ReadFromJsonAsync<ApiStatusResponse>();

        Assert.NotNull(payload);
        Assert.Equal("Hans Portfolio API", payload.Name);
        Assert.Equal("Testing", payload.Environment);
        Assert.Equal("ok", payload.Status);
        Assert.True(payload.UtcNow <= DateTimeOffset.UtcNow);
    }

    [Fact]
    public async Task Health_ReturnsHealthyPayload_WhenChecksAreHealthy()
    {
        _healthState.Status = HealthStatus.Healthy;
        _healthState.Description = "Healthy test check.";

        var response = await _client.GetAsync("/health");

        response.EnsureSuccessStatusCode();

        var payload = await response.Content.ReadFromJsonAsync<HealthStatusResponse>();

        Assert.NotNull(payload);
        Assert.Equal("Healthy", payload.Status);
        Assert.Single(payload.Checks);
        Assert.Equal("test-health", payload.Checks.First().Name);
        Assert.Equal("Healthy", payload.Checks.First().Status);
        Assert.Equal("Healthy test check.", payload.Checks.First().Description);
        Assert.Null(payload.Checks.First().Error);
    }

    [Fact]
    public async Task Health_ReturnsServiceUnavailable_WhenChecksAreUnhealthy()
    {
        _healthState.Status = HealthStatus.Unhealthy;
        _healthState.Description = "Unhealthy test check.";

        var response = await _client.GetAsync("/health");

        Assert.Equal(HttpStatusCode.ServiceUnavailable, response.StatusCode);

        var payload = await response.Content.ReadFromJsonAsync<HealthStatusResponse>();

        Assert.NotNull(payload);
        Assert.Equal("Unhealthy", payload.Status);
        Assert.Single(payload.Checks);
        Assert.Equal("Unhealthy", payload.Checks.First().Status);
        Assert.Equal("Unhealthy test check.", payload.Checks.First().Description);
    }

    [Fact]
    public async Task OpenApi_Documents_Ping_And_Health_Endpoints()
    {
        var response = await _client.GetAsync("/openapi/v1.json");

        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();

        Assert.Contains("\"/api/system/ping\"", content);
        Assert.Contains("\"/health\"", content);
    }
}
