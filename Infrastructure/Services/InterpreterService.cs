using Application.Dtos;
using Application.Interfaces;
using Domain.Models;
using Infrastructure.Database;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Services;

public class InterpreterService : IInterpreterService
{
    private readonly UserDbContext _context;

    public InterpreterService(UserDbContext context)
    {
        _context = context;
    }


    public async Task<List<InterpreterDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var interpreters = await _context.Interpreters
            .Include(i => i.Languages)
                .ThenInclude(il => il.Language)
            .ToListAsync(cancellationToken);

        return interpreters.Select(MapToDto).ToList();
    }

    public async Task<InterpreterDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var interpreter = await _context.Interpreters
            .Include(i => i.Languages)
                .ThenInclude(il => il.Language)
            .FirstOrDefaultAsync(i => i.Id == id, cancellationToken);

        return interpreter is null ? null : MapToDto(interpreter);
    }

    public async Task<InterpreterDto> CreateAsync(CreateInterpreterDto dto, CancellationToken ct)
    {
        if (dto.UserId == Guid.Empty)
            throw new ArgumentException("UserId får inte vara tom (Guid.Empty).");

        var userExists = await _context.Users.AnyAsync(u => u.Id == dto.UserId, ct);
        if (!userExists)
            throw new Exception($"UserId {dto.UserId} finns inte i Users-tabellen.");

        var interpreter = new Interpreter
        {
            UserId = dto.UserId,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            PhoneNumber = dto.PhoneNumber,
            Email = dto.Email,
            City = dto.City,
            Languages = dto.LanguageIds
                .Select(id => new InterpreterLanguage { LanguageId = id })
                .ToList()
        };

        _context.Interpreters.Add(interpreter);
        await _context.SaveChangesAsync(ct);

        // Ladda Language-namn för DTO (eller gör Include efteråt)
        await _context.Entry(interpreter)
            .Collection(i => i.Languages)
            .Query()
            .Include(il => il.Language)
            .LoadAsync(ct);

        return MapToDto(interpreter);
    }



    public async Task<InterpreterDto?> UpdateAsync(int id, InterpreterDto dto, CancellationToken cancellationToken = default)
    {
        var interpreter = await _context.Interpreters
            .Include(i => i.Languages)
            .FirstOrDefaultAsync(i => i.Id == id, cancellationToken);

        if (interpreter is null) return null;

        interpreter.FirstName = dto.FullName.Split(' ')[0];
        interpreter.LastName = string.Join(" ", dto.FullName.Split(' ').Skip(1));
        interpreter.Email = dto.Email;
        interpreter.PhoneNumber = dto.PhoneNumber;
        interpreter.City = dto.City;

        await _context.SaveChangesAsync(cancellationToken);
        return MapToDto(interpreter);
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var interpreter = await _context.Interpreters.FirstOrDefaultAsync(i => i.Id == id, cancellationToken);
        if (interpreter is null) return false;

        _context.Interpreters.Remove(interpreter);
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }

    private static InterpreterDto MapToDto(Interpreter i)
        => new()
        {
            Id = i.Id,
            FullName = $"{i.FirstName} {i.LastName}",
            Email = i.Email,
            PhoneNumber = i.PhoneNumber,
            City = i.City,
            Languages = i.Languages
                .Where(il => il.Language != null)
                .Select(il => il.Language!.Name)
                .ToList()
        };


}

