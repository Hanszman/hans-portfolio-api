using HansPortfolio.Api.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApiServices(builder.Configuration);

var app = builder.Build();

app.UseSwaggerUI(options =>
{
    options.RoutePrefix = "swagger";
    options.SwaggerEndpoint("/openapi/v1.json", "Hans Portfolio API v1");
    options.DocumentTitle = "Hans Portfolio API";
});

app.UseHttpsRedirection();
app.UseAuthorization();

app.MapApiEndpoints();

app.Run();

public partial class Program;
