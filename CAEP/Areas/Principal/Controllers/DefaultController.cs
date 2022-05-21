using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CAEP.Data.SCUP;
using CAEP.Miscelaneos;
using CAEP.Models;
using CAEP.Models.Principal.Default;
using CAEP.Data.CAEP;
using DevExtreme.AspNet.Mvc;
using DevExtreme.AspNet.Data;

namespace CAEP.Areas.Principal.Controllers
{
    public class DefaultController : Controller
    {
        private readonly SCUPContext _contextSCUP;
        private readonly CAEPContext _context;

        public DefaultController(SCUPContext contextSCUP, CAEPContext context)
        {
            _contextSCUP = contextSCUP;
            _context = context;
        }

        [AllowAnonymous]
        public IActionResult Index()
        {
            if (User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Inicio");
            }
            return View();
        }

        public object GetEmpresasUsuario(string Usuario, DataSourceLoadOptions loadOptions)
        {
            var empresas = _context.PrVEmpresas
                                .Where(r => r.IdUsuario == (Usuario ?? ""))
                                .GroupBy(g => new { g.IdEmpresa, g.NombreEmpresa })
                                .Select(s => new { IdEmpresa= s.Key.IdEmpresa, NombreEmpresa = s.Key.NombreEmpresa })                                
                                .ToList();

            return DataSourceLoader.Load(empresas, loadOptions);
        }
        public object GetCCUsuario(string Usuario, int IdEmpresa, DataSourceLoadOptions loadOptions)
        {
            var centros = _context.PrVCentrosDeCosto
                                .Where(r => r.IdUsuario == (Usuario ?? "") && r.IdEmpresa == IdEmpresa)
                                .ToList();

            return DataSourceLoader.Load(centros, loadOptions);
        }

        public object GetEmpresasUsuarioActual(DataSourceLoadOptions loadOptions)
        {
            var empresas = _context.PrVEmpresas
                                .Where(r => r.IdUsuario == User.Identity.Name)
                                .ToList();

            return DataSourceLoader.Load(empresas, loadOptions);
        }
        public object GetCCUsuarioActual(DataSourceLoadOptions loadOptions)
        {
            var centros = _context.PrVCentrosDeCosto
                                .Where(r => r.IdUsuario == User.Identity.Name)
                                .Select(r => new { r.IdCentroDeCosto, NombreCentroDeCosto=r.CentroDeCosto, r.CodCentroDeCosto })
                                .OrderBy(s => s.CodCentroDeCosto)
                                .ToList();

            return DataSourceLoader.Load(centros, loadOptions);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult IniciarSesion(LoginViewModel usuario)
        {
            if (ModelState.IsValid)
            {
                //Funciones.GenerarMenus(_contextSCUP);
                var idUsuario = Int32.Parse(Funciones.EjecutarSPScalar(contexto: _contextSCUP,
                                                                       sp: "SCUP_LOGIN",
                                                                       new SQLP("@USUARIO", SqlDbType.VarChar, 50, usuario.NombreUsuario),
                                                                       new SQLP("@CONTRASENA", SqlDbType.VarChar, 50, usuario.Contrasena),
                                                                       new SQLP("@CODIGO_SISTEMA", SqlDbType.VarChar, 50, Propiedades._gCodigoSistema)).ToString());
                if (idUsuario > 0)
                {
                    var perfil = Funciones.EjecutarSPScalar(contexto: _contextSCUP,
                                                            sp: "SCUP_PERFIL_USUARIO",
                                                            new SQLP("@ID_USUARIO", SqlDbType.Int, idUsuario),
                                                            new SQLP("@CODIGO_SISTEMA", SqlDbType.VarChar, 50, Propiedades._gCodigoSistema)).ToString().Trim();

                    var identity = new ClaimsIdentity(new[] {
                                                        new Claim(ClaimTypes.Name, usuario.NombreUsuario.ToUpper()),
                                                        new Claim(ClaimTypes.Role, perfil.ToUpper()),
                                                        new Claim(ClaimTypes.NameIdentifier, idUsuario.ToString())
                    }, CookieAuthenticationDefaults.AuthenticationScheme);

                    var principal = new ClaimsPrincipal(identity);
                    var login = HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);

                    HttpContext.Session.Set<int>("SESSION_ID_CC", usuario.IdCC);
                    HttpContext.Session.Set<string>("SESSION_CC", _context.PrCentrosDeCosto.Find(usuario.IdCC).NombreCentroDeCosto);
                    //HttpContext.Session.Set<List<Menu>>("SESSION_MENU", Funciones.EstablecerPadres(Funciones.ObtenerMenuAsignado(_contextSCUP, idUsuario)));
                    HttpContext.Session.Set<List<Menu>>("SESSION_MENU", Funciones.EstablecerPadres(Propiedades._gListaMenus.ToList()));
                    return RedirectToAction("Inicio");
                }
                else if (idUsuario == 0)
                {
                    ModelState.AddModelError("NombreUsuario", "Usuario invalido!");
                    ModelState.AddModelError("Contrasena", "Contraseña invalida!");
                    ViewBag.Error = "Usuario o Contraseña Incorrectos!";
                }
                else if (idUsuario == -1)
                {
                    ModelState.AddModelError("NombreUsuario", "Usuario invalido!");
                    ModelState.AddModelError("Contrasena", "Contraseña invalida!");
                    ViewBag.Error = "Usuario sin acceso al sistema!";
                }
            }

