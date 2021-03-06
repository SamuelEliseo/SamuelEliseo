// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CAEP.Data.CAEP
{
    [Table("PR_PUESTOS")]
    public partial class PrPuestos
    {
        public PrPuestos()
        {
            PrEmpleados = new HashSet<PrEmpleados>();
        }

        [Key]
        [Column("ID_PUESTO")]
        public int IdPuesto { get; set; }
        [Column("PUESTO")]
        [StringLength(100)]
        public string Puesto { get; set; }
        [StringLength(30)]
        public string Usuario { get; set; }

        [InverseProperty("IdPuestoNavigation")]
        public virtual ICollection<PrEmpleados> PrEmpleados { get; set; }
    }
}