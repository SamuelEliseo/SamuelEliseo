using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace CAEP.Models.Principal.Default
{
    public class LoginViewModel
    {
        [Required(ErrorMessage = "El usuario es requerido!")]
        public string NombreUsuario { get; set; }

        [Required(ErrorMessage = "La contraseña es requerida!")]
        public string Contrasena { get; set; }
        [Required(ErrorMessage = "La empresa es requerida!")]
        public int IdEmpresa { get; set; }
        [Required(ErrorMessage = "El Centro de Costo es requerida!")]
        public int IdCC { get; set; }
    }
}
