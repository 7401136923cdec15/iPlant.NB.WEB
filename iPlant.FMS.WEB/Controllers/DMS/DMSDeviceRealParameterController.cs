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
    public class DMSDeviceRealParameterController : BaseController
    {

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(DMSDeviceRealParameterController));
        [HttpGet]
        public ActionResult All()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                String wName = StringUtils.parseString(Request.QueryParamString("Name"));
                String wVariableName = StringUtils.parseString(Request.QueryParamString("VariableName"));
                int wDeviceID = StringUtils.parseInt(Request.QueryParamString("DeviceID"));
                int wAreaID = StringUtils.parseInt(Request.QueryParamString("AreaID"));
                String wDeviceNo = StringUtils.parseString(Request.QueryParamString("DeviceNo"));
                String wAssetNo = StringUtils.parseString(Request.QueryParamString("AssetNo"));
                String wDeviceName = StringUtils.parseString(Request.QueryParamString("DeviceName"));
                int wDataType = StringUtils.parseInt(Request.QueryParamString("DataType"));
                int wDataClass = StringUtils.parseInt(Request.QueryParamString("DataClass"));


                ServiceResult<List<DMSDeviceRealParameter>> wServiceResult = ServiceInstance.mDMSService.DMS_SelectDeviceRealParameterList(wBMSEmployee, wName, wVariableName,
                wAreaID, wDeviceID, wDeviceNo, wAssetNo, wDeviceName, wDataType, wDataClass);
                List<DMSDeviceRealParameter> wServerRst = wServiceResult.getResult();

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServerRst, null);
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), wServerRst, null);
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
        public ActionResult StructAll()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                String wName = StringUtils.parseString(Request.QueryParamString("Name"));
                String wVariableName = StringUtils.parseString(Request.QueryParamString("VariableName"));

                int wAreaID = StringUtils.parseInt(Request.QueryParamString("AreaID"));
                int wDeviceID = StringUtils.parseInt(Request.QueryParamString("DeviceID"));
                String wDeviceNo = StringUtils.parseString(Request.QueryParamString("DeviceNo"));
                String wAssetNo = StringUtils.parseString(Request.QueryParamString("AssetNo"));
                String wDeviceName = StringUtils.parseString(Request.QueryParamString("DeviceName"));
                int wDataType = StringUtils.parseInt(Request.QueryParamString("DataType"));
                int wDataClass = StringUtils.parseInt(Request.QueryParamString("DataClass"));


                ServiceResult<Dictionary<int, Dictionary<String, Object>>> wServiceResult = ServiceInstance.mDMSService.DMS_SelectDeviceRealParameterStructList(wBMSEmployee, wName, wVariableName,
                 wAreaID,wDeviceID, wDeviceNo, wAssetNo, wDeviceName, wDataType, wDataClass);
                Dictionary<String, Dictionary<String, Object>> wServiceRst = null;
                if (wServiceResult != null && wServiceResult.Result != null && wServiceResult.Result.Count > 0)
                    wServiceRst = wServiceResult.Result.ToDictionary(p => p.Key.ToString(), p => p.Value);


                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {

                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wServiceRst);
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), null, wServiceRst);
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
        public ActionResult DeviceCurrentAll()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                int wDeviceID = StringUtils.parseInt(Request.QueryParamString("DeviceID"));
                String wDeviceNo = StringUtils.parseString(Request.QueryParamString("DeviceNo"));
                String wAssetNo = StringUtils.parseString(Request.QueryParamString("AssetNo"));


                ServiceResult<Dictionary<String, Object>> wServiceResult = ServiceInstance.mDMSService.DMS_SelectDeviceCurrentStruct(wBMSEmployee,

                 wDeviceID, wDeviceNo, wAssetNo);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wServiceResult.Result);
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
        public ActionResult Info()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                int wID = StringUtils.parseInt(Request.QueryParamString("ID"));
                String wDeviceNo = StringUtils.parseString(Request.QueryParamString("DeviceNo"));



                ServiceResult<DMSDeviceRealParameter> wServiceResult = ServiceInstance.mDMSService.DMS_SelectDeviceRealParameter(wBMSEmployee, wID,
                    wDeviceNo);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wServiceResult.Result);
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
        public ActionResult DeviceAll()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                List<int> wIDList = StringUtils.parseIntList(Request.QueryParamString("DeviceIDList"), ",");



                ServiceResult<List<DMSDeviceRealParameter>> wServiceResult = ServiceInstance.mDMSService.DMS_SelectDeviceRealParameterList(wBMSEmployee,
                 wIDList);
                List<DMSDeviceRealParameter> wServerRst = wServiceResult.getResult();

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServerRst, null);
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), wServerRst, null);
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
        public ActionResult SyncRealParameter()
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

                List<DMSDeviceRealParameter> wDMSDeviceRealParameterList = CloneTool.CloneArray<DMSDeviceRealParameter>(wParam["data"]);
                ServiceResult<List<String>> wServerRst  = ServiceInstance.mDMSService.DMS_SyncDeviceRealParameterList(wBMSEmployee, wDMSDeviceRealParameterList);
                // 直接更新数据库值 没有则插入
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
