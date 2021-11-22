using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Encodings.Web;
using System.Text.Unicode;
using iPlant.Common.Tools;
using System.IO;
using Microsoft.Extensions.FileProviders;
using System;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace iPlant.FMS.WEB
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //services.AddControllers(
            //    opt =>
            //{
            //    // ͳһ����·��ǰ׺
            //    opt.UseCentralRoutePrefix(new RouteAttribute("api/"));

            //}
            //).AddJsonOptions(options =>
            //{
            //    options.JsonSerializerOptions.Encoder = JavaScriptEncoder.Create(UnicodeRanges.All);
            //    options.JsonSerializerOptions.Converters.Add(new DateTimeConverterUsingDateTimeParse());
            //    options.JsonSerializerOptions.Converters.Add(new DateTimeConverterUsingDateTimeOffsetParse());

            //});
            services.AddMvc(options =>
            {
                options.EnableEndpointRouting = false;
                options.Filters.Add<GlobalExceptionFilter>();
                options.Filters.Add<iPlantFilter>();
                options.ModelMetadataDetailsProviders.Add(new ModelBindingMetadataProvider()); 
            }).AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.PropertyNamingPolicy = null;
                options.JsonSerializerOptions.Encoder = JavaScriptEncoder.Create(UnicodeRanges.All);
                options.JsonSerializerOptions.Converters.Add(new DateTimeConverterUsingDateTimeParse());
                options.JsonSerializerOptions.Converters.Add(new DateTimeConverterUsingDateTimeOffsetParse());

            });
            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

            services.Configure<CookiePolicyOptions>(options =>
            {
                // This lambda determines whether user consent for non-essential cookies is needed for a given request.
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });
            services.AddSingleton(HtmlEncoder.Create(UnicodeRanges.All));


            //services.AddDbContext

            services.AddMemoryCache();
            services.AddSession(o =>
            {
                o.IdleTimeout = TimeSpan.FromMinutes(30);
                o.Cookie.HttpOnly = true;
            });
            services.AddHttpContextAccessor();


            // GlobalContext.SystemConfig = Configuration.GetSection("SystemConfig").Get<SystemConfig>();
            GlobalContext.Services = services;
            GlobalContext.Configuration = Configuration;


        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/api/HomePage/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }
            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();


            app.UseSession();


            GlobalContext.ContentRootPath = env.ContentRootPath;

            string resource = Path.Combine(env.ContentRootPath, "Resource");

            if (!Directory.Exists(resource))
            {
                Directory.CreateDirectory(resource);
            }
            app.UseStaticFiles(new StaticFileOptions
            {
                RequestPath = "/Resource",
                FileProvider = new PhysicalFileProvider(resource),
                OnPrepareResponse = GlobalContext.SetCacheControl
            });

            app.UseAuthorization();

            GlobalContext.ServiceProvider = app.ApplicationServices;

            app.UseMvc(routes=>{

                routes.MapRoute(
                name: "Default",
                template: "api/{controller=HomePage}/{action=Index}/{id?}");
         
            });

            //app.UseEndpoints(endpoints =>
            //{
            //    endpoints.MapControllerRoute(
            //        name: "default",
            //        pattern: "{controller}/{action}/{id?}",
            //        defaults: new { Controller = "HomePage", Action = "Index" });
            //    endpoints.MapControllerRoute(
            //       name: "area",
            //       pattern: "area/api/{controller}/{action}/{id?}",
            //       defaults: new { Controller = "HomePage", Action = "Index", area = "Management" });
            //});
        }
    }
}
