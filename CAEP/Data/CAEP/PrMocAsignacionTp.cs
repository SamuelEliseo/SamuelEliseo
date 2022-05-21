﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CAEP.Data.CAEP
{
    [Table("PR_MOC_ASIGNACION_TP")]
    public partial class PrMocAsignacionTp
    {
        [Key]
        [Column("ID_MOC_ASIGNACION_TP")]
        public int IdMocAsignacionTp { get; set; }
        [Column("ID_CENTRO_DE_COSTO")]
        public int IdCentroDeCosto { get; set; }
        [Column("ID_TIPO_PROCESO")]
        public int IdTipoProceso { get; set; }
        [Column("OBLIGATORIO")]
        public bool? Obligatorio { get; set; }
        [Column("NO_USAR")]
        public bool? NoUsar { get; set; }
        [StringLength(30)]
        public string Usuario { get; set; }

        [ForeignKey(nameof(IdCentroDeCosto))]
        [InverseProperty(nameof(PrCentrosDeCosto.PrMocAsignacionTp))]
        public virtual PrCentrosDeCosto IdCentroDeCostoNavigation { get; set; }
        [ForeignKey(nameof(IdTipoProceso))]
        [InverseProperty(nameof(PrTipoProceso.PrMocAsignacionTp))]
        public virtual PrTipoProceso IdTipoProcesoNavigation { get; set; }
    }
}