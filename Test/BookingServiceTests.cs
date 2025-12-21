using Application.Dtos;
using Domain.Models;
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

        var userId = Guid.NewGuid();

        // ✅ Skapa customer-profil kopplad till userId (detta krävs av din service)
        context.Customers.Add(new Customer
        {
            UserId = userId,
            Name = "Test Customer",
            ContactPerson = "Test Customer",
            PhoneNumber = "N/A",
            Email = "N/A",
            Address = "N/A"
        });

        // ✅ Se till att LanguageId finns (antingen via seed eller lägg in här)
        // Om seed redan skapar Language med Id=1 kan du ta bort detta.
        if (!context.Languages.Any(l => l.Id == 1))
        {
            context.Languages.Add(new Language { Id = 1, Name = "Swedish" });
        }

        await context.SaveChangesAsync();

        var dto = new CreateBookingRequestDto
        {
            LanguageId = 1,
            StartTime = DateTime.UtcNow.AddHours(1),
            EndTime = DateTime.UtcNow.AddHours(2),
            Location = "Testplats",
            Notes = "Testanteckning"
        };

        // Act
        var result = await service.CreateAsync(userId, dto);

        // Assert
        Assert.NotNull(result);
        Assert.True(result.Id > 0);
        Assert.Equal(1, result.LanguageId);
        Assert.Equal("Testplats", result.Location);
        Assert.Equal("Pending", result.Status);
        Assert.Null(result.InterpreterId);
    }

}


