﻿using iPlant.Common.Tools;
using iPlant.FMS.Models;
using iPlant.SCADA.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNetCore.Http;using Microsoft.AspNetCore.Mvc;
namespace iPlant.FMS.WEB
{
    public class DMSDeviceStatusController : BaseController
    {

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(DMSDeviceStatusController));
        [HttpGet]
        public ActionResult All()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                String wName = StringUtils.parseString(Request.QueryParamString("Name"));
                String wAssetNo = StringUtils.parseString(Request.QueryParamString("AssetNo"));
                int wDeviceType = StringUtils.parseInt(Request.QueryParamString("DeviceType"));
                int wModelID = StringUtils.parseInt(Request.QueryParamString("ModelID"));
                int wFactoryID = StringUtils.parseInt(Request.QueryParamString("FactoryID"));
                int wWorkShopID = StringUtils.parseInt(Request.QueryParamString("WorkShopID"));
                int wLineID = StringUtils.parseInt(Request.QueryParamString("LineID"));
                int wActive = StringUtils.parseInt(Request.QueryParamString("Active"));
                int wTeamID = StringUtils.parseInt(Request.QueryParamString("TeamID"));
                int wAreaID = StringUtils.parseInt(Request.QueryParamString("AreaID"));
                DateTime wStartTime = StringUtils.parseDate(Request.QueryParamString("StartTime"));
                DateTime wEndTime = StringUtils.parseDate(Request.QueryParamString("EndTime"));
                int wPageSize = StringUtils.parseInt(Request.QueryParamString("PageSize"));
                int wPageIndex = StringUtils.parseInt(Request.QueryParamString("PageIndex"));

