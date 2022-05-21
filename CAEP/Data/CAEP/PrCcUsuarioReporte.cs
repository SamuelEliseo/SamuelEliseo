﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CAEP.Data.CAEP
{
    [Table("PR_CC_USUARIO_REPORTE")]
    public partial class PrCcUsuarioReporte
    {
        [Key]
        [Column("ID_CC_USUARIO")]
        public int IdCcUsuario { get; set; }
        [Column("ID_CENTRO_COSTO")]
        public int? IdCentroCosto { get; set; }
        [Column("ID_USUARIO")]
        [StringLength(50)]
        public string IdUsuario { get; set; }
        [Column("VER")]
        public bool? Ver { get; set; }
        [Column("ID_EMPRESA")]
        public int? IdEmpresa { get; set; }
        [Column("Agrupado_CC")]
        public bool? AgrupadoCc { get; set; }
        [Column("Agrupado_Probable")]
        public bool? AgrupadoProbable { get; set; }
        [Column("ID_MATERIAL")]
        public int? IdMaterial { get; set; }
        [Column("AGRUPADO_MATERIAL")]
        public bool? AgrupadoMaterial { get; set; }
        [Column("AGRUPADO_CC_X_MATE")]
        public bool? AgrupadoCcXMate { get; set; }
        [Column("APLICA_SAP")]
        public bool? AplicaSap { get; set; }
        [Column("AGRUPADO_CC_X_CUENTA")]
        public bool? AgrupadoCcXCuenta { get; set; }
        [StringLength(30)]
        public string Usuario { get; set; }
        public bool? AplicaDashBoard { get; set; }
        public bool? AplicaMaterial { get; set; }

        [ForeignKey(nameof(IdCentroCosto))]
        [InverseProperty(nameof(PrCentrosDeCosto.PrCcUsuarioReporte))]
        public virtual PrCentrosDeCosto IdCentroCostoNavigation { get; set; }
    }
}