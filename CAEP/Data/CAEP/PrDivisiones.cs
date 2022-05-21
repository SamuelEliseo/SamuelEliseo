﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CAEP.Data.CAEP
{
    [Table("PR_DIVISIONES")]
    public partial class PrDivisiones
    {
        [Key]
        [Column("ID_DIVISION")]
        public int IdDivision { get; set; }
        [Required]
        [Column("COD_DIVISION")]
        [StringLength(50)]
        public string CodDivision { get; set; }
        [Required]
        [Column("NOMBRE_DIVISION")]
        [StringLength(50)]
        public string NombreDivision { get; set; }
        [Column("ID_SUCURSAL")]
        public int? IdSucursal { get; set; }
        [StringLength(30)]
        public string Usuario { get; set; }
    }
}