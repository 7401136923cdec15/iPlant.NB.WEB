using iPlant.Common.Tools;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.Common;
using System.IO;
using System.Linq;
using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using System.Threading.Tasks;
using System.Text.Json.Serialization;
using System.Text.Json;
using Microsoft.Extensions.Primitives;
using iPlant.NB.WEB.Models;

namespace iPlant.NB.WEB.Controllers
{

    public class RetCode
    {

        public static int SERVER_CODE_SUC = 1000;
        public static int SERVER_CODE_ERR = 9999;
        public static string SERVER_CODE_ERR_MSG = "处理异常";
        public static int SERVER_CODE_UNLOGIN = 9998;
        public static string SERVER_CODE_UNLOGIN_ALARM_NOPD = "密码错误!";
        public static string SERVER_CODE_UNLOGIN_ALARM_TOKEN = "免密验证失败!";

        public static string SERVER_CODE_UNROLE = "无权限！";

        public static string SERVER_CODE_UNLOGIN_ALARM = "用户名或密码不正确!";
        public static string SERVER_CODE_UNLOGIN_ALARM_NOMAC = "终端不匹配！";

        public static int LOGIN_ERR_CODE_LOGIN_FAIL = 9997;
        public static int PERMISSION_DENIED = 9994;

        public static string SERVER_RST_NULL = "服务返回值为空！";
        public static string SERVER_RST_ERROR_IN = "服务器内部错误！";
        public static string SERVER_RST_ERROR_FAILED = "操作失败！";
        public static string SERVER_RST_ERROR_OUT = "输入参数错误或参数不合法！";
    }

    public class BaseController : Controller
    {
        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(BaseController));

        public new HttpRequest Request { get { return HttpContext.Request; } }

        public new HttpResponse Response { get { return HttpContext.Response; } }

        public ISession Session { get { return HttpContext.Session; } }


        public const string RESULT_KEY = "resultCode";

        public const string RESULT_MSG = "msg";

        public const string RESULT_RETURN = "returnObject";

        public const string DATA_LIST = "list";

        public const string DATA_INFO = "info";



        protected bool CheckCookieEmpty()
        {
            bool wRst = false;


            BMSEmployee wBMSEmployee = GetSession();
            if (wBMSEmployee.ID <= 0 && wBMSEmployee.ID != -100)
            {
                string wLoginName = getCookieValue(SessionContants.CookieUser, Request);
                string wID = getCookieValue(SessionContants.CookieUserID, Request);
                if (string.IsNullOrWhiteSpace(wID))
                {

                    wRst = true;
                }
                else
                {
                    wBMSEmployee.ID = StringUtils.parseInt(wID);
                }
                if (StringUtils.isEmpty(wLoginName))
                {
                    wRst = true;
                }
                else
                {
                    wBMSEmployee.LoginName = wLoginName;
                }
                SetSession(HttpContext.Session, wBMSEmployee);
            }
            if (wBMSEmployee.ID <= 0 && wBMSEmployee.ID != -100)
            {
                wRst = true;
            }
            return wRst;

        }



        protected BMSEmployee GetSession()
        {
            BMSEmployee wBMSEmployee = new BMSEmployee();

            if (!string.IsNullOrWhiteSpace(HttpContext.Session.GetString(SessionContants.SessionUser)))
            {
                wBMSEmployee = JsonSerializer.Deserialize<BMSEmployee>(HttpContext.Session.GetString(SessionContants.SessionUser));
                if (wBMSEmployee == null)
                    wBMSEmployee = new BMSEmployee();
            }
            return wBMSEmployee;

        }


        public static BMSEmployee GetSession(ISession wSession)
        {
            BMSEmployee wBMSEmployee = new BMSEmployee();

            if (!string.IsNullOrWhiteSpace(wSession.GetString(SessionContants.SessionUser)))
            {
                wBMSEmployee = JsonSerializer.Deserialize<BMSEmployee>(wSession.GetString(SessionContants.SessionUser));
                if (wBMSEmployee == null)
                    wBMSEmployee = new BMSEmployee();
            }
            return wBMSEmployee;

        }

        public static void RmoveSession(ISession wSession)
        {

            if (!string.IsNullOrWhiteSpace(wSession.GetString(SessionContants.SessionUser)))
            {
                wSession.Remove(SessionContants.SessionUser);
            }
        }

        public static void SetSession(ISession wSession, BMSEmployee wBMSEmployee)
        {

            if (wBMSEmployee == null)
                return;
            if (wSession.Keys.Contains(SessionContants.SessionUser))
            {
                wSession.Remove(SessionContants.SessionUser);
            }
            wSession.SetString(SessionContants.SessionUser, JsonSerializer.Serialize(wBMSEmployee));
        }


