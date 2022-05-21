using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;
using CAEP.Data.SCUP;
using CAEP.Miscelaneos;
using CAEP.Data.CAEP;

namespace CAEP
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<CookiePolicyOptions>(options =>
            {
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.Strict;
            });

            services.ConfigureApplicationCookie(options => {
                options.LoginPath = "/";
                options.AccessDeniedPath = "/";
                options.ReturnUrlParameter = $"CAEP-{Propiedades._gNombreSistema.Replace(" ", "-")}-DENIED";
            });

            services.AddDistributedSqlServerCache(options =>
            {
                options.ConnectionString = Configuration.GetConnectionString("APP_CadenaConexion");
                options.SchemaName = "dbo";
                options.TableName = "SesionesUsuariosWeb";
            });

            services.AddSession(options =>
            {
                options.IdleTimeout = TimeSpan.FromDays(1);
                options.Cookie.HttpOnly = true;
                options.Cookie.IsEssential = true;
            });

            services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie(options => {
                options.LoginPath = "/";
                options.AccessDeniedPath = "/";
                options.ReturnUrlParameter = $"GGM-{Propiedades._gNombreSistema.Replace(" ","-")}-DENIED";
            });

            services.AddDbContext<SCUPContext>(o => o.UseSqlServer(Configuration.GetConnectionString("SCUP_CadenaConexion")));
            services.AddDbContext<CAEPContext>(o => o.UseSqlServer(Configuration.GetConnectionString("APP_CadenaConexion")));
            services.AddControllersWithViews().AddJsonOptions(options => options.JsonSerializerOptions.PropertyNamingPolicy = null).AddRazorRuntimeCompilation();

            services.AddAuthorization(options => {            
                foreach(var politica in Propiedades._gPoliticasRoles)
                {
                    options.AddPolicy(politica, policy =>
                    {
                        policy.AddRequirements(new UserPolicyRequirement(politica));
                    });

                }
            });

            services.AddTransient<IAuthorizationHandler, VerificadorRoles>();
            services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();
        }
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Principal/Default/Error");
                app.UseStatusCodePagesWithRedirects("/Principal/Default/Error");
            }

            app.UseStaticFiles();
            app.UseSession();
            app.UseAuthentication();
            app.UseRouting();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{area=Principal}/{controller=Default}/{action=Index}/{id?}");
            });
        }
    }
}
