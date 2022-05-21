﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CAEP.Data.CAEP
{
    [Table("PR_TIPO_PROCESO_CATEGORIA")]
    public partial class PrTipoProcesoCategoria
    {
        public PrTipoProcesoCategoria()
        {
            PrTipoProceso = new HashSet<PrTipoProceso>();
        }

        [Key]
        [Column("ID_TP_CATEGORIA")]
        public int IdTpCategoria { get; set; }
        [Required]
        [Column("CATEGORIA")]
        [StringLength(80)]
        public string Categoria { get; set; }
        [StringLength(30)]
        public string Usuario { get; set; }

        [InverseProperty("IdTpCategoriaNavigation")]
        public virtual ICollection<PrTipoProceso> PrTipoProceso { get; set; }
    }
}