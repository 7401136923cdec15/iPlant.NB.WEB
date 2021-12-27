using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.SCADA.Service
{
    public class QMSWorkpieceRepairRecordDAO : BaseDAO
    {
        private static readonly log4net.ILog logger = log4net.LogManager.GetLogger(typeof(QMSWorkpieceRepairRecordDAO));
        private static QMSWorkpieceRepairRecordDAO Instance = null;

        private QMSWorkpieceRepairRecordDAO() : base()
        {

        }

        public static QMSWorkpieceRepairRecordDAO getInstance()
        {
            if (Instance == null)
                Instance = new QMSWorkpieceRepairRecordDAO();
            return Instance;
        }

        public List<QMSWorkpieceRepairRecord> GetAll(BMSEmployee wLoginUser, String wOrderNo,
                List<int> wProductIDList, String wWorkpieceNo, int wLineID,String wStartTime, String wEndTime, int wPageSize, int wPageIndex, int wPaging, OutResult<Int32> wPageCount, OutResult<Int32> wErrorCode)
        {
            List<QMSWorkpieceRepairRecord> wResult = new List<QMSWorkpieceRepairRecord>();
            try
            {

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName(); 
                if (wErrorCode.Result != 0)
                    return wResult;

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                string wSqlCondition = string.Format(@" FROM {0}.qms_repairtask t 
                                                   left join {0}.oms_workpiece t1 on t1.ID = t.WorkpieceID
                                                   left join {0}.oms_order t2 on t2.ID = t1.OrderID
                                                   left join {0}.fpc_product t3 on t3.ID = t2.ProductID
                                                   left join {0}.fmc_station t4 on t4.ID = t.StationID
                                                  where (@wLineID<=0 or t2.LineID=@wLineID) ", wInstance);
                wParamMap.Add("wLineID", wLineID);
                if (!string.IsNullOrEmpty(wOrderNo))
                {
                    wSqlCondition += " and t2.OrderNo LIKE @wOrderNo ";
                    wParamMap.Add("wOrderNo", "%" + wOrderNo + "%");
                }
                if (wProductIDList.Count>0) 
                {
                    wSqlCondition += " and t3.ID IN ("+ StringUtils.Join(",", wProductIDList) + ")";
                }
                if (!string.IsNullOrEmpty(wWorkpieceNo))
                {
                    wSqlCondition += " and t1.WorkpieceNo LIKE @wWorkpieceNo ";
                    wParamMap.Add("wWorkpieceNo", "%" + wWorkpieceNo + "%");
                }
                if (!string.IsNullOrEmpty(wStartTime))
                {
                    wSqlCondition += " and t.RepairStartDate >= @wStartTime ";
                    wParamMap.Add("wStartTime", Convert.ToDateTime(wStartTime));
                }
                if (!string.IsNullOrEmpty(wEndTime))
                {
                    wSqlCondition += " and t.RepairStartDate <= @wEndTime ";
                    wParamMap.Add("wEndTime", Convert.ToDateTime(wEndTime));
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

                String wSQL = "select t.ID,t.RepairStartDate,t.RepairEndDate,t.RepairReason,t1.WorkpieceNo,t2.OrderNo,t3.ProductNo,t3.ProductName,t4.Name as StationName," +
                    "ROUND(TIMESTAMPDIFF(SECOND,t.RepairStartDate,t.RepairEndDate)/3600,2) as RepairTimeCount " + wSqlCondition + " order by t.RepairStartDate";
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
                    QMSWorkpieceRepairRecord wSpotCheckRecord = new QMSWorkpieceRepairRecord();

                    wSpotCheckRecord.ID = StringUtils.parseInt(wReader["ID"]);
                    wSpotCheckRecord.OrderNo = StringUtils.parseString(wReader["OrderNo"]);
                    wSpotCheckRecord.ProductNo = StringUtils.parseString(wReader["ProductNo"]);
                    wSpotCheckRecord.ProductName = StringUtils.parseString(wReader["ProductName"]);
                    wSpotCheckRecord.WorkpieceNo = StringUtils.parseString(wReader["WorkpieceNo"]);
                    wSpotCheckRecord.StationName = StringUtils.parseString(wReader["StationName"]);
                    wSpotCheckRecord.RepairStartDate = StringUtils.parseDate(wReader["RepairStartDate"]);
                    wSpotCheckRecord.RepairEndDate = StringUtils.parseDate(wReader["RepairEndDate"]);
                    wSpotCheckRecord.RepairTimeCount = StringUtils.parseDouble(wReader["RepairTimeCount"]);
                    wSpotCheckRecord.RepairReason = StringUtils.parseString(wReader["RepairReason"]);
                    wResult.Add(wSpotCheckRecord);
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
