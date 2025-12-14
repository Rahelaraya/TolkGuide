using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{

    public enum BookingStatus
    {
        Pending = 0,
        Assigned = 1,
        Completed = 2,
        Cancelled = 3
    }

    public class Booking
    {
        public int Id { get; set; }

        public int CustomerId { get; set; }
        public Customer Customer { get; set; } = null!;

        public int? InterpreterId { get; set; }
        public Interpreter? Interpreter { get; set; }

        public int LanguageId { get; set; }
        public Language Language { get; set; } = null!;

        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }

        public string Location { get; set; } = null!;
        public string Notes { get; set; } = string.Empty;

        public BookingStatus Status { get; set; } = BookingStatus.Pending;
    }

}
