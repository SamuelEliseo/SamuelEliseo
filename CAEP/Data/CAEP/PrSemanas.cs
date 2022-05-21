﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CAEP.Data.CAEP
{
    [Table("PR_SEMANAS")]
    public partial class PrSemanas
    {
        public PrSemanas()
        {
            PrDatosFincasEpDetalle = new HashSet<PrDatosFincasEpDetalle>();
            PrDatosFincasTbDetalle = new HashSet<PrDatosFincasTbDetalle>();
        }

        [Key]
        [Column("ID_SEMANA")]
        public int IdSemana { get; set; }
        [Required]
        [Column("NOMBRE_SEMANA")]
        [StringLength(50)]
        public string NombreSemana { get; set; }
        [Column("ID_MES")]
        public int IdMes { get; set; }
        [Column("NUM_SEMANA")]
        public int? NumSemana { get; set; }
        [StringLength(30)]
        public string Usuario { get; set; }

        [ForeignKey(nameof(IdMes))]
        [InverseProperty(nameof(PrMeses.PrSemanas))]
        public virtual PrMeses IdMesNavigation { get; set; }
        [InverseProperty("IdSemanaNavigation")]
        public virtual ICollection<PrDatosFincasEpDetalle> PrDatosFincasEpDetalle { get; set; }
        [InverseProperty("IdSemanaNavigation")]
        public virtual ICollection<PrDatosFincasTbDetalle> PrDatosFincasTbDetalle { get; set; }
    }
}