using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class Language
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;

        public ICollection<InterpreterLanguage> InterpreterLanguages { get; set; } = new List<InterpreterLanguage>();
    }

}
