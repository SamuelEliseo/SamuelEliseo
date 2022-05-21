﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CAEP.Data.CAEP
{
    [Table("PR_PRESUPUESTO_MAESTRO")]
    public partial class PrPresupuestoMaestro
    {
        public PrPresupuestoMaestro()
        {
            PrAsignarEstacionBombas = new HashSet<PrAsignarEstacionBombas>();
            PrAsignarMaterialesADf = new HashSet<PrAsignarMaterialesADf>();
            PrDatosFincasEpDetalle = new HashSet<PrDatosFincasEpDetalle>();
            PrDatosFincasTbDetalle = new HashSet<PrDatosFincasTbDetalle>();
            PrEmpleados = new HashSet<PrEmpleados>();
            PrHorasExtras = new HashSet<PrHorasExtras>();
            PrMocAsignacionTpPres = new HashSet<PrMocAsignacionTpPres>();
            PrMocMaestro = new HashSet<PrMocMaestro>();
            PrParameBonificaciones = new HashSet<PrParameBonificaciones>();
            PrParametrizacionMoc = new HashSet<PrParametrizacionMoc>();
            PrParametrizacionValorDr = new HashSet<PrParametrizacionValorDr>();
            PrPresupuestoSemanalDetalle = new HashSet<PrPresupuestoSemanalDetalle>();
            PrRelaciones = new HashSet<PrRelaciones>();
            PrSsPrestaciones = new HashSet<PrSsPrestaciones>();
            PrValorBonificaciones = new HashSet<PrValorBonificaciones>();
        }

        [Key]
        [Column("ID_PRESUPUESTO")]
        public int IdPresupuesto { get; set; }
        [Column("ID_CENTRO_DE_COSTO")]
        public int? IdCentroDeCosto { get; set; }
        [Column("NUM_VERSION")]
        [StringLength(10)]
        public string NumVersion { get; set; }
        [Column("AÑO")]
        public int? Año { get; set; }
        [Column("CERRADA")]
        public bool? Cerrada { get; set; }
        [Column("HORA")]
        public TimeSpan? Hora { get; set; }
        [Column("APROBADO")]
        public bool? Aprobado { get; set; }
        [Column("EDITABLE")]
        public bool? Editable { get; set; }
        [Column("FECHA_INICIO", TypeName = "date")]
        public DateTime? FechaInicio { get; set; }
        [Column("FECHA_FINAL", TypeName = "date")]
        public DateTime? FechaFinal { get; set; }
        [Column("OBSERVACION")]
        [StringLength(1000)]
        public string Observacion { get; set; }
        [Column("TIEMPO_EJECUCION")]
        [StringLength(20)]
        public string TiempoEjecucion { get; set; }
        [Column("ULTIMA_ACTUALIZACION", TypeName = "datetime")]
        public DateTime? UltimaActualizacion { get; set; }
        [StringLength(30)]
        public string Usuario { get; set; }

        [ForeignKey(nameof(IdCentroDeCosto))]
        [InverseProperty(nameof(PrCentrosDeCosto.PrPresupuestoMaestro))]
        public virtual PrCentrosDeCosto IdCentroDeCostoNavigation { get; set; }
        [InverseProperty("IdPresupuestoNavigation")]
        public virtual ICollection<PrAsignarEstacionBombas> PrAsignarEstacionBombas { get; set; }
        [InverseProperty("IdPresupuestoNavigation")]
        public virtual ICollection<PrAsignarMaterialesADf> PrAsignarMaterialesADf { get; set; }
        [InverseProperty("IdPresupuestoNavigation")]
        public virtual ICollection<PrDatosFincasEpDetalle> PrDatosFincasEpDetalle { get; set; }
        [InverseProperty("IdPresupuestoNavigation")]
        public virtual ICollection<PrDatosFincasTbDetalle> PrDatosFincasTbDetalle { get; set; }
        [InverseProperty("IdPresupuestoNavigation")]
        public virtual ICollection<PrEmpleados> PrEmpleados { get; set; }
        [InverseProperty("IdPresupuestoNavigation")]
        public virtual ICollection<PrHorasExtras> PrHorasExtras { get; set; }
        [InverseProperty("IdPresupuestoNavigation")]
        public virtual ICollection<PrMocAsignacionTpPres> PrMocAsignacionTpPres { get; set; }
        [InverseProperty("IdPresupuestoNavigation")]
        public virtual ICollection<PrMocMaestro> PrMocMaestro { get; set; }
        [InverseProperty("IdPresupuestoNavigation")]
        public virtual ICollection<PrParameBonificaciones> PrParameBonificaciones { get; set; }
        [InverseProperty("IdPresupuestoNavigation")]
        public virtual ICollection<PrParametrizacionMoc> PrParametrizacionMoc { get; set; }
        [InverseProperty("IdPresupuestoNavigation")]
        public virtual ICollection<PrParametrizacionValorDr> PrParametrizacionValorDr { get; set; }
        [InverseProperty("IdPresupuestoNavigation")]
        public virtual ICollection<PrPresupuestoSemanalDetalle> PrPresupuestoSemanalDetalle { get; set; }
        [InverseProperty("IdPresupuestoNavigation")]
        public virtual ICollection<PrRelaciones> PrRelaciones { get; set; }
        [InverseProperty("IdPresupuestoNavigation")]
        public virtual ICollection<PrSsPrestaciones> PrSsPrestaciones { get; set; }
        [InverseProperty("IdPresupuestoNavigation")]
        public virtual ICollection<PrValorBonificaciones> PrValorBonificaciones { get; set; }
    }
}