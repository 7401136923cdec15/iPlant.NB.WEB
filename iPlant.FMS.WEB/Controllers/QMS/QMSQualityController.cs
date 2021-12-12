using iPlant.Common.Tools;
using iPlant.FMS.Models;
using iPlant.SCADA.Service;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace iPlant.FMS.WEB
{
    public class QMSQualityController : BaseController
    {
        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(QMSQualityController));
        [HttpGet]
        public ActionResult GetSpotCheckRecord()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                String wOrderNo = StringUtils.parseString(Request.QueryParamString("OrderNo"));
                List<int> wProductIDList = StringUtils.parseIntList(Request.QueryParamString("ProductID"), ",");
                String wWorkpieceNo = StringUtils.parseString(Request.QueryParamString("WorkpieceNo"));
                String wSpotCheckResult = StringUtils.parseString(Request.QueryParamString("SpotCheckResult"));
                String wStartTime = StringUtils.parseString(Request.QueryParamString("StartTime"));
                String wEndTime = StringUtils.parseString(Request.QueryParamString("EndTime"));
                int wPageSize = StringUtils.parseInt(Request.QueryParamString("PageSize"));
                int wPageIndex = StringUtils.parseInt(Request.QueryParamString("PageIndex"));
                int wPaging = StringUtils.parseInt(Request.QueryParamString("Paging"));

                ServiceResult<List<QMSSpotCheckRecord>> wServiceResult = ServiceInstance.mQMSService.QMS_GetSpotCheckRecordList(wBMSEmployee, wOrderNo,
                 wProductIDList, wWorkpieceNo, wSpotCheckResult, wStartTime, wEndTime, wPageSize, wPageIndex, wPaging);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.Result, wServiceResult.Get("PageCount"));
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
        public ActionResult GetWorkpieceRepairRecord()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                String wOrderNo = StringUtils.parseString(Request.QueryParamString("OrderNo"));
                List<int> wProductIDList = StringUtils.parseIntList(Request.QueryParamString("ProductID"), ",");
                String wWorkpieceNo = StringUtils.parseString(Request.QueryParamString("WorkpieceNo"));
                String wStartTime = StringUtils.parseString(Request.QueryParamString("StartTime"));
                String wEndTime = StringUtils.parseString(Request.QueryParamString("EndTime"));
                int wPageSize = StringUtils.parseInt(Request.QueryParamString("PageSize"));
                int wPageIndex = StringUtils.parseInt(Request.QueryParamString("PageIndex"));
                int wPaging = StringUtils.parseInt(Request.QueryParamString("Paging"));

                ServiceResult<List<QMSWorkpieceRepairRecord>> wServiceResult = ServiceInstance.mQMSService.QMS_GetWorkpieceRepairRecordList(wBMSEmployee, wOrderNo,
                 wProductIDList, wWorkpieceNo, wStartTime, wEndTime, wPageSize, wPageIndex, wPaging);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.Result, wServiceResult.Get("PageCount"));
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
        public ActionResult GetWorkpieceCheckResult()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                String wOrderNo = StringUtils.parseString(Request.QueryParamString("OrderNo"));
                List<int> wProductIDList = StringUtils.parseIntList(Request.QueryParamString("ProductID"), ",");
                String wWorkpieceNo = StringUtils.parseString(Request.QueryParamString("WorkpieceNo"));
                String wStartTime = StringUtils.parseString(Request.QueryParamString("StartTime"));
                String wEndTime = StringUtils.parseString(Request.QueryParamString("EndTime"));
                int wPageSize = StringUtils.parseInt(Request.QueryParamString("PageSize"));
                int wPageIndex = StringUtils.parseInt(Request.QueryParamString("PageIndex"));
                int wPaging = StringUtils.parseInt(Request.QueryParamString("Paging"));

                ServiceResult<List<QMSWorkpieceCheckResult>> wServiceResult = ServiceInstance.mQMSService.QMS_GetWorkpieceCheckResultList(wBMSEmployee, wOrderNo,
                 wProductIDList, wWorkpieceNo, wStartTime, wEndTime, wPageSize, wPageIndex, wPaging);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.Result, wServiceResult.Get("PageCount"));
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
        public ActionResult GetWorkpieceQualityInfo()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                String wOrderNo = StringUtils.parseString(Request.QueryParamString("OrderNo"));
                List<int> wProductIDList = StringUtils.parseIntList(Request.QueryParamString("ProductID"), ",");
                String wWorkpieceNo = StringUtils.parseString(Request.QueryParamString("WorkpieceNo"));
                String wProcessStatus = StringUtils.parseString(Request.QueryParamString("ProcessStatus"));
                String wStartTime = StringUtils.parseString(Request.QueryParamString("StartTime"));
                String wEndTime = StringUtils.parseString(Request.QueryParamString("EndTime"));
                int wPageSize = StringUtils.parseInt(Request.QueryParamString("PageSize"));
                int wPageIndex = StringUtils.parseInt(Request.QueryParamString("PageIndex"));
                int wPaging = StringUtils.parseInt(Request.QueryParamString("Paging"));

                ServiceResult<List<QMSWorkpieceQualityInfo>> wServiceResult = ServiceInstance.mQMSService.QMS_GetWorkpieceQualityInfoList(wBMSEmployee, wOrderNo,
                 wProductIDList, wWorkpieceNo, wProcessStatus, wStartTime, wEndTime, wPageSize, wPageIndex, wPaging);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.Result, wServiceResult.Get("PageCount"));
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
        public ActionResult GetThreeDimensionalCheckResult()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wBMSEmployee = GetSession();

                int wWorkpieceID = StringUtils.parseInt(Request.QueryParamString("WorkpieceID"));
                int wPageSize = StringUtils.parseInt(Request.QueryParamString("PageSize"));
                int wPageIndex = StringUtils.parseInt(Request.QueryParamString("PageIndex"));
                int wPaging = StringUtils.parseInt(Request.QueryParamString("Paging"));

                ServiceResult<List<QMSThreeDimensionalCheckResult>> wServiceResult = ServiceInstance.mQMSService.QMS_GetThreeDimensionalCheckResultList(wBMSEmployee, wWorkpieceID, wPageSize, wPageIndex, wPaging);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.Result, wServiceResult.Get("PageCount"));
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
    }
}