        public static void RmoveCookie(HttpRequest wRequest, HttpResponse wResponse)
        {


            if (wRequest.Cookies != null && wResponse.Cookies != null)
            {


                if (wRequest.Cookies.ContainsKey(SessionContants.CookieUser))
                {
                    wResponse.Cookies.Delete(SessionContants.CookieUser);
                }
                if (wRequest.Cookies.ContainsKey(SessionContants.CookieUserID))
                {
                    wResponse.Cookies.Delete(SessionContants.CookieUserID);
                }


                var co = new CookieOptions();
                co.Path = "/";

                //on localhost, Domain value is not needed !!
                //co.Domain = "";

                co.Expires = DateTime.Now.AddDays(-1);
                co.HttpOnly = true;

                wResponse.Cookies.Append(SessionContants.CookieUser, "", co);
                wResponse.Cookies.Append(SessionContants.CookieUserID, "", co);
            }
        }



        public static void SetCookie(HttpRequest wRequest, HttpResponse wResponse, BMSEmployee wBMSEmployee)
        {
            if (wBMSEmployee == null)
                return;

            RmoveCookie(wRequest, wResponse);


            var co = new CookieOptions();
            co.Path = "/";

            //on localhost, Domain value is not needed !!
            //co.Domain = "";

            co.HttpOnly = true;

            wResponse.Cookies.Append(SessionContants.CookieUser, wBMSEmployee.LoginName, co);

            wResponse.Cookies.Append(SessionContants.CookieUserID, DesUtil.encrypt(wBMSEmployee.ID + "", SessionContants.appSecret), co);

        }


        public static string getCookieValue(string cookie_key, HttpRequest request)
        {

            string cookie_val = null;

            if (request.Cookies != null && request.Cookies.Count > 0)
            {
                if (request.Cookies.ContainsKey(cookie_key))
                {
                    request.Cookies.TryGetValue(cookie_key, out cookie_val);
                }
            }
            else
            {
                StringValues wStringValues = new StringValues();
                if (request.Query.TryGetValue(cookie_key, out wStringValues))
                {

                    foreach (var item in wStringValues)
                    {
                        if (string.IsNullOrWhiteSpace(item))
                            continue;

                        cookie_val = item;
                    }
                }
            }
            if (string.IsNullOrWhiteSpace(cookie_val))
                return cookie_val;

            try
            {
                cookie_val = DesUtil.decrypt(cookie_val, SessionContants.appSecret);
            }
            catch (Exception e)
            {
                // TODO 自动生成的 catch 块 
                logger.Error("getCookieValue", e);
            }

            return cookie_val;
        }

        public static string CreateToken(string account)
        {
            string wToken = "";

            try
            {
                string wT4 = account.Substring(0, account.Length / 2);
                string wT2 = account.Substring(account.Length / 2);
                string wT3 = DateTime.Now.ToString("yyyy-MM");
                string wT5 = string.Format("{0:D2}", DateTime.Now.Day);
                string wT1 = DateTime.Now.ToString("HH:mm:ss");

                wToken = string.Format("{0}+-abc072-+{1}+-abc072-+{2}+-abc072-+{3}+-abc072-+{4}", wT1, wT2, wT3, wT4,
                        wT5);

                wToken = DesUtil.encrypt(wToken, SessionContants.appSecret);
            }
            catch (Exception e)
            {
                logger.Error("CreateToken", e);
            }

            return wToken;
        }


        public static string GetProjectName(HttpRequest request)
        {

            string wResult = "";


            string wURL = new StringBuilder()

             .Append(request.PathBase)
             .Append(request.Path)
             .ToString();


            if (wURL.IndexOf("/api/") <= 0)
                return wResult;

            wResult = wURL.Substring(0, wURL.IndexOf("/api/"));
            return wResult;
        }

        /// <summary>
        /// 获取返回ReturnObject
        /// </summary>
        /// <param name="wMsg"></param>
        /// <param name="wReturnObjectList"></param>
        /// <param name="wReturnObjectInfo"></param>
        /// <returns></returns>
        public Dictionary<string, object> GetReturnObject(string wMsg, object wReturnObjectList, object wReturnObjectInfo)
        {
            return new Dictionary<string, object> { { RESULT_MSG, wMsg }, { DATA_LIST, wReturnObjectList }, { DATA_INFO, wReturnObjectInfo } };
        }