            return View("index", usuario);
        }

        [Authorize]
        public IActionResult Inicio()
        {
            return View();
        }

        public IActionResult CambiarCCUsuario(int IdCC)
        {
            HttpContext.Session.Set<int>("SESSION_ID_CC", IdCC);
            HttpContext.Session.Set<string>("SESSION_CC", _context.PrCentrosDeCosto.Find(HttpContext.Session.Get<int>("SESSION_ID_CC")).NombreCentroDeCosto);

            return new JsonResult(new { ok = true });

        }

        [Authorize]
        public IActionResult CerrarSesion()
        {
            HttpContext.Session.Remove("SESSION_MENU");
            var login = HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction("Index");
        }

        [HttpPost]
        public IActionResult GuardarTema(string tema)
        {
            CookieOptions option = new CookieOptions();
            option.Expires = DateTime.Now.AddYears(1);
            Response.Cookies.Append("dx-theme", tema, option);
            return new JsonResult(new { exito = true });
        }

        [HttpPost]
        public IActionResult GuardarDrawerEstado(string abierto)
        {
            CookieOptions option = new CookieOptions();
            option.Expires = DateTime.Now.AddYears(1);
            Response.Cookies.Append("dx-drawer-state", abierto, option);
            return new JsonResult(new { exito = true });
        }

        [HttpPost]
        public IActionResult GuardarMenuSeleccionado(string nombreLogico, bool seleccionar)
        {
            List<Menu> menus = HttpContext.Session.Get<List<Menu>>("SESSION_MENU");

            if (seleccionar)
            {
                foreach (var menu in menus)
                {
                    if (menu.nombreLogico != null && (nombreLogico ?? "") == menu.nombreLogico)
                    {
                        if (menu.items.Count() == 0)
                        {
                            LimpiarMenus(menus);
                            menu.seleccionado = true;
                        }
                        menu.expandido = (menu.items.Count() != 0);
                    }
                    else
                    {
                        foreach (var menu2 in menu.items)
                        {
                            if (menu2.nombreLogico != null && (nombreLogico ?? "") == menu2.nombreLogico)
                            {
                                if (menu2.items.Count() == 0)
                                {
                                    LimpiarMenus(menus);
                                    menu2.seleccionado = true;
                                }
                                menu2.expandido = (menu2.items.Count() != 0);
                                menu.expandido = true;
                            }
                            else
                            {
                                foreach (var menu3 in menu2.items)
                                {
                                    if (menu3.nombreLogico != null && (nombreLogico ?? "") == menu3.nombreLogico)
                                    {
                                        LimpiarMenus(menus);
                                        menu3.seleccionado = true;
                                        menu2.expandido = true;
                                        menu.expandido = true;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            else
            {
                foreach (var menu in menus)
                {
                    if (menu.nombreLogico != null && (nombreLogico ?? "") == menu.nombreLogico)
                    {
                        LimpiarMenu(menu);
                        foreach (var menu2 in menu.items)
                        {
                            menu2.seleccionado = false;
                            menu2.expandido = false;
                        }
                        menu.expandido = false;
                    }
                    else
                    {
                        foreach (var menu2 in menu.items)
                        {
                            if (menu2.nombreLogico != null && (nombreLogico ?? "") == menu2.nombreLogico)
                            {
                                LimpiarMenu(menu2);
                                menu2.expandido = false;
                            }
                        }
                    }
                }
            }
            HttpContext.Session.Set<List<Menu>>("SESSION_MENU", menus);
            return new JsonResult(new { exito = true });
        }

        private void LimpiarMenus(List<Menu> menus)
        {
            foreach (var menu in menus)
            {
                LimpiarMenu(menu);
            }
        }
        private void LimpiarMenu(Menu menu)
        {
            menu.seleccionado = false;
            foreach (var menu2 in menu.items)
            {
                LimpiarMenu(menu2);
            }
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View("~/GlobalViews/_Error.cshtml", new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        [Authorize]
        [HttpPost]
        public IActionResult CambiarPassword(string contrasenaAnterior, string contrasenaNueva)
        {
            var resultado = new SQLP("@RESULTADO", SqlDbType.VarChar, 10, "", ParameterDirection.Output);
            var idUsuario = new SQLP("@ID_USUARIO", SqlDbType.VarChar, 10, "", ParameterDirection.Output);

            Funciones.EjecutarSPComando(contexto: _contextSCUP,
                                        sp: "SCUP_VERIFICAR_PASSWORD",
                                        new SQLP("@CONTRASEÑA_ANTERIOR", SqlDbType.VarChar, 30, contrasenaAnterior),
                                        new SQLP("@USUARIO", SqlDbType.VarChar, 30, User.Identity.Name),
                                        idUsuario,
                                        resultado);

            if (resultado.getValor().ToString() != "0")
            {
                Funciones.EjecutarSPComando(contexto: _contextSCUP,
                                         sp: "SCUP_RESETEAR_PASSWORD",
                                         new SQLP("@CONTRASENA", SqlDbType.VarChar, 200, contrasenaNueva),
                                         new SQLP("@ID_USUARIO", SqlDbType.Int, Int64.Parse(idUsuario.getValor().ToString())));
            }


            return new JsonResult(new { ok = true, result = resultado.getValor().ToString() });
        }
    }
}