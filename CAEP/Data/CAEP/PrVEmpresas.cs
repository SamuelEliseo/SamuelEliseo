﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CAEP.Data.CAEP
{
    public partial class PrVEmpresas
    {
        [Column("ID_EMPRESA")]
        public int IdEmpresa { get; set; }
        [Required]
        [Column("COD_EMPRESA")]
        [StringLength(50)]
        public string CodEmpresa { get; set; }
        [Required]
        [Column("NOMBRE_EMPRESA")]
        [StringLength(50)]
        public string NombreEmpresa { get; set; }
        [Required]
        [Column("ID_USUARIO")]
        [StringLength(50)]
        public string IdUsuario { get; set; }
    }
}