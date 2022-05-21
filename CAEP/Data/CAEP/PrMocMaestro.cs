﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CAEP.Data.CAEP
{
    [Table("PR_MOC_MAESTRO")]
    public partial class PrMocMaestro
    {
        [Key]
        [Column("ID_MOC_MAESTRO")]
        public int IdMocMaestro { get; set; }
        [Column("LIBRAS", TypeName = "numeric(10, 2)")]
        public decimal Libras { get; set; }
        [Column("PEDIDOS_ESPECIALES", TypeName = "numeric(10, 2)")]
        public decimal PedidosEspeciales { get; set; }
        [Column("LIBRAS_HORA_MUJER_HOMBRE", TypeName = "numeric(10, 2)")]
        public decimal LibrasHoraMujerHombre { get; set; }
        [Column("DIAS_TRABAJO")]
        public int DiasTrabajo { get; set; }
        [Column("HORAS_POR_DIA")]
        public int HorasPorDia { get; set; }
        [Column("EMPLEADOS")]
        public int? Empleados { get; set; }
        [Column("VALOR_PAQUETE", TypeName = "numeric(10, 2)")]
        public decimal? ValorPaquete { get; set; }
        [Column("BINES")]
        public int? Bines { get; set; }
        [Column("BINES_POR_DIA")]
        public int? BinesPorDia { get; set; }
        [Column("ID_TIPO_PROCESO")]
        public int? IdTipoProceso { get; set; }
        [Column("ID_PRESUPUESTO")]
        public int IdPresupuesto { get; set; }
        [Column("ID_MES")]
        public int IdMes { get; set; }
        [Column("NO_USAR")]
        public bool? NoUsar { get; set; }
        [StringLength(30)]
        public string Usuario { get; set; }

        [ForeignKey(nameof(IdMes))]
        [InverseProperty(nameof(PrMeses.PrMocMaestro))]
        public virtual PrMeses IdMesNavigation { get; set; }
        [ForeignKey(nameof(IdPresupuesto))]
        [InverseProperty(nameof(PrPresupuestoMaestro.PrMocMaestro))]
        public virtual PrPresupuestoMaestro IdPresupuestoNavigation { get; set; }
        [ForeignKey(nameof(IdTipoProceso))]
        [InverseProperty(nameof(PrTipoProceso.PrMocMaestro))]
        public virtual PrTipoProceso IdTipoProcesoNavigation { get; set; }
    }
}