﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CAEP.Data.CAEP
{
    [Table("PR_PERMISOS_USUARIOS")]
    public partial class PrPermisosUsuarios
    {
        [Key]
        public int IdPermisoUsuario { get; set; }
        [Column("Id_Usuario")]
        [StringLength(20)]
        public string IdUsuario { get; set; }
        [Column("Id_Presupuesto")]
        public int? IdPresupuesto { get; set; }
        [StringLength(30)]
        public string Usuario { get; set; }
        [StringLength(200)]
        public string NombreEquipo { get; set; }
    }
}