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
    public class DMSProcessRecordController : BaseController
    {

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(DMSProcessRecordController));
        [HttpGet]
        public ActionResult All()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                String wOrderNo = StringUtils.parseString(Request.QueryParamString("OrderNo"));
                int wOrderID = StringUtils.parseInt(Request.QueryParamString("OrderID"));
                String wDeviceNo = StringUtils.parseString(Request.QueryParamString("DeviceNo"));
                int wDeviceID = StringUtils.parseInt(Request.QueryParamString("DeviceID"));
                int wActive = StringUtils.parseInt(Request.QueryParamString("Active"));
                int wStatus = StringUtils.parseInt(Request.QueryParamString("Status"));
                DateTime wStartTime = StringUtils.parseDate(Request.QueryParamString("StartTime"));
                DateTime wEndTime = StringUtils.parseDate(Request.QueryParamString("EndTime"));
                int wPageSize = StringUtils.parseInt(Request.QueryParamString("PageSize"));
                int wPageIndex = StringUtils.parseInt(Request.QueryParamString("PageIndex"));

                ServiceResult<List<DMSProcessRecord>> wServiceResult = ServiceInstance.mDMSService.DMS_SelectProcessRecordList(wBMSEmployee, wOrderID, wOrderNo, wDeviceID, wDeviceNo,
                    wActive, wStatus, wStartTime, wEndTime, wPageSize, wPageIndex);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.getResult(), wServiceResult.Get("PageCount"));
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), wServiceResult.getResult(), null);
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
        public ActionResult Current()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {


                BMSEmployee wBMSEmployee = GetSession();

                String wDeviceNo = StringUtils.parseString(Request.QueryParamString("DeviceNo"));
                int wDeviceID = StringUtils.parseInt(Request.QueryParamString("DeviceID"));
                int wActive = StringUtils.parseInt(Request.QueryParamString("Active"));
                int wHasOrder = StringUtils.parseInt(Request.QueryParamString("HasOrder"));

                ServiceResult<List<DMSProcessRecord>> wServiceResult = ServiceInstance.mDMSService.DMS_CurrentProcessRecordList(wBMSEmployee, wDeviceID, wDeviceNo,
             wActive);

                if (StringUtils.isNotEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), wServiceResult.getResult(), null);
                    return Json(wResult);
                }
                List<OMSOrder> wOMSOrderList = null;
                if (wHasOrder > 0 && wServiceResult.getResult() != null && wServiceResult.getResult().Count > 0)
                {
                    
                    List<int> wOrderIDList = wServiceResult.getResult().Select(p => p.OrderID).Distinct().ToList();

                    ServiceResult<List<OMSOrder>>  wOrderServiceResult = ServiceInstance.mOMSService.OMS_SelectListByIDList(wBMSEmployee, wOrderIDList);

                    if (StringUtils.isNotEmpty(wOrderServiceResult.getFaultCode()))
                    {
                        wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), wServiceResult.getResult(), wOrderServiceResult.Result);
                        return Json(wResult);
                    }
                    wOMSOrderList = wOrderServiceResult.Result; 
                }
                wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.getResult(), wOMSOrderList);
            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
                wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
            }
            return Json(wResult);
        }
        [HttpGet]
        public ActionResult Info()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                int wRecordID = StringUtils.parseInt(Request.QueryParamString("RecordID"));

                ServiceResult<DMSProcessRecord> wServiceResult = ServiceInstance.mDMSService.DMS_SelectProcessRecord(wBMSEmployee, wRecordID);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wServiceResult.getResult());
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), null, wServiceResult.Result);
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
        public ActionResult ItemAll()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {


                BMSEmployee wBMSEmployee = GetSession();

                String wDeviceNo = StringUtils.parseString(Request.QueryParamString("DeviceNo"));
                int wDeviceID = StringUtils.parseInt(Request.QueryParamString("DeviceID"));
                int wRecordID = StringUtils.parseInt(Request.QueryParamString("RecordID"));
                String wParameterNo = StringUtils.parseString(Request.QueryParamString("ParameterNo"));
                int wParameterID = StringUtils.parseInt(Request.QueryParamString("ParameterID"));
                int wActive = StringUtils.parseInt(Request.QueryParamString("Active"));
                int wStatus = StringUtils.parseInt(Request.QueryParamString("Status"));
                DateTime wStartTime = StringUtils.parseDate(Request.QueryParamString("StartTime"));
                DateTime wEndTime = StringUtils.parseDate(Request.QueryParamString("EndTime"));

                ServiceResult<List<DMSProcessRecordItem>> wServiceResult = ServiceInstance.mDMSService.DMS_SelectProcessRecordItemList(wBMSEmployee, wDeviceID, wDeviceNo, wRecordID,

                wParameterID, wParameterNo, wActive, wStatus, wStartTime, wEndTime);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.getResult(), null);
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), wServiceResult.getResult(), null);
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
        public ActionResult UploadAll()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();
                 
                ServiceResult<List<DMSProcessRecord>> wServiceResult = ServiceInstance.mDMSService.DMS_SelectProcessRecordUploadList(wBMSEmployee);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.getResult(), null);
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), wServiceResult.getResult(), null);
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
        public ActionResult UploadStatus()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);
                
                BMSEmployee wBMSEmployee = GetSession();
                if (!wParam.ContainsKey("data")||!wParam.ContainsKey("UploadStatus"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }
                int wUploadStatus = StringUtils.parseInt(wParam["UploadStatus"]);
                List<Int32> wProcessRecordIDList = CloneTool.CloneArray<Int32>(wParam["data"]);
                ServiceResult<Int32> wServerRst = ServiceInstance.mDMSService.DMS_UpdateProcessRecordUploadStatus(wBMSEmployee, wProcessRecordIDList, wUploadStatus);
                // 直接插入
                if (StringUtils.isEmpty(wServerRst.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServerRst.getResult(), null);
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServerRst.getFaultCode(), wServerRst.getResult(), null);
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
        public ActionResult SyncProcessRecord()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);
                
                BMSEmployee wBMSEmployee = GetSession();
                if (!wParam.ContainsKey("data"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                List<DMSProcessRecord> wDMSProcessRecordList = CloneTool.CloneArray<DMSProcessRecord>(wParam["data"]);
                ServiceResult<List<String>> wServerRst = ServiceInstance.mDMSService.DMS_SyncProcessRecordList(wBMSEmployee, wDMSProcessRecordList);
                // 直接插入
                if (StringUtils.isEmpty(wServerRst.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServerRst.getResult(), null);
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServerRst.getFaultCode(), wServerRst.getResult(), null);
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
