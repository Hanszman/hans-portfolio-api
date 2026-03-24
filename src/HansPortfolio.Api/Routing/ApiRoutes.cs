namespace HansPortfolio.Api.Routing;

public static class ApiRoutes
{
    public static class System
    {
        public const string Tag = "System";
        public const string Base = "api/system";
        public const string Ping = "ping";
        public const string Database = "database";
    }

    public static class Diagnostics
    {
        public const string Tag = "System";
        public const string Health = "health";
    }
}
