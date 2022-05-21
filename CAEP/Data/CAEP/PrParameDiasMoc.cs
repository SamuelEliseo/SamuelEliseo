﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CAEP.Data.CAEP
{
    [Table("PR_PARAME_DIAS_MOC")]
    public partial class PrParameDiasMoc
    {
        [Key]
        [Column("ID_PARAME_DIAS_MOC")]
        public int IdParameDiasMoc { get; set; }
        [Column("ID_CENTRO_DE_COSTO")]
        public int? IdCentroDeCosto { get; set; }
        [Column("DIAS_VACACIONES")]
        public int? DiasVacaciones { get; set; }
        [Column("DIAS_CESANTIA")]
        public int? DiasCesantia { get; set; }
        [Column("AÑO")]
        public int? Año { get; set; }
        [StringLength(30)]
        public string Usuario { get; set; }
        [StringLength(200)]
        public string NombreEquipo { get; set; }
    }
}