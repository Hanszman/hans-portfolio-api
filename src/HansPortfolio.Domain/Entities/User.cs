using HansPortfolio.Domain.Enums;

namespace HansPortfolio.Domain.Entities;

public sealed class User : AuditableEntity
{
    public required string Name { get; set; }

    public required string Email { get; set; }

    public required string PasswordHash { get; set; }

    public UserRole Role { get; set; } = UserRole.Administrator;

    public bool IsActive { get; set; } = true;
}
