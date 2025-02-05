public record DriverStandingDTO
{
    public required string DriverUUID { get; init; }
    public required string DriverName { get; init; }
    public required string DriverCountryCode { get; init; }
    public required string SeasonTeamName { get; init; }
    public required double SeasonPoints { get; init; }
    public required int Position { get; init; }
}
