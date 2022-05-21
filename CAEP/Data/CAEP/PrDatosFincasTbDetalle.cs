﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CAEP.Data.CAEP
{
    [Table("PR_DATOS_FINCAS_TB_DETALLE")]
    public partial class PrDatosFincasTbDetalle
    {
        [Key]
        [Column("ID_DETALLE_DATO_TB")]
        public int IdDetalleDatoTb { get; set; }
        [Column("ID_PRESUPUESTO")]
        public int IdPresupuesto { get; set; }
        [Column("ID_ESTACION")]
        public int IdEstacion { get; set; }
        [Column("ID_SEMANA")]
        public int IdSemana { get; set; }
        [Column("NUMERO_DE_MOTORES")]
        public int NumeroDeMotores { get; set; }
        [Column("HORAS_MAREA_MOTOR", TypeName = "numeric(10, 2)")]
        public decimal HorasMareaMotor { get; set; }
        [Column("CANTIDAD_MAREAS")]
        public int? CantidadMareas { get; set; }
        [Column("CONSUMO_DIESEL_HORA_MOTOR", TypeName = "numeric(10, 2)")]
        public decimal ConsumoDieselHoraMotor { get; set; }
        [StringLength(30)]
        public string Usuario { get; set; }

        [ForeignKey(nameof(IdEstacion))]
        [InverseProperty(nameof(PrNumeroEstacionBombas.PrDatosFincasTbDetalle))]
        public virtual PrNumeroEstacionBombas IdEstacionNavigation { get; set; }
        [ForeignKey(nameof(IdPresupuesto))]
        [InverseProperty(nameof(PrPresupuestoMaestro.PrDatosFincasTbDetalle))]
        public virtual PrPresupuestoMaestro IdPresupuestoNavigation { get; set; }
        [ForeignKey(nameof(IdSemana))]
        [InverseProperty(nameof(PrSemanas.PrDatosFincasTbDetalle))]
        public virtual PrSemanas IdSemanaNavigation { get; set; }
    }
}