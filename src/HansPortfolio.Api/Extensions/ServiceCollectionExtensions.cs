using System.Diagnostics.CodeAnalysis;
using HansPortfolio.Infrastructure;

namespace HansPortfolio.Api.Extensions;

[ExcludeFromCodeCoverage]
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
