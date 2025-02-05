using System.Net.Http.Headers;
using Microsoft.AspNetCore.Mvc;

var corsPolicy = "allow-all-cors";

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddHttpClient<DriverStandingsDataService>((serviceProvider, client) =>
{
    IConfiguration configuration = serviceProvider.GetService<IConfiguration>();
    var baseAddress = configuration["rb-task-api-base-address"];
    var apiKey = configuration["rb-task-api-key"];
    client.BaseAddress = new Uri(baseAddress);
    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("x-api-key", apiKey);
});

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: corsPolicy,
        policy =>
        {
            policy.AllowAnyOrigin();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapGet("/driver-standings", (int year, [FromServices] DriverStandingsDataService standingsService) =>
{
    return standingsService.GetDataForYear(year);
})
.WithName("GetDriverStandings")
.WithOpenApi();

app.UseCors(corsPolicy);

app.Run();
