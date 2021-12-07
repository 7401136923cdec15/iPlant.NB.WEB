using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.SCADA.Service
{
    public class MSSMaterialOperationRecordDAO : BaseDAO
    {
        private static readonly log4net.ILog logger = log4net.LogManager.GetLogger(typeof(MSSMaterialOperationRecordDAO));
        private static MSSMaterialOperationRecordDAO Instance = null;

        private MSSMaterialOperationRecordDAO() : base()
        {

        }

        public static MSSMaterialOperationRecordDAO getInstance()
        {
            if (Instance == null)
                Instance = new MSSMaterialOperationRecordDAO();
            return Instance;
        }

        public List<MSSMaterialOperationRecord> GetMaterialStock(BMSEmployee wLoginUser, String wMaterialStoragePoint, String wMaterialNo,
                String wMaterialName, String wMaterialBatch, int wPageSize, int wPageIndex,int wPaging, OutResult<Int32> wPageCount, OutResult<Int32> wErrorCode)
        {
            List<MSSMaterialOperationRecord> wResult = new List<MSSMaterialOperationRecord>();
            try
            {

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                string wSqlCondition = @" from (select t.MaterialStoragePoint,t.MaterialID,t.MaterialBatch,t1.MaterialNo,t1.MaterialName,t1.Groes,
                               sum(case when t.OperationType in (2,5) then -1*t.Num else t.Num END) as Num from " + wInstance + ".mss_material_operationrecord t " +
                    "inner join " + wInstance + ".mss_material t1 on t.MaterialID=t1.ID" +
                    " left join " + wInstance + ".mbs_user t2 on t.CreatorID=t2.ID where t1.Active=1 ";
                if (!string.IsNullOrWhiteSpace(wMaterialStoragePoint))
                {
                    wSqlCondition += " and t.MaterialStoragePoint like @wMaterialStoragePoint";
                    wParamMap.Add("wMaterialStoragePoint", "%" + wMaterialStoragePoint + "%");
                }
                if (!string.IsNullOrWhiteSpace(wMaterialNo))
                {
                    wSqlCondition += " and t1.MaterialNo like @wMaterialNo";
                    wParamMap.Add("wMaterialNo", "%" + wMaterialNo + "%");
                }
                if (!string.IsNullOrWhiteSpace(wMaterialName))
                {
                    wSqlCondition += " and t1.MaterialName like @wMaterialName";
                    wParamMap.Add("wMaterialName", "%" + wMaterialName + "%");
                }
                if (!string.IsNullOrWhiteSpace(wMaterialBatch))
                {
                    wSqlCondition += " and t.MaterialBatch like @wMaterialBatch";
                    wParamMap.Add("wMaterialBatch", "%" + wMaterialBatch + "%");
                }
                wSqlCondition += " group by t.MaterialStoragePoint,t.MaterialID,t.MaterialBatch,t1.MaterialNo," +
                    "t1.MaterialName,t1.Groes ) t3";

                if (wPaging == 1)
                {
                    wPageCount.Result = this.GetPageCount(wSqlCondition, wPageSize, wParamMap);
                    if (wPageCount.Result <= 0)
                    {
                        wPageCount.Result = 1;

                        return wResult;
                    }
                }
                else
                {
                    wPageCount.Result = 1;
                }

                String wSQL = @"select t3.* " + wSqlCondition + " order by t3.MaterialNo ";
                if (wPaging==1) 
                {
                    wSQL += " limit " + wPageIndex * wPageSize + "," + wPageSize;
                }
                wSQL = this.DMLChange(wSQL);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);

                if (wQueryResult.Count <= 0)
                {
                    return wResult;
                }
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    MSSMaterialOperationRecord wMaterialOperationRecord = new MSSMaterialOperationRecord();

                    wMaterialOperationRecord.MaterialID = StringUtils.parseInt(wReader["MaterialID"]);
                    wMaterialOperationRecord.MaterialStoragePoint = StringUtils.parseString(wReader["MaterialStoragePoint"]);
                    wMaterialOperationRecord.MaterialNo = StringUtils.parseString(wReader["MaterialNo"]);
                    wMaterialOperationRecord.MaterialName = StringUtils.parseString(wReader["MaterialName"]);
                    wMaterialOperationRecord.Groes = StringUtils.parseString(wReader["Groes"]);
                    wMaterialOperationRecord.MaterialBatch = StringUtils.parseString(wReader["MaterialBatch"]);
                    wMaterialOperationRecord.Num = StringUtils.parseInt(wReader["Num"]);
                    wResult.Add(wMaterialOperationRecord);
                }

            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public void Add(BMSEmployee wLoginUser, MSSMaterialOperationRecord wMSSMaterialOperationRecord, OutResult<Int32> wErrorCode)
        {
            try
            {
                if (wMSSMaterialOperationRecord == null || wMSSMaterialOperationRecord.MaterialID<=0 || StringUtils.isEmpty(wMSSMaterialOperationRecord.MaterialStoragePoint)
                    || StringUtils.isEmpty(wMSSMaterialOperationRecord.MaterialBatch) || wMSSMaterialOperationRecord.OperationType<=0 || wMSSMaterialOperationRecord.Num <= 0)
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return;
                }

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("MaterialID", wMSSMaterialOperationRecord.MaterialID);
                wParamMap.Add("MaterialStoragePoint", wMSSMaterialOperationRecord.MaterialStoragePoint);
                wParamMap.Add("MaterialBatch", wMSSMaterialOperationRecord.MaterialBatch);
                wParamMap.Add("Num", wMSSMaterialOperationRecord.Num);
                wParamMap.Add("Remark", wMSSMaterialOperationRecord.Remark);
                wParamMap.Add("OperationType", wMSSMaterialOperationRecord.OperationType);
                wParamMap.Add("CreatorID", wLoginUser.ID);
                wParamMap.Add("CreateTime", DateTime.Now);
                wMSSMaterialOperationRecord.ID = this.Insert(StringUtils.Format("{0}.mss_material_operationrecord", wInstance), wParamMap);
            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }

        public List<MSSMaterialOperationRecord> GetMaterialOperationRecord(BMSEmployee wLoginUser, String wMaterialStoragePoint, String wMaterialNo,
               String wMaterialName, String wMaterialBatch,int wOperationType, int wPageSize, int wPageIndex, int wPaging, OutResult<Int32> wPageCount, OutResult<Int32> wErrorCode)
        {
            List<MSSMaterialOperationRecord> wResult = new List<MSSMaterialOperationRecord>();
            try
            {

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                string wSqlCondition = @"  from " + wInstance + ".mss_material_operationrecord t " +
                    " inner join " + wInstance + ".mss_material t1 on t.MaterialID=t1.ID " +
                    " left join " + wInstance + ".mbs_user t2 on t.CreatorID=t2.ID where t1.Active=1 ";
                if (!string.IsNullOrWhiteSpace(wMaterialStoragePoint))
                {
                    wSqlCondition += " and t.MaterialStoragePoint like @wMaterialStoragePoint";
                    wParamMap.Add("wMaterialStoragePoint", "%" + wMaterialStoragePoint + "%");
                }
                if (!string.IsNullOrWhiteSpace(wMaterialNo))
                {
                    wSqlCondition += " and t1.MaterialNo like @wMaterialNo";
                    wParamMap.Add("wMaterialNo", "%" + wMaterialNo + "%");
                }
                if (!string.IsNullOrWhiteSpace(wMaterialName))
                {
                    wSqlCondition += " and t1.MaterialName like @wMaterialName";
                    wParamMap.Add("wMaterialName", "%" + wMaterialName + "%");
                }
                if (!string.IsNullOrWhiteSpace(wMaterialBatch))
                {
                    wSqlCondition += " and t.MaterialBatch like @wMaterialBatch";
                    wParamMap.Add("wMaterialBatch", "%" + wMaterialBatch + "%");
                }
                if (wOperationType > 0)
                {
                    if (wOperationType == 3)
                    {
                        wSqlCondition += " and t.OperationType in (4,5)";
                    }
                    else
                    {
                        wSqlCondition += " and t.OperationType = @wOperationType";
                        wParamMap.Add("wOperationType", wOperationType);
                    }
                }

                if (wPaging == 1)
                {
                    wPageCount.Result = this.GetPageCount(wSqlCondition, wPageSize, wParamMap);
                    if (wPageCount.Result <= 0)
                    {
                        wPageCount.Result = 1;

                        return wResult;
                    }
                }
                else
                {
                    wPageCount.Result = 1;
                }

                String wSQL = @"Select t.*,(case t.OperationType when 1 then N'入库' when 2 then N'出库' when 4 then N'盘盈' when 5 then N'盘亏' else '' end) as OperationTypeName,
                              t1.MaterialNo,t1.MaterialName,t1.Groes,t2.Name as Creator  " + wSqlCondition + " order by t.Createtime ";
                if (wPaging == 1)
                {
                    wSQL += " limit " + wPageIndex * wPageSize + "," + wPageSize;
                }
                wSQL = this.DMLChange(wSQL);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);

                if (wQueryResult.Count <= 0)
                {
                    return wResult;
                }
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    MSSMaterialOperationRecord wMaterialOperationRecord = new MSSMaterialOperationRecord();

                    wMaterialOperationRecord.MaterialID = StringUtils.parseInt(wReader["MaterialID"]);
                    wMaterialOperationRecord.MaterialStoragePoint = StringUtils.parseString(wReader["MaterialStoragePoint"]);
                    wMaterialOperationRecord.MaterialNo = StringUtils.parseString(wReader["MaterialNo"]);
                    wMaterialOperationRecord.MaterialName = StringUtils.parseString(wReader["MaterialName"]);
                    wMaterialOperationRecord.Groes = StringUtils.parseString(wReader["Groes"]);
                    wMaterialOperationRecord.MaterialBatch = StringUtils.parseString(wReader["MaterialBatch"]);
                    wMaterialOperationRecord.OperationTypeName = StringUtils.parseString(wReader["OperationTypeName"]);
                    wMaterialOperationRecord.Num = StringUtils.parseInt(wReader["Num"]);
                    wMaterialOperationRecord.Creator = StringUtils.parseString(wReader["Creator"]);
                    wMaterialOperationRecord.CreateTime = StringUtils.parseDate(wReader["CreateTime"]);
                    wMaterialOperationRecord.Remark = StringUtils.parseString(wReader["Remark"]);
                    wResult.Add(wMaterialOperationRecord);
                }

            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }
    }
}
