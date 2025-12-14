using Application.Dtos;
using Application.Interfaces;
using Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InterpretersController : ControllerBase
{
    private readonly IInterpreterService _interpreterService;

    public InterpretersController(IInterpreterService interpreterService)
    {
        _interpreterService = interpreterService;
    }

    [HttpGet]
  // eller [AllowAnonymous] om du vill testa enklare
    public async Task<ActionResult<List<InterpreterDto>>> GetAll()
    {
        var result = await _interpreterService.GetAllAsync();
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<InterpreterDto>> GetById(int id)
    {
        var interpreter = await _interpreterService.GetByIdAsync(id);
        if (interpreter is null) return NotFound();
        return Ok(interpreter);
    }


    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateInterpreterDto dto, CancellationToken ct)
    {
        var result = await _interpreterService.CreateAsync(dto, ct);
        return Ok(result);
    }


    [HttpPut("{id:int}")]
    public async Task<ActionResult<InterpreterDto>> Update(int id, InterpreterDto dto)
    {
        var updated = await _interpreterService.UpdateAsync(id, dto);
        if (updated is null) return NotFound();
        return Ok(updated);
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> Delete(int id)
    {
        var success = await _interpreterService.DeleteAsync(id);
        if (!success) return NotFound();
        return NoContent();
    }
}

