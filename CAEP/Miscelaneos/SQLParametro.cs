using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace CAEP.Miscelaneos
{
    public class SQLP
    {
        private SqlParameter parametro;
        public SQLP(string nombre, SqlDbType tipoDato, object valor, ParameterDirection? direction)
        {
            if (!nombre.ToString().Trim().Contains("@")) nombre = $"@{nombre}";

            parametro = new SqlParameter(nombre, tipoDato);

            if (valor != null)
            {
                parametro.Value = valor;
            }

            if (direction.HasValue)
            {
                parametro.Direction = direction.Value;
            }
        }

        public SQLP(string nombre, SqlDbType tipoDato, int largo, object valor, ParameterDirection? direction)
        {
            if (!nombre.ToString().Trim().Contains("@")) nombre = $"@{nombre}";

            parametro = new SqlParameter(nombre, tipoDato, largo);

            if (valor != null)
            {
                parametro.Value = valor;
            }

            if (direction.HasValue)
            {
                parametro.Direction = direction.Value;
            }
        }

        public SQLP(string nombre, SqlDbType tipoDato, object valor)
        {
            if (!nombre.ToString().Trim().Contains("@")) nombre = $"@{nombre}";

            parametro = new SqlParameter(nombre, tipoDato);

            if (valor != null)
            {
                parametro.Value = valor;
            }
        }

        public SQLP(string nombre, SqlDbType tipoDato, int largo, object valor)
        {
            if (!nombre.ToString().Trim().Contains("@")) nombre = $"@{nombre}";

            parametro = new SqlParameter(nombre, tipoDato, largo);

            if (valor != null)
            {
                parametro.Value = valor;
            }
        }

        public SqlParameter getParametro()
        {
            return parametro;
        }

        public object getValor()
        {
            return parametro.Value;
        }

    }
}
