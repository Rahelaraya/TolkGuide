using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class Customer
    {
       
        public int Id { get; set; }

        public string Name { get; set; } = null!;
        public string ContactPerson { get; set; } = null!;
        public string PhoneNumber { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Address { get; set; } = null!;
        public Guid UserId { get; set; }     // FK till Users
        [JsonIgnore]
        public User User { get; set; } = null!;


        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    }

}
