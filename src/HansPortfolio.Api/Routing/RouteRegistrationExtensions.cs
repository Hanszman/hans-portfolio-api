namespace HansPortfolio.Api.Routing;

public static class RouteRegistrationExtensions
{
    public static WebApplication MapApplicationRoutes(this WebApplication app)
    {
        app.MapControllers();

        return app;
    }
}
