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
    public class PrCentrosDeCostosController : Controller
    {
        private CAEPContext _context;

        public PrCentrosDeCostosController(CAEPContext context) {
            _context = context;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> Get(DataSourceLoadOptions loadOptions) {
            var prcentrosdecosto = _context.PrCentrosDeCosto.Select(i => new {
                i.IdCentroDeCosto,
                i.CodCentroDeCosto,
                i.NombreCentroDeCosto,
                i.IdEmpresa,
                i.AplicaGmsb,
                i.EsGmsb,
                i.AplicaCrimasa,
                i.EsCrimasa,
                i.AqhIndicador,
                i.CadelpaIndicador,
                i.CrimasaIndicador,
                i.GmsbIndicador,
                i.SfhIndicador,
                i.Activo,
                i.Usuario,
                i.Correo,
                i.NombreEquipo,
                i.IdSectorFinca
            });

            // If you work with a large amount of data, consider specifying the PaginateViaPrimaryKey and PrimaryKey properties.
            // In this case, keys and data are loaded in separate queries. This can make the SQL execution plan more efficient.
            // Refer to the topic https://github.com/DevExpress/DevExtreme.AspNet.Data/issues/336.
            // loadOptions.PrimaryKey = new[] { "IdCentroDeCosto" };
            // loadOptions.PaginateViaPrimaryKey = true;

            return Json(await DataSourceLoader.LoadAsync(prcentrosdecosto, loadOptions));
        }

        [HttpPost]
        public async Task<IActionResult> Post(string values) {
            var model = new PrCentrosDeCosto();
            var valuesDict = JsonConvert.DeserializeObject<IDictionary>(values);
            PopulateModel(model, valuesDict);

            if(!TryValidateModel(model))
                return BadRequest(GetFullErrorMessage(ModelState));

            var result = _context.PrCentrosDeCosto.Add(model);
            await _context.SaveChangesAsync();

            return Json(result.Entity.IdCentroDeCosto);
        }

        [HttpPut]
        public async Task<IActionResult> Put(int key, string values) {
            var model = await _context.PrCentrosDeCosto.FirstOrDefaultAsync(item => item.IdCentroDeCosto == key);
            if(model == null)
                return StatusCode(409, "PrCentrosDeCosto not found");

            var valuesDict = JsonConvert.DeserializeObject<IDictionary>(values);
            PopulateModel(model, valuesDict);

            if(!TryValidateModel(model))
                return BadRequest(GetFullErrorMessage(ModelState));

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete]
        public async Task Delete(int key) {
            var model = await _context.PrCentrosDeCosto.FirstOrDefaultAsync(item => item.IdCentroDeCosto == key);

            _context.PrCentrosDeCosto.Remove(model);
            await _context.SaveChangesAsync();
        }


        [HttpGet]
        public async Task<IActionResult> PrEmpresasLookup(DataSourceLoadOptions loadOptions) {
            var lookup = from i in _context.PrEmpresas
                         orderby i.IdEmpresa ascending
                         select new {
                             Value = i.IdEmpresa,
                             Text = i.CodEmpresa
                         };
            return Json(await DataSourceLoader.LoadAsync(lookup, loadOptions));
        }

        private void PopulateModel(PrCentrosDeCosto model, IDictionary values) {
            string ID_CENTRO_DE_COSTO = nameof(PrCentrosDeCosto.IdCentroDeCosto);
            string COD_CENTRO_DE_COSTO = nameof(PrCentrosDeCosto.CodCentroDeCosto);
            string NOMBRE_CENTRO_DE_COSTO = nameof(PrCentrosDeCosto.NombreCentroDeCosto);
            string ID_EMPRESA = nameof(PrCentrosDeCosto.IdEmpresa);
            string APLICA_GMSB = nameof(PrCentrosDeCosto.AplicaGmsb);
            string ES_GMSB = nameof(PrCentrosDeCosto.EsGmsb);
            string APLICA_CRIMASA = nameof(PrCentrosDeCosto.AplicaCrimasa);
            string ES_CRIMASA = nameof(PrCentrosDeCosto.EsCrimasa);
            string AQH_INDICADOR = nameof(PrCentrosDeCosto.AqhIndicador);
            string CADELPA_INDICADOR = nameof(PrCentrosDeCosto.CadelpaIndicador);
            string CRIMASA_INDICADOR = nameof(PrCentrosDeCosto.CrimasaIndicador);
            string GMSB_INDICADOR = nameof(PrCentrosDeCosto.GmsbIndicador);
            string SFH_INDICADOR = nameof(PrCentrosDeCosto.SfhIndicador);
            string ACTIVO = nameof(PrCentrosDeCosto.Activo);
            string USUARIO = nameof(PrCentrosDeCosto.Usuario);
            string CORREO = nameof(PrCentrosDeCosto.Correo);
            string NOMBRE_EQUIPO = nameof(PrCentrosDeCosto.NombreEquipo);
            string ID_SECTOR_FINCA = nameof(PrCentrosDeCosto.IdSectorFinca);

            if(values.Contains(ID_CENTRO_DE_COSTO)) {
                model.IdCentroDeCosto = Convert.ToInt32(values[ID_CENTRO_DE_COSTO]);
            }

            if(values.Contains(COD_CENTRO_DE_COSTO)) {
                model.CodCentroDeCosto = Convert.ToString(values[COD_CENTRO_DE_COSTO]);
            }

            if(values.Contains(NOMBRE_CENTRO_DE_COSTO)) {
                model.NombreCentroDeCosto = Convert.ToString(values[NOMBRE_CENTRO_DE_COSTO]);
            }

            if(values.Contains(ID_EMPRESA)) {
                model.IdEmpresa = values[ID_EMPRESA] != null ? Convert.ToInt32(values[ID_EMPRESA]) : (int?)null;
            }

            if(values.Contains(APLICA_GMSB)) {
                model.AplicaGmsb = values[APLICA_GMSB] != null ? Convert.ToBoolean(values[APLICA_GMSB]) : (bool?)null;
            }

            if(values.Contains(ES_GMSB)) {
                model.EsGmsb = values[ES_GMSB] != null ? Convert.ToBoolean(values[ES_GMSB]) : (bool?)null;
            }

            if(values.Contains(APLICA_CRIMASA)) {
                model.AplicaCrimasa = values[APLICA_CRIMASA] != null ? Convert.ToBoolean(values[APLICA_CRIMASA]) : (bool?)null;
            }

            if(values.Contains(ES_CRIMASA)) {
                model.EsCrimasa = values[ES_CRIMASA] != null ? Convert.ToBoolean(values[ES_CRIMASA]) : (bool?)null;
            }

            if(values.Contains(AQH_INDICADOR)) {
                model.AqhIndicador = values[AQH_INDICADOR] != null ? Convert.ToBoolean(values[AQH_INDICADOR]) : (bool?)null;
            }

            if(values.Contains(CADELPA_INDICADOR)) {
                model.CadelpaIndicador = values[CADELPA_INDICADOR] != null ? Convert.ToBoolean(values[CADELPA_INDICADOR]) : (bool?)null;
            }

            if(values.Contains(CRIMASA_INDICADOR)) {
                model.CrimasaIndicador = values[CRIMASA_INDICADOR] != null ? Convert.ToBoolean(values[CRIMASA_INDICADOR]) : (bool?)null;
            }

            if(values.Contains(GMSB_INDICADOR)) {
                model.GmsbIndicador = values[GMSB_INDICADOR] != null ? Convert.ToBoolean(values[GMSB_INDICADOR]) : (bool?)null;
            }

            if(values.Contains(SFH_INDICADOR)) {
                model.SfhIndicador = values[SFH_INDICADOR] != null ? Convert.ToBoolean(values[SFH_INDICADOR]) : (bool?)null;
            }

            if(values.Contains(ACTIVO)) {
                model.Activo = values[ACTIVO] != null ? Convert.ToBoolean(values[ACTIVO]) : (bool?)null;
            }

            if(values.Contains(USUARIO)) {
                model.Usuario = Convert.ToString(values[USUARIO]);
            }

            if(values.Contains(CORREO)) {
                model.Correo = Convert.ToString(values[CORREO]);
            }

            if(values.Contains(NOMBRE_EQUIPO)) {
                model.NombreEquipo = Convert.ToString(values[NOMBRE_EQUIPO]);
            }

            if(values.Contains(ID_SECTOR_FINCA)) {
                model.IdSectorFinca = values[ID_SECTOR_FINCA] != null ? Convert.ToInt32(values[ID_SECTOR_FINCA]) : (int?)null;
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
        public async Task<IActionResult> GetEmpresas(DataSourceLoadOptions loadOptions)
        {
            var lookup = from i in _context.PrEmpresas
                         orderby i.NombreEmpresa
                         select new
                         {
                             IdEmpresa = i.IdEmpresa,
                             NombreEmpresa = i.NombreEmpresa
                         };
            return Json(await DataSourceLoader.LoadAsync(lookup, loadOptions));
        }
    }
}