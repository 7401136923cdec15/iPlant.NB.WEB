
using iPlant.Common.Tools;

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using iPlant.NB.WEB.Utils;

namespace iPlant.NB.WEB.Controllers
{
    public class UploadController : BaseController
    {
        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(UploadController));
        [HttpPost]
        public IActionResult Submit(IFormFileCollection files)
        {
            Dictionary<string, object> wResult = new Dictionary<string, object>();
            string wMsg = "";

            try
            {
                if (files == null || files.Count <= 0)
                    files = Request.Form.Files;
                if (files.Count == 0)
                {
                    wMsg = "提示：没有要上传的文件！";
                    return Json(GetResult(RetCode.SERVER_CODE_ERR, wMsg, null, null));
                }

                string wFileNameUrl = "";
                string wPath = "";
                List<string> wPathList = new List<string>();

                string wProjectName = GetProjectName(Request);
                for (int i = 0; i < files.Count; i++)
                {
                    IFormFile wCurFile = files[i];
                    if (wCurFile != null && wCurFile.Length < 1)
                        continue;
                    //获取保存路径


                    string wFilesUrl = StringUtils.CombinePath(GlobalContext.WebRootPath, Constants.UPLOAD_SAVE_PATH);//全局配置读取

                    DateTime wDateTime = DateTime.Now;

                    wFilesUrl = StringUtils.CombinePath(wFilesUrl, wDateTime.ToString("yyyy/MM/dd/"));

                    if (Directory.Exists(wFilesUrl) == false)//路径不存在则创建  
                        Directory.CreateDirectory(wFilesUrl);


                    //获取文件名  
                    string wFileName = Path.GetFileName(wCurFile.FileName);
                    if (wFileName == null)
                        continue;
                    //文件后缀名   
                    //string wFilePostfixName = wFileName.Substring(wFileName.LastIndexOf('.'));


                    //if (wFilePostfixName != null)
                    //  wFilePostfixName = wFilePostfixName.ToLower();

                    //if (wFilePostfixName.StartsWith("."))
                    //wFilePostfixName = wFilePostfixName.Substring(1);

                    string wNewFileName = StringUtils.Format("{0}_{1}",
                    wDateTime.ToString("HHmmssfff"), wCurFile.FileName);

                    wFileNameUrl = StringUtils.CombinePath(Constants.UPLOAD_SAVE_PATH, wDateTime.ToString("yyyy/MM/dd/"), wNewFileName);


                    wPath = StringUtils.CombinePath(wFilesUrl, wNewFileName);
                    using (var fileStream = new FileStream(wPath, FileMode.Create))
                    {
                        wCurFile.CopyTo(fileStream);
                        fileStream.Flush();
                    }
                    //保存文件  

                    if (StringUtils.isEmpty(wFileNameUrl))
                    {
                        wResult = GetResult(RetCode.SERVER_CODE_ERR, "上传的文件不能为空!");
                        return Json(wResult);
                    }
                    wPathList.Add(StringUtils.CombinePath(wProjectName, wFileNameUrl));

                }
                if (wPathList == null || wPathList.Count <= 0)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, "上传的文件不能为空!");
                }
                else
                {
                    Dictionary<string, object> wResultObject = new Dictionary<string, object>();
                    wResultObject.Add("file_id", wPathList[0]);
                    wResultObject.Add("file_url", wPathList[0]);
                    wResultObject.Add("diskUrl", wPath);
                    wResultObject.Add("list", wPathList);
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, wResultObject);
                }
            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);

                wResult = GetResult(RetCode.SERVER_CODE_ERR, wMsg + "\n" + ex.ToString());
            }
            return Json(wResult);
        }

        [HttpGet]

        public ActionResult DownLoadFile()
        {
            Dictionary<string, object> wResult = new Dictionary<string, object>();
            try
            {

                string wFilePath = Request.QueryParamString("Path");
                string wFileName = Request.QueryParamString("FileName");

                string wProjectName = GetProjectName(Request);
                if (wFilePath.StartsWith(wProjectName))
                {
                    wFilePath = wFilePath.Substring(wProjectName.Length);
                }
                string wFilesUrl = "";
                if (Constants.UPLOAD_SAVE_PATH.IndexOf('/') == 0)
                {
                    wFilesUrl = Constants.UPLOAD_SAVE_PATH.Substring(1);
                }

                else
                {
                    wFilesUrl = Constants.UPLOAD_SAVE_PATH;
                }
                if (wFilePath.IndexOf("/") != 0)
                {
                    wFilePath = "/" + wFilePath;
                }

                wFilesUrl += wFilePath;

                if (System.IO.File.Exists(wFilesUrl) && StringUtils.isEmpty(wFileName))
                    wFileName = Path.GetFileName(wFilesUrl);


                return File(wFilesUrl, "text/plain", wFileName);
            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
                wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString());
            }
            return Json(wResult);
        }


        [HttpPost]
        public ActionResult ImportExcel(IFormFileCollection files)
        {
            Dictionary<string, object> wResult = new Dictionary<string, object>();
            string wMsg = "";
            try
            {
                if (files == null || files.Count <= 0)
                    files = Request.Form.Files;
                if (files.Count == 0)
                {
                    wMsg = "提示：没有要导入的Excel文件！";
                    return Json(GetResult(RetCode.SERVER_CODE_ERR, wMsg, null, null));
                }

                for (int i = 0; i < files.Count; i++)
                {
                    IFormFile wCurFile = files[i];

                    if (wCurFile == null && wCurFile.Length < 1)
                        continue;

                    //获取文件名  
                    string wFileName = Path.GetFileName(wCurFile.FileName);
                    if (wFileName == null)
                        continue;

                    List<Dictionary<string, object>> wReturnResult = ServerExcelUtils.Instance.Import(wCurFile.OpenReadStream(), wCurFile.FileName, out wMsg);

                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wReturnResult, null);
                    break;
                }
            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);

                wResult = GetResult(RetCode.SERVER_CODE_ERR, wMsg + "\n" + ex.ToString());
            }

            return Json(wResult);
        }
        [HttpPost]
        public ActionResult ExportExcel()
        {
            object wResult = new object();
            string wMsg = "";
            try
            {

                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);

                if (!wParam.ContainsKey("data") || !wParam.ContainsKey("head") || !wParam.ContainsKey("fileName"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }
                List<Dictionary<string, object>> wList = CloneTool.Clone<object, List<Dictionary<string, object>>>(wParam["data"]);

                Dictionary<string, string> wHeadList = CloneTool.Clone<object, Dictionary<string, string>>(wParam["head"]);

                string wTitle = wParam.ContainsKey("title") ? StringUtils.parseString(wParam["title"]) : "";

                string wFileName = StringUtils.parseString(wParam["fileName"]);

                List<string> wOrderList = wParam.ContainsKey("order") ? CloneTool.Clone<object, List<string>>(wParam["order"]) : new List<string>();

                string wPath = ServerExcelUtils.Instance.Export(GlobalContext.WebRootPath, StringUtils.CombinePath(Constants.UPLOAD_EXCEL_URL, DateTime.Now.ToString("yyyy/MM/dd")), wList, wHeadList, wTitle, wFileName, out wMsg, wOrderList);
                Dictionary<string, object> wInfo = new Dictionary<string, object>();


                wInfo.Add("path", StringUtils.CombinePath(GetProjectName(Request), wPath));

                wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wInfo);
            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);

                wMsg += "\n" + ex.ToString();
            }
            finally
            {
                if (!string.IsNullOrWhiteSpace(wMsg))
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wMsg);
            }
            return Json(wResult);
        }

    }
}