﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CAEP.Data.CAEP
{
    [Table("PR_TIPO_TASA")]
    public partial class PrTipoTasa
    {
        public PrTipoTasa()
        {
            PrTasaDeCambio = new HashSet<PrTasaDeCambio>();
        }

        [Key]
        [Column("ID_TIPO_TASA")]
        public int IdTipoTasa { get; set; }
        [Column("TIPO_TASA")]
        [StringLength(50)]
        public string TipoTasa { get; set; }
        [StringLength(30)]
        public string Usuario { get; set; }

        [InverseProperty("IdTipoTasaNavigation")]
        public virtual ICollection<PrTasaDeCambio> PrTasaDeCambio { get; set; }
    }
}