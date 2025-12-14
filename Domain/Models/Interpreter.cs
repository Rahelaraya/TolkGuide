using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Domain.Models
{
    
    public class Interpreter
    {
        public int Id { get; set; }
        public Guid UserId { get; set; }      // FK till Users
       
        [JsonIgnore]
        public User User { get; set; } = null!;


        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string PhoneNumber { get; set; } = null!;
        public string Email { get; set; } = null!;

        // T.ex. "Swedish", "Arabic"
        public ICollection<InterpreterLanguage> Languages { get; set; } = new List<InterpreterLanguage>();

        // Stad/område där tolken jobbar
        public string City { get; set; } = null!;

        // Är tolken aktiv i systemet?
        public bool IsActive { get; set; } = true;

        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    }

}
