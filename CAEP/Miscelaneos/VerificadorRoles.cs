using Microsoft.AspNetCore.Authorization;
using CAEP.Data.SCUP;
using CAEP.Models.Principal.Default;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using CBTMonitoreo.Models.Principal.Default;

namespace CAEP.Miscelaneos
{
    public class UserPolicyRequirement : IAuthorizationRequirement
    {
        public UserPolicyRequirement(string _politica)
        {
            Politica = _politica;
        }

        public string Politica { get; set; }
    }
    public class VerificadorRoles : AuthorizationHandler<UserPolicyRequirement>
    {
        private string _NombrePolitica;
        private readonly SCUPContext _contextSCUP;
        public VerificadorRoles(string nombrePolitica)
        {
            this._NombrePolitica = nombrePolitica;
        }

        public VerificadorRoles(SCUPContext contextSCUP)
        {
            _contextSCUP = contextSCUP;
        }
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, UserPolicyRequirement requirement)
        {
            var perfil = context.User.FindFirst(claim => claim.Type == System.Security.Claims.ClaimTypes.Role)?.Value;

            List<PerfilesViewModel> perfiles = Funciones.EjecutarSPList<PerfilesViewModel>(contexto: _contextSCUP,
                                                                                           sp: "SCUP_PERFILES_MENU",
                                                                                           new SQLP("@NOMBRE_LOGICO", SqlDbType.VarChar, 100, requirement.Politica),
                                                                                           new SQLP("@CODIGO_SISTEMA", SqlDbType.VarChar, 50, Propiedades._gCodigoSistema));
            var existe = false;
            
            foreach(var _perfil in perfiles)
            {
                if(perfil != null && _perfil.Perfil.Trim().ToUpper() == perfil.ToString().Trim().ToUpper())
                {
                    existe = true;
                }
            }

            if (existe)
            {
                context.Succeed(requirement);
            }
            else
            {
                context.Fail();
            }
            return Task.CompletedTask;
        }
    }
}
