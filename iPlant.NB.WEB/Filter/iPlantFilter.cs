using iPlant.Common.Tools;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace iPlant.NB.WEB.Filter
{
    public class iPlantFilter : ActionFilterAttribute
    {
        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(iPlantFilter));
        private static string IGNORE_CONTENT_TYPE = "multipart/form-data";

        public const string Filter_Api_ID = "filter_api_id";

        public const string Filter_Api_Time = "filter_api_time";

        private LockHelper mLockHelper = new LockHelper();

        private const string RESULT_KEY = "resultCode";


        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            try
            {
                //对接口有效

                HttpContext context = filterContext.HttpContext;

                HttpRequest wRequest = context.Request;

                HttpResponse wResponse = context.Response;


                wResponse.ContentType = "text/plain; charset=utf-8";



            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString()); logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
        }

        public override void OnActionExecuted(ActionExecutedContext filterContext)
        {
            try
            {


            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
        }

    }

}