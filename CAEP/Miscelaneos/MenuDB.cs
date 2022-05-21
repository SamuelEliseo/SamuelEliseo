using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CAEP.Miscelaneos
{
    public class MenuDB
    {
        public string NombreLogicoSegNivel { get; set; }
        public string NombreSegNivel { get; set; }
        public string NombreLogicoPrimNivel { get; set; }
        public string NombrePrimNivel { get; set; }
        public string NombreLogicoTercerNivel { get; set; }
        public string NombreTercerNivel { get; set; }

        public bool EsTercerNivel { get; set; }
    }
}
