using Application.Dtos;
using Infrastructure.Authentication;
using Microsoft.Extensions.Configuration;
using System;
using Test;
using Xunit;

public class AuthServiceTests
{
    [Fact]
    public async Task Register_Should_Create_User_With_HashedPassword()
    {
        // Arrange
        var context = TestDbContextFactory.Create(); // in-memory DB
        var config = new ConfigurationBuilder()
       .AddInMemoryCollection(new Dictionary<string, string?>
       {
           ["AppSettings:Token"] = "THIS_IS_A_TEST_TOKEN_123456789012345678901234567890",
           ["AppSettings:Issuer"] = "TolkGuide",
           ["AppSettings:Audience"] = "TolkGuideClient"
       })
       .Build();

        var service = new AuthService(context, config);


        var dto = new UserDto
        {
            Username = "testuser",
            Password = "hello123",
            Role = "User"
           
        };

        // Act
        var result = await service.RegisterAsync(dto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("testuser", result.Username);
        Assert.NotEqual("hello123", result.PasswordHash);   // får inte vara klartext
        Assert.NotNull(result.PasswordHash);
        Assert.NotEqual(Guid.Empty, result.Id);             // ✔ rätt sätt att testa Guid
    }
}
