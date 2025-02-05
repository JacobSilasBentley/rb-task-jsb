using System.Text.Json;
using System.Text.Json.Serialization;

public class DriverStandingsDataService
{
    private readonly HttpClient _client;
    public DriverStandingsDataService(HttpClient client)
    {
        _client = client;
    }

    public async Task<IReadOnlyCollection<DriverStandingDTO>> GetDataForYear(int year)
    {
        var result = await _client.GetAsync($"/api/standings/drivers/{year}");
        if (result.IsSuccessStatusCode == false)
        {
            var errorString = await result.Content.ReadAsStringAsync();
            throw new HttpRequestException($"Failed to retrieve the driver standings data for {year}. Failed with {result.StatusCode} : {errorString}");
        }
        var resultString = await result.Content.ReadAsStringAsync();
        var standings = JsonSerializer.Deserialize<DriverStandingDataAccess[]>(resultString);
        var output = standings.Select((ds, index) => new DriverStandingDTO()
        {
            DriverUUID = ds.DriverUUID,
            DriverName = $"{ds.FirstName}, {ds.LastName}",
            DriverCountryCode = ds.DriverCountryCode,
            SeasonTeamName = ds.SeasonTeamName,
            SeasonPoints = ds.SeasonPoints,
            Position = index //Assumes position in array returned from the API is the position in the Championship
        });
        return output.ToArray();
    }

    private record DriverStandingDataAccess
    {
        [JsonPropertyName("driver_uuid")]
        public string DriverUUID { get; init; }

        [JsonPropertyName("first_name")]
        public string FirstName { get; init; }

        [JsonPropertyName("last_name")]
        public string LastName { get; init; }

        [JsonPropertyName("driver_country_code")]
        public string DriverCountryCode { get; init; }

        [JsonPropertyName("season_team_name")]
        public string SeasonTeamName { get; init; }

        [JsonPropertyName("season_points")]
        public double SeasonPoints { get; init; }
    }
}
