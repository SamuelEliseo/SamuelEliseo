﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CAEP.Data.CAEP
{
    [Table("PR_TASA_DE_CAMBIO")]
    public partial class PrTasaDeCambio
    {
        [Key]
        [Column("ID_TASA")]
        public int IdTasa { get; set; }
        [Column("ID_TIPO_TASA")]
        public int? IdTipoTasa { get; set; }
        [Column("TASA", TypeName = "numeric(10, 2)")]
        public decimal? Tasa { get; set; }
        [Column("SIMBOLO")]
        [StringLength(10)]
        public string Simbolo { get; set; }
        [Column("AÑO")]
        public int? Año { get; set; }
        [StringLength(30)]
        public string Usuario { get; set; }
        [StringLength(200)]
        public string NombreEquipo { get; set; }

        [ForeignKey(nameof(IdTipoTasa))]
        [InverseProperty(nameof(PrTipoTasa.PrTasaDeCambio))]
        public virtual PrTipoTasa IdTipoTasaNavigation { get; set; }
    }
}