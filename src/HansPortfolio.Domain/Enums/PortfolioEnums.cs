namespace HansPortfolio.Domain.Enums;

public enum UserRole
{
    Administrator = 1
}

public enum ProjectContext
{
    Professional = 1,
    Personal = 2,
    Academic = 3,
    Study = 4
}

public enum ProjectStatus
{
    Completed = 1,
    InProgress = 2,
    Archived = 3,
    Planned = 4
}

public enum ProjectEnvironment
{
    Frontend = 1,
    Backend = 2,
    Fullstack = 3,
    Mobile = 4,
    Library = 5,
    Dashboard = 6
}

public enum TechnologyCategory
{
    Frontend = 1,
    Backend = 2,
    Database = 3,
    Cloud = 4,
    DevOps = 5,
    Testing = 6,
    Architecture = 7,
    DesignSystem = 8,
    Mobile = 9,
    Tooling = 10,
    Other = 11
}

public enum ProficiencyLevel
{
    Basic = 1,
    Intermediate = 2,
    Advanced = 3
}

public enum UsageFrequency
{
    Frequent = 1,
    Occasional = 2,
    UsedBefore = 3,
    Studying = 4
}

[Flags]
public enum UsageContext
{
    None = 0,
    Professional = 1,
    Personal = 2,
    Academic = 4,
    Study = 8
}

public enum DegreeType
{
    Technical = 1,
    Undergraduate = 2,
    Specialization = 3,
    Mba = 4,
    Bootcamp = 5,
    Course = 6,
    Certification = 7,
    Other = 8
}

public enum SpokenLanguageProficiency
{
    Basic = 1,
    Intermediate = 2,
    Advanced = 3,
    Fluent = 4,
    Native = 5
}

public enum LinkType
{
    GitHub = 1,
    Deploy = 2,
    Npm = 3,
    Docs = 4,
    LinkedIn = 5,
    Website = 6,
    Article = 7,
    Figma = 8,
    Other = 9
}
