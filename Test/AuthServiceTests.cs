using System;
using Application.Dtos;
using Infrastructure.Authentication;
using Test;
using Xunit;

public class AuthServiceTests
{
    [Fact]
    public async Task Register_Should_Create_User_With_HashedPassword()
    {
        // Arrange
        var context = TestDbContextFactory.Create(); // in-memory DB
        var service = new AuthService(context);

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
