using AuthSystem.API.Extensions;
using AuthSystem.API.Middleware;
using AuthSystem.Infrastructure;
using AuthSystem.Infrastructure.Identity;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container

// Infrastructure layer (DbContext)
builder.Services.AddInfrastructure(builder.Configuration);

// JWT Authentication
builder.Services.AddJwtAuthentication(builder.Configuration);

// Authorization
builder.Services.AddAuthorization();

// CORS for Angular frontend
builder.Services.AddCorsPolicy(builder.Configuration);

// Controllers
builder.Services.AddControllers();

// OpenAPI (.NET 10 built-in - no Swashbuckle)
builder.Services.AddOpenApi();



var app = builder.Build();

// Seed default admin user at startup
await DataSeed.SeedAsync(app.Services);

// Configure the HTTP request pipeline

// Global exception handling
app.UseExceptionMiddleware();

// OpenAPI endpoint (development mode)
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// CORS must be before authentication/authorization
app.UseCors("AllowAngularApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
