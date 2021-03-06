// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CAEP.Data.CAEP
{
    [Table("PR_PRESUPUESTO_SEMANAL_DETALLE_D")]
    public partial class PrPresupuestoSemanalDetalleD
    {
        [Key]
        [Column("ID_DETALLE_PRES_SEMANAL_D")]
        public int IdDetallePresSemanalD { get; set; }
        [Column("ID_DETALLE_PRES_SEMANAL")]
        public int IdDetallePresSemanal { get; set; }
        [Column("ID_SEMANA")]
        public int IdSemana { get; set; }
        [Column("CANTIDAD", TypeName = "numeric(10, 2)")]
        public decimal? Cantidad { get; set; }
        [StringLength(30)]
        public string Usuario { get; set; }

        [ForeignKey(nameof(IdDetallePresSemanal))]
        [InverseProperty(nameof(PrPresupuestoSemanalDetalle.PrPresupuestoSemanalDetalleD))]
        public virtual PrPresupuestoSemanalDetalle IdDetallePresSemanalNavigation { get; set; }
    }
}