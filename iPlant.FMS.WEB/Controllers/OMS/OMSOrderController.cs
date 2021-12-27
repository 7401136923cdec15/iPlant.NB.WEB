using iPlant.Common.Tools;
using iPlant.FMS.Models;
using iPlant.SCADA.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web; 
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using iPlant.FMS.WEB;

namespace iPlant.FMS.WEB
{
    public class OMSOrderController : BaseController
    {

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(OMSOrderController));
        [HttpGet]
        public ActionResult All()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wLoginUser = this.GetSession();
                
                int wCommandID = StringUtils.parseInt(Request.QueryParamString("CommandID"));
                int wFactoryID = StringUtils.parseInt(Request.QueryParamString("FactoryID"));
                int wWorkShopID = StringUtils.parseInt(Request.QueryParamString("WorkShopID"));
                int wLineID = StringUtils.parseInt(Request.QueryParamString("LineID"));
                int wStationID = StringUtils.parseInt(Request.QueryParamString("StationID"));
                int wProductID = StringUtils.parseInt(Request.QueryParamString("ProductID"));
                int wCustomerID = StringUtils.parseInt(Request.QueryParamString("CustomerID"));
                int wTeamID = StringUtils.parseInt(Request.QueryParamString("TeamID"));
                String wPartNo = StringUtils.parseString(Request.QueryParamString("PartNo"));
                String wOrderNo = StringUtils.parseString(Request.QueryParamString("OrderNo"));

                DateTime wPreStartTime = StringUtils.parseDate(Request.QueryParamString("PreStartTime"));
                DateTime wPreEndTime = StringUtils.parseDate(Request.QueryParamString("PreEndTime"));
                DateTime wRelStartTime = StringUtils.parseDate(Request.QueryParamString("RelStartTime"));
                DateTime wRelEndTime = StringUtils.parseDate(Request.QueryParamString("RelEndTime"));
                List<int> wStatusList = StringUtils.parseIntList(Request.QueryParamString("StatusList"), ",");

                int wPageSize = StringUtils.parseInt(Request.QueryParamString("PageSize"));
                int wPageIndex = StringUtils.parseInt(Request.QueryParamString("PageIndex"));

                String wSort = StringUtils.parseString(Request.QueryParamString("Sort"));
                String wSortType = StringUtils.parseString(Request.QueryParamString("SortType"));

                ServiceResult<List<OMSOrder>> wServiceResult = ServiceInstance.mOMSService.OMS_SelectList(wLoginUser,
                          wCommandID, wFactoryID, wWorkShopID,
                 wLineID, wStationID, wProductID, wCustomerID, wTeamID, wPartNo,
                 wStatusList, wOrderNo, wPreStartTime, wPreEndTime, wRelStartTime,
                 wRelEndTime, Pagination.Create(wPageIndex, wPageSize, wSort, wSortType));

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




        public ActionResult StatusCount()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wLoginUser = this.GetSession();

                int wCommandID = StringUtils.parseInt(Request.QueryParamString("CommandID"));
                int wFactoryID = StringUtils.parseInt(Request.QueryParamString("FactoryID"));
                int wWorkShopID = StringUtils.parseInt(Request.QueryParamString("WorkShopID"));
                int wLineID = StringUtils.parseInt(Request.QueryParamString("LineID"));
                int wStationID = StringUtils.parseInt(Request.QueryParamString("StationID"));
                int wProductID = StringUtils.parseInt(Request.QueryParamString("ProductID"));
                int wCustomerID = StringUtils.parseInt(Request.QueryParamString("CustomerID"));
                int wTeamID = StringUtils.parseInt(Request.QueryParamString("TeamID"));
                String wPartNo = StringUtils.parseString(Request.QueryParamString("PartNo"));

                DateTime wPreStartTime = StringUtils.parseDate(Request.QueryParamString("PreStartTime"));
                DateTime wPreEndTime = StringUtils.parseDate(Request.QueryParamString("PreEndTime"));
                DateTime wRelStartTime = StringUtils.parseDate(Request.QueryParamString("RelStartTime"));
                DateTime wRelEndTime = StringUtils.parseDate(Request.QueryParamString("RelEndTime"));
                List<int> wStatusList = StringUtils.parseIntList(Request.QueryParamString("StatusList"), ",");

                String wOrderNo = StringUtils.parseString(Request.QueryParamString("OrderNo"));

