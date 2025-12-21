using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos;

public class CreateBookingRequestDto
{
    public int LanguageId { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public string Location { get; set; } = string.Empty;
    public string? Notes { get; set; }
}
