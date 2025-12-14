using Application.Dtos;
using Infrastructure.Services;
using Test;
using Xunit;

public class BookingServiceTests
{
    [Fact]
    public async Task CreateBooking_Should_Save_Booking()
    {
        // Arrange
        var context = await TestDbContextFactory.CreateWithSeedAsync();
        var service = new BookingService(context);

        var dto = new BookingDto
        {
            CustomerId = 1,
            InterpreterId = 1,     // ✅ finns nu
            LanguageId = 1,        // ✅ finns nu
            StartTime = DateTime.Now,
            EndTime = DateTime.Now.AddHours(1),
            Location = "Testplats",
            Notes = "Testanteckning",
            Status = "Pending"
        };

        // Act
        var result = await service.CreateAsync(dto);

        // Assert
        Assert.NotNull(result);
        Assert.True(result.Id > 0);
        Assert.Equal("Pending", result.Status);
        Assert.Equal("Testplats", result.Location);
        Assert.Equal(1, result.CustomerId);
        Assert.Equal(1, result.InterpreterId);
        Assert.Equal(1, result.LanguageId);
    }
}