                ServiceResult<Dictionary<String, int>> wServiceResult = ServiceInstance.mOMSService.OMS_SelectStatusCount(wLoginUser,
                          wCommandID, wFactoryID, wWorkShopID,
                 wLineID, wStationID, wProductID, wCustomerID, wTeamID, wPartNo, wStatusList,
                 wOrderNo, wPreStartTime, wPreEndTime, wRelStartTime,
                 wRelEndTime);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.Result, null);
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
        public ActionResult RFOrderList()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wLoginUser = this.GetSession();


                int wCustomerID = StringUtils.parseInt(Request.QueryParamString("CustomerID"));
                int wWorkShopID = StringUtils.parseInt(Request.QueryParamString("WorkShopID"));
                int wLineID = StringUtils.parseInt(Request.QueryParamString("LineID"));
                int wProductID = StringUtils.parseInt(Request.QueryParamString("ProductID"));
                String wPartNo = StringUtils.parseString(Request.QueryParamString("PartNo"));

                DateTime wStartTime = StringUtils.parseDate(Request.QueryParamString("StartTime"));
                DateTime wEndTime = StringUtils.parseDate(Request.QueryParamString("EndTime"));
                int wPageSize = StringUtils.parseInt(Request.QueryParamString("PageSize"));
                int wPageIndex = StringUtils.parseInt(Request.QueryParamString("PageIndex"));
                String wSort = StringUtils.parseString(Request.QueryParamString("Sort"));
                String wSortType = StringUtils.parseString(Request.QueryParamString("SortType"));

                ServiceResult<List<OMSOrder>> wServiceResult = ServiceInstance.mOMSService.OMS_SelectList_RF(wLoginUser, wCustomerID,
                    wWorkShopID, wLineID, wProductID, wPartNo, wStartTime, wEndTime, Pagination.Create(wPageIndex, wPageSize, wSort, wSortType));

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
        public ActionResult StatusAll()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                BMSEmployee wLoginUser = this.GetSession();


                List<int> wStatusList = StringUtils.parseIntList(Request.QueryParamString("StatusList"), ",");

                int wWorkShopID = StringUtils.parseInt(Request.QueryParamString("WorkShopID"));
                int wLineID = StringUtils.parseInt(Request.QueryParamString("LineID"));

                int wPageSize = StringUtils.parseInt(Request.QueryParamString("PageSize"));
                int wPageIndex = StringUtils.parseInt(Request.QueryParamString("PageIndex"));
                String wSort = StringUtils.parseString(Request.QueryParamString("Sort"));
                String wSortType = StringUtils.parseString(Request.QueryParamString("SortType"));
                ServiceResult<List<OMSOrder>> wServiceResult = ServiceInstance.mOMSService.OMS_QueryOrderByStatus(wLoginUser, wWorkShopID, wLineID,
                        wStatusList, Pagination.Create(wPageIndex, wPageSize, wSort, wSortType));

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.Result, wServiceResult.Get("PageCount"));
                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_IN);
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


                String wCode = StringUtils.parseString(Request.QueryParamString("Code"));

                ServiceResult<OMSOrder> wServiceResult = null;

                if (wID >= 0)
                {
                    wServiceResult = ServiceInstance.mOMSService.OMS_SelectOrderByID(wBMSEmployee, wID);
                }
                else if (StringUtils.isNotEmpty(wCode))
                {
                    wServiceResult = ServiceInstance.mOMSService.OMS_QueryOrderByNo(wBMSEmployee, wCode);

                }
                else
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }


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


        [HttpPost] 
        public ActionResult Update()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);
                BMSEmployee wLoginUser = this.GetSession();

                if (!wParam.ContainsKey("data"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                OMSOrder wOMSOrder = CloneTool.Clone<OMSOrder>(wParam["data"]);
                if (wOMSOrder == null)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                if (wOMSOrder.ID <= 0)
                {
                    wOMSOrder.CreatorID = wLoginUser.ID;
                    wOMSOrder.CreateTime = DateTime.Now;
                }
                else
                {
                    wOMSOrder.EditorID = wLoginUser.ID;
                    wOMSOrder.EditTime = DateTime.Now;
                }

                ServiceResult<Int32> wServiceResult = ServiceInstance.mOMSService.OMS_UpdateOrder(wLoginUser, wOMSOrder);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wOMSOrder);
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
        public ActionResult UpdateList()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);
                BMSEmployee wLoginUser = this.GetSession();

                if (!wParam.ContainsKey("data"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                List<OMSOrder> wOMSOrderList = CloneTool.CloneArray<OMSOrder>(wParam["data"]);
                if (wOMSOrderList == null || wOMSOrderList.Count <= 0)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }
                ServiceResult<Int32> wServiceResult = new ServiceResult<int>();
                foreach (OMSOrder wOMSOrder in wOMSOrderList)
                {
                    if (wOMSOrder.ID <= 0)
                    {
                        wOMSOrder.CreatorID = wLoginUser.ID;
                        wOMSOrder.CreateTime = DateTime.Now;
                    }
                    else
                    {
                        wOMSOrder.EditorID = wLoginUser.ID;
                        wOMSOrder.EditTime = DateTime.Now;
                    }

                    wServiceResult = ServiceInstance.mOMSService.OMS_UpdateOrder(wLoginUser, wOMSOrder);
                    if (StringUtils.isNotEmpty(wServiceResult.getFaultCode()))
                        break;
                }


                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wOMSOrderList);
                }
                else
                {
                    ServiceInstance.mOMSService.OMS_DeleteOrderList(wLoginUser, wOMSOrderList);
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
        public ActionResult CheckList()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);
                BMSEmployee wLoginUser = this.GetSession();

                if (!wParam.ContainsKey("data"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                List<OMSOrder> wOMSOrderList = CloneTool.CloneArray<OMSOrder>(wParam["data"]);
                if (wOMSOrderList == null || wOMSOrderList.Count <= 0)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }
                List<OMSOrder> wBadOrderList;

                ServiceResult<List<OMSOrder>> wServiceResult = ServiceInstance.mOMSService.OMS_JudgeOrderImport(wLoginUser,
                    wOMSOrderList,out wBadOrderList);
                   

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServiceResult.Result, wBadOrderList);
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
        public ActionResult Delete()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);
                BMSEmployee wLoginUser = this.GetSession();

                if (!wParam.ContainsKey("data"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                List<OMSOrder> wOMSOrderList = CloneTool.CloneArray<OMSOrder>(wParam["data"]);
                if (wOMSOrderList == null || wOMSOrderList.Count <= 0)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                ServiceResult<Int32> wServiceResult = ServiceInstance.mOMSService.OMS_DeleteOrderList(wLoginUser, wOMSOrderList);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "");
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
        public ActionResult Audit()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {

                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);
                BMSEmployee wLoginUser = this.GetSession();

                if (!wParam.ContainsKey("data"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                List<OMSOrder> wOMSOrderList = CloneTool.CloneArray<OMSOrder>(wParam["data"]);
                if (wOMSOrderList == null || wOMSOrderList.Count <= 0)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                ServiceResult<Int32> wServiceResult = ServiceInstance.mOMSService.OMS_AuditOrder(wLoginUser, wOMSOrderList);

                if (StringUtils.isEmpty(wServiceResult.getFaultCode()))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_SUC, "");
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
        public ActionResult SyncAll()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);
                BMSEmployee wLoginUser = this.GetSession();

                if (!wParam.ContainsKey("data"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                List<OMSOrder> wOMSOrderList = CloneTool.CloneArray<OMSOrder>(wParam["data"]);
                if (wOMSOrderList == null || wOMSOrderList.Count <= 0)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }
                

                ServiceResult<List<String>> wServerRst = ServiceInstance.mOMSService.OMS_SyncOrderList(wLoginUser, wOMSOrderList);

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
        public ActionResult StatusChange()
        {
            Dictionary<String, Object> wResult = new Dictionary<String, Object>();
            try
            {
                Dictionary<string, object> wParam = GetInputDictionaryObject(Request);
                BMSEmployee wLoginUser = this.GetSession();

                if (!wParam.ContainsKey("data"))
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }
                // 检查订单存在 存在且订单状态可以变更

                List<OMSOrder> wOMSOrderList = CloneTool.CloneArray<OMSOrder>(wParam["data"]);
                if (wOMSOrderList == null || wOMSOrderList.Count <= 0)
                {
                    wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
                    return Json(wResult);
                }

                ServiceResult<List<String>> wServerRst = ServiceInstance.mOMSService.OMS_SyncOrderChangeList(wLoginUser, wOMSOrderList);

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
