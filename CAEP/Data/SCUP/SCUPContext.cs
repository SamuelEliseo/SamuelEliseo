﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace CAEP.Data.SCUP
{
    public partial class SCUPContext : DbContext
    {
        public SCUPContext()
        {
        }

        public SCUPContext(DbContextOptions<SCUPContext> options)
            : base(options)
        {
        }

        public virtual DbSet<ScupUsuarios> ScupUsuarios { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<ScupUsuarios>(entity =>
            {
                entity.HasIndex(e => e.Username)
                    .HasName("U_SCUP_USUARIOS_USERNAME")
                    .IsUnique();

                entity.Property(e => e.AdjuntaArchivo).HasDefaultValueSql("((0))");

                entity.Property(e => e.AdminLarva).HasDefaultValueSql("((0))");

                entity.Property(e => e.Apellidos).IsUnicode(false);

                entity.Property(e => e.EliminaTl).HasDefaultValueSql("((0))");

                entity.Property(e => e.Email).IsUnicode(false);

                entity.Property(e => e.ModificaTl).HasDefaultValueSql("((0))");

                entity.Property(e => e.RegeneraPs).HasDefaultValueSql("((0))");

                entity.Property(e => e.Username).IsUnicode(false);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}