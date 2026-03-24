using HansPortfolio.Api.Routing;

namespace HansPortfolio.Api.Extensions;

public static class WebApplicationExtensions
{
    public static WebApplication MapApiEndpoints(this WebApplication app)
    {
        app.MapOpenApi("/openapi/{documentName}.json");

        app.MapGet("/", () => Results.Redirect("/swagger"))
            .ExcludeFromDescription();

        app.MapApplicationRoutes();

        return app;
    }
}
