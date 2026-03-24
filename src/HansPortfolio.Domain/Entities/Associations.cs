namespace HansPortfolio.Domain.Entities;

public sealed class ProjectTechnology
{
    public Guid ProjectId { get; set; }

    public Guid TechnologyId { get; set; }

    public Project Project { get; set; } = null!;

    public Technology Technology { get; set; } = null!;
}

public sealed class ExperienceTechnology
{
    public Guid ExperienceId { get; set; }

    public Guid TechnologyId { get; set; }

    public Experience Experience { get; set; } = null!;

    public Technology Technology { get; set; } = null!;
}

public sealed class FormationTechnology
{
    public Guid FormationId { get; set; }

    public Guid TechnologyId { get; set; }

    public Formation Formation { get; set; } = null!;

    public Technology Technology { get; set; } = null!;
}

public sealed class ProjectExperience
{
    public Guid ProjectId { get; set; }

    public Guid ExperienceId { get; set; }

    public Project Project { get; set; } = null!;

    public Experience Experience { get; set; } = null!;
}

public sealed class ExperienceCustomer
{
    public Guid ExperienceId { get; set; }

    public Guid CustomerId { get; set; }

    public Experience Experience { get; set; } = null!;

    public Customer Customer { get; set; } = null!;
}

public sealed class ExperienceJob
{
    public Guid ExperienceId { get; set; }

    public Guid JobId { get; set; }

    public Experience Experience { get; set; } = null!;

    public Job Job { get; set; } = null!;
}

public sealed class ProjectTag
{
    public Guid ProjectId { get; set; }

    public Guid TagId { get; set; }

    public Project Project { get; set; } = null!;

    public Tag Tag { get; set; } = null!;
}

public sealed class TechnologyTag
{
    public Guid TechnologyId { get; set; }

    public Guid TagId { get; set; }

    public Technology Technology { get; set; } = null!;

    public Tag Tag { get; set; } = null!;
}

public sealed class ProjectLink
{
    public Guid ProjectId { get; set; }

    public Guid LinkId { get; set; }

    public Project Project { get; set; } = null!;

    public Link Link { get; set; } = null!;
}

public sealed class ExperienceLink
{
    public Guid ExperienceId { get; set; }

    public Guid LinkId { get; set; }

    public Experience Experience { get; set; } = null!;

    public Link Link { get; set; } = null!;
}

public sealed class FormationLink
{
    public Guid FormationId { get; set; }

    public Guid LinkId { get; set; }

    public Formation Formation { get; set; } = null!;

    public Link Link { get; set; } = null!;
}

public sealed class ProjectImageAsset
{
    public Guid ProjectId { get; set; }

    public Guid ImageAssetId { get; set; }

    public Project Project { get; set; } = null!;

    public ImageAsset ImageAsset { get; set; } = null!;
}

public sealed class ExperienceImageAsset
{
    public Guid ExperienceId { get; set; }

    public Guid ImageAssetId { get; set; }

    public Experience Experience { get; set; } = null!;

    public ImageAsset ImageAsset { get; set; } = null!;
}

public sealed class FormationImageAsset
{
    public Guid FormationId { get; set; }

    public Guid ImageAssetId { get; set; }

    public Formation Formation { get; set; } = null!;

    public ImageAsset ImageAsset { get; set; } = null!;
}
