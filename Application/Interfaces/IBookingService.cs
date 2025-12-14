using Application.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces;

public interface IBookingService
{
    Task<List<BookingDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<BookingDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<BookingDto> CreateAsync(BookingDto dto, CancellationToken cancellationToken = default);

    Task<BookingDto?> AssignInterpreterAsync(
        int bookingId,
        int interpreterId,
        CancellationToken cancellationToken = default);

    Task<bool> CancelAsync(int bookingId, CancellationToken cancellationToken = default);
}
