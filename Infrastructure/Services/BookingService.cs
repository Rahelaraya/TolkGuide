using Application.Dtos;
using Application.Interfaces;
using Domain.Models;
using Infrastructure.Database;   // eller Infrastructure.Persistence beroende på ditt projekt
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Services;

public class BookingService : IBookingService
{
    private readonly UserDbContext _context;

    public BookingService(UserDbContext context)
    {
        _context = context;
    }

    public async Task<List<BookingDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var bookings = await _context.Bookings
            .Include(b => b.Customer)
            .Include(b => b.Interpreter)
            .Include(b => b.Language)
            .ToListAsync(cancellationToken);

        return bookings.Select(MapToDto).ToList();
    }

    public async Task<BookingDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var booking = await _context.Bookings
            .Include(b => b.Customer)
            .Include(b => b.Interpreter)
            .Include(b => b.Language)
            .FirstOrDefaultAsync(b => b.Id == id, cancellationToken);

        return booking is null ? null : MapToDto(booking);
    }

    public async Task<BookingDto> CreateAsync(BookingDto dto, CancellationToken cancellationToken = default)
    {
        var booking = new Booking
        {
            CustomerId = dto.CustomerId,
            InterpreterId = dto.InterpreterId,
            LanguageId = dto.LanguageId,
            StartTime = dto.StartTime,
            EndTime = dto.EndTime,
            Location = dto.Location,
            Notes = dto.Notes,
            Status = BookingStatus.Pending
        };

        _context.Bookings.Add(booking);
        await _context.SaveChangesAsync(cancellationToken);

        dto.Id = booking.Id;
        dto.Status = booking.Status.ToString();

        return dto;
    }

    public async Task<BookingDto?> AssignInterpreterAsync(
        int bookingId,
        int interpreterId,
        CancellationToken cancellationToken = default)
    {
        var booking = await _context.Bookings
            .FirstOrDefaultAsync(b => b.Id == bookingId, cancellationToken);

        if (booking is null)
            return null;

        booking.InterpreterId = interpreterId;
        booking.Status = BookingStatus.Assigned;

        await _context.SaveChangesAsync(cancellationToken);

        return MapToDto(booking);
    }

    public async Task<bool> CancelAsync(int bookingId, CancellationToken cancellationToken = default)
    {
        var booking = await _context.Bookings.FirstOrDefaultAsync(b => b.Id == bookingId, cancellationToken);

        if (booking is null)
            return false;

        booking.Status = BookingStatus.Cancelled;
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }

    private static BookingDto MapToDto(Booking booking)
    {
        return new BookingDto
        {
            Id = booking.Id,
            CustomerId = booking.CustomerId,
            InterpreterId = booking.InterpreterId,
            LanguageId = booking.LanguageId,
            StartTime = booking.StartTime,
            EndTime = booking.EndTime,
            Location = booking.Location,
            Notes = booking.Notes,
            Status = booking.Status.ToString()
        };
    }
}

