using System.Net.Http.Headers;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddHttpClient<DriverStandingsDataService>((serviceProvider, client) =>
{
    var apiKey = builder.Configuration["rb-task-api-key"];
    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("x-api-key", apiKey);
    client.BaseAddress = new Uri("https://pitwall.redbullracing.com");
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapGet("/driver-standings", ([FromServices] DriverStandingsDataService standingsService) =>
{
    return standingsService.GetDataForYear(2023);
})
.WithName("GetDriverStandings")
.WithOpenApi();

app.Run();



public class DriverStandingsDataService
{
    private readonly HttpClient _client;
    public DriverStandingsDataService(HttpClient client)
    {
        _client = client;
    }

    public async Task<string> GetDataForYear(int year)
    {
        var result = await _client.GetAsync($"/api/standings/drivers/{year}");
        var resultString = await result.Content.ReadAsStringAsync();
        return resultString;
    }
}