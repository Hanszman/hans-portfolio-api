using HansPortfolio.Domain.Enums;

namespace HansPortfolio.Domain.Entities;

public sealed class SpokenLanguage : BaseEntity
{
    public required string Code { get; set; }

    public required string NamePt { get; set; }

    public required string NameEn { get; set; }

    public SpokenLanguageProficiency Proficiency { get; set; }

    public bool Highlight { get; set; }

    public int SortOrder { get; set; }
}
