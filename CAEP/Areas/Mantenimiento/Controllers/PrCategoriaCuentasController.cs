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
    public class PrCategoriaCuentasController : Controller
    {
        private CAEPContext _context;

        public PrCategoriaCuentasController(CAEPContext context) {
            _context = context;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> Get(DataSourceLoadOptions loadOptions) {
            var prcategoriacuentas = _context.PrCategoriaCuentas.Select(i => new {
                i.IdCategoria,
                i.NombreCategoria,
                i.Usuario,
                i.NombreEquipo
            });

            // If you work with a large amount of data, consider specifying the PaginateViaPrimaryKey and PrimaryKey properties.
            // In this case, keys and data are loaded in separate queries. This can make the SQL execution plan more efficient.
            // Refer to the topic https://github.com/DevExpress/DevExtreme.AspNet.Data/issues/336.
            // loadOptions.PrimaryKey = new[] { "IdCategoria" };
            // loadOptions.PaginateViaPrimaryKey = true;

            return Json(await DataSourceLoader.LoadAsync(prcategoriacuentas, loadOptions));
        }

        [HttpPost]
        public async Task<IActionResult> Post(string values) {
            var model = new PrCategoriaCuentas();
            var valuesDict = JsonConvert.DeserializeObject<IDictionary>(values);
            PopulateModel(model, valuesDict);

            if(!TryValidateModel(model))
                return BadRequest(GetFullErrorMessage(ModelState));

            var result = _context.PrCategoriaCuentas.Add(model);
            await _context.SaveChangesAsync();

            return Json(result.Entity.IdCategoria);
        }

        [HttpPut]
        public async Task<IActionResult> Put(int key, string values) {
            var model = await _context.PrCategoriaCuentas.FirstOrDefaultAsync(item => item.IdCategoria == key);
            if(model == null)
                return StatusCode(409, "PrCategoriaCuentas not found");

            var valuesDict = JsonConvert.DeserializeObject<IDictionary>(values);
            PopulateModel(model, valuesDict);

            if(!TryValidateModel(model))
                return BadRequest(GetFullErrorMessage(ModelState));

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete]
        public async Task Delete(int key) {
            var model = await _context.PrCategoriaCuentas.FirstOrDefaultAsync(item => item.IdCategoria == key);

            _context.PrCategoriaCuentas.Remove(model);
            await _context.SaveChangesAsync();
        }


        private void PopulateModel(PrCategoriaCuentas model, IDictionary values) {
            string ID_CATEGORIA = nameof(PrCategoriaCuentas.IdCategoria);
            string NOMBRE_CATEGORIA = nameof(PrCategoriaCuentas.NombreCategoria);
            string USUARIO = nameof(PrCategoriaCuentas.Usuario);
            string NOMBRE_EQUIPO = nameof(PrCategoriaCuentas.NombreEquipo);

            if(values.Contains(ID_CATEGORIA)) {
                model.IdCategoria = Convert.ToInt32(values[ID_CATEGORIA]);
            }

            if(values.Contains(NOMBRE_CATEGORIA)) {
                model.NombreCategoria = Convert.ToString(values[NOMBRE_CATEGORIA]);
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