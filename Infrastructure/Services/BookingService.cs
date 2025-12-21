using Application.Dtos;
using Application.Interfaces;
using Domain.Models;
using Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services;

public class BookingService : IBookingService
{
    private readonly UserDbContext _context;

    public BookingService(UserDbContext context)
    {
        _context = context;
    }

    // -------------------------
    // Core - Customer + Interpreter
    // -------------------------

    public async Task<BookingDto> CreateAsync(Guid userId, CreateBookingRequestDto dto, CancellationToken ct = default)
    {
        if (dto.EndTime <= dto.StartTime)
            throw new InvalidOperationException("EndTime måste vara efter StartTime.");

        // Hitta customer-profil kopplad till inloggad user
        var customerId = await _context.Customers
            .Where(c => c.UserId == userId)
            .Select(c => (int?)c.Id)
            .FirstOrDefaultAsync(ct);

        if (customerId is null)
            throw new UnauthorizedAccessException("Customer-profil saknas för denna användare.");

        var languageExists = await _context.Languages.AnyAsync(l => l.Id == dto.LanguageId, ct);
        if (!languageExists)
            throw new InvalidOperationException("LanguageId finns inte.");

        var booking = new Booking
        {
            CustomerId = customerId.Value,
            InterpreterId = null,
            LanguageId = dto.LanguageId,
            StartTime = dto.StartTime,
            EndTime = dto.EndTime,
            Location = dto.Location,
            Notes = dto.Notes ?? string.Empty,
            Status = BookingStatus.Pending
        };

        _context.Bookings.Add(booking);
        await _context.SaveChangesAsync(ct);

        var created = await _context.Bookings
            .AsNoTracking()
            .Include(b => b.Customer)
            .Include(b => b.Interpreter)
            .Include(b => b.Language)
            .FirstAsync(b => b.Id == booking.Id, ct);

        return MapToDto(created);
    }

    public async Task<List<BookingDto>> GetMineAsync(Guid userId, CancellationToken ct = default)
    {
        // Är användaren customer?
        var customerId = await _context.Customers
            .Where(c => c.UserId == userId)
            .Select(c => (int?)c.Id)
            .FirstOrDefaultAsync(ct);

        // Är användaren interpreter?
        var interpreterId = await _context.Interpreters
            .Where(i => i.UserId == userId)
            .Select(i => (int?)i.Id)
            .FirstOrDefaultAsync(ct);

        if (customerId is null && interpreterId is null)
            throw new UnauthorizedAccessException("Ingen Customer/Interpreter-profil kopplad till användaren.");

        var query = _context.Bookings
            .AsNoTracking()
            .Include(b => b.Customer)
            .Include(b => b.Interpreter)
            .Include(b => b.Language)
            .AsQueryable();

        if (customerId is not null)
            query = query.Where(b => b.CustomerId == customerId.Value);

        // För interpreter: visa bokningar som är tilldelade/interpreterns, och även “Pending” om du vill att de kan plocka upp.
        if (interpreterId is not null)
            query = query.Where(b => b.InterpreterId == interpreterId.Value || b.InterpreterId == null);

        var bookings = await query
            .OrderByDescending(b => b.StartTime)
            .ToListAsync(ct);

        return bookings.Select(MapToDto).ToList();
    }

    public async Task<BookingDto?> GetByIdAsync(int bookingId, Guid userId, CancellationToken ct = default)
    {
        var booking = await _context.Bookings
            .AsNoTracking()
            .Include(b => b.Customer)
            .Include(b => b.Interpreter)
            .Include(b => b.Language)
            .FirstOrDefaultAsync(b => b.Id == bookingId, ct);

        if (booking is null) return null;

        // Access-koll: antingen customer äger den, eller interpreter är tilldelad
        var customerId = await _context.Customers
            .Where(c => c.UserId == userId)
            .Select(c => (int?)c.Id)
            .FirstOrDefaultAsync(ct);

        var interpreterId = await _context.Interpreters
            .Where(i => i.UserId == userId)
            .Select(i => (int?)i.Id)
            .FirstOrDefaultAsync(ct);

        var isOwnerCustomer = customerId is not null && booking.CustomerId == customerId.Value;
        var isAssignedInterpreter = interpreterId is not null && booking.InterpreterId == interpreterId.Value;

        if (!isOwnerCustomer && !isAssignedInterpreter)
            throw new UnauthorizedAccessException("Du har inte access till denna bokning.");

        return MapToDto(booking);
    }

    public async Task<BookingDto?> AcceptAsync(int bookingId, Guid userId, CancellationToken ct = default)
    {
        // Endast interpreter får acceptera
        var interpreterId = await _context.Interpreters
            .Where(i => i.UserId == userId)
            .Select(i => (int?)i.Id)
            .FirstOrDefaultAsync(ct);

        if (interpreterId is null)
            throw new UnauthorizedAccessException("Interpreter-profil saknas för denna användare.");

        var booking = await _context.Bookings.FirstOrDefaultAsync(b => b.Id == bookingId, ct);
        if (booking is null) return null;

        if (booking.Status == BookingStatus.Cancelled)
            throw new InvalidOperationException("Kan inte acceptera en avbokad bokning.");

        if (booking.Status == BookingStatus.Completed)
            throw new InvalidOperationException("Kan inte acceptera en completed bokning.");

        // Om någon annan redan tagit den
        if (booking.InterpreterId is not null && booking.InterpreterId != interpreterId.Value)
            throw new InvalidOperationException("Bokningen är redan accepterad av en annan tolk.");

        booking.InterpreterId = interpreterId.Value;

        // OBS: Jag använder Assigned eftersom din enum redan har Assigned.
        // Om du vill ha Confirmed istället kan vi lägga till statusen senare.
        booking.Status = BookingStatus.Assigned;

        await _context.SaveChangesAsync(ct);

        var updated = await _context.Bookings
            .AsNoTracking()
            .Include(b => b.Customer)
            .Include(b => b.Interpreter)
            .Include(b => b.Language)
            .FirstAsync(b => b.Id == bookingId, ct);

        return MapToDto(updated);
    }

    public async Task<bool> CancelAsync(int bookingId, Guid userId, CancelBookingRequestDto dto, CancellationToken ct = default)
    {
        var booking = await _context.Bookings
            .Include(b => b.Customer)
            .FirstOrDefaultAsync(b => b.Id == bookingId, ct);

        if (booking is null) return false;

        if (booking.Status == BookingStatus.Completed)
            throw new InvalidOperationException("Completed bokning kan inte avbokas.");

        // Kolla om user är customer som äger
        var customerId = await _context.Customers
            .Where(c => c.UserId == userId)
            .Select(c => (int?)c.Id)
            .FirstOrDefaultAsync(ct);

        var isOwnerCustomer = customerId is not null && booking.CustomerId == customerId.Value;

        // Kolla om user är interpreter som är tilldelad
        var interpreterId = await _context.Interpreters
            .Where(i => i.UserId == userId)
            .Select(i => (int?)i.Id)
            .FirstOrDefaultAsync(ct);

        var isAssignedInterpreter = interpreterId is not null && booking.InterpreterId == interpreterId.Value;

        if (!isOwnerCustomer && !isAssignedInterpreter)
            throw new UnauthorizedAccessException("Du får inte avboka någon annans bokning.");

        booking.Status = BookingStatus.Cancelled;

        // Om du har CancelReason i DB kan du spara dto.Reason här:
        // booking.CancelReason = dto.Reason;

        await _context.SaveChangesAsync(ct);
        return true;
    }

    // -------------------------
    // MAPPING
    // -------------------------

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

