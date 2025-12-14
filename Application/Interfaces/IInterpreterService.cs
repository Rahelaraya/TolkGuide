using Application.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces;

public interface IInterpreterService
{
    Task<List<InterpreterDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<InterpreterDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    Task<InterpreterDto> CreateAsync(CreateInterpreterDto dto, CancellationToken cancellationToken = default);

    Task<InterpreterDto?> UpdateAsync(int id, InterpreterDto dto, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
}
