using Application.Dtos;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BookingsController : ControllerBase
{
    private readonly IBookingService _bookingService;

    public BookingsController(IBookingService bookingService)
    {
        _bookingService = bookingService;
    }

    private Guid GetUserId()
    {
        var raw = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.Parse(raw!);
    }


    // 1) Customer skapar bokning (customerId tas från token)
    [HttpPost]
    public async Task<ActionResult<BookingDto>> Create([FromBody] CreateBookingRequestDto dto)
    {
        var userId = GetUserId();
        var created = await _bookingService.CreateAsync(userId, dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    // 2) Hämta en bokning (för att CreatedAtAction ska funka + detaljvy)
    [HttpGet("{id:int}")]
    public async Task<ActionResult<BookingDto>> GetById(int id)
    {
        var userId = GetUserId();
        var booking = await _bookingService.GetByIdAsync(id, userId);
        if (booking is null) return NotFound();
        return Ok(booking);
    }

    // 3) Min lista (customer ser sina, interpreter ser sina)
    [HttpGet("mine")]
    public async Task<ActionResult<List<BookingDto>>> GetMine()
    {
        var userId = GetUserId();
        var result = await _bookingService.GetMineAsync(userId);
        return Ok(result);
    }

    // 4) Interpreter accepterar bokning (ingen interpreterId i URL!)
    [Authorize(Roles = "Interpreter")]
    [HttpPost("{id:int}/accept")]
    public async Task<ActionResult<BookingDto>> Accept(int id)
    {
        var userId = GetUserId();
        var updated = await _bookingService.AcceptAsync(id, userId);
        if (updated is null) return NotFound();
        return Ok(updated);
    }

    // 5) Customer eller Interpreter avbokar
    [HttpPost("{id:int}/cancel")]
    public async Task<IActionResult> Cancel(int id, [FromBody] CancelBookingRequestDto dto)
    {
        var userId = GetUserId();
        var ok = await _bookingService.CancelAsync(id, userId, dto);
        if (!ok) return NotFound();
        return NoContent();
    }
}

