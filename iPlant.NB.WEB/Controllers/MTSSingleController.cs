
using iPlant.Common.Tools;

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using iPlant.NB.WEB.Models;
using iPlant.NB.WEB.Daos;

namespace iPlant.NB.WEB.Controllers
{
    public class MTSSingleController : BaseController
    {
        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(MTSSingleController));
        [HttpPost]
        public IActionResult AsyncCheckResult()
        {
            Dictionary<string, object> wResult = new Dictionary<string, object>();
            string wMsg = "";

            try
            {
                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);

                if (!wParam.ContainsKey("data"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                List<MTSSingleResult> wMTSSingleResultList = CloneTool.CloneArray<MTSSingleResult>(wParam["data"]);

                foreach (MTSSingleResult wMTSSingleResult in wMTSSingleResultList)
                {
                    //保存数据
                    MysqlDAO.Instance.SaveSingleInfo(wMTSSingleResult);

                    int wCurrentPartID = MysqlDAO.Instance.GetCurrentPartID(wMTSSingleResult.PackageNo);
                    if (wCurrentPartID != 3 && wCurrentPartID != 4)
                        continue;

                    int wProductID = 0;
                    string wSerialNumber = MysqlDAO.Instance.GetSerialNumber(wMTSSingleResult.PackageNo, out wProductID);

                    //计算真实静置时间
                    int wTimeStandardID = MysqlDAO.Instance.GetStandardID(wProductID, 5);
                    //根据序列号和标准ID查询值的ID和创建时间
                    int wValueID = 0;
                    DateTime wCreateTime = DateTime.Now;
                    MysqlDAO.Instance.GetCreateTime(wSerialNumber, wTimeStandardID, out wValueID, out wCreateTime);

                    //wMTSSingleResult.StatusTime = wMTSSingleResult.StatusTime.Substring(0, wMTSSingleResult.StatusTime.LastIndexOf(":"));

                    DateTime dt = DateTime.ParseExact(wMTSSingleResult.StatusTime, "yyyy-MM-dd HH:mm:ss", System.Globalization.CultureInfo.CurrentCulture);

                    double wHours = (dt - wCreateTime).TotalHours;
                    wHours = Math.Round(wHours, 2);
                    //更新静置时间
                    MysqlDAO.Instance.UpdateJZTime(wValueID, wHours);
                    //根据标准ID查询检测上下限制
                    double wLowerLimit = 0;
                    double wUpperLimit = 0;
                    MysqlDAO.Instance.GetLimitByID(wTimeStandardID, out wLowerLimit, out wUpperLimit);
                    bool wIsQaulity = true;
                    if (wLowerLimit != 0 || wUpperLimit != 0)
                    {
                        if (wHours >= wLowerLimit && wHours <= wUpperLimit)
                        {
                        }
                        else
                            wIsQaulity = false;
                    }
                    //更新主表
                    MysqlDAO.Instance.UpdateWithstandVoltageTest(wMTSSingleResult, wIsQaulity);
                    //更新子表
                    int wStandardID = MysqlDAO.Instance.GetStandardID(wProductID, 6);
                    if (!string.IsNullOrWhiteSpace(wSerialNumber) && wStandardID > 0)
                    {
                        MysqlDAO.Instance.DeleteItem(wSerialNumber, wStandardID);
                        MysqlDAO.Instance.InsertItem(wMTSSingleResult, wSerialNumber, wStandardID);
                    }
                }

                wResult = GetResult(RetCode.SERVER_CODE_SUC, wMsg, null, null);

            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);

                wResult = GetResult(RetCode.SERVER_CODE_ERR, wMsg + "\n" + ex.ToString());
            }
            return Json(wResult);
        }


        [HttpGet]
        public IActionResult Head()
        {
            Dictionary<string, object> wResult = new Dictionary<string, object>();
            string wMsg = "";

            try
            {
                wResult = GetResult(RetCode.SERVER_CODE_SUC, "");
            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);

                wResult = GetResult(RetCode.SERVER_CODE_ERR, wMsg + "\n" + ex.ToString());
            }
            return Json(wResult);
        }

    }
}