namespace HansPortfolio.Domain.Entities;

public sealed class ImageAsset : AuditableEntity
{
    public required string FileName { get; set; }

    public required string FilePath { get; set; }

    public required string AltPt { get; set; }

    public required string AltEn { get; set; }

    public string? CaptionPt { get; set; }

    public string? CaptionEn { get; set; }

    public required string MimeType { get; set; }

    public int Width { get; set; }

    public int Height { get; set; }

    public int SortOrder { get; set; }

    public bool IsPublished { get; set; }

    public ICollection<ProjectImageAsset> ProjectImageAssets { get; set; } = [];

    public ICollection<ExperienceImageAsset> ExperienceImageAssets { get; set; } = [];

    public ICollection<FormationImageAsset> FormationImageAssets { get; set; } = [];
}
