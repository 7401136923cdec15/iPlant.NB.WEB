
using System;
using System.Collections.Generic;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using iPlant.Common.Tools;
using iPlant.NB.WEB.Controllers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;

namespace iPlant.NB.WEB.Utils
{
    public static partial class Extensions
    {
        public static Exception GetOriginalException(this Exception ex)
        {
            if (ex.InnerException == null) return ex;

            return ex.InnerException.GetOriginalException();
        }

        public static string QueryParamString(this HttpRequest wRequest, string wKey)
        {

            if (!wRequest.Query.ContainsKey(wKey))
            {
                return null;
            }
            return wRequest.Query[wKey].ToString();
        }

        public static JsonResult GetErrorResult(this HttpResponse wHttpResponse, string wMsg)
        {
            return new JsonResult(new Dictionary<string, object>{
                { BaseController.RESULT_KEY, RetCode.SERVER_CODE_ERR},
                {
                    BaseController.RESULT_RETURN, new Dictionary<string,object>{
                    { BaseController.RESULT_MSG, wMsg },
                    { BaseController.DATA_LIST, null },
                    { BaseController.DATA_INFO, null }
                  }
                }
            });
        }

        public static JsonResult GetErrorResult(this HttpResponse wHttpResponse, int wErrorCode, string wMsg)
        {
            return new JsonResult(new Dictionary<string, object>{
                { BaseController.RESULT_KEY, wErrorCode},
                {
                    BaseController.RESULT_RETURN, new Dictionary<string,object>{
                    { BaseController.RESULT_MSG, wMsg },
                    { BaseController.DATA_LIST, null },
                    { BaseController.DATA_INFO, null }
                  }
                }
            });
        }

        public static IHostBuilder UseLog4Net(this IHostBuilder wHostBuilder, string wRepositoryName = "")
        {

            log4net.Repository.ILoggerRepository repository;
            if (string.IsNullOrWhiteSpace(wRepositoryName))
            {
                repository = log4net.LogManager.GetRepository(Assembly.GetEntryAssembly());
            }
            else
            {
                repository = log4net.LogManager.CreateRepository(wRepositoryName);
            }
            //指定log4net的配置文件，即你的log4net的文件
            log4net.Config.XmlConfigurator.Configure(repository, new System.IO.FileInfo(
                StringUtils.CombinePath(AppDomain.CurrentDomain.BaseDirectory, "/wwwroot/Configs/LogConfig.xml")));


            log4net.ILog logger = log4net.LogManager.GetLogger(typeof(Extensions));


            logger.Info(" Service NB StartUp!!!");

            return wHostBuilder;
        }
    }

}
