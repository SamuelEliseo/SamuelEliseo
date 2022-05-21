﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CAEP.Data.CAEP
{
    [Table("PR_SUCURSALES")]
    public partial class PrSucursales
    {
        [Key]
        [Column("ID_SUCURSAL")]
        public int IdSucursal { get; set; }
        [Required]
        [Column("COD_SUCURSAL")]
        [StringLength(20)]
        public string CodSucursal { get; set; }
        [Required]
        [Column("NOMBRE_SUCURSAL")]
        [StringLength(100)]
        public string NombreSucursal { get; set; }
        [Column("ID_EMPRESA")]
        public int? IdEmpresa { get; set; }
        [StringLength(30)]
        public string Usuario { get; set; }
    }
}