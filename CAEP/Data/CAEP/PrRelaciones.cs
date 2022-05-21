﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CAEP.Data.CAEP
{
    [Table("PR_RELACIONES")]
    public partial class PrRelaciones
    {
        [Key]
        [Column("ID_RELACION")]
        public int IdRelacion { get; set; }
        [Column("HIELO_POR_LBS_CAMARON_ENTERO", TypeName = "numeric(10, 2)")]
        public decimal HieloPorLbsCamaronEntero { get; set; }
        [Column("METABISULFITO_LBS_BIN_COSECHA_ENTERO", TypeName = "numeric(10, 2)")]
        public decimal MetabisulfitoLbsBinCosechaEntero { get; set; }
        [Column("SAL_LBS_BIN_DE_CAMARON_ENTERO", TypeName = "numeric(10, 2)")]
        public decimal SalLbsBinDeCamaronEntero { get; set; }
        [Column("ACIDO_LÁCTICO_ML_POR_LBS_DE_CAMARON_ENTERO", TypeName = "numeric(10, 2)")]
        public decimal AcidoLácticoMlPorLbsDeCamaronEntero { get; set; }
        [Column("FACTOR_DE_CONVERSIÓN_ALIMENTICIO", TypeName = "numeric(10, 2)")]
        public decimal? FactorDeConversiónAlimenticio { get; set; }
        [Column("FERTILAKE_HA_QQ_LLENADO", TypeName = "numeric(10, 2)")]
        public decimal FertilakeHaQqLlenado { get; set; }
        [Column("FOSFOLAKE_HA_QQ_LLENADO", TypeName = "numeric(10, 2)")]
        public decimal FosfolakeHaQqLlenado { get; set; }
        [Column("FERTILAKE_HA_QQ_MANTENIMIENTO", TypeName = "numeric(10, 2)")]
        public decimal FertilakeHaQqMantenimiento { get; set; }
        [Column("METASILICATO_HA_QQ_LLENADO", TypeName = "numeric(10, 2)")]
        public decimal MetasilicatoHaQqLlenado { get; set; }
        [Column("CAL_HA_QQ_FONDOS", TypeName = "numeric(10, 2)")]
        public decimal CalHaQqFondos { get; set; }
        [Column("CAL_HA_QQ_MAL_SABOR", TypeName = "numeric(10, 2)")]
        public decimal CalHaQqMalSabor { get; set; }
        [Column("YODO_ML_POR_CAMIÓN", TypeName = "numeric(10, 2)")]
        public decimal YodoMlPorCamión { get; set; }
        [Column("MELAZA_EN_POLVO_HA_LBS", TypeName = "numeric(10, 2)")]
        public decimal MelazaEnPolvoHaLbs { get; set; }
        [Column("GRAIN_PELLET_HA_LBS_LLENADO", TypeName = "numeric(10, 2)")]
        public decimal GrainPelletHaLbsLlenado { get; set; }
        [Column("GRAIN_PELLET_HA_LBS_MANTENIMIENTO", TypeName = "numeric(10, 2)")]
        public decimal GrainPelletHaLbsMantenimiento { get; set; }
        [Column("MILLONES_PLS_TRANSPORTADOS_POR_CAMIÓN", TypeName = "numeric(10, 2)")]
        public decimal MillonesPlsTransportadosPorCamión { get; set; }
        [Column("JUVENILES_TRANSPORTADOS_POR_CAMIÓN", TypeName = "numeric(10, 2)")]
        public decimal JuvenilesTransportadosPorCamión { get; set; }
        [Column("CLORO_PARA_PREPARACIÓN_DE_LAGUNAS_LBS_HA", TypeName = "numeric(10, 2)")]
        public decimal CloroParaPreparaciónDeLagunasLbsHa { get; set; }
        [Column("CLORO_A_UTILIZAR_EN_COSECHA_LBS_POR_CAMIÓN", TypeName = "numeric(10, 2)")]
        public decimal CloroAUtilizarEnCosechaLbsPorCamión { get; set; }
        [Column("SERVICIO_COSECHA_DE_CAMARÓN", TypeName = "numeric(10, 2)")]
        public decimal ServicioCosechaDeCamarón { get; set; }
        [Column("PORCENT_SOBREVIV_CENTRO_ACLIM", TypeName = "numeric(10, 2)")]
        public decimal PorcentSobrevivCentroAclim { get; set; }
        [Column("PORCENT_SOBREVIV_VIVEROS_NORMALES", TypeName = "numeric(10, 2)")]
        public decimal PorcentSobrevivViverosNormales { get; set; }
        [Column("PORCENT_SOBREVIV_NAVE_MIMS", TypeName = "numeric(10, 2)")]
        public decimal? PorcentSobrevivNaveMims { get; set; }
        [Column("PORCENT_SOBREVIV_R", TypeName = "numeric(10, 2)")]
        public decimal? PorcentSobrevivR { get; set; }
        [Column("ID_PRESUPUESTO")]
        public int IdPresupuesto { get; set; }
        [Column("ID_TIPO_FINCA")]
        public int? IdTipoFinca { get; set; }
        [Column("FERTILAKE_LLENADO_SEM_INC")]
        public int? FertilakeLlenadoSemInc { get; set; }
        [Column("FOSFOLAKE_LLENADO_SEM_INC")]
        public int? FosfolakeLlenadoSemInc { get; set; }
        [Column("METASILICATO_SEM_INC")]
        public int? MetasilicatoSemInc { get; set; }
        [Column("CLORO_PREPARACION_LAG_SEM_INC")]
        public int? CloroPreparacionLagSemInc { get; set; }
        [Column("GRAIN_PELLET_LLENADO_SEM_INC")]
        public int? GrainPelletLlenadoSemInc { get; set; }
        [Column("FERTILAKE_MANTENIMIENTO_SEM_DEC")]
        public int? FertilakeMantenimientoSemDec { get; set; }
        [StringLength(30)]
        public string Usuario { get; set; }

        [ForeignKey(nameof(IdPresupuesto))]
        [InverseProperty(nameof(PrPresupuestoMaestro.PrRelaciones))]
        public virtual PrPresupuestoMaestro IdPresupuestoNavigation { get; set; }
        [ForeignKey(nameof(IdTipoFinca))]
        [InverseProperty(nameof(PrTipoFinca.PrRelaciones))]
        public virtual PrTipoFinca IdTipoFincaNavigation { get; set; }
    }
}