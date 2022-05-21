﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CAEP.Data.CAEP
{
    [Table("PR_SS_PRESTACIONES")]
    public partial class PrSsPrestaciones
    {
        public PrSsPrestaciones()
        {
            PrSsPrestacionesDetalle = new HashSet<PrSsPrestacionesDetalle>();
        }

        [Key]
        [Column("ID_PRESTACION")]
        public int IdPrestacion { get; set; }
        [Column("FECHA_14AVO", TypeName = "date")]
        public DateTime? Fecha14avo { get; set; }
        [Column("FECHA_AGUINALDO", TypeName = "date")]
        public DateTime? FechaAguinaldo { get; set; }
        [Column("ID_PRESUPUESTO")]
        public int? IdPresupuesto { get; set; }
        [Column("FECHA_AGUINALDOII", TypeName = "date")]
        public DateTime? FechaAguinaldoii { get; set; }
        [StringLength(30)]
        public string Usuario { get; set; }
        [Column("FECHA_14AVO_II", TypeName = "date")]
        public DateTime? Fecha14avoIi { get; set; }

        [ForeignKey(nameof(IdPresupuesto))]
        [InverseProperty(nameof(PrPresupuestoMaestro.PrSsPrestaciones))]
        public virtual PrPresupuestoMaestro IdPresupuestoNavigation { get; set; }
        [InverseProperty("IdPrestacionNavigation")]
        public virtual ICollection<PrSsPrestacionesDetalle> PrSsPrestacionesDetalle { get; set; }
    }
}