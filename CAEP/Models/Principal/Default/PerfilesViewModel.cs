using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CBTMonitoreo.Models.Principal.Default
{
    public class PerfilesViewModel
    {
        public string Perfil { get; set; }

        public override string ToString()
        {
            return Perfil;
        }
    }
}
