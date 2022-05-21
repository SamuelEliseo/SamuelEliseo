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
    public class PrEmpresasController : Controller
    {
        private CAEPContext _context;

        public PrEmpresasController(CAEPContext context) {
            _context = context;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> Get(DataSourceLoadOptions loadOptions) {
            var prempresas = _context.PrEmpresas.Select(i => new {
                i.IdEmpresa,
                i.CodEmpresa,
                i.NombreEmpresa,
                i.Direccion,
                i.Activo,
                i.Usuario,
                i.NombreEquipo
            });

            // If you work with a large amount of data, consider specifying the PaginateViaPrimaryKey and PrimaryKey properties.
            // In this case, keys and data are loaded in separate queries. This can make the SQL execution plan more efficient.
            // Refer to the topic https://github.com/DevExpress/DevExtreme.AspNet.Data/issues/336.
            // loadOptions.PrimaryKey = new[] { "IdEmpresa" };
            // loadOptions.PaginateViaPrimaryKey = true;

            return Json(await DataSourceLoader.LoadAsync(prempresas, loadOptions));
        }

        [HttpPost]
        public async Task<IActionResult> Post(string values) {
            var model = new PrEmpresas();
            var valuesDict = JsonConvert.DeserializeObject<IDictionary>(values);
            PopulateModel(model, valuesDict);

            if(!TryValidateModel(model))
                return BadRequest(GetFullErrorMessage(ModelState));

            var result = _context.PrEmpresas.Add(model);
            await _context.SaveChangesAsync();

            return Json(result.Entity.IdEmpresa);
        }

        [HttpPut]
        public async Task<IActionResult> Put(int key, string values) {
            var model = await _context.PrEmpresas.FirstOrDefaultAsync(item => item.IdEmpresa == key);
            if(model == null)
                return StatusCode(409, "PrEmpresas not found");

            var valuesDict = JsonConvert.DeserializeObject<IDictionary>(values);
            PopulateModel(model, valuesDict);

            if(!TryValidateModel(model))
                return BadRequest(GetFullErrorMessage(ModelState));

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete]
        public async Task Delete(int key) {
            var model = await _context.PrEmpresas.FirstOrDefaultAsync(item => item.IdEmpresa == key);

            _context.PrEmpresas.Remove(model);
            await _context.SaveChangesAsync();
        }


        private void PopulateModel(PrEmpresas model, IDictionary values) {
            string ID_EMPRESA = nameof(PrEmpresas.IdEmpresa);
            string COD_EMPRESA = nameof(PrEmpresas.CodEmpresa);
            string NOMBRE_EMPRESA = nameof(PrEmpresas.NombreEmpresa);
            string DIRECCION = nameof(PrEmpresas.Direccion);
            string ACTIVO = nameof(PrEmpresas.Activo);
            string USUARIO = nameof(PrEmpresas.Usuario);
            string NOMBRE_EQUIPO = nameof(PrEmpresas.NombreEquipo);

            if(values.Contains(ID_EMPRESA)) {
                model.IdEmpresa = Convert.ToInt32(values[ID_EMPRESA]);
            }

            if(values.Contains(COD_EMPRESA)) {
                model.CodEmpresa = Convert.ToString(values[COD_EMPRESA]);
            }

            if(values.Contains(NOMBRE_EMPRESA)) {
                model.NombreEmpresa = Convert.ToString(values[NOMBRE_EMPRESA]);
            }

            if(values.Contains(DIRECCION)) {
                model.Direccion = Convert.ToString(values[DIRECCION]);
            }

            if(values.Contains(ACTIVO)) {
                model.Activo = values[ACTIVO] != null ? Convert.ToBoolean(values[ACTIVO]) : (bool?)null;
            }

            if(values.Contains(USUARIO)) {
                model.Usuario = Convert.ToString(values[USUARIO]);
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
    }
}