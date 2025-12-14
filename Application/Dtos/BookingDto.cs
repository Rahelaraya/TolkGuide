using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos
{
   
    public class BookingDto
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public int? InterpreterId { get; set; }
        public int LanguageId { get; set; }

        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }

        public string Location { get; set; } = null!;
        public string Notes { get; set; } = string.Empty;
        public string Status { get; set; } = null!;
    }

}
