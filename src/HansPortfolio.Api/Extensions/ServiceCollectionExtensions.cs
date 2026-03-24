using HansPortfolio.Infrastructure;

namespace HansPortfolio.Api.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApiServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddProblemDetails();
        services.AddControllers();
        services.AddEndpointsApiExplorer();
        services.AddOpenApi();
        services.AddAuthorization();
        services.AddInfrastructure(configuration);

        return services;
    }
}
