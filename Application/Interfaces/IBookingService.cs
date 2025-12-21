using Application.Dtos;

namespace Application.Interfaces;

public interface IBookingService
{
    // Customer skapar bokning (customerId hämtas från token)
    Task<BookingDto> CreateAsync(Guid userId, CreateBookingRequestDto dto, CancellationToken cancellationToken = default);

    // Customer eller Interpreter: lista mina bokningar
    Task<List<BookingDto>> GetMineAsync(Guid userId, CancellationToken cancellationToken = default);

    // Hämta bokning (med access-koll: bara den som äger bokningen / tilldelad tolk)
    Task<BookingDto?> GetByIdAsync(int bookingId, Guid userId, CancellationToken cancellationToken = default);

    // Interpreter accepterar bokning
    Task<BookingDto?> AcceptAsync(int bookingId, Guid userId, CancellationToken cancellationToken = default);

    // Customer eller Interpreter avbokar
    Task<bool> CancelAsync(int bookingId, Guid userId, CancelBookingRequestDto dto, CancellationToken cancellationToken = default);
}

