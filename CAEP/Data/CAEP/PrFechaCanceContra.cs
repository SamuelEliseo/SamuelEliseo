﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CAEP.Data.CAEP
{
    [Table("PR_FECHA_CANCE_CONTRA")]
    public partial class PrFechaCanceContra
    {
        [Key]
        [Column("ID_FECHA_CAN_CON")]
        public int IdFechaCanCon { get; set; }
        [Column("MES_CANCEL")]
        public int? MesCancel { get; set; }
        [Column("MES_CONTRA")]
        public int? MesContra { get; set; }
        [Column("RNP_EMPLEADO")]
        [StringLength(15)]
        public string RnpEmpleado { get; set; }
        [Column("ID_EMPLEADO")]
        public int? IdEmpleado { get; set; }
        [StringLength(30)]
        public string Usuario { get; set; }

        [ForeignKey(nameof(IdEmpleado))]
        [InverseProperty(nameof(PrEmpleados.PrFechaCanceContra))]
        public virtual PrEmpleados IdEmpleadoNavigation { get; set; }
    }
}