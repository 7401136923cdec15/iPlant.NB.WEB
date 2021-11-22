﻿using iPlant.Common.Tools;
using iPlant.Data.EF;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.SCADA.Service
{
    public class OMSOrderDAO : BaseDAO
    {

        private static readonly log4net.ILog logger = log4net.LogManager.GetLogger(typeof(OMSOrderDAO));
        private static OMSOrderDAO Instance = null;

        private OMSOrderDAO() : base()
        {

        }

        public static OMSOrderDAO getInstance()
        {
            if (Instance == null)
                Instance = new OMSOrderDAO();
            return Instance;
        }

        public OMSOrder OMS_CheckOrder(BMSEmployee wLoginUser, OMSOrder wOrder,
             OutResult<Int32> wErrorCode)
        {
            OMSOrder wOrderDB = new OMSOrder();
            wErrorCode.set(0);

            try
            {
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0)
                {
                    // Step0:查询
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = StringUtils.Format("Select ID,OrderNo from {0}.oms_order ", wInstance)
                                + " where ID!=@ID and OrderNo=@OrderNo";
                    wParms.Clear();
                    wParms.Add("ID", wOrder.ID);
                    wParms.Add("OrderNo", wOrder.OrderNo);

                    wSQLText = this.DMLChange(wSQLText);
                    List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
                    foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                    {
                        wOrderDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
                        wOrderDB.OrderNo = StringUtils.parseString(wSqlDataReader["OrderNo"]);
                    }

                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("OMS_CheckOrderByCode", ex);

            }
            return wOrderDB;
        }
        public void OMS_UpdateOrder(BMSEmployee wLoginUser, OMSOrder wOMSOrder, OutResult<Int32> wErrorCode)
        {

            try
            {
                if (wOMSOrder == null || StringUtils.isEmpty(wOMSOrder.PartNo) || StringUtils.isEmpty(wOMSOrder.WBSNo)
                    || wOMSOrder.StationID <= 0)
                {
                    wErrorCode.Result = MESException.Parameter.getValue();
                    return;
                }

                OMSOrder wOMSOrderDB = this.OMS_CheckOrder(wLoginUser, wOMSOrder, wErrorCode);
                if (wOMSOrderDB != null && wOMSOrderDB.ID > 0)
                {
                    wErrorCode.Result = MESException.Duplication.getValue();
                    return;
                }


                String wInstance = iPlant.Data.EF.MESDBSource.APS.getDBName();



                if (wOMSOrder.CommandID <= 0 && StringUtils.isNotEmpty(wOMSOrder.PartNo))
                {
                    OMSCommand wOMSCommand = OMSCommandDAO.getInstance().OMS_SelectCommandByPartNo(wLoginUser, wOMSOrder.PartNo, wErrorCode);

                    if (((Int32)wErrorCode.Result) != 0)
                    {
                        return;
                    }
                    if (wOMSCommand.ID <= 0)
                    {
                        wOMSCommand.WBSNo = wOMSOrder.PartNo;
                        wOMSCommand.PartNo = wOMSOrder.PartNo;
                        wOMSCommand.ProductID = wOMSOrder.ProductID;
                        wOMSCommand.WorkShopID = wOMSOrder.WorkShopID;
                        wOMSCommand.FactoryID = wOMSOrder.FactoryID;
                        wOMSCommand.CustomerID = wOMSOrder.CustomerID;
                        wOMSCommand.ContactCode = wOMSOrder.ContactCode;
                        wOMSCommand.LinkManID = wOMSOrder.LinkManID;
                        wOMSCommand.BusinessUnitID = wOMSOrder.BusinessUnitID;
                        OMSCommandDAO.getInstance().OMS_UpdateCommand(wLoginUser, wOMSCommand, wErrorCode);
                        if (((Int32)wErrorCode.Result) != 0)
                        {
                            return;
                        }
                        if (wOMSCommand.ID <= 0)
                        {
                            wErrorCode.Result = MESException.Exception.getValue();
                            return;
                        }

                    }
                    wOMSOrder.CommandID = wOMSCommand.ID;
                    //查找上层订单 
                    //没有就添加 有就直接返回

                }
                else
                {
                    OMSCommand wOMSCommand = OMSCommandDAO.getInstance().OMS_SelectCommandByID(wLoginUser, wOMSOrder.CommandID, wErrorCode);
                    wOMSCommand.WBSNo = wOMSOrder.WBSNo;
                    wOMSCommand.PartNo = wOMSOrder.PartNo;
                    wOMSCommand.ProductID = wOMSOrder.ProductID;
                    wOMSCommand.WorkShopID = wOMSOrder.WorkShopID;
                    wOMSCommand.FactoryID = wOMSOrder.FactoryID;
                    wOMSCommand.CustomerID = wOMSOrder.CustomerID;
                    wOMSCommand.ContactCode = wOMSOrder.ContactCode;
                    wOMSCommand.LinkManID = wOMSOrder.LinkManID;
                    wOMSCommand.BusinessUnitID = wOMSOrder.BusinessUnitID;
                    OMSCommandDAO.getInstance().OMS_UpdateCommand(wLoginUser, wOMSCommand, wErrorCode);
                    if (((Int32)wErrorCode.Result) != 0)
                    {
                        return;
                    }

                }


                if (wOMSOrder.ID <= 0 && StringUtils.isEmpty(wOMSOrder.OrderNo))
                    wOMSOrder.OrderNo = OMS_SelectSubOrderNo(wLoginUser, wOMSOrder.CommandID, wErrorCode);

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();


                wParamMap.Add("CommandID", wOMSOrder.CommandID);
                wParamMap.Add("ERPID", wOMSOrder.ERPID);
                if (StringUtils.isNotEmpty(wOMSOrder.OrderNo))
                    wParamMap.Add("OrderNo", wOMSOrder.OrderNo);
                wParamMap.Add("LineID", wOMSOrder.LineID);
                wParamMap.Add("Status", wOMSOrder.Status);
                wParamMap.Add("PlanReceiveDate", wOMSOrder.PlanReceiveDate);
                wParamMap.Add("PlanFinishDate", wOMSOrder.PlanFinishDate);
                wParamMap.Add("RealStartDate", wOMSOrder.RealStartDate);
                wParamMap.Add("RealFinishDate", wOMSOrder.RealFinishDate);
                wParamMap.Add("RealSendDate", wOMSOrder.RealSendDate);
                wParamMap.Add("Remark", wOMSOrder.Remark);
                wParamMap.Add("StationID", wOMSOrder.StationID);
                wParamMap.Add("TeamID", wOMSOrder.TeamID);
                wParamMap.Add("WorkerIDList", StringUtils.Join(",", wOMSOrder.WorkerIDList));
                wParamMap.Add("EditorID", wOMSOrder.EditorID);
                wParamMap.Add("EditTime", DateTime.Now);

                if (wOMSOrder.ID > 0)
                {
                    wParamMap.Add("ID", wOMSOrder.ID);

                    this.Update(StringUtils.Format("{0}.oms_order", wInstance), "ID", wParamMap);


                }
                else
                {
                    wParamMap.Add("CreatorID", wOMSOrder.CreatorID);
                    wParamMap.Add("CreateTime", DateTime.Now);

                    wOMSOrder.ID = this.Insert(StringUtils.Format("{0}.oms_order", wInstance), wParamMap);
                }

            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.getValue());
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
        }

        public void OMS_DeleteOrderList(BMSEmployee wLoginUser, List<OMSOrder> wList, OutResult<Int32> wErrorCode)
        {
            try
            {
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.APS.getDBName();
                if (((Int32)wErrorCode.Result) != 0)
                {
                    return;
                }

                if (wList == null || wList.Count <= 0)
                {
                    return;
                }
                List<Int32> wIDList = new List<Int32>();
                foreach (OMSOrder wItem in wList)
                {
                    if (wItem == null || wItem.ID <= 0)
                        continue;
                    wIDList.Add(wItem.ID);
                }
                if (wIDList.Count <= 0)
                {
                    return;
                }
                String wSql = StringUtils.Format("delete from {0}.oms_order WHERE ID IN({1}) and Status<=3 ;", wInstance,
                        StringUtils.Join(",", wIDList));
                ExecuteSqlTransaction(wSql);
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.getValue());
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
        }

        public OMSOrder OMS_SelectOrderByID(BMSEmployee wLoginUser, int wID, OutResult<Int32> wErrorCode)
        {
            OMSOrder wResult = new OMSOrder();
            try
            {

                DateTime wBaseTime = new DateTime(2000, 1, 1);
                OutResult<Int32> wPageCount = new OutResult<Int32>(1);
                List<OMSOrder> wList = OMS_SelectList(wLoginUser, wID, -1, "", -1, -1, -1, -1, -1, -1, -1, "", null, "",
                        wBaseTime, wBaseTime, wBaseTime, wBaseTime, 10, 0, wPageCount, wErrorCode);

                if (wList == null || wList.Count != 1)
                    return wResult;
                wResult = wList[0];
            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.getValue());
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public List<OMSOrder> OMS_SelectList(BMSEmployee wLoginUser, int wID, int wCommandID, String wOrderNo, int wFactoryID, int wWorkShopID,
                int wLineID, int wStationID, int wProductID, int wCustomerID, int wTeamID, String wPartNo,
                List<Int32> wStateIDList, String wOrderNoLike, DateTime wPreStartTime, DateTime wPreEndTime, DateTime wRelStartTime,
                DateTime wRelEndTime, int wPageSize, int wPageIndex, OutResult<Int32> wPageCount, OutResult<Int32> wErrorCode)
        {
            List<OMSOrder> wResultList = new List<OMSOrder>();
            try
            {
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result != 0)
                {
                    return wResultList;
                }

                if (wStateIDList == null)
                {
                    wStateIDList = new List<Int32>();
                }
                wStateIDList.RemoveAll(p => p < 0);

                DateTime wBaseTime = new DateTime(2000, 1, 1);
                if (wPreStartTime.CompareTo(wBaseTime) < 0)
                    wPreStartTime = wBaseTime;
                if (wPreEndTime.CompareTo(wBaseTime) < 0)
                    wPreEndTime = wBaseTime;
                if (wPreStartTime.CompareTo(wPreEndTime) > 0)
                {
                    return wResultList;
                }
                if (wRelStartTime.CompareTo(wBaseTime) < 0)
                    wRelStartTime = wBaseTime;
                if (wRelEndTime.CompareTo(wBaseTime) < 0)
                    wRelEndTime = wBaseTime;
                if (wRelStartTime.CompareTo(wRelEndTime) > 0)
                {
                    return wResultList;
                }

                if (wPartNo == null)
                    wPartNo = "";
                if (wOrderNo == null)
                    wOrderNo = "";

                String wSqlCondition = StringUtils.Format(" FROM {0}.oms_order t1"
                        + " left join {0}.oms_command t2 on t1.CommandID=t2.ID "
                        + " left join {0}.fmc_factory t7 on t2.FactoryID=t7.ID "
                        + " left join {0}.crm_customer t8 on t2.CustomerID=t8.ID "
                        + " left join {0}.fpc_product t9 on t2.ProductID=t9.ID "
                        + " left join {0}.fmc_workshop t3 on t2.WorkShopID=t3.ID "
                        + " left join {0}.fmc_line t4 on t1.LineID=t4.ID "
                        + " left join {0}.fmc_station t5 on t1.StationID=t5.ID "
                        + " left join {0}.bms_teammanage t6 on t1.TeamID=t6.ID "
                        + " WHERE  1=1  and ( @wID <= 0 or @wID = t1.ID ) "
                        + " and ( @wCommandID <= 0 or @wCommandID = t1.CommandID ) "
                        + " and ( @wOrderNo = '' or @wOrderNo = t1.OrderNo ) "
                        + " and ( @wOrderNoLike = '' or t1.OrderNo  like @wOrderNoLike  ) "
                        + " and ( @wCustomerID <= 0 or @wCustomerID = t2.CustomerID ) "
                        + " and ( @wFactoryID <= 0 or @wFactoryID = t2.FactoryID ) "
                        + " and ( @wWorkShopID <= 0 or @wWorkShopID = t2.WorkShopID ) "
                        + " and ( @wLineID <= 0 or @wLineID = t1.LineID ) "
                        + " and ( @wStationID <= 0 or @wStationID = t1.StationID ) "
                        + " and ( @wTeamID <= 0 or @wTeamID = t1.TeamID ) "
                        + " and ( @wProductID <= 0 or @wProductID = t2.ProductID ) "
                        + " and ( @wPartNo = '' or t2.PartNo like @wPartNo ) "
                        + " and ( @wStatus = '' or t1.Status in ({1})) "
                        + " and ( @wPreStartTime <= str_to_date('2010-01-01', '%Y-%m-%d') or t1.PlanFinishDate <= str_to_date('2010-01-01', '%Y-%m-%d') or @wPreStartTime <= t1.PlanFinishDate) "
                        + " and ( @wPreEndTime <= str_to_date('2010-01-01', '%Y-%m-%d') or t1.PlanReceiveDate <= str_to_date('2010-01-01', '%Y-%m-%d') or @wPreEndTime >= t1.PlanReceiveDate) "
                        + " and ( @wRelStartTime <= str_to_date('2010-01-01', '%Y-%m-%d') or t1.RealFinishDate <= str_to_date('2010-01-01', '%Y-%m-%d') or @wRelStartTime <= t1.RealFinishDate) "
                        + " and ( @wRelEndTime <= str_to_date('2010-01-01', '%Y-%m-%d') or t1.RealStartDate <= str_to_date('2010-01-01', '%Y-%m-%d') or @wRelEndTime >= t1.RealStartDate) ", wInstance,
                        (wStateIDList.Count > 0) ? StringUtils.Join(",", wStateIDList) : "0");


                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("wID", wID);
                wParamMap.Add("wCommandID", wCommandID);
                wParamMap.Add("wCustomerID", wCustomerID);
                wParamMap.Add("wOrderNo", wOrderNo);
                wParamMap.Add("wOrderNoLike", StringUtils.isNotEmpty(wOrderNoLike) ? "%" + wOrderNoLike + "%" : "");
                wParamMap.Add("wFactoryID", wFactoryID);
                wParamMap.Add("wWorkShopID", wWorkShopID);
                wParamMap.Add("wLineID", wLineID);
                wParamMap.Add("wStationID", wStationID);
                wParamMap.Add("wTeamID", wTeamID);
                wParamMap.Add("wProductID", wProductID);
                wParamMap.Add("wPartNo", StringUtils.isNotEmpty(wPartNo) ? "%" + wPartNo + "%" : "");
                wParamMap.Add("wPreStartTime", wPreStartTime);
                wParamMap.Add("wPreEndTime", wPreEndTime);
                wParamMap.Add("wRelStartTime", wRelStartTime);
                wParamMap.Add("wRelEndTime", wRelEndTime);
                wParamMap.Add("wStatus", StringUtils.Join(",", wStateIDList));

                wPageCount.Result = this.GetPageCount(wSqlCondition, wPageSize, wParamMap);
                if (wPageCount.Result <= 0)
                {
                    wPageCount.Result = 1;

                    return wResultList;
                }


                String wSQL = "SELECT t1.*,t2.WBSNo,t2.CustomerID,t2.ContactCode,t2.PartNo,"
                        + " t2.LinkManID,t2.FactoryID,t2.BusinessUnitID,t2.WorkShopID,t3.Name as  WorkShopName,"
                        + " t7.Name as Factory,t8.CustomerName as Customer,t4.Name as LineName ,t2.ProductID,"
                        + " t9.ProductNo,t5.Name as StationName,t5.Code as StationNo,t6.Name as TeamName,"
                        + " t6.Code as TeamNo,t5.WorkName  "
                        + wSqlCondition + StringUtils.Format("order by CreateTime desc limit {0},{1};", wPageIndex * wPageSize, wPageSize);
                wSQL = this.DMLChange(wSQL);


                List<Dictionary<String, Object>> wQueryResult = this.mDBPool.queryForList(wSQL, wParamMap);

                SetValue(wLoginUser, wResultList, wQueryResult, wErrorCode);
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.getValue());
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResultList;
        }


        public Dictionary<String, int> OMS_SelectStatusCount(BMSEmployee wLoginUser, int wCommandID, int wFactoryID, int wWorkShopID,
                int wLineID, int wStationID, int wProductID, int wCustomerID, int wTeamID, String wPartNo,
                List<Int32> wStateIDList, String wOrderNoLike, DateTime wPreStartTime, DateTime wPreEndTime, DateTime wRelStartTime,
                DateTime wRelEndTime, OutResult<Int32> wErrorCode)
        {
            Dictionary<String, int> wResultList = new Dictionary<String, int>();
            try
            {
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result != 0)
                {
                    return wResultList;
                }

                if (wStateIDList == null)
                {
                    wStateIDList = new List<Int32>();
                }
                wStateIDList.RemoveAll(p => p < 0);

                DateTime wBaseTime = new DateTime(2000, 1, 1);
                if (wPreStartTime.CompareTo(wBaseTime) < 0)
                    wPreStartTime = wBaseTime;
                if (wPreEndTime.CompareTo(wBaseTime) < 0)
                    wPreEndTime = wBaseTime;
                if (wPreStartTime.CompareTo(wPreEndTime) > 0)
                {
                    return wResultList;
                }
                if (wRelStartTime.CompareTo(wBaseTime) < 0)
                    wRelStartTime = wBaseTime;
                if (wRelEndTime.CompareTo(wBaseTime) < 0)
                    wRelEndTime = wBaseTime;
                if (wRelStartTime.CompareTo(wRelEndTime) > 0)
                {
                    return wResultList;
                }

                if (wPartNo == null)
                    wPartNo = "";
                String wSQL = StringUtils.Format("SELECT count(t1.ID) as StatusCount , count(t1.Status=0 or null) as Status0 ,"
                        + " count(t1.Status=1 or null) as Status1, count(t1.Status=2 or null) as Status2,"
                        + " count(t1.Status=3 or null) as Status3, count(t1.Status=4 or null) as Status4,"
                        + " count(t1.Status=5 or null) as Status5, count(t1.Status=6 or null) as Status6,"
                        + " count(t1.Status=7 or null) as Status7, count(t1.Status=8 or null) as Status8,"
                        + " count(t1.Status=9 or null) as Status9, count( (t1.Status not in (5,6,7,8,9) and  t1.PlanFinishDate > now())" +
                        "  or (t1.Status in (5,6,7,8) and  t1.PlanFinishDate > t1.RealFinishDate) or null ) as Status10  FROM {0}.oms_order t1"
                        + " left join {0}.oms_command t2 on t1.CommandID=t2.ID "
                        + " left join {0}.fmc_factory t7 on t2.FactoryID=t7.ID "
                        + " left join {0}.crm_customer t8 on t2.CustomerID=t8.ID "
                        + " left join {0}.fpc_product t9 on t2.ProductID=t9.ID "
                        + " left join {0}.fmc_workshop t3 on t2.WorkShopID=t3.ID "
                        + " left join {0}.fmc_line t4 on t1.LineID=t4.ID "
                        + " left join {0}.fmc_station t5 on t1.StationID=t5.ID "
                        + " left join {0}.bms_teammanage t6 on t1.TeamID=t6.ID "
                        + " WHERE  1=1  and   ( @wCommandID <= 0 or @wCommandID = t1.CommandID ) "

                        + " and ( @wOrderNoLike = '' or t1.OrderNo  like @wOrderNoLike  ) "
                        + " and ( @wCustomerID <= 0 or @wCustomerID = t2.CustomerID ) "
                        + " and ( @wFactoryID <= 0 or @wFactoryID = t2.FactoryID ) "
                        + " and ( @wWorkShopID <= 0 or @wWorkShopID = t2.WorkShopID ) "
                        + " and ( @wLineID <= 0 or @wLineID = t1.LineID ) "
                        + " and ( @wStationID <= 0 or @wStationID = t1.StationID ) "
                        + " and ( @wTeamID <= 0 or @wTeamID = t1.TeamID ) "
                        + " and ( @wProductID <= 0 or @wProductID = t2.ProductID ) "
                        + " and ( @wPartNo = '' or t2.PartNo like @wPartNo ) "
                        + " and ( @wStatus = '' or t1.Status in ({1})) "
                        + " and ( @wPreStartTime <= str_to_date('2010-01-01', '%Y-%m-%d') or t1.PlanFinishDate <= str_to_date('2010-01-01', '%Y-%m-%d') or @wPreStartTime <= t1.PlanFinishDate) "
                        + " and ( @wPreEndTime <= str_to_date('2010-01-01', '%Y-%m-%d') or t1.PlanReceiveDate <= str_to_date('2010-01-01', '%Y-%m-%d') or @wPreEndTime >= t1.PlanReceiveDate) "
                        + " and ( @wRelStartTime <= str_to_date('2010-01-01', '%Y-%m-%d') or t1.RealFinishDate <= str_to_date('2010-01-01', '%Y-%m-%d') or @wRelStartTime <= t1.RealFinishDate) "
                        + " and ( @wRelEndTime <= str_to_date('2010-01-01', '%Y-%m-%d') or t1.RealStartDate <= str_to_date('2010-01-01', '%Y-%m-%d') or @wRelEndTime >= t1.RealStartDate) ;", wInstance,
                        (wStateIDList.Count > 0) ? StringUtils.Join(",", wStateIDList) : "0");
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("wCommandID", wCommandID);
                wParamMap.Add("wCustomerID", wCustomerID);
                wParamMap.Add("wOrderNoLike", StringUtils.isNotEmpty(wOrderNoLike) ? "%" + wOrderNoLike + "%" : "");
                wParamMap.Add("wFactoryID", wFactoryID);
                wParamMap.Add("wWorkShopID", wWorkShopID);
                wParamMap.Add("wLineID", wLineID);
                wParamMap.Add("wStationID", wStationID);
                wParamMap.Add("wTeamID", wTeamID);
                wParamMap.Add("wProductID", wProductID);
                wParamMap.Add("wPartNo", StringUtils.isNotEmpty(wPartNo) ? "%" + wPartNo + "%" : "");
                wParamMap.Add("wPreStartTime", wPreStartTime);
                wParamMap.Add("wPreEndTime", wPreEndTime);
                wParamMap.Add("wRelStartTime", wRelStartTime);
                wParamMap.Add("wRelEndTime", wRelEndTime);
                wParamMap.Add("wStatus", StringUtils.Join(",", wStateIDList));

                wSQL = DMLChange(wSQL);

                List<Dictionary<String, Object>> wQueryResult = this.mDBPool.queryForList(wSQL, wParamMap);

                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    wResultList.Add("-1", StringUtils.parseInt(wReader["StatusCount"]));
                    wResultList.Add("0", StringUtils.parseInt(wReader["Status0"]));
                    wResultList.Add("1", StringUtils.parseInt(wReader["Status1"]));
                    wResultList.Add("2", StringUtils.parseInt(wReader["Status2"]));
                    wResultList.Add("3", StringUtils.parseInt(wReader["Status3"]));
                    wResultList.Add("4", StringUtils.parseInt(wReader["Status4"]));
                    wResultList.Add("5", StringUtils.parseInt(wReader["Status5"]));
                    wResultList.Add("6", StringUtils.parseInt(wReader["Status6"]));
                    wResultList.Add("7", StringUtils.parseInt(wReader["Status7"]));
                    wResultList.Add("8", StringUtils.parseInt(wReader["Status8"]));
                    wResultList.Add("9", StringUtils.parseInt(wReader["Status9"]));
                    wResultList.Add("10", StringUtils.parseInt(wReader["Status10"]));
                }


            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.getValue());
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResultList;
        }

        public List<OMSOrder> OMS_QueryOrderByStatus(BMSEmployee wLoginUser, int wWorkShopID, int wLineID, List<Int32> wStateIDList, int wPageSize, int wPageIndex, OutResult<Int32> wPageCount,
                OutResult<Int32> wErrorCode)
        {
            List<OMSOrder> wResult = new List<OMSOrder>();
            try
            {

                DateTime wBaseTime = new DateTime(2000, 1, 1);


                wResult = OMS_SelectList(wLoginUser, -1, -1, "", -1, wWorkShopID, wLineID, -1, -1, -1, -1, "", wStateIDList, "",
                        wBaseTime, wBaseTime, wBaseTime, wBaseTime, wPageSize, wPageIndex, wPageCount, wErrorCode);

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.getValue());
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public OMSOrder OMS_QueryOrderByNo(BMSEmployee wLoginUser, String wOrderNo, OutResult<Int32> wErrorCode)
        {
            OMSOrder wResult = new OMSOrder();
            try
            {
                wErrorCode.set(0);
                DateTime wBaseTime = new DateTime(2000, 1, 1);

                OutResult<Int32> wPageCount = new OutResult<Int32>(1);
                List<OMSOrder> wList = OMS_SelectList(wLoginUser, -1, -1, wOrderNo, -1, -1, -1, -1, -1, -1, -1, "", null, "",
                       wBaseTime, wBaseTime, wBaseTime, wBaseTime, 10, 0, wPageCount, wErrorCode);
                if (wList == null || wList.Count != 1)
                    return wResult;
                wResult = wList[0];
            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.getValue());
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        private List<Dictionary<String, Object>> OMS_SelectListByOrderNoList(BMSEmployee wLoginUser, List<String> wOrderNoList,
                OutResult<Int32> wErrorCode)
        {
            List<Dictionary<String, Object>> wResultList = new List<Dictionary<String, Object>>();
            try
            {
                if (wOrderNoList == null)
                {
                    wOrderNoList = new List<String>();
                }
                wOrderNoList.RemoveAll(p => StringUtils.isEmpty(p));

                if (wOrderNoList.Count <= 0)
                {
                    return wResultList;
                }

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.APS.getDBName();
                if (wErrorCode.Result != 0)
                {
                    return wResultList;
                }



                String wSQL = StringUtils.Format("SELECT t1.*,t2.WBSNo,t2.CustomerID,t2.ContactCode,t2.PartNo,"
                        + " t2.LinkManID,t2.FactoryID,t2.BusinessUnitID,t2.WorkShopID,t3.Name as  WorkShopName,"
                        + " t7.Name as Factory,t8.CustomerName as Customer,t4.Name as LineName ,t2.ProductID,"
                        + " t9.ProductNo,t5.Name as StationName,t5.Code as StationNo,t6.Name as TeamName,"
                        + " t6.Code as TeamNo,t5.WorkName   FROM {0}.oms_order t1"
                        + " left join {0}.oms_command t2 on t1.CommandID=t2.ID "
                        + " left join {0}.fmc_factory t7 on t2.FactoryID=t7.ID "
                        + " left join {0}.crm_customer t8 on t2.CustomerID=t8.ID "
                        + " left join {0}.fpc_product t9 on t2.ProductID=t9.ID "
                        + " left join {0}.fmc_workshop t3 on t2.WorkShopID=t3.ID "
                        + " left join {0}.fmc_line t4 on t1.LineID=t4.ID "
                        + " left join {0}.fmc_station t5 on t1.StationID=t5.ID "
                        + " left join {0}.bms_teammanage t6 on t1.TeamID=t6.ID "
                                + " WHERE 1=1  and (  @wOrderNo = '' or t1.OrderNo in ('{1}'));",

                        wInstance,
                        (wOrderNoList.Count > 0) ? StringUtils.Join("','", wOrderNoList) : "0");
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("wOrderNo", StringUtils.Join("','", wOrderNoList));

                wSQL = DMLChange(wSQL);

                wResultList = this.mDBPool.queryForList(wSQL, wParamMap);

            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.getValue());
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResultList;
        }

        public List<OMSOrder> OMS_SelectOrderListByOrderNoList(BMSEmployee wLoginUser, List<String> wOrderNoList,
              OutResult<Int32> wErrorCode)
        {
            List<OMSOrder> wResultList = new List<OMSOrder>();
            try
            {
                if (wOrderNoList == null)
                {
                    wOrderNoList = new List<String>();
                }
                wOrderNoList.RemoveAll(p => StringUtils.isEmpty(p));

                if (wOrderNoList.Count <= 0)
                {
                    return wResultList;
                }


                List<Dictionary<String, Object>> wQueryResult = new List<Dictionary<string, object>>();
                List<String> wSelectList = new List<String>();
                for (int i = 0; i < wOrderNoList.Count; i++)
                {
                    wSelectList.Add(wOrderNoList[i]);
                    if (i % 25 == 0)
                    {
                        wQueryResult.AddRange(this.OMS_SelectListByOrderNoList(wLoginUser, wSelectList, wErrorCode));

                        wSelectList.Clear();

                        if (wErrorCode.Result != 0)
                            break;
                    }
                    if (i == wOrderNoList.Count - 1)
                    {
                        if (wSelectList.Count > 0)
                            wQueryResult.AddRange(this.OMS_SelectListByOrderNoList(wLoginUser, wSelectList, wErrorCode));
                        break;
                    }
                }
                if (wErrorCode.Result != 0)
                {
                    return wResultList;
                }

                SetValue(wLoginUser, wResultList, wQueryResult, wErrorCode);
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.getValue());
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResultList;
        }

        public List<OMSOrder> OMS_SelectListByPartNoList(BMSEmployee wLoginUser, List<String> wPartNoList, List<Int32> wStationIDList,
              OutResult<Int32> wErrorCode)
        {
            List<OMSOrder> wResultList = new List<OMSOrder>();
            try
            {
                if (wPartNoList == null)
                {
                    wPartNoList = new List<String>();
                }
                wPartNoList.RemoveAll(p => StringUtils.isEmpty(p));

                if (wPartNoList.Count <= 0)
                {
                    return wResultList;
                }
                if (wStationIDList == null)
                {
                    wStationIDList = new List<Int32>();
                }
                wStationIDList.RemoveAll(p => p <= 0);

                if (wStationIDList.Count <= 0)
                {
                    return wResultList;
                }

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.APS.getDBName();
                if (wErrorCode.Result != 0)
                {
                    return wResultList;
                }



                String wSQL = StringUtils.Format("SELECT t1.*,t2.WBSNo,t2.CustomerID,t2.ContactCode,t2.PartNo,"
                        + " t2.LinkManID,t2.FactoryID,t2.BusinessUnitID,t2.WorkShopID,t3.Name as  WorkShopName,"
                        + " t7.Name as Factory,t8.CustomerName as Customer,t4.Name as LineName ,t2.ProductID,"
                        + " t9.ProductNo,t5.Name as StationName,t5.Code as StationNo,t6.Name as TeamName,"
                        + " t6.Code as TeamNo,t5.WorkName   FROM {0}.oms_order t1"
                        + " left join {0}.oms_command t2 on t1.CommandID=t2.ID "
                        + " left join {0}.fmc_factory t7 on t2.FactoryID=t7.ID "
                        + " left join {0}.crm_customer t8 on t2.CustomerID=t8.ID "
                        + " left join {0}.fpc_product t9 on t2.ProductID=t9.ID "
                        + " left join {0}.fmc_workshop t3 on t2.WorkShopID=t3.ID "
                        + " left join {0}.fmc_line t4 on t1.LineID=t4.ID "
                        + " left join {0}.fmc_station t5 on t1.StationID=t5.ID "
                        + " left join {0}.bms_teammanage t6 on t1.TeamID=t6.ID "
                                + " WHERE 1=1  AND t2.PartNo in ('{1}')" +
                                " and t1.StationID in ({2}) ;",

                        wInstance, StringUtils.Join("','", wPartNoList), StringUtils.Join(",", wStationIDList));
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();


                wSQL = DMLChange(wSQL);

                List<Dictionary<String, Object>> wQueryResult = this.mDBPool.queryForList(wSQL, wParamMap);

                SetValue(wLoginUser, wResultList, wQueryResult, wErrorCode);

                wResultList = wResultList.OrderByDescending(p => p.CreateTime).GroupBy(p => p.PartNo).ToDictionary(p => p.Key, p => p.First()).Values.ToList();

            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.getValue());
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResultList;
        }



        private List<Dictionary<String, Object>> OMS_SelectListByIDList(BMSEmployee wLoginUser, List<Int32> wIDList,
            OutResult<Int32> wErrorCode)
        {

            List<Dictionary<String, Object>> wResultList = new List<Dictionary<String, Object>>();
            try
            {
                wErrorCode.set(0);
                if (wIDList == null || wIDList.Count <= 0)
                {
                    return wResultList;
                }

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.APS.getDBName();
                if (wErrorCode.Result != 0)
                {
                    return wResultList;
                }
                String wSQL = StringUtils.Format("SELECT t1.*,t2.WBSNo,t2.CustomerID,t2.ContactCode,t2.PartNo,"
                        + " t2.LinkManID,t2.FactoryID,t2.BusinessUnitID,t2.WorkShopID,t3.Name as  WorkShopName,"
                        + " t7.Name as Factory,t8.CustomerName as Customer,t4.Name as LineName ,t2.ProductID,"
                        + " t9.ProductNo,t5.Name as StationName,t5.Code as StationNo,t6.Name as TeamName,"
                        + " t6.Code as TeamNo,t5.WorkName   FROM {0}.oms_order t1"
                        + " left join {0}.oms_command t2 on t1.CommandID=t2.ID "
                        + " left join {0}.fmc_factory t7 on t2.FactoryID=t7.ID "
                        + " left join {0}.crm_customer t8 on t2.CustomerID=t8.ID "
                        + " left join {0}.fpc_product t9 on t2.ProductID=t9.ID "
                        + " left join {0}.fmc_workshop t3 on t2.WorkShopID=t3.ID "
                        + " left join {0}.fmc_line t4 on t1.LineID=t4.ID "
                        + " left join {0}.fmc_station t5 on t1.StationID=t5.ID "
                        + " left join {0}.bms_teammanage t6 on t1.TeamID=t6.ID "
                                + " WHERE 1=1  and (  @wIDs = '' or t1.ID in ({1}));",

                        wInstance,
                        (wIDList.Count > 0) ? StringUtils.Join(",", wIDList) : "0");
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("wIDs", StringUtils.Join(",", wIDList));

                wSQL = DMLChange(wSQL);

                wResultList = this.mDBPool.queryForList(wSQL, wParamMap);

            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.getValue());
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResultList;
        }

        public List<OMSOrder> OMS_SelectOrderListByIDList(BMSEmployee wLoginUser, List<Int32> wIDList,
            OutResult<Int32> wErrorCode)
        {
            List<OMSOrder> wResultList = new List<OMSOrder>();
            try
            {
                if (wIDList == null || wIDList.Count <= 0)
                {
                    return wResultList;
                }

                wIDList.RemoveAll(p => p <= 0);

                if (wIDList.Count <= 0)
                {
                    return wResultList;
                }


                List<Dictionary<String, Object>> wQueryResult = new List<Dictionary<string, object>>();
                List<Int32> wSelectList = new List<Int32>();
                for (int i = 0; i < wIDList.Count; i++)
                {
                    wSelectList.Add(wIDList[i]);
                    if (i % 25 == 0)
                    {
                        wQueryResult.AddRange(this.OMS_SelectListByIDList(wLoginUser, wSelectList, wErrorCode));

                        wSelectList.Clear();

                        if (wErrorCode.Result != 0)
                            break;
                    }
                    if (i == wIDList.Count - 1)
                    {
                        if (wSelectList.Count > 0)
                            wQueryResult.AddRange(this.OMS_SelectListByIDList(wLoginUser, wSelectList, wErrorCode));
                        break;
                    }
                }
                if (wErrorCode.Result != 0)
                {
                    return wResultList;
                }

                SetValue(wLoginUser, wResultList, wQueryResult, wErrorCode);
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.getValue());
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResultList;
        }


        public List<OMSOrder> OMS_SelectFinishListByTime(BMSEmployee wLoginUser, DateTime wStartTime, DateTime wEndTime, int wPageSize, int wPageIndex, OutResult<Int32> wPageCount,
                OutResult<Int32> wErrorCode)
        {
            List<OMSOrder> wResultList = new List<OMSOrder>();
            try
            {
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.APS.getDBName();
                if (wErrorCode.Result != 0)
                {
                    return wResultList;
                }


                DateTime wBaseTime = new DateTime(2000, 1, 1);

                if (wStartTime <= wBaseTime)
                {
                    wStartTime = wBaseTime;
                }
                if (wEndTime <= wBaseTime)
                {
                    wEndTime = wBaseTime;
                }

                String wSqlCondition = StringUtils.Format("FROM {0}.oms_order t1"
                        + " left join {0}.oms_command t2 on t1.CommandID=t2.ID "
                        + " left join {0}.fmc_factory t7 on t2.FactoryID=t7.ID "
                        + " left join {0}.crm_customer t8 on t2.CustomerID=t8.ID "
                        + " left join {0}.fpc_product t9 on t2.ProductID=t9.ID "
                        + " left join {0}.fmc_workshop t3 on t2.WorkShopID=t3.ID "
                        + " left join {0}.fmc_line t4 on t1.LineID=t4.ID "
                        + " left join {0}.fmc_station t5 on t1.StationID=t5.ID "
                        + " left join {0}.bms_teammanage t6 on t1.TeamID=t6.ID "
                                + "WHERE 1=1  and @wStartTime <= t1.RealFinishDate and t1.RealFinishDate <= @wEndTime "
                                + " and t1.Status in({1}) ",
                        wInstance,
                        StringUtils.parseList(new Int32[] { (int)OMSOrderStatus.FinishOrder,
                            (int)OMSOrderStatus.StockOrder,(int) OMSOrderStatus.SendOrder }));



                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wEndTime", wEndTime);

                wPageCount.Result = this.GetPageCount(wSqlCondition, wPageSize, wParamMap);
                if (wPageCount.Result <= 0)
                {
                    wPageCount.Result = 1;

                    return wResultList;
                }
                String wSQL = "SELECT t1.*,t2.WBSNo,t2.CustomerID,t2.ContactCode,t2.PartNo,"
                      + " t2.LinkManID,t2.FactoryID,t2.BusinessUnitID,t2.WorkShopID,t3.Name as  WorkShopName,"
                      + " t7.Name as Factory,t8.CustomerName as Customer,t4.Name as LineName ,t2.ProductID,"
                      + " t9.ProductNo,t5.Name as StationName,t5.Code as StationNo,t6.Name as TeamName,"
                      + " t6.Code as TeamNo,t5.WorkName   " + wSqlCondition + StringUtils.Format(" limit {0},{1};", wPageIndex * wPageSize, wPageSize);
                wSQL = this.DMLChange(wSQL);

                List<Dictionary<String, Object>> wQueryResult = this.mDBPool.queryForList(wSQL, wParamMap);

                SetValue(wLoginUser, wResultList, wQueryResult, wErrorCode);
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.getValue());
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResultList;
        }

        public List<OMSOrder> OMS_SelectList_RF(BMSEmployee wLoginUser, int wCustomerID, int wWorkShopID, int wLineID,
                int wProductID, String wPartNo, DateTime wStartTime, DateTime wEndTime, int wPageSize, int wPageIndex, OutResult<Int32> wPageCount,
                OutResult<Int32> wErrorCode)
        {
            List<OMSOrder> wResultList = new List<OMSOrder>();
            try
            {
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.APS.getDBName();

                String wInstanceBasic = iPlant.Data.EF.MESDBSource.Basic.getDBName();


                DateTime wBaseTime = new DateTime(2000, 1, 1);

                if (wStartTime.CompareTo(wBaseTime) < 0)
                    wStartTime = wBaseTime;
                if (wEndTime.CompareTo(wBaseTime) < 0)
                {
                    wEndTime = wBaseTime;
                }
                if (wEndTime.CompareTo(wStartTime) < 0)
                {
                    return wResultList;
                }

                String wSqlCondition = StringUtils.Format(" FROM {0}.oms_order t1"
                        + " left join {0}.oms_command t2 on t1.CommandID=t2.ID "
                        + " left join {0}.fmc_factory t7 on t2.FactoryID=t7.ID "
                        + " left join {0}.crm_customer t8 on t2.CustomerID=t8.ID "
                        + " left join {0}.fpc_product t9 on t2.ProductID=t9.ID "
                        + " left join {0}.fmc_workshop t3 on t2.WorkShopID=t3.ID "
                        + " left join {0}.fmc_line t4 on t1.LineID=t4.ID "
                        + " left join {0}.fmc_station t5 on t1.StationID=t5.ID "
                        + " left join {0}.bms_teammanage t6 on t1.TeamID=t6.ID "
                                + " WHERE 1=1 and ( @wCustomerID <= 0 or @wCustomerID = t2.CustomerID ) "
                                + " and ( @wWorkShopID <= 0 or @wWorkShopID = t2.WorkShopID ) "
                                + " and ( @wLineID <= 0 or @wLineID = t1.LineID ) "
                                + " and ( @wProductID <= 0 or @wProductID = t2.ProductID ) "
                                + " and ( @wPartNo = '' or @wPartNo = t2.PartNo ) "
                                + " and ( @wStartTime <= str_to_date('2010-01-01', '%Y-%m-%d') "
                                + " or @wEndTime <= str_to_date('2010-01-01', '%Y-%m-%d') "
                                + " or (@wStartTime <= t1.PlanReceiveDate and t1.PlanReceiveDate<=@wEndTime) "
                                + " or (@wStartTime <= t1.PlanFinishDate and t1.PlanFinishDate<=@wEndTime) "
                                + " or (@wStartTime <= t1.RealStartDate and t1.RealStartDate<=@wEndTime) "
                                + " or (@wStartTime <= t1.RealFinishDate and t1.RealFinishDate<=@wEndTime) "
                                + " or (@wStartTime <= t1.RealSendDate and t1.RealSendDate<=@wEndTime) ) ",
                        wInstance, wInstanceBasic);



                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("wCustomerID", wCustomerID);
                wParamMap.Add("wLineID", wLineID);
                wParamMap.Add("wProductID", wProductID);
                wParamMap.Add("wWorkShopID", wWorkShopID);
                wParamMap.Add("wPartNo", wPartNo);
                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wEndTime", wEndTime);

                wPageCount.Result = this.GetPageCount(wSqlCondition, wPageSize, wParamMap);
                if (wPageCount.Result <= 0)
                {
                    wPageCount.Result = 1;

                    return wResultList;
                }

                String wSQL = "SELECT t1.*,t2.WBSNo,t2.CustomerID,t2.ContactCode,t2.PartNo,"
                       + " t2.LinkManID,t2.FactoryID,t2.BusinessUnitID,t2.WorkShopID,t3.Name as  WorkShopName,"
                       + " t7.Name as Factory,t8.CustomerName as Customer,t4.Name as LineName ,t2.ProductID,"
                       + " t9.ProductNo,t5.Name as StationName,t5.Code as StationNo,t6.Name as TeamName,"
                       + " t6.Code as TeamNo,t5.WorkName  "
                        + wSqlCondition + StringUtils.Format(" limit {0},{1};", wPageIndex * wPageSize, wPageSize);
                wSQL = this.DMLChange(wSQL);

                List<Dictionary<String, Object>> wQueryResult = this.mDBPool.queryForList(wSQL, wParamMap);

                SetValue(wLoginUser, wResultList, wQueryResult, wErrorCode);
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.getValue());
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResultList;
        }

        public List<OMSOrder> OMS_ConditionAll(BMSEmployee wLoginUser, int wProductID, int wWorkShopID, int wLine,
                int wCustomerID, String wWBSNo, DateTime wStartTime, DateTime wEndTime, int wStatus, int wPageSize, int wPageIndex, OutResult<Int32> wPageCount,
                OutResult<Int32> wErrorCode)
        {
            List<OMSOrder> wResult = new List<OMSOrder>();
            try
            {
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.APS.getDBName();
                if (wErrorCode.Result != 0)
                {
                    return wResult;
                }

                DateTime wBaseTime = new DateTime(2000, 1, 1);

                if (wStartTime.CompareTo(wBaseTime) < 0)
                    wStartTime = wBaseTime;
                if (wEndTime.CompareTo(wBaseTime) < 0)
                {
                    wEndTime = wBaseTime;
                }
                if (wEndTime.CompareTo(wStartTime) < 0)
                {
                    return wResult;
                }
                if (StringUtils.isEmpty(wWBSNo))
                {
                    wWBSNo = "";
                }
                String wSqlCondition = StringUtils.Format(" FROM {0}.oms_order t1"
                        + " left join {0}.oms_command t2 on t1.CommandID=t2.ID "
                        + " left join {0}.fmc_factory t7 on t2.FactoryID=t7.ID "
                        + " left join {0}.crm_customer t8 on t2.CustomerID=t8.ID "
                        + " left join {0}.fpc_product t9 on t2.ProductID=t9.ID "
                        + " left join {0}.fmc_workshop t3 on t2.WorkShopID=t3.ID "
                        + " left join {0}.fmc_line t4 on t1.LineID=t4.ID "
                        + " left join {0}.fmc_station t5 on t1.StationID=t5.ID "
                        + " left join {0}.bms_teammanage t6 on t1.TeamID=t6.ID "
                                + " where  1=1 and (@wCustomerID <= 0 or @wCustomerID = t2.CustomerID ) "
                                + " and ( @wWorkShopID <= 0 or @wWorkShopID = t2.WorkShopID ) "
                                + " and ( @wLineID <= 0 or @wLineID = t1.LineID ) "
                                + " and ( @wStatus <= 0 or @wStatus = t1.Status ) "
                                + " and ( @wProductID <= 0 or @wProductID = t2.ProductID ) "
                                + " and ( @wWBSNo = '' or t2.WBSNo like '%{1}%') "
                                + " and ( @wStartTime <= str_to_date('2010-01-01', '%Y-%m-%d') "
                                + " or @wEndTime <= str_to_date('2010-01-01', '%Y-%m-%d') "
                                + " or (@wStartTime <= t1.PlanReceiveDate and t1.PlanReceiveDate<=@wEndTime) "
                                + " or (@wStartTime <= t1.PlanFinishDate and t1.PlanFinishDate<=@wEndTime) "
                                + " or (@wStartTime <= t1.RealStartDate and t1.RealStartDate<=@wEndTime) "
                                + " or (@wStartTime <= t1.RealFinishDate and t1.RealFinishDate<=@wEndTime) "
                                + " or (@wStartTime <= t1.RealSendDate and t1.RealSendDate<=@wEndTime) )",
                        wInstance, wWBSNo);


                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("wProductID", wProductID);
                wParamMap.Add("wLineID", wLine);
                wParamMap.Add("wWorkShopID", wWorkShopID);
                wParamMap.Add("wCustomerID", wCustomerID);
                wParamMap.Add("wWBSNo", wWBSNo);
                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wEndTime", wEndTime);
                wParamMap.Add("wStatus", wStatus);

                wPageCount.Result = this.GetPageCount(wSqlCondition, wPageSize, wParamMap);
                if (wPageCount.Result <= 0)
                {
                    wPageCount.Result = 1;

                    return wResult;
                }



                String wSQL = "SELECT t1.*,t2.WBSNo,t2.CustomerID,t2.ContactCode,t2.PartNo,"
                      + " t2.LinkManID,t2.FactoryID,t2.BusinessUnitID,t2.WorkShopID,t3.Name as  WorkShopName,"
                      + " t7.Name as Factory,t8.CustomerName as Customer,t4.Name as LineName ,t2.ProductID,"
                      + " t9.ProductNo,t5.Name as StationName,t5.Code as StationNo,t6.Name as TeamName,"
                      + " t6.Code as TeamNo,t5.WorkName   " + wSqlCondition + StringUtils.Format(" limit {0},{1};", wPageIndex * wPageSize, wPageSize);

                wSQL = DMLChange(wSQL);

                List<Dictionary<String, Object>> wQueryResult = this.mDBPool.queryForList(wSQL, wParamMap);

                SetValue(wLoginUser, wResult, wQueryResult, wErrorCode);
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        private String OMS_SelectSubOrderNo(BMSEmployee wLoginUser, int wCommandID, OutResult<Int32> wErrorCode)
        {
            String wResult = "";
            try
            {
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.APS.getDBName();
                if (((Int32)wErrorCode.Result) != 0)
                {
                    return wResult;
                }

                String wSQL = StringUtils
                        .Format("SELECT  t1.ID,t1.OrderNo, t2.WBSNo"
                                + " FROM  {0}.oms_order t1  left join  {0}.oms_command t2  on t1.CommandID = t2.ID"
                                + " WHERE t1.CommandID=@CommandID and  locate (t2.WBSNo , t1.OrderNo)=0 order by t1.CreateTime desc limit 1;",
                                wInstance);

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                wParamMap.Add("CommandID", wCommandID);
                wSQL = DMLChange(wSQL);

                List<Dictionary<String, Object>> wQueryResult = this.mDBPool.queryForList(wSQL, wParamMap);

                int wMaxID = 0;
                String wWBSNo = "";
                String wOrderNo = "";
                foreach (Dictionary<String, Object> wMap in wQueryResult)
                {
                    wWBSNo = StringUtils.parseString(wMap["WBSNo"]);
                    wOrderNo = StringUtils.parseString(wMap["OrderNo"]);
                }
                if (wOrderNo.StartsWith(wWBSNo + "."))
                {

                    wOrderNo = wOrderNo.Substring(wWBSNo.Length + 1);

                    wMaxID = StringUtils.parseInt(wOrderNo);
                    wResult = StringUtils.Format("{0}.{1}", wWBSNo, String.Format("{0:D3}", wMaxID + 1));

                }
                else
                {
                    wResult = StringUtils.Format("{0}.{1}", wWBSNo, String.Format("{0:D3}", wMaxID + 1));
                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.getValue());
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }

        /**
         * 根据季度开始时间和结束时间和产线获取完成数
         * 
         * @param wLoginUser
         * @param wQStart    季度开始时刻
         * @param wQEnd      季度结束时刻
         * @param wLineID    产线
         * @param wErrorCode 错误码
         * @return 订单完成数
         */
        public int OMS_SelectCountByQuarter(BMSEmployee wLoginUser, DateTime wQStart, DateTime wQEnd, int wLineID,
                OutResult<Int32> wErrorCode)
        {
            int wResult = 0;
            try
            {
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.APS.getDBName();
                if (((Int32)wErrorCode.Result) != 0)
                {
                    return wResult;
                }

                String wSQL = StringUtils.Format("select count(*) as Number From {0}.oms_order "
                        + "where @wStartTime <= RealFinishDate and RealFinishDate <= @wEndTime "
                        + "and LineID = @wLineID and Status in(5,6,7,8);", wInstance);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("wStartTime", wQStart);
                wParamMap.Add("wEndTime", wQEnd);
                wParamMap.Add("wLineID", wLineID);

                wSQL = DMLChange(wSQL);

                List<Dictionary<String, Object>> wQueryResult = this.mDBPool.queryForList(wSQL, wParamMap);

                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    Int32 wNumber = StringUtils.parseInt(wReader["Number"]);
                    if (wNumber > 0)
                    {
                        return wNumber;
                    }
                }
            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }


        private void SetValue(BMSEmployee wLoginUser, List<OMSOrder> wResultList, List<Dictionary<String, Object>> wQueryResult,
                OutResult<Int32> wErrorCode)
        {
            try
            {

                if (wQueryResult.Count <= 0)
                {
                    return;
                }
                Dictionary<int, String> wBMSEmployeeNameDic = BMSEmployeeDAO.getInstance().BMS_QueryEmployeeList(wLoginUser, "", -1, -1, -1, -1, -1, 1, wErrorCode).ToDictionary(p => p.ID, p => p.Name);


                //  FPCRoute wFPCRoute;
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    OMSOrder wItem = new OMSOrder();

                    wItem.ID = StringUtils.parseInt(wReader["ID"]);
                    wItem.CommandID = StringUtils.parseInt(wReader["CommandID"]);
                    wItem.ERPID = StringUtils.parseInt(wReader["ERPID"]);
                    wItem.OrderNo = StringUtils.parseString(wReader["OrderNo"]);
                    wItem.LineID = StringUtils.parseInt(wReader["LineID"]);
                    wItem.LineName = StringUtils.parseString(wReader["LineName"]);
                    wItem.ProductID = StringUtils.parseInt(wReader["ProductID"]);
                    wItem.ProductNo = StringUtils.parseString(wReader["ProductNo"]);
                    wItem.WorkShopID = StringUtils.parseInt(wReader["WorkShopID"]);
                    wItem.WorkShopName = StringUtils.parseString(wReader["WorkShopName"]);
                    wItem.CustomerID = StringUtils.parseInt(wReader["CustomerID"]);
                    wItem.Customer = StringUtils.parseString(wReader["Customer"]);
                    wItem.ContactCode = StringUtils.parseString(wReader["ContactCode"]);
                    wItem.FactoryID = StringUtils.parseInt(wReader["FactoryID"]);
                    wItem.Factory = StringUtils.parseString(wReader["Factory"]);
                    wItem.PartNo = StringUtils.parseString(wReader["PartNo"]);
                    wItem.Status = StringUtils.parseInt(wReader["Status"]);

                    wItem.TeamID = StringUtils.parseInt(wReader["TeamID"]);
                    wItem.TeamNo = StringUtils.parseString(wReader["TeamNo"]);
                    wItem.TeamName = StringUtils.parseString(wReader["TeamName"]);
                    wItem.StationID = StringUtils.parseInt(wReader["StationID"]);
                    wItem.StationName = StringUtils.parseString(wReader["StationName"]);
                    wItem.StationNo = StringUtils.parseString(wReader["StationNo"]);
                    wItem.WorkName = StringUtils.parseString(wReader["WorkName"]);

                    wItem.PlanReceiveDate = StringUtils.parseDate(wReader["PlanReceiveDate"]);
                    wItem.PlanFinishDate = StringUtils.parseDate(wReader["PlanFinishDate"]);
                    wItem.RealStartDate = StringUtils.parseDate(wReader["RealStartDate"]);
                    wItem.RealFinishDate = StringUtils.parseDate(wReader["RealFinishDate"]);
                    wItem.RealSendDate = StringUtils.parseDate(wReader["RealSendDate"]);
                    wItem.Remark = StringUtils.parseString(wReader["Remark"]);
                    wItem.CreatorID = StringUtils.parseInt(wReader["CreatorID"]);
                    wItem.CreateTime = StringUtils.parseDate(wReader["CreateTime"]);
                    wItem.EditorID = StringUtils.parseInt(wReader["EditorID"]);
                    wItem.EditTime = StringUtils.parseDate(wReader["EditTime"]);
                    wItem.AuditorID = StringUtils.parseInt(wReader["AuditorID"]);
                    wItem.AuditTime = StringUtils.parseDate(wReader["AuditTime"]);
                    wItem.LinkManID = StringUtils.parseInt(wReader["LinkManID"]);
                    wItem.BusinessUnitID = StringUtils.parseInt(wReader["BusinessUnitID"]);
                    wItem.WBSNo = StringUtils.parseString(wReader["WBSNo"]);

                    wItem.WorkerIDList = StringUtils
                            .parseIntList(StringUtils.split(StringUtils.parseString(wReader["WorkerIDList"]), ","));
                    wItem.WorkerName = StringUtils.parseName(wItem.WorkerIDList, wBMSEmployeeNameDic);
                    wItem.Editor = StringUtils.parseName(wItem.EditorID, wBMSEmployeeNameDic);
                    wItem.Creator = StringUtils.parseName(wItem.CreatorID, wBMSEmployeeNameDic);

                    wItem.Auditor = StringUtils.parseName(wItem.AuditorID, wBMSEmployeeNameDic);

                    wResultList.Add(wItem);
                }
            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
        }

        public void OMS_AuditOrder(BMSEmployee wLoginUser, List<OMSOrder> wResultList, OutResult<Int32> wErrorCode)
        {
            try
            {
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.APS.getDBName();
                if (((Int32)wErrorCode.Result) != 0)
                {
                    return;
                }

                if (wResultList == null || wResultList.Count <= 0)
                    return;

                Dictionary<String, Object> wParamMap = null;
                foreach (OMSOrder wOMSOrder in wResultList)
                {
                    if (wOMSOrder == null || wOMSOrder.ID <= 0 || wOMSOrder.Status <= 0)
                        continue;
                    wParamMap = new Dictionary<String, Object>();

                    wParamMap.Add("ID", wOMSOrder.ID);

                    wParamMap.Add("Status", wOMSOrder.Status);

                    wParamMap.Add("AuditorID", wLoginUser.ID);
                    wParamMap.Add("AuditTime", DateTime.Now);
                    this.Update(StringUtils.Format("{0}.oms_order", wInstance), "ID", wParamMap);

                }
            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.getValue());
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }



    }
}
