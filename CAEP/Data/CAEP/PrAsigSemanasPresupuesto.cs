// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CAEP.Data.CAEP
{
    [Table("PR_ASIG_SEMANAS_PRESUPUESTO")]
    public partial class PrAsigSemanasPresupuesto
    {
        [Key]
        [Column("ID_ASIG_SEMANA")]
        public int IdAsigSemana { get; set; }
        [Column("ID_PRESUPUESTO")]
        public int? IdPresupuesto { get; set; }
        [Column("ID_SEMANA")]
        public int? IdSemana { get; set; }
        [Column("AÑO")]
        public int? Año { get; set; }
        [StringLength(30)]
        public string Usuario { get; set; }
        [StringLength(200)]
        public string NombreEquipo { get; set; }
    }
}