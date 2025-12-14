using Domain.Models;
using Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace Test;

public static class TestDbContextFactory
{
    public static UserDbContext Create()
    {
        var options = new DbContextOptionsBuilder<UserDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .EnableSensitiveDataLogging()
            .Options;

        return new UserDbContext(options);
    }

    public static async Task<UserDbContext> CreateWithSeedAsync()
    {
        var ctx = Create();

        // Languages
        ctx.Languages.Add(new Language { Id = 1, Name = "Svenska" });

        // User + Customer
        var customerUserId = Guid.NewGuid();
        ctx.Users.Add(new User
        {
            Id = customerUserId,
            Username = "customer1",
            PasswordHash = "hash",
            Role = "Customer"
        });

        ctx.Customers.Add(new Customer
        {
            Id = 1,
            Name = "Testkund AB",
            ContactPerson = "Anna Andersson",
            PhoneNumber = "0700000000",
            Email = "kund@example.com",
            Address = "Testgatan 1",
            UserId = customerUserId
        });

        // User + Interpreter
        var interpreterUserId = Guid.NewGuid();
        ctx.Users.Add(new User
        {
            Id = interpreterUserId,
            Username = "interpreter1",
            PasswordHash = "hash",
            Role = "Interpreter"
        });

        ctx.Interpreters.Add(new Interpreter
        {
            Id = 1,
            UserId = interpreterUserId,
            FirstName = "Sara",
            LastName = "Nilsson",
            Email = "sara@example.com",
            PhoneNumber = "0701111111",
            City = "Göteborg",
            IsActive = true
        });

        await ctx.SaveChangesAsync();
        return ctx;
    }

}



