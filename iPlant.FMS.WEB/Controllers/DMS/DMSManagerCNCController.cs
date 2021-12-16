using iPlant.Common.Tools;
using iPlant.FMS.Models;
using iPlant.SCADA.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNetCore.Http;using Microsoft.AspNetCore.Mvc;
namespace iPlant.FMS.WEB
{
    public class DMSManagerCNCController : BaseController
    {

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(DMSManagerCNCController));
        [HttpGet]
        public ActionResult ProgramAll()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                int wDeviceID = StringUtils.parseInt(Request.QueryParamString("DeviceID"));
                String wDeviceNo = StringUtils.parseString(Request.QueryParamString("DeviceNo"));
                String wAssetNo = StringUtils.parseString(Request.QueryParamString("AssetNo"));
                int wDeviceType = StringUtils.parseInt(Request.QueryParamString("DeviceType"));
                int wModelID = StringUtils.parseInt(Request.QueryParamString("ModelID"));
                int wFactoryID = StringUtils.parseInt(Request.QueryParamString("FactoryID"));
                int wWorkShopID = StringUtils.parseInt(Request.QueryParamString("WorkShopID"));
                int wLineID = StringUtils.parseInt(Request.QueryParamString("LineID")); 
                int wAreaID = StringUtils.parseInt(Request.QueryParamString("AreaID"));
                int wProductID = StringUtils.parseInt(Request.QueryParamString("ProductID"));
                String wProductNo = StringUtils.parseString(Request.QueryParamString("ProductNo"));
                int wPageIndex = StringUtils.parseInt(Request.QueryParamString("PageIndex"));
                int wPageSize = StringUtils.parseInt(Request.QueryParamString("PageSize"));



                ServiceResult<List<DMSProgramNC>> wServiceResult = ServiceInstance.mDMSService.DMS_GetProgramNCList(wBMSEmployee,  wDeviceID,  wDeviceNo,
                 wAssetNo,  wDeviceType,  wModelID,  wFactoryID,
                 wWorkShopID,  wLineID,  wAreaID,  wProductID,  wProductNo, Pagination.Create(wPageIndex, wPageSize));
                 
                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.getResult(), wServiceResult.Get("PageCount"));
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode());
                }
            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
                wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
            }
            return Json(wResult);
        }



        [HttpGet]
        public ActionResult ProgramRecordAll()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                int wDeviceID = StringUtils.parseInt(Request.QueryParamString("DeviceID"));
                String wDeviceNo = StringUtils.parseString(Request.QueryParamString("DeviceNo"));
                String wAssetNo = StringUtils.parseString(Request.QueryParamString("AssetNo"));
                int wDeviceType = StringUtils.parseInt(Request.QueryParamString("DeviceType"));
                int wModelID = StringUtils.parseInt(Request.QueryParamString("ModelID"));
                int wFactoryID = StringUtils.parseInt(Request.QueryParamString("FactoryID"));
                int wWorkShopID = StringUtils.parseInt(Request.QueryParamString("WorkShopID"));
                int wLineID = StringUtils.parseInt(Request.QueryParamString("LineID"));
                int wAreaID = StringUtils.parseInt(Request.QueryParamString("AreaID"));
                int wProductID = StringUtils.parseInt(Request.QueryParamString("ProductID"));
                String wProductNo = StringUtils.parseString(Request.QueryParamString("ProductNo"));
                int wEditorID = StringUtils.parseInt(Request.QueryParamString("EditorID"));
                int wRecordType = StringUtils.parseInt(Request.QueryParamString("RecordType"));
                DateTime wStarTime = StringUtils.parseDate(Request.QueryParamString("StarTime"));
                DateTime wEndTime = StringUtils.parseDate(Request.QueryParamString("EndTime"));
                int wPageIndex = StringUtils.parseInt(Request.QueryParamString("PageIndex"));
                int wPageSize = StringUtils.parseInt(Request.QueryParamString("PageSize"));



                ServiceResult<List<DMSProgramNCRecord>> wServiceResult = ServiceInstance.mDMSService.DMS_GetProgramNCRecordList(wBMSEmployee,  wDeviceID,  wDeviceNo,
                 wAssetNo,  wDeviceType,  wModelID,  wFactoryID,  wWorkShopID,  wLineID,  wAreaID,  wProductID,  wProductNo,
                 wEditorID,  wRecordType,  wStarTime,  wEndTime,   Pagination.Create(wPageIndex, wPageSize));
               

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.getResult(), wServiceResult.Get("PageCount"));
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode());
                }
            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
                wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
            }
            return Json(wResult);
        }


        [HttpPost]

        public ActionResult ProgramUpdate()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);

                BMSEmployee wBMSEmployee = GetSession();
                int wUserID = wBMSEmployee.ID;

                if (!wParam.ContainsKey("data"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                DMSProgramNCRecord wDMSProgramNCRecord = CloneTool.Clone<DMSProgramNCRecord>(wParam["data"]);
                 
                ServiceResult<Int32> wServiceResult = ServiceInstance.mDMSService.DMS_UpdateProgramNCRecordList(wBMSEmployee, wDMSProgramNCRecord);
                //下载 需要前端提交后 然后openurl
                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wDMSProgramNCRecord);
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), null, wDMSProgramNCRecord);
                }
            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
                wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
            }
            return Json(wResult);
        }


        

    }
}
