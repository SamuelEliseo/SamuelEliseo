﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CAEP.Data.CAEP
{
    public partial class TipoUbicaciones
    {
        [Key]
        public int IdTipoUbicacion { get; set; }
        [StringLength(100)]
        public string TipoUbicacion { get; set; }
        public bool? Activo { get; set; }
    }
}