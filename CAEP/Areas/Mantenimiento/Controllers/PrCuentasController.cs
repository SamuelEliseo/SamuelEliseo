using DevExtreme.AspNet.Data;
using DevExtreme.AspNet.Mvc;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using CAEP.Data.CAEP;

namespace CAEP.Controllers
{
    public class PrCuentasController : Controller
    {
        private CAEPContext _context;

        public PrCuentasController(CAEPContext context) {
            _context = context;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> Get(DataSourceLoadOptions loadOptions) {
            var prcuentas = _context.PrCuentas.Select(i => new {
                i.IdCuenta,
                i.CodCuenta,
                i.NombreCuenta,
                i.IdCategoria,
                i.ExcluirCd,
                i.AfectaSemanal,
                i.Activo,
                i.Usuario,
                i.IdCuentaDepende,
                i.NombreEquipo
            });

            // If you work with a large amount of data, consider specifying the PaginateViaPrimaryKey and PrimaryKey properties.
            // In this case, keys and data are loaded in separate queries. This can make the SQL execution plan more efficient.
            // Refer to the topic https://github.com/DevExpress/DevExtreme.AspNet.Data/issues/336.
            // loadOptions.PrimaryKey = new[] { "IdCuenta" };
            // loadOptions.PaginateViaPrimaryKey = true;

            return Json(await DataSourceLoader.LoadAsync(prcuentas, loadOptions));
        }

        [HttpPost]
        public async Task<IActionResult> Post(string values) {
            var model = new PrCuentas();
            var valuesDict = JsonConvert.DeserializeObject<IDictionary>(values);
            PopulateModel(model, valuesDict);

            if(!TryValidateModel(model))
                return BadRequest(GetFullErrorMessage(ModelState));

            var result = _context.PrCuentas.Add(model);
            await _context.SaveChangesAsync();

            return Json(result.Entity.IdCuenta);
        }

        [HttpPut]
        public async Task<IActionResult> Put(int key, string values) {
            var model = await _context.PrCuentas.FirstOrDefaultAsync(item => item.IdCuenta == key);
            if(model == null)
                return StatusCode(409, "PrCuentas not found");

            var valuesDict = JsonConvert.DeserializeObject<IDictionary>(values);
            PopulateModel(model, valuesDict);

            if(!TryValidateModel(model))
                return BadRequest(GetFullErrorMessage(ModelState));

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete]
        public async Task Delete(int key) {
            var model = await _context.PrCuentas.FirstOrDefaultAsync(item => item.IdCuenta == key);

            _context.PrCuentas.Remove(model);
            await _context.SaveChangesAsync();
        }


        [HttpGet]
        public async Task<IActionResult> PrCategoriaCuentasLookup(DataSourceLoadOptions loadOptions) {
            var lookup = from i in _context.PrCategoriaCuentas
                         orderby i.NombreCategoria
                         select new {
                             Value = i.IdCategoria,
                             Text = i.NombreCategoria
                         };
            return Json(await DataSourceLoader.LoadAsync(lookup, loadOptions));
        }

        private void PopulateModel(PrCuentas model, IDictionary values) {
            string ID_CUENTA = nameof(PrCuentas.IdCuenta);
            string COD_CUENTA = nameof(PrCuentas.CodCuenta);
            string NOMBRE_CUENTA = nameof(PrCuentas.NombreCuenta);
            string ID_CATEGORIA = nameof(PrCuentas.IdCategoria);
            string EXCLUIR_CD = nameof(PrCuentas.ExcluirCd);
            string AFECTA_SEMANAL = nameof(PrCuentas.AfectaSemanal);
            string ACTIVO = nameof(PrCuentas.Activo);
            string USUARIO = nameof(PrCuentas.Usuario);
            string ID_CUENTA_DEPENDE = nameof(PrCuentas.IdCuentaDepende);
            string NOMBRE_EQUIPO = nameof(PrCuentas.NombreEquipo);

            if(values.Contains(ID_CUENTA)) {
                model.IdCuenta = Convert.ToInt32(values[ID_CUENTA]);
            }

            if(values.Contains(COD_CUENTA)) {
                model.CodCuenta = Convert.ToString(values[COD_CUENTA]);
            }

            if(values.Contains(NOMBRE_CUENTA)) {
                model.NombreCuenta = Convert.ToString(values[NOMBRE_CUENTA]);
            }

            if(values.Contains(ID_CATEGORIA)) {
                model.IdCategoria = values[ID_CATEGORIA] != null ? Convert.ToInt32(values[ID_CATEGORIA]) : (int?)null;
            }

            if(values.Contains(EXCLUIR_CD)) {
                model.ExcluirCd = values[EXCLUIR_CD] != null ? Convert.ToBoolean(values[EXCLUIR_CD]) : (bool?)null;
            }

            if(values.Contains(AFECTA_SEMANAL)) {
                model.AfectaSemanal = values[AFECTA_SEMANAL] != null ? Convert.ToBoolean(values[AFECTA_SEMANAL]) : (bool?)null;
            }

            if(values.Contains(ACTIVO)) {
                model.Activo = values[ACTIVO] != null ? Convert.ToBoolean(values[ACTIVO]) : (bool?)null;
            }

            if(values.Contains(USUARIO)) {
                model.Usuario = Convert.ToString(values[USUARIO]);
            }

            if(values.Contains(ID_CUENTA_DEPENDE)) {
                model.IdCuentaDepende = values[ID_CUENTA_DEPENDE] != null ? Convert.ToInt32(values[ID_CUENTA_DEPENDE]) : (int?)null;
            }

            if(values.Contains(NOMBRE_EQUIPO)) {
                model.NombreEquipo = Convert.ToString(values[NOMBRE_EQUIPO]);
            }
        }

        private string GetFullErrorMessage(ModelStateDictionary modelState) {
            var messages = new List<string>();

            foreach(var entry in modelState) {
                foreach(var error in entry.Value.Errors)
                    messages.Add(error.ErrorMessage);
            }

            return String.Join(" ", messages);
        }

        [HttpGet]
        public async Task<IActionResult> GetCategorias(DataSourceLoadOptions loadOptions)
        {
            var lookup = from i in _context.PrCategoriaCuentas
                         orderby i.NombreCategoria
                         select new
                         {
                             IdCategoria = i.IdCategoria,
                             NombreCategoria = i.NombreCategoria
                         };
            return Json(await DataSourceLoader.LoadAsync(lookup, loadOptions));
        }
    }
}