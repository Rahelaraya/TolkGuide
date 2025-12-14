using Application;
using Application.Interfaces;
using Infrastructure.Authentication;
using Infrastructure.Database;
using Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContext<UserDbContext>(options =>
     options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));


        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IInterpreterService, InterpreterService>();
        services.AddScoped<IBookingService, BookingService>();

        return services;
    }
}





