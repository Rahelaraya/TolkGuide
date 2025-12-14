using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
 

    public class InterpreterLanguage
    {
        public int InterpreterId { get; set; }
        public Interpreter Interpreter { get; set; } = null!;

        public int LanguageId { get; set; }
        public Language Language { get; set; } = null!;
    }

}
