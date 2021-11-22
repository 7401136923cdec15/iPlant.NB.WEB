using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.SCADA.Service
{
    public class DMSProcessRecordDAO : BaseDAO
    {

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(DMSProcessRecordDAO));




        private static DMSProcessRecordDAO Instance;

        private DMSProcessRecordDAO() : base()
        {

        }

        public static DMSProcessRecordDAO getInstance()
        {
            if (Instance == null)
                Instance = new DMSProcessRecordDAO();
            return Instance;
        }


        public List<DMSProcessRecord> DMS_CurrentProcessRecordList(BMSEmployee wLoginUser, int wDeviceID, String wDeviceNo, int wActive, OutResult<Int32> wErrorCode)
        {
            List<DMSProcessRecord> wResult = new List<DMSProcessRecord>();
            try
            {
                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;
                String wSQL = StringUtils.Format("SELECT t.*,o.ID as OrderID,t1.ID as DeviceID,t1.Code as DeviceNo,t1.Name as DeviceName " +
                            "  FROM {0}.dms_device_processrecord t" +
                            " inner join {0}.oms_order o on t.OrderNo = o.OrderNo and o.ID>0 " +
                            " inner join {0}.dms_device_ledger t1 on t.AssetNo = t1.AssetNo where o.Status in (3,4,6) "
                        + " and ( @wDeviceID <= 0 or t1.ID  = @wDeviceID)  "
                        + " and ( @wDeviceNo =''  or t1.Code  = @wDeviceNo) "
                        + " and ( @wActive < 0 or t.Active  = @wActive) ;", wInstance);
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("wDeviceID", wDeviceID);
                wParamMap.Add("wDeviceNo", wDeviceNo);
                wParamMap.Add("wActive", wActive);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);
                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    DMSProcessRecord wProcessRecord = new DMSProcessRecord();

                    wProcessRecord.ID = StringUtils.parseInt(wReader["ID"]);
                    wProcessRecord.DeviceID = StringUtils.parseInt(wReader["DeviceID"]);
                    wProcessRecord.DeviceNo = StringUtils.parseString(wReader["DeviceNo"]);
                    wProcessRecord.DeviceName = StringUtils.parseString(wReader["DeviceName"]);
                    wProcessRecord.AssetNo = StringUtils.parseString(wReader["AssetNo"]);
                    wProcessRecord.OrderID = StringUtils.parseInt(wReader["OrderID"]);
                    wProcessRecord.OrderNo = StringUtils.parseString(wReader["OrderNo"]);
                    wProcessRecord.MetroNo = StringUtils.parseString(wReader["MetroNo"]);
                    wProcessRecord.WorkPieceNo = StringUtils.parseString(wReader["WorkPieceNo"]);
                    wProcessRecord.MetroNo = StringUtils.parseString(wReader["MetroNo"]);
                    wProcessRecord.StartTime = StringUtils.parseDate(wReader["StartTime"]);
                    wProcessRecord.EndTime = StringUtils.parseDate(wReader["EndTime"]);
                    wProcessRecord.Active = StringUtils.parseInt(wReader["Active"]);
                    wProcessRecord.Status = StringUtils.parseInt(wReader["Status"]);
                    wProcessRecord.Remark = StringUtils.parseString(wReader["Remark"]);

                    wResult.Add(wProcessRecord);
                }

                this.DMS_SetProcessRecordItemList(wLoginUser, wResult, wErrorCode);

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public List<DMSProcessRecord> DMS_SelectProcessRecordList(BMSEmployee wLoginUser, int wOrderID, String wOrderNo, int wDeviceID, String wDeviceNo,
            int wActive, int wStatus, DateTime wStartTime, DateTime wEndTime, int wPageSize, int wPageIndex, OutResult<Int32> wPageCount, OutResult<Int32> wErrorCode)
        {
            List<DMSProcessRecord> wResult = new List<DMSProcessRecord>();
            try
            {

                DateTime wBaseTime = new DateTime(2000, 1, 1);
                if ( wStartTime.CompareTo(wBaseTime) < 0)
                    wStartTime = wBaseTime;
                if ( wEndTime.CompareTo(wBaseTime) < 0)
                    wEndTime = wBaseTime;
                if (wStartTime.CompareTo(wEndTime) > 0)
                {
                    return wResult;
                }

                if (wOrderNo == null)
                    wOrderNo = "";
                if (wDeviceNo == null)
                    wDeviceNo = "";

                if (wPageSize <= 0)
                    wPageSize = Int32.MaxValue;

                if (wPageSize > 2000)
                {
                    wPageSize = 2000;
                }

                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;



                String wSqlCondition = StringUtils.Format(" FROM {0}.dms_device_processrecord t" +
                            " left join {0}.oms_order o on t.OrderNo = o.OrderNo" +
                            " inner join {0}.dms_device_ledger t1 on t.AssetNo = t1.AssetNo where 1=1 "
                        + " and ( @wOrderID <= 0 or o.ID  = @wOrderID)  "
                        + " and ( @wOrderNo =''  or o.OrderNo  = @wOrderNo) "
                        + " and ( @wDeviceID <= 0 or t1.ID  = @wDeviceID)  "
                        + " and ( @wDeviceNo =''  or t1.Code  = @wDeviceNo) "
                        + " and ( @wStatus <= 0 or t.Status  = @wStatus)"
                        + " and ( @wStartTime <= str_to_date('2010-01-01', '%Y-%m-%d')   or @wStartTime <= t.EndTime) "
                        + " and ( @wEndTime <= str_to_date('2010-01-01', '%Y-%m-%d')  or @wEndTime >= t.StartTime)  "
                        + " and ( @wActive < 0 or t.Active  = @wActive) ", wInstance);


                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("wOrderID", wOrderID);
                wParamMap.Add("wOrderNo", wOrderNo);
                wParamMap.Add("wDeviceID", wDeviceID);
                wParamMap.Add("wDeviceNo", wDeviceNo);
                wParamMap.Add("wActive", wActive);
                wParamMap.Add("wStatus", wStatus);
                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wEndTime", wEndTime);

                wPageCount.Result = this.GetPageCount(wSqlCondition, wPageSize, wParamMap);
                if (wPageCount.Result <= 0)
                {
                    wPageCount.Result = 1;

                    return wResult;
                }


                String wSQL = "SELECT t.*,o.ID as OrderID,t1.ID as DeviceID,t1.Name as DeviceName,t1.Code as DeviceNo "
                    + wSqlCondition + StringUtils.Format(" order by EndTime desc limit {0},{1};", wPageIndex * wPageSize, wPageSize);
                wSQL = this.DMLChange(wSQL);


                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);
                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    DMSProcessRecord wProcessRecord = new DMSProcessRecord();

                    wProcessRecord.ID = StringUtils.parseInt(wReader["ID"]);
                    wProcessRecord.DeviceID = StringUtils.parseInt(wReader["DeviceID"]);
                    wProcessRecord.DeviceNo = StringUtils.parseString(wReader["DeviceNo"]);
                    wProcessRecord.DeviceName = StringUtils.parseString(wReader["DeviceName"]);
                    wProcessRecord.AssetNo = StringUtils.parseString(wReader["AssetNo"]);
                    wProcessRecord.OrderID = StringUtils.parseInt(wReader["OrderID"]);
                    wProcessRecord.OrderNo = StringUtils.parseString(wReader["OrderNo"]);
                    wProcessRecord.MetroNo = StringUtils.parseString(wReader["MetroNo"]);
                    wProcessRecord.WorkPieceNo = StringUtils.parseString(wReader["WorkPieceNo"]);
                    wProcessRecord.MetroNo = StringUtils.parseString(wReader["MetroNo"]);
                    wProcessRecord.StartTime = StringUtils.parseDate(wReader["StartTime"]);
                    wProcessRecord.EndTime = StringUtils.parseDate(wReader["EndTime"]);
                    wProcessRecord.Active = StringUtils.parseInt(wReader["Active"]);
                    wProcessRecord.Status = StringUtils.parseInt(wReader["Status"]);
                    wProcessRecord.Remark = StringUtils.parseString(wReader["Remark"]);

                    wResult.Add(wProcessRecord);
                }
                this.DMS_SetProcessRecordItemList(wLoginUser, wResult, wErrorCode);
            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public List<DMSProcessRecord> DMS_SelectProcessRecordUploadList(BMSEmployee wLoginUser,  OutResult<Int32> wErrorCode)
        {
            List<DMSProcessRecord> wResult = new List<DMSProcessRecord>();
            try
            {


                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;



                String wSQL = StringUtils.Format(" SELECT t.*,o.ID as OrderID,t1.ID as DeviceID," +
                    " t1.Name as DeviceName,t1.Code as DeviceNo  FROM {0}.dms_device_processrecord t" +
                            " inner join {0}.oms_order o on t.OrderNo = o.OrderNo" +
                            " inner join {0}.dms_device_ledger t1 on t.AssetNo = t1.AssetNo " +
                            "where t.UploadStatus=0 AND t.Active=1 order by t.StartTime DESC limit 100 ", wInstance);


                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                 

                wSQL = this.DMLChange(wSQL);


                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);

                if (wQueryResult.Count <= 0)
                {
                    this.DMS_UpdateProcessRecordUploadStatus(wLoginUser, wErrorCode);
                    return wResult;
                }
                List<Int32> wRecordIDList = new List<int>();
                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    DMSProcessRecord wProcessRecord = new DMSProcessRecord();

                    wProcessRecord.ID = StringUtils.parseInt(wReader["ID"]);
                    wProcessRecord.DeviceID = StringUtils.parseInt(wReader["DeviceID"]);
                    wProcessRecord.DeviceNo = StringUtils.parseString(wReader["DeviceNo"]);
                    wProcessRecord.DeviceName = StringUtils.parseString(wReader["DeviceName"]);
                    wProcessRecord.AssetNo = StringUtils.parseString(wReader["AssetNo"]);
                    wProcessRecord.OrderID = StringUtils.parseInt(wReader["OrderID"]);
                    wProcessRecord.OrderNo = StringUtils.parseString(wReader["OrderNo"]);
                    wProcessRecord.MetroNo = StringUtils.parseString(wReader["MetroNo"]);
                    wProcessRecord.WorkPieceNo = StringUtils.parseString(wReader["WorkPieceNo"]);
                    wProcessRecord.MetroNo = StringUtils.parseString(wReader["MetroNo"]);
                    wProcessRecord.StartTime = StringUtils.parseDate(wReader["StartTime"]);
                    wProcessRecord.EndTime = StringUtils.parseDate(wReader["EndTime"]);
                    wProcessRecord.Active = StringUtils.parseInt(wReader["Active"]);
                    wProcessRecord.Status = StringUtils.parseInt(wReader["Status"]);
                    wProcessRecord.Remark = StringUtils.parseString(wReader["Remark"]);

                    wResult.Add(wProcessRecord);

                    if (wProcessRecord.ID > 0 && !wRecordIDList.Contains(wProcessRecord.ID))
                        wRecordIDList.Add(wProcessRecord.ID);
                }
                if (wRecordIDList.Count > 0)
                {
                    this.DMS_SetProcessRecordItemList(wLoginUser, wResult, wErrorCode);
                    this.DMS_UpdateProcessRecordUploadStatus(wLoginUser, wRecordIDList, 2, wErrorCode);
                }
            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        private void DMS_UpdateProcessRecordUploadStatus(BMSEmployee wLoginUser, OutResult<Int32> wErrorCode)
        {

            try
            {

                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return;

                String wSQL = StringUtils.Format(" update {0}.dms_device_processrecord t  set t.UploadStatus=1 where t.ID>0 AND t.UploadStatus=2; ", wInstance);


                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                mDBPool.update(wSQL, wParamMap);

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="wLoginUser"></param>
        /// <param name="wRecordIDList"></param>
        /// <param name="wUploadStatus">1上传成功 2 上传失败 0未上传</param>
        /// <param name="wErrorCode"></param>
        public void DMS_UpdateProcessRecordUploadStatus(BMSEmployee wLoginUser, List<Int32> wRecordIDList, int wUploadStatus, OutResult<Int32> wErrorCode)
        {

            try
            {
                if (wRecordIDList == null || wRecordIDList.Count <= 0 || wUploadStatus <= 0)
                    return;

                wRecordIDList.RemoveAll(p => p <= 0);

                if (wRecordIDList.Count <= 0)
                    return;


                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return;

                String wSQL = StringUtils.Format(" update {0}.dms_device_processrecord t  set t.UploadStatus=@wUploadStatus " +
                    "where  t.UploadStatus!=1 and t.ID in ({1}) ; ", wInstance, StringUtils.Join(",", wRecordIDList.Distinct()));


                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                mDBPool.update(wSQL, wParamMap);

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }

        public DMSProcessRecord DMS_SelectProcessRecord(BMSEmployee wLoginUser, int wRecordID, OutResult<Int32> wErrorCode)
        {

            DMSProcessRecord wResult = new DMSProcessRecord();
            try
            {
                if (wRecordID <= 0)
                    return wResult;

                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;
                String wSQL = StringUtils.Format("SELECT t.*,o.ID as OrderID,t1.ID as DeviceID,t1.Name as DeviceName,t1.Code as DeviceNo " +
                            " FROM {0}.dms_device_processrecord t" +
                            " inner join {0}.oms_order o on t.OrderNo = o.OrderNo" +
                            " inner join {0}.dms_device_ledger t1 on t.AssetNo = t1.AssetNo where t.ID=@wID ;", wInstance);
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("wID", wRecordID);
                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);
                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    wResult.ID = StringUtils.parseInt(wReader["ID"]);
                    wResult.DeviceID = StringUtils.parseInt(wReader["DeviceID"]);
                    wResult.DeviceNo = StringUtils.parseString(wReader["DeviceNo"]);
                    wResult.DeviceName = StringUtils.parseString(wReader["DeviceName"]);
                    wResult.AssetNo = StringUtils.parseString(wReader["AssetNo"]);
                    wResult.OrderID = StringUtils.parseInt(wReader["OrderID"]);
                    wResult.OrderNo = StringUtils.parseString(wReader["OrderNo"]);
                    wResult.MetroNo = StringUtils.parseString(wReader["MetroNo"]);
                    wResult.WorkPieceNo = StringUtils.parseString(wReader["WorkPieceNo"]);
                    wResult.MetroNo = StringUtils.parseString(wReader["MetroNo"]);
                    wResult.StartTime = StringUtils.parseDate(wReader["StartTime"]);
                    wResult.EndTime = StringUtils.parseDate(wReader["EndTime"]);
                    wResult.Active = StringUtils.parseInt(wReader["Active"]);
                    wResult.Status = StringUtils.parseInt(wReader["Status"]);
                    wResult.Remark = StringUtils.parseString(wReader["Remark"]);
                    wResult.ItemList = this.DMS_SelectProcessRecordItemList(wLoginUser, wResult.ID, wErrorCode);

                    wResult.ItemList.Sort((o1, o2) =>
                        (o1.AnalysisOrder <= 0 ? Int32.MaxValue : o1.AnalysisOrder)
                        - (o2.AnalysisOrder <= 0 ? Int32.MaxValue : o2.AnalysisOrder));
                }

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;

        }


        public List<DMSProcessRecordItem> DMS_SelectProcessRecordItemList(BMSEmployee wLoginUser, int wRecordID, OutResult<Int32> wErrorCode)
        {

            List<DMSProcessRecordItem> wResult = new List<DMSProcessRecordItem>();
            try
            {
                if (wRecordID <= 0)
                    return wResult;



                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;
                String wSQL = StringUtils.Format("SELECT P.* ,t2.DataType, t1.AssetNo,t1.ID as DeviceID,t1.Code as DeviceNo," +
                    "  t2.Name as ParameterName,t2.Code as ParameterCode,"
                        + " t2.ParameterDesc,t2.ID AS  ParameterID ,t2.AnalysisOrder FROM iplantscada.dms_device_recorditem p "
                        + " inner join dms_device_processrecord t on p.RecordID = t.ID  "
                        + " inner join dms_device_ledger t1 on t.AssetNo = t1.AssetNo  "
                        + " inner join dms_device_parameter t2 on t2.Code = p.ParameterNo and t2.DeviceID = t1.ID "
                        + " where t.ID=@wRecordID  ;", wInstance);
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("wRecordID", wRecordID);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);
                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    DMSProcessRecordItem wProcessRecordItem = new DMSProcessRecordItem();

                    wProcessRecordItem.ID = StringUtils.parseLong(wReader["ID"]);
                    wProcessRecordItem.RecordID = StringUtils.parseInt(wReader["RecordID"]);
                    wProcessRecordItem.DeviceID = StringUtils.parseInt(wReader["DeviceID"]);
                    wProcessRecordItem.DeviceNo = StringUtils.parseString(wReader["DeviceNo"]);
                    wProcessRecordItem.AssetNo = StringUtils.parseString(wReader["AssetNo"]);
                    wProcessRecordItem.ParameterID = StringUtils.parseInt(wReader["ParameterID"]);
                    wProcessRecordItem.ParameterNo = StringUtils.parseString(wReader["ParameterCode"]);
                    wProcessRecordItem.ParameterName = StringUtils.parseString(wReader["ParameterName"]);
                    wProcessRecordItem.ParameterDesc = StringUtils.parseString(wReader["ParameterDesc"]);
                    wProcessRecordItem.ParameterValue = StringUtils.parseString(wReader["ParameterValue"]);
                    wProcessRecordItem.DataType = StringUtils.parseInt(wReader["DataType"]);
                    wProcessRecordItem.AnalysisOrder = StringUtils.parseInt(wReader["AnalysisOrder"]);
                    wProcessRecordItem.SampleTime = StringUtils.parseDate(wReader["SampleTime"]);

                    wResult.Add(wProcessRecordItem);
                }

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        private void DMS_SetProcessRecordItemList(BMSEmployee wLoginUser, List<DMSProcessRecord> wRecordList, OutResult<Int32> wErrorCode)
        {
            if (wRecordList == null || wRecordList.Count <= 0)
                return;
            List<int> wRecordIDList = wRecordList.Select(p => p.ID).ToList();

            Dictionary<int, List<DMSProcessRecordItem>> wDic = this.DMS_SelectProcessRecordItemList(wLoginUser, wRecordIDList, wErrorCode);

            foreach (DMSProcessRecord wDMSProcessRecord in wRecordList)
            {
                if (wDic.ContainsKey(wDMSProcessRecord.ID))
                    wDMSProcessRecord.ItemList = wDic[wDMSProcessRecord.ID];
                if (wDMSProcessRecord.ItemList == null)
                    wDMSProcessRecord.ItemList = new List<DMSProcessRecordItem>();

                wDMSProcessRecord.ItemList.Sort((o1, o2) =>
                (o1.AnalysisOrder <= 0 ? Int32.MaxValue : o1.AnalysisOrder)
                - (o2.AnalysisOrder <= 0 ? Int32.MaxValue : o2.AnalysisOrder));
            }
        }

        private Dictionary<int, List<DMSProcessRecordItem>> DMS_SelectProcessRecordItemList(BMSEmployee wLoginUser, List<int> wRecordIDList, OutResult<Int32> wErrorCode)
        {

            Dictionary<int, List<DMSProcessRecordItem>> wResult = new Dictionary<int, List<DMSProcessRecordItem>>();
            try
            {
                if (wRecordIDList == null)
                    return wResult;

                wRecordIDList.RemoveAll(p => p <= 0);

                if (wRecordIDList.Count <= 0)
                    return wResult;

                wRecordIDList = wRecordIDList.Distinct().ToList();

                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;
                String wSQL = StringUtils.Format("SELECT P.* ,t2.DataType, t1.AssetNo,t1.ID as DeviceID,t1.Code as DeviceNo ,t2.Name as ParameterName,"
                        + " t2.ParameterDesc,t2.ID  AS  ParameterID ,t2.AnalysisOrder FROM iplantscada.dms_device_recorditem p "
                        + " inner join dms_device_processrecord t on p.RecordID = t.ID  "
                        + " inner join dms_device_ledger t1 on t.AssetNo = t1.AssetNo  "
                        + " inner join dms_device_parameter t2 on t2.Code = p.ParameterNo and t2.DeviceID = t1.ID "
                        + " where t.ID in ({1})  ;", wInstance, StringUtils.Join(",", wRecordIDList));
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();


                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);
                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    DMSProcessRecordItem wProcessRecordItem = new DMSProcessRecordItem();

                    wProcessRecordItem.ID = StringUtils.parseLong(wReader["ID"]);
                    wProcessRecordItem.RecordID = StringUtils.parseInt(wReader["RecordID"]);
                    wProcessRecordItem.DeviceID = StringUtils.parseInt(wReader["DeviceID"]);
                    wProcessRecordItem.DeviceNo = StringUtils.parseString(wReader["DeviceNo"]);
                    wProcessRecordItem.AssetNo = StringUtils.parseString(wReader["AssetNo"]);
                    wProcessRecordItem.ParameterID = StringUtils.parseInt(wReader["ParameterID"]);
                    wProcessRecordItem.ParameterNo = StringUtils.parseString(wReader["ParameterNo"]);
                    wProcessRecordItem.ParameterName = StringUtils.parseString(wReader["ParameterName"]);
                    wProcessRecordItem.ParameterDesc = StringUtils.parseString(wReader["ParameterDesc"]);
                    wProcessRecordItem.ParameterValue = StringUtils.parseString(wReader["ParameterValue"]);
                    wProcessRecordItem.DataType = StringUtils.parseInt(wReader["DataType"]);
                    wProcessRecordItem.AnalysisOrder = StringUtils.parseInt(wReader["AnalysisOrder"]);
                    wProcessRecordItem.SampleTime = StringUtils.parseDate(wReader["SampleTime"]);

                    if (!wResult.ContainsKey(wProcessRecordItem.RecordID))
                        wResult.Add(wProcessRecordItem.RecordID, new List<DMSProcessRecordItem>());
                    wResult[wProcessRecordItem.RecordID].Add(wProcessRecordItem);
                }

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public List<DMSProcessRecordItem> DMS_SelectProcessRecordItemList(BMSEmployee wLoginUser, int wDeviceID, String wDeviceNo, int wRecordID,
            int wParameterID, String wParameterNo, int wActive, int wStatus, DateTime wStartTime, DateTime wEndTime, OutResult<Int32> wErrorCode)
        {

            List<DMSProcessRecordItem> wResult = new List<DMSProcessRecordItem>();
            try
            {
                DateTime wBaseTime = new DateTime(2000, 1, 1);
                if ( wStartTime.CompareTo(wBaseTime) < 0)
                    wStartTime = wBaseTime;
                if ( wEndTime.CompareTo(wBaseTime) < 0)
                    wEndTime = wBaseTime;
                if (wStartTime.CompareTo(wEndTime) > 0)
                {
                    return wResult;
                }

                if (wDeviceID <= 0 || StringUtils.isEmpty(wDeviceNo))
                {
                    return wResult;
                }


                if (wParameterNo == null)
                    wParameterNo = "";
                if (wDeviceNo == null)
                    wDeviceNo = "";


                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;
                String wSQL = StringUtils.Format("SELECT p.* ,t2.DataType,t1.AssetNo, t1.ID as DeviceID ,t1.Code as DeviceNo ,t2.Name as ParameterName,"
                        + " t2.ParameterDesc,t2.ID as  ParameterID ,t2.AnalysisOrder  FROM iplantscada.dms_device_recorditem p "
                        + " inner join dms_device_processrecord t on p.RecordID = t.ID  "
                        + " inner join dms_device_ledger t1 on t.AssetNo = t1.AssetNo  "
                        + " inner join dms_device_parameter t2 on t2.Code = p.ParameterNo and t2.DeviceID = t1.ID "
                        + " where t.ID=@wRecordID  ;"
                        + " and ( @wRecordID <= 0 or t.ID  = @wRecordID)  "
                        + " and ( @wDeviceID <= 0 or t1.ID  = @wDeviceID)  "
                        + " and ( @wDeviceNo =''  or t1.Code  = @wDeviceNo) "
                        + " and ( @wParameterID <= 0 or t2.ID  = @wParameterID)  "
                        + " and ( @wParameterNo =''  or p.ParameterNo  = @wParameterNo) "
                        + " and ( @wStatus <= 0 or t.Status  = @wStatus)"
                        + " and ( @wStartTime <= str_to_date('2010-01-01', '%Y-%m-%d')   or @wStartTime <= t.EndTime) "
                        + " and ( @wEndTime <= str_to_date('2010-01-01', '%Y-%m-%d')  or @wEndTime >= t.StartTime)  "
                        + " and ( @wActive < 0 or t.Active  = @wActive) ;", wInstance);
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("wRecordID", wRecordID);
                wParamMap.Add("wDeviceID", wDeviceID);
                wParamMap.Add("wDeviceNo", wDeviceNo);
                wParamMap.Add("wParameterID", wParameterID);
                wParamMap.Add("wParameterNo", wParameterNo);
                wParamMap.Add("wStatus", wStatus);
                wParamMap.Add("wActive", wActive);
                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wEndTime", wEndTime);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);
                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    DMSProcessRecordItem wProcessRecordItem = new DMSProcessRecordItem();

                    wProcessRecordItem.ID = StringUtils.parseLong(wReader["ID"]);
                    wProcessRecordItem.RecordID = StringUtils.parseInt(wReader["RecordID"]);
                    wProcessRecordItem.DeviceID = StringUtils.parseInt(wReader["DeviceID"]);
                    wProcessRecordItem.DeviceNo = StringUtils.parseString(wReader["DeviceNo"]);
                    wProcessRecordItem.AssetNo = StringUtils.parseString(wReader["AssetNo"]);
                    wProcessRecordItem.ParameterID = StringUtils.parseInt(wReader["ParameterID"]);
                    wProcessRecordItem.ParameterNo = StringUtils.parseString(wReader["ParameterNo"]);
                    wProcessRecordItem.ParameterName = StringUtils.parseString(wReader["ParameterName"]);
                    wProcessRecordItem.ParameterDesc = StringUtils.parseString(wReader["ParameterDesc"]);
                    wProcessRecordItem.ParameterValue = StringUtils.parseString(wReader["ParameterValue"]);
                    wProcessRecordItem.DataType = StringUtils.parseInt(wReader["DataType"]);
                    wProcessRecordItem.AnalysisOrder = StringUtils.parseInt(wReader["AnalysisOrder"]);
                    wProcessRecordItem.SampleTime = StringUtils.parseDate(wReader["SampleTime"]);

                    wResult.Add(wProcessRecordItem);
                }

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public void DMS_InsertProcessRecord(BMSEmployee wLoginUser, DMSProcessRecord wDMSProcessRecord, OutResult<Int32> wErrorCode)
        {

            try
            {
                if (wDMSProcessRecord == null || StringUtils.isEmpty(wDMSProcessRecord.AssetNo))
                    return;
                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return;

                String wSQL = StringUtils.Format("update {0}.dms_device_processrecord set Active=0 " +
                    " where AssetNo=@wAssetNo AND OrderNo = @wOrderNo AND  MetroNo =@wMetroNo AND WorkPieceNo = @wWorkPieceNo AND Active = 1  ; ",
                  wInstance);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("wAssetNo", wDMSProcessRecord.AssetNo);
                wParamMap.Add("wOrderNo", wDMSProcessRecord.OrderNo);
                wParamMap.Add("wMetroNo", wDMSProcessRecord.MetroNo);
                wParamMap.Add("wWorkPieceNo", wDMSProcessRecord.WorkPieceNo);
                wParamMap.Add("wStartTime", wDMSProcessRecord.StartTime);
                wParamMap.Add("wEndTime", wDMSProcessRecord.EndTime);
                wParamMap.Add("wStatus", wDMSProcessRecord.Status);
                wParamMap.Add("wRemark", wDMSProcessRecord.Remark);

                mDBPool.update(wSQL, wParamMap);

                wSQL = StringUtils.Format("Insert into {0}.dms_device_processrecord (AssetNo,OrderNo,MetroNo,WorkPieceNo,StartTime,EndTime,Active,Status,Remark) values " +
                   " (@wAssetNo,@wOrderNo,@wMetroNo,@wWorkPieceNo,@wStartTime,@wEndTime,1,@wStatus,@wRemark) ; ",
                 wInstance);

                wDMSProcessRecord.ID = ((int)mDBPool.insert(wSQL, wParamMap));

                if (wDMSProcessRecord.ID > 0 && wDMSProcessRecord.ItemList != null && wDMSProcessRecord.ItemList.Count > 0)
                {
                    this.DMS_InsertProcessRecordItemList(wLoginUser, wDMSProcessRecord.ItemList, wDMSProcessRecord.ID, wErrorCode);
                }

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }
        public void DMS_InsertProcessRecordItemList(BMSEmployee wLoginUser, List<DMSProcessRecordItem> wDMSProcessRecordItemList, int wRecordID, OutResult<Int32> wErrorCode)
        {
            try
            {
                if (wRecordID <= 0 || wDMSProcessRecordItemList == null || wDMSProcessRecordItemList.Count <= 0)
                {
                    return;
                }

                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return;

                List<String> wValueStringList = new List<string>();

                String wValueTemp = "({0},'{1}','{2}','{3}')";

                foreach (DMSProcessRecordItem wDMSProcessRecordItem in wDMSProcessRecordItemList)
                {
                    if (wDMSProcessRecordItem == null || StringUtils.isEmpty(wDMSProcessRecordItem.ParameterNo))
                        continue;


                    if ( wDMSProcessRecordItem.SampleTime.Year <= 2010)
                        wDMSProcessRecordItem.SampleTime = DateTime.Now;

                    if (wDMSProcessRecordItem.ParameterValue == null)
                        wDMSProcessRecordItem.ParameterValue = "";

                    wValueStringList.Add(StringUtils.Format(wValueTemp, wRecordID, wDMSProcessRecordItem.ParameterNo,
                        wDMSProcessRecordItem.ParameterValue, wDMSProcessRecordItem.SampleTime.ToString("yyyy-MM-dd HH:mm:ss")));
                }


                String wSQL = StringUtils.Format("insert into {0}.dms_device_recorditem (RecordID,ParameterNo,ParameterValue,SampleTime) Values ", wInstance)
                    + StringUtils.Join(",", wValueStringList);


                mDBPool.update(wSQL, new Dictionary<string, object>());

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }
    }
}
