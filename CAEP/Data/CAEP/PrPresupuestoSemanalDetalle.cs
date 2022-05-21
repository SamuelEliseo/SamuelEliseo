﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CAEP.Data.CAEP
{
    [Table("PR_PRESUPUESTO_SEMANAL_DETALLE")]
    public partial class PrPresupuestoSemanalDetalle
    {
        public PrPresupuestoSemanalDetalle()
        {
            PrPresupuestoSemanalDetalleD = new HashSet<PrPresupuestoSemanalDetalleD>();
        }

        [Key]
        [Column("ID_DETALLE_PRES_SEMANAL")]
        public int IdDetallePresSemanal { get; set; }
        [Column("ID_PRESUPUESTO")]
        public int IdPresupuesto { get; set; }
        [Column("ID_CUENTA")]
        public int IdCuenta { get; set; }
        [Column("ID_MATERIAL")]
        public int IdMaterial { get; set; }
        [Column("PRECIO_UNITARIO", TypeName = "numeric(10, 2)")]
        public decimal PrecioUnitario { get; set; }
        [Column("CANTIDAD", TypeName = "numeric(18, 1)")]
        public decimal Cantidad { get; set; }
        [Column("TOTAL", TypeName = "numeric(18, 2)")]
        public decimal Total { get; set; }
        [StringLength(30)]
        public string Usuario { get; set; }

        [ForeignKey(nameof(IdCuenta))]
        [InverseProperty(nameof(PrCuentas.PrPresupuestoSemanalDetalle))]
        public virtual PrCuentas IdCuentaNavigation { get; set; }
        [ForeignKey(nameof(IdMaterial))]
        [InverseProperty(nameof(PrMateriales.PrPresupuestoSemanalDetalle))]
        public virtual PrMateriales IdMaterialNavigation { get; set; }
        [ForeignKey(nameof(IdPresupuesto))]
        [InverseProperty(nameof(PrPresupuestoMaestro.PrPresupuestoSemanalDetalle))]
        public virtual PrPresupuestoMaestro IdPresupuestoNavigation { get; set; }
        [InverseProperty("IdDetallePresSemanalNavigation")]
        public virtual ICollection<PrPresupuestoSemanalDetalleD> PrPresupuestoSemanalDetalleD { get; set; }
    }
}