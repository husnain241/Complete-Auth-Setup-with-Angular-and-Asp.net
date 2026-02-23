using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace AuthSystem.API.Extensions;

/// <summary>
/// Service collection extensions for API layer.
/// </summary>
public static class ServiceExtensions
{
    /// <summary>
    /// Adds JWT authentication to the service collection.
    /// </summary>
    public static IServiceCollection AddJwtAuthentication(
        this IServiceCollection services, 
        IConfiguration configuration)
    {
        var jwtSettings = configuration.GetSection("JwtSettings");
        var secretKey = jwtSettings["SecretKey"] 
            ?? throw new InvalidOperationException("JWT SecretKey is not configured");
        
        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = jwtSettings["Issuer"],
                ValidAudience = jwtSettings["Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
                ClockSkew = TimeSpan.Zero // No tolerance for token expiry
            };
            
            options.Events = new JwtBearerEvents
            {
                OnAuthenticationFailed = context =>
                {
                    if (context.Exception is SecurityTokenExpiredException)
                    {
                        context.Response.Headers["Token-Expired"] = "true";
                    }
                    return Task.CompletedTask;
                },
                // YEH WALA HISSA ADD KAREIN
        OnMessageReceived = context =>
        {
            // SignalR token ko "access_token" query parameter mein bhejta hai
            var accessToken = context.Request.Query["access_token"];

            // Agar request Hub ke raste par ja rahi hai toh token utha lo
            var path = context.HttpContext.Request.Path;
            if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs"))
            {
                context.Token = accessToken;
            }
            return Task.CompletedTask;
        }
            };
        });
        
        return services;
    }
    
    /// <summary>
    /// Adds CORS policy for the Angular frontend.  
    /// </summary>
    public static IServiceCollection AddCorsPolicy(
        this IServiceCollection services, 
        IConfiguration configuration)
    {
        var allowedOrigins = configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() 
            ?? ["http://localhost:4200"];
        
        services.AddCors(options =>
        {
            options.AddPolicy("AllowAngularApp", policy =>
        {
            policy.WithOrigins(allowedOrigins) // Yahan JSON wala data apply hoga
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials(); // SignalR ke liye must hai
        });
        });
        
        return services;
    }
}
