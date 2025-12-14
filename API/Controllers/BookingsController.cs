using Application.Dtos;

using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookingsController : ControllerBase
{
    private readonly IBookingService _bookingService;

    public BookingsController(IBookingService bookingService)
    {
        _bookingService = bookingService;
    }

    [HttpGet]
    public async Task<ActionResult<List<BookingDto>>> GetAll()
        => Ok(await _bookingService.GetAllAsync());

    [HttpGet("{id:int}")]
    public async Task<ActionResult<BookingDto>> GetById(int id)
    {
        var booking = await _bookingService.GetByIdAsync(id);
        if (booking is null) return NotFound();
        return Ok(booking);
    }

    [HttpPost]
    public async Task<ActionResult<BookingDto>> Create(BookingDto dto)
    {
        var created = await _bookingService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPost("{id:int}/assign/{interpreterId:int}")]
    public async Task<ActionResult<BookingDto>> AssignInterpreter(int id, int interpreterId)
    {
        var updated = await _bookingService.AssignInterpreterAsync(id, interpreterId);
        if (updated is null) return NotFound();
        return Ok(updated);
    }

    [HttpPost("{id:int}/cancel")]
    public async Task<ActionResult> Cancel(int id)
    {
        var success = await _bookingService.CancelAsync(id);
        if (!success) return NotFound();
        return NoContent();
    }
}

