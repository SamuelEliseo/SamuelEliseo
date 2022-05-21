﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CAEP.Data.CAEP
{
    [Table("PR_PARAMETERIZACION_DEDUCCION_REMUNERACION")]
    public partial class PrParameterizacionDeduccionRemuneracion
    {
        [Key]
        [Column("ID_PARAMETRO")]
        public int IdParametro { get; set; }
        [Required]
        [Column("NOMBRE_PARAMETRO")]
        [StringLength(100)]
        public string NombreParametro { get; set; }
        [Column("VALOR_PARAMETRO", TypeName = "numeric(10, 2)")]
        public decimal ValorParametro { get; set; }
        [Column("AÑO")]
        public int Año { get; set; }
        [Column("ID_TIPO_VALOR")]
        public int IdTipoValor { get; set; }
        [StringLength(30)]
        public string Usuario { get; set; }
    }
}