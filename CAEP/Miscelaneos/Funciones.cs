using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace CAEP.Miscelaneos
{
    public class Funciones
    {
        public static List<T> EjecutarSPList<T>(DbContext contexto, string sp, params SQLP[] parametros) where T : new()
        {
            try
            {
                using (var cmd = contexto.Database.GetDbConnection().CreateCommand())
                {
                    cmd.CommandText = sp;
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 0;

                    foreach (var parametro in parametros)
                    {
                        cmd.Parameters.Add(parametro.getParametro());
                    }

                    if (cmd.Connection.State != ConnectionState.Open)
                        cmd.Connection.Open();

                    using (var dataReader =  cmd.ExecuteReader())
                    {
                        var lista = DataReaderMapToList<T>(dataReader);
                        return lista;
                    }
                }
            }
            catch (Exception e)
            {
                
                throw new Exception(e.Message);
            }
        }

        public static object EjecutarSPScalar(DbContext contexto, string sp, params SQLP[] parametros) 
        {           
            try
            {
                using (var cmd = contexto.Database.GetDbConnection().CreateCommand())
                {
                    cmd.CommandText = sp;
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 0;

                    foreach (var parametro in parametros)
                    {
                        cmd.Parameters.Add(parametro.getParametro());
                    }

                    if (cmd.Connection.State != ConnectionState.Open)
                         cmd.Connection.Open();
                    object valor =  cmd.ExecuteScalar();
                    return valor;
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public static void EjecutarSPComando(DbContext contexto, string sp, params SQLP[] parametros)
        {
            try
            {
                using (var cmd = contexto.Database.GetDbConnection().CreateCommand())
                {
                    cmd.CommandText = sp;
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 0;

                    foreach (var parametro in parametros)
                    {
                        cmd.Parameters.Add(parametro.getParametro());
                    }

                    if (cmd.Connection.State != ConnectionState.Open)
                        cmd.Connection.Open();

                     cmd.ExecuteNonQuery();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        private static List<T> DataReaderMapToList<T>(DbDataReader dr)
        {
            List<T> list = new List<T>();
            while (dr.Read())
            {
                var obj = Activator.CreateInstance<T>();
                if (typeof(IDictionary<string, object>).IsAssignableFrom((Activator.CreateInstance<T>()).GetType()))
                {
                    for (int lp = 0; lp < dr.FieldCount; lp++)
                    {
                        ((IDictionary<string, object>)obj).Add(dr.GetName(lp), (dr.GetValue(lp) == DBNull.Value ? null : dr.GetValue(lp)));
                    }
                }
                else
                {
                    foreach (PropertyInfo prop in obj.GetType().GetProperties())
                    {
                        if (dr.HasColumn(prop.Name))
                        {
                            if (!Equals(dr[prop.Name], DBNull.Value))
                            {
                                prop.SetValue(obj, dr[prop.Name], null);
                            }
                        }
                    }
                }
                list.Add(obj);
            }
            return list;
        }

        public static List<Menu> ObtenerMenuAsignado(DbContext _contextSCUP, int idUsuario)
        {
            List<MenuDB> menusDB = Funciones.EjecutarSPList<MenuDB>(contexto: _contextSCUP,
                                                                             sp: "SCUP_OBTENER_MENUS_WEB",
                                                                             new SQLP("@ID_USUARIO", SqlDbType.Int, idUsuario),
                                                                             new SQLP("@CODIGO_SISTEMA", SqlDbType.VarChar, 15, Propiedades._gCodigoSistema));

            List<Menu> padres = new List<Menu>();

            foreach (var staticMenu in Propiedades._gListaMenus)
            {
                if(staticMenu.items.Count() == 0)
                {                       
                    padres.Add(staticMenu);
                }
                else
                {
                    foreach (var menu in menusDB)
                    {
                        if (staticMenu.nombreLogico.Trim().ToUpper() == menu.NombreLogicoPrimNivel.Trim().ToUpper())
                        {
                            Menu padre = new Menu().setMenu(menu.NombrePrimNivel)
                                                   .setImagen(staticMenu.imagen)
                                                   .setNombreLogico(menu.NombreLogicoPrimNivel.Trim().ToUpper());
                            padres.Add(padre);
                            break;
                        }    
                    }
                }
            }

            foreach (var padre in padres)
            {
                foreach (var staticMenu in Propiedades._gListaMenus)
                {
                    if(staticMenu.nombreLogico != null && staticMenu.nombreLogico.Trim().ToUpper() == (padre.nombreLogico ?? ""))
                    {
                        foreach(var staticMenuHijo1 in staticMenu.items)
                        {
                            Menu hijo = null;
                            foreach (var menu in menusDB)
                            {
                                if (menu.NombreLogicoPrimNivel.Trim().ToUpper() == padre.nombreLogico && menu.NombreLogicoSegNivel.Trim().ToUpper() == staticMenuHijo1.nombreLogico.Trim().ToUpper())
                                {
                                    hijo = new Menu().setMenu(menu.NombreSegNivel)
                                                      .setNombreLogico(menu.NombreLogicoSegNivel.Trim().ToUpper())
                                                      .setUrl(staticMenuHijo1.url);
                                    padre.items.Add(hijo);
                                    break;
                                }
                            }
                            if(hijo != null)
                            {
                                foreach (var staticMenuHijo2 in staticMenuHijo1.items)
                                {
                                    foreach (var menu in menusDB)
                                    {
                                        if (menu.EsTercerNivel && menu.NombreLogicoPrimNivel.Trim().ToUpper() == padre.nombreLogico && menu.NombreLogicoSegNivel.Trim().ToUpper() == staticMenuHijo1.nombreLogico.Trim().ToUpper() && menu.NombreLogicoTercerNivel.Trim().ToUpper() == staticMenuHijo2.nombreLogico.Trim().ToUpper())
                                        {
                                            Menu hijo2 = new Menu().setMenu(menu.NombreTercerNivel)
                                                                   .setNombreLogico(menu.NombreLogicoTercerNivel.Trim().ToUpper())
                                                                   .setUrl(staticMenuHijo2.url);
                                            hijo.items.Add(hijo2);
                                            break;
                                        }
                                    }
                                }
                            }
                        }                       
                        break;
                    }
                }
            }
            return padres;
        }

        public static List<Menu> EstablecerPadres(List<Menu> menus)
        {
            foreach (var menu in menus)
            {
                foreach (var menu2 in menu.items)
                {
                    menu2.nombreLogicoPadre = menu.nombreLogico;
                    foreach (var menu3 in menu2.items)
                    {
                        menu3.nombreLogicoPadre = menu2.nombreLogico;
                    }
                }
            }
            return menus;
        }

        public static void GenerarMenus(DbContext _contextSCUP)
        {
            foreach (var menu in Propiedades._gListaMenus)
            {
                if (menu.items.Count() > 0 && menu.nombreLogico != "")
                {
                    var IdMenu = Int64.Parse(Funciones.EjecutarSPScalar(contexto: _contextSCUP,
                                                                        sp: "SCUP_GENERAR_MENUS",
                                                                        new SQLP("@NOMBRE_MENU", SqlDbType.VarChar, 200, menu.menu.Trim()),
                                                                        new SQLP("@NOMBRE_LOGICO_MENU", SqlDbType.VarChar, 200, menu.nombreLogico.Trim()),
                                                                        new SQLP("@NIVEL", SqlDbType.Int, 1),
                                                                        new SQLP("@PREDECESOR", SqlDbType.Int, 0),
                                                                        new SQLP("@SISTEMA", SqlDbType.VarChar, 50, Propiedades._gCodigoSistema)).ToString());

                    foreach (var menu2 in menu.items)
                    {
                        if (menu2.nombreLogico != "")
                        {
                            var IdMenu2 = Int64.Parse(Funciones.EjecutarSPScalar(contexto: _contextSCUP,
                                                                                 sp: "SCUP_GENERAR_MENUS",
                                                                                 new SQLP("@NOMBRE_MENU", SqlDbType.VarChar, 200, menu2.menu.Trim()),
                                                                                 new SQLP("@NOMBRE_LOGICO_MENU", SqlDbType.VarChar, 200, menu2.nombreLogico.Trim()),
                                                                                 new SQLP("@NIVEL", SqlDbType.Int, 2),
                                                                                 new SQLP("@PREDECESOR", SqlDbType.Int, IdMenu),
                                                                                 new SQLP("@SISTEMA", SqlDbType.VarChar, 50, Propiedades._gCodigoSistema)).ToString());

                            foreach (var menu3 in menu2.items)
                            {
                                if (menu3.nombreLogico != "")
                                {
                                    Funciones.EjecutarSPComando(contexto: _contextSCUP,
                                                                          sp: "SCUP_GENERAR_MENUS",
                                                                          new SQLP("@NOMBRE_MENU", SqlDbType.VarChar, 200, menu3.menu.Trim()),
                                                                          new SQLP("@NOMBRE_LOGICO_MENU", SqlDbType.VarChar, 200, menu3.nombreLogico.Trim()),
                                                                          new SQLP("@NIVEL", SqlDbType.Int, 3),
                                                                          new SQLP("@PREDECESOR", SqlDbType.Int, IdMenu2),
                                                                          new SQLP("@SISTEMA", SqlDbType.VarChar, 50, Propiedades._gCodigoSistema));
                                }
                            }
                        }
                    }
                }
            }
        }
    }
         
}