        /// <summary>
        /// 特殊处理返回  可修改ReturnObject后返回
        /// </summary>
        /// <param name="wResultCode"></param>
        /// <param name="wReturnObject"></param>
        /// <returns></returns>
        public Dictionary<string, object> GetResult(int wResultCode, Dictionary<string, object> wReturnObject)
        {
            return new Dictionary<string, object> { { RESULT_KEY, wResultCode }, { RESULT_RETURN, wReturnObject } };
        }
        /// <summary>
        /// 普通返回
        /// </summary>
        /// <param name="wResultCode"></param>
        /// <param name="wMsg"></param>
        /// <param name="wReturnObjectList">返回数组</param>
        /// <param name="wReturnObjectInfo">返回对象</param>
        /// <returns></returns>
        public Dictionary<string, object> GetResult(int wResultCode, string wMsg, object wReturnObjectList, object wReturnObjectInfo)
        {
            return GetResult(wResultCode, GetReturnObject(wMsg, wReturnObjectList, wReturnObjectInfo));
        }
        public Dictionary<string, object> SetResult(Dictionary<string, object> wResult, string wObjectName, object wObject)
        {
            if (wResult.ContainsKey(RESULT_RETURN))
            {
                ((Dictionary<string, object>)wResult[RESULT_RETURN])[wObjectName] = wObject;
            }

            return wResult;
        }


        /// <summary>
        /// 报错返回
        /// </summary>
        /// <param name="wResultCode"></param>
        /// <param name="wMsg"></param>
        /// <returns></returns>
        public Dictionary<string, object> GetResult(int wResultCode, string wMsg)
        {
            return GetResult(wResultCode, GetReturnObject(wMsg, null, null));
        }



        public Dictionary<string, object> GetInputDictionaryObject(HttpRequest wRequest)
        {
            Dictionary<string, object> wResult = new Dictionary<string, object>();

            StreamReader wStreamReader = new StreamReader(wRequest.Body);
            string wJson = wStreamReader.ReadToEndAsync().Result;
            wResult = JsonTool.JsonToObject<Dictionary<string, object>>(wJson);
            if (wResult != null)
                RemoveExtensionData(wResult);

            return wResult;
        }

        private void RemoveExtensionData(Dictionary<string, object> wInput)
        {
            if (wInput.ContainsKey("ExtensionData"))
                wInput.Remove("ExtensionData");

            foreach (string wKey in wInput.Keys)
            {
                if (wInput[wKey] == null)
                    continue;
                if (wInput[wKey] is Dictionary<string, object>)
                {
                    RemoveExtensionData((Dictionary<string, object>)wInput[wKey]);
                    continue;
                }

                if (wInput[wKey] is List<Dictionary<string, object>>)
                {
                    foreach (Dictionary<string, object> item in (List<Dictionary<string, object>>)wInput[wKey])
                    {
                        RemoveExtensionData(item);
                    }
                    continue;
                }
                if (wInput[wKey] is Dictionary<string, object>[])
                {
                    foreach (Dictionary<string, object> item in (Dictionary<string, object>[])wInput[wKey])
                    {
                        RemoveExtensionData(item);
                    }
                    continue;
                }
                if (wInput[wKey] is ArrayList)
                {
                    //
                    foreach (var item in (ArrayList)wInput[wKey])
                    {
                        if (item is Dictionary<string, object>)
                            RemoveExtensionData((Dictionary<string, object>)item);
                    }
                    continue;
                }
                if (wInput[wKey] is Array)
                {
                    //
                    foreach (var item in (Array)wInput[wKey])
                    {
                        if (item is Dictionary<string, object>)
                            RemoveExtensionData((Dictionary<string, object>)item);
                    }
                    continue;
                }

            }

        }



        public MemoryStream SetInputObject<T>(T wT)
        {
            string wJson = JsonTool.ObjectToJson(wT);

            byte[] wArray = Encoding.UTF8.GetBytes(wJson);

            MemoryStream wMemoryStream = new MemoryStream(wArray);

            return wMemoryStream;
        }



    }

    public class SessionContants
    {
        public static string TOKEN = "";

        public static string appSecret = "c5e330214fb33e2d80f14e3fc45ed214";

        public static string Key = "bl6L4gzCvFSQQseTTapubIFQiZOuc3g2suvwFdNoACz";

        public static string USER_INFO = "cadv_ao";

        public static string USER_PASSWORD = "cade_po";

        public static string SessionUser = "user_info";

        public static string Extension_Module_ID = "User_ModuleID";

        public static string CookieUser = "_user_info_";

        public static string CookieUserID = "_user_info_ct_";

    }

}