                ServiceResult<List<DMSDeviceStatus>> wServiceResult = ServiceInstance.mDMSService.DMS_SelectDeviceStatusList(wBMSEmployee, wName,
                 wAssetNo, wDeviceType, wModelID, wFactoryID, wWorkShopID, wLineID, wAreaID, wTeamID,
                wActive, wStartTime, wEndTime, wPageSize, wPageIndex);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.getResult(),  wServiceResult.Get("PageCount"));
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

                int wDeviceID = StringUtils.parseInt(Request.QueryParamString("DeviceID"));
                String wDeviceNo = StringUtils.parseString(Request.QueryParamString("DeviceNo"));

                String wDeviceName = StringUtils.parseString(Request.QueryParamString("DeviceName"));
                String wAssetNo = StringUtils.parseString(Request.QueryParamString("AssetNo"));
                int wDeviceType = StringUtils.parseInt(Request.QueryParamString("DeviceType"));
                int wModelID = StringUtils.parseInt(Request.QueryParamString("ModelID"));
                int wFactoryID = StringUtils.parseInt(Request.QueryParamString("FactoryID"));
                int wWorkShopID = StringUtils.parseInt(Request.QueryParamString("WorkShopID"));
                int wLineID = StringUtils.parseInt(Request.QueryParamString("LineID"));
                int wTeamID = StringUtils.parseInt(Request.QueryParamString("TeamID"));
                int wAreaID = StringUtils.parseInt(Request.QueryParamString("AreaID"));
                int wStatus = StringUtils.parseInt(Request.QueryParamString("Status"));

                ServiceResult<List<DMSDeviceStatus>> wServiceResult = ServiceInstance.mDMSService.DMS_CurrentDeviceStatusList(wBMSEmployee,
                    wDeviceID, wDeviceNo, wDeviceName, wAssetNo, wDeviceType, wModelID, wFactoryID, wWorkShopID, wLineID, wAreaID, wTeamID,  wStatus);

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
        public ActionResult CurrentArea()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                //统计 区域的不同状态数量

                BMSEmployee wBMSEmployee = GetSession();

                String wName = StringUtils.parseString(Request.QueryParamString("Name"));
                String wAssetNo = StringUtils.parseString(Request.QueryParamString("AssetNo"));
                int wDeviceType = StringUtils.parseInt(Request.QueryParamString("DeviceType"));
                int wModelID = StringUtils.parseInt(Request.QueryParamString("ModelID"));
                int wFactoryID = StringUtils.parseInt(Request.QueryParamString("FactoryID"));
                int wWorkShopID = StringUtils.parseInt(Request.QueryParamString("WorkShopID"));
                int wLineID = StringUtils.parseInt(Request.QueryParamString("LineID"));
                int wTeamID = StringUtils.parseInt(Request.QueryParamString("TeamID"));
                int wAreaID = StringUtils.parseInt(Request.QueryParamString("AreaID"));
                int wStatus = StringUtils.parseInt(Request.QueryParamString("Status"));

                ServiceResult<List<DMSDeviceAreaStatus>> wServiceResult = ServiceInstance.mDMSService.DMS_CurrentDeviceStatusStatistics(wBMSEmployee, wName,
                 wAssetNo, wDeviceType, wModelID, wFactoryID, wWorkShopID, wLineID, wAreaID, wTeamID, wStatus);

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
        public ActionResult StatusTime()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                //统计 区域的不同状态数量

                BMSEmployee wBMSEmployee = GetSession();
                List<int> wIDList = StringUtils.parseIntList(Request.QueryParamString("DeviceIDList"), ",");
                String wDeviceNo = StringUtils.parseString(Request.QueryParamString("DeviceNo"));
                String AssetNo = StringUtils.parseString(Request.QueryParamString("AssetNo"));
                String wName = StringUtils.parseString(Request.QueryParamString("Name"));
                String wAssetNo = StringUtils.parseString(Request.QueryParamString("AssetNo"));
                int wDeviceType = StringUtils.parseInt(Request.QueryParamString("DeviceType"));
                int wModelID = StringUtils.parseInt(Request.QueryParamString("ModelID"));
                int wFactoryID = StringUtils.parseInt(Request.QueryParamString("FactoryID"));
                int wWorkShopID = StringUtils.parseInt(Request.QueryParamString("WorkShopID"));
                int wLineID = StringUtils.parseInt(Request.QueryParamString("LineID"));
                int wTeamID = StringUtils.parseInt(Request.QueryParamString("TeamID"));
                int wAreaID = StringUtils.parseInt(Request.QueryParamString("AreaID"));

                DateTime wStartTime = StringUtils.parseDate(Request.QueryParamString("StartTime"));
                DateTime wEndTime = StringUtils.parseDate(Request.QueryParamString("EndTime"));
                ServiceResult<Dictionary<int, Dictionary<String, int>>> wServiceResult = ServiceInstance.mDMSService.DMS_SelectDeviceStatusTime(wBMSEmployee, wIDList, wDeviceNo, wName,
                 wAssetNo, wDeviceType, wModelID, wFactoryID, wWorkShopID, wLineID, wAreaID, wTeamID, wStartTime, wEndTime);


                Dictionary<String, Dictionary<String, int>> wServiceRst = null;
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
        public ActionResult DeviceInfo()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                int wID = StringUtils.parseInt(Request.QueryParamString("DeviceID"));
                String wDeviceNo = StringUtils.parseString(Request.QueryParamString("DeviceNo"));
                String AssetNo = StringUtils.parseString(Request.QueryParamString("AssetNo"));

                DateTime wStartTime = StringUtils.parseDate(Request.QueryParamString("StartTime"));
                DateTime wEndTime = StringUtils.parseDate(Request.QueryParamString("EndTime"));

                int wPageSize = StringUtils.parseInt(Request.QueryParamString("PageSize"));
                int wPageIndex = StringUtils.parseInt(Request.QueryParamString("PageIndex"));

                ServiceResult<List<DMSDeviceStatus>> wServiceResult = ServiceInstance.mDMSService.DMS_SelectDeviceStatus(wBMSEmployee, wID,
                    wDeviceNo, AssetNo, wStartTime, wEndTime, wPageSize, wPageIndex);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.Result, wServiceResult.Get("PageCount"));
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), wServiceResult.Result, null);
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

                DateTime wStartTime = StringUtils.parseDate(Request.QueryParamString("StartTime"));
                DateTime wEndTime = StringUtils.parseDate(Request.QueryParamString("EndTime"));

                int wPageSize = StringUtils.parseInt(Request.QueryParamString("PageSize"));
                int wPageIndex = StringUtils.parseInt(Request.QueryParamString("PageIndex"));

                ServiceResult<List<DMSDeviceStatus>> wServiceResult = ServiceInstance.mDMSService.DMS_SelectDeviceStatusList(wBMSEmployee,
                    wIDList, wStartTime, wEndTime, wPageSize, wPageIndex);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.Result, wServiceResult.Get("PageCount"));
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), wServiceResult.Result, null);
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
        public ActionResult Statistics()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();


                int wDeviceID = StringUtils.parseInt(Request.QueryParamString("DeviceID"));
                String wDeviceNo = StringUtils.parseString(Request.QueryParamString("DeviceNo"));
                String wDeviceName = StringUtils.parseString(Request.QueryParamString("DeviceName"));
                String wAssetNo = StringUtils.parseString(Request.QueryParamString("AssetNo"));
                int wDeviceType = StringUtils.parseInt(Request.QueryParamString("DeviceType"));
                int wModelID = StringUtils.parseInt(Request.QueryParamString("ModelID"));
                int wFactoryID = StringUtils.parseInt(Request.QueryParamString("FactoryID"));
                int wWorkShopID = StringUtils.parseInt(Request.QueryParamString("WorkShopID"));
                int wLineID = StringUtils.parseInt(Request.QueryParamString("LineID"));
                int wTeamID = StringUtils.parseInt(Request.QueryParamString("TeamID"));
                int wAreaID = StringUtils.parseInt(Request.QueryParamString("AreaID"));
                DateTime wStartTime = StringUtils.parseDate(Request.QueryParamString("StartTime"));
                DateTime wEndTime = StringUtils.parseDate(Request.QueryParamString("EndTime"));
                int wStatus = StringUtils.parseInt(Request.QueryParamString("Status"));

                int wHasAlarm = StringUtils.parseInt(Request.QueryParamString("HasAlarm"));

                ServiceResult<List<DMSDeviceStatusStatistics>> wServiceResult = ServiceInstance.mDMSService.DMS_SelectDeviceStatusStatisticsList(wBMSEmployee, wDeviceID, wDeviceNo, wDeviceName,
                 wAssetNo, wDeviceType, wModelID, wFactoryID, wWorkShopID, wLineID, wAreaID, wTeamID, wStatus, wStartTime, wEndTime, wHasAlarm);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.getResult(), null);

                    SetResult(wResult, "Alarm", wServiceResult.Get("Alarm"));
                    SetResult(wResult, "Frequency", wServiceResult.Get("Frequency"));
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
        public ActionResult StatisticsTypeAll()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();



                List<int> wDeviceIDList = StringUtils.parseIntList(Request.QueryParamString("DeviceID"), ","); 
                int wStatType = StringUtils.parseInt(Request.QueryParamString("StatType")); 
                DateTime wStartTime = StringUtils.parseDate(Request.QueryParamString("StartTime"));
                DateTime wEndTime = StringUtils.parseDate(Request.QueryParamString("EndTime"));


                ServiceResult<List<DMSDeviceStatistics>> wServiceResult = ServiceInstance.mDMSService.DMS_SelectDeviceStatusDetailStatisticsTime(wBMSEmployee, wDeviceIDList , wStatType, wStartTime, wEndTime);

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
        public ActionResult DetailAll()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                String wName = StringUtils.parseString(Request.QueryParamString("Name"));
                String wAssetNo = StringUtils.parseString(Request.QueryParamString("AssetNo"));
                int wDeviceType = StringUtils.parseInt(Request.QueryParamString("DeviceType"));
                int wModelID = StringUtils.parseInt(Request.QueryParamString("ModelID"));
                int wFactoryID = StringUtils.parseInt(Request.QueryParamString("FactoryID"));
                int wWorkShopID = StringUtils.parseInt(Request.QueryParamString("WorkShopID"));
                int wLineID = StringUtils.parseInt(Request.QueryParamString("LineID"));
                int wStatus = StringUtils.parseInt(Request.QueryParamString("Status"));
                int wTeamID = StringUtils.parseInt(Request.QueryParamString("TeamID"));
                int wAreaID = StringUtils.parseInt(Request.QueryParamString("AreaID"));
                DateTime wStartTime = StringUtils.parseDate(Request.QueryParamString("StartTime"));
                DateTime wEndTime = StringUtils.parseDate(Request.QueryParamString("EndTime"));
                int wPageSize = StringUtils.parseInt(Request.QueryParamString("PageSize"));
                int wPageIndex = StringUtils.parseInt(Request.QueryParamString("PageIndex"));

                ServiceResult<List<DMSDeviceStatus>> wServiceResult = ServiceInstance.mDMSService.DMS_SelectDeviceStatusDetailList(wBMSEmployee, wName,
                 wAssetNo, wDeviceType, wModelID, wFactoryID, wWorkShopID, wLineID, wAreaID, wTeamID,
                wStatus, wStartTime, wEndTime, wPageSize, wPageIndex);

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
        public ActionResult DetailDeviceInfo()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                int wID = StringUtils.parseInt(Request.QueryParamString("DeviceID"));
                String wDeviceNo = StringUtils.parseString(Request.QueryParamString("DeviceNo"));
                String AssetNo = StringUtils.parseString(Request.QueryParamString("AssetNo"));

                int wStatus = StringUtils.parseInt(Request.QueryParamString("Status"));
                DateTime wStartTime = StringUtils.parseDate(Request.QueryParamString("StartTime"));
                DateTime wEndTime = StringUtils.parseDate(Request.QueryParamString("EndTime"));

                int wPageSize = StringUtils.parseInt(Request.QueryParamString("PageSize"));
                int wPageIndex = StringUtils.parseInt(Request.QueryParamString("PageIndex"));

                ServiceResult<List<DMSDeviceStatus>> wServiceResult = ServiceInstance.mDMSService.DMS_SelectDeviceStatusDetail(wBMSEmployee, wID,
                    wDeviceNo, AssetNo, wStatus, wStartTime, wEndTime, wPageSize, wPageIndex);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.Result, wServiceResult.Get("PageCount"));
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), wServiceResult.Result, null);
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
        public ActionResult DetailDeviceAll()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                List<int> wIDList = StringUtils.parseIntList(Request.QueryParamString("DeviceIDList"), ",");

                DateTime wStartTime = StringUtils.parseDate(Request.QueryParamString("StartTime"));
                DateTime wEndTime = StringUtils.parseDate(Request.QueryParamString("EndTime"));

                int wPageSize = StringUtils.parseInt(Request.QueryParamString("PageSize"));
                int wPageIndex = StringUtils.parseInt(Request.QueryParamString("PageIndex"));

                int wStatus = StringUtils.parseInt(Request.QueryParamString("Status"));
                ServiceResult<List<DMSDeviceStatus>> wServiceResult = ServiceInstance.mDMSService.DMS_SelectDeviceStatusDetailList(wBMSEmployee,
                    wIDList, wStatus, wStartTime, wEndTime, wPageSize, wPageIndex);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.Result, wServiceResult.Get("PageCount"));
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), wServiceResult.Result, null);
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
        public ActionResult SyncStatusCurrent()
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

                List<DMSDeviceStatus> wDMSDeviceStatusList = CloneTool.CloneArray<DMSDeviceStatus>(wParam["data"]);
                ServiceResult<List<String>> wServerRst = ServiceInstance.mDMSService.DMS_SyncDeviceStatusList(wBMSEmployee, wDMSDeviceStatusList);
                //数据库当前状态与数据当前状态对比 有变更则查询最后一条历史记录 与数据库当前状态对比 更新结束时间并添加变更历史记录 
                //数据库当前状态变更为当前状态

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
        public ActionResult SyncStatusHistory()
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

                List<DMSDeviceStatus> wDMSDeviceStatusList = CloneTool.CloneArray<DMSDeviceStatus>(wParam["data"]);
                ServiceResult<List<String>> wServerRst = ServiceInstance.mDMSService.DMS_SyncDeviceStatusHistoryList(wBMSEmployee, wDMSDeviceStatusList);
                

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
