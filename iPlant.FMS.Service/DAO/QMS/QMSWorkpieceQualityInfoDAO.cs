using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.SCADA.Service
{
    public class QMSWorkpieceQualityInfoDAO : BaseDAO
    {
        private static readonly log4net.ILog logger = log4net.LogManager.GetLogger(typeof(QMSWorkpieceQualityInfoDAO));
        private static QMSWorkpieceQualityInfoDAO Instance = null;

        private QMSWorkpieceQualityInfoDAO() : base()
        {

        }

        public static QMSWorkpieceQualityInfoDAO getInstance()
        {
            if (Instance == null)
                Instance = new QMSWorkpieceQualityInfoDAO();
            return Instance;
        }

        public List<QMSWorkpieceQualityInfo> GetAll(BMSEmployee wLoginUser, String wOrderNo,
                List<int> wProductIDList, String wWorkpieceNo, String wProcessStatus,int wLineID, String wStartTime, String wEndTime, int wPageSize, int wPageIndex, int wPaging, OutResult<Int32> wPageCount, OutResult<Int32> wErrorCode)
        {
            List<QMSWorkpieceQualityInfo> wResult = new List<QMSWorkpieceQualityInfo>();
            try
            {

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName(); 
                if (wErrorCode.Result != 0)
                    return wResult;

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                string wSqlCondition = string.Format(@" FROM {0}.qms_workpiece_qualityinfo t 
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
                if (wProcessStatus != "-1")
                {
                    wSqlCondition += " and t1.ProcessStatus = @wProcessStatus ";
                    wParamMap.Add("wProcessStatus", wProcessStatus);
                }
                if (!string.IsNullOrEmpty(wStartTime))
                {
                    wSqlCondition += " and t.FeedingTime >= @wStartTime ";
                    wParamMap.Add("wStartTime", Convert.ToDateTime(wStartTime));
                }
                if (!string.IsNullOrEmpty(wEndTime))
                {
                    wSqlCondition += " and t.FeedingTime <= @wEndTime ";
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

                String wSQL = string.Format(@"select t.*,t1.WorkpieceNo,t2.OrderNo,t3.ProductNo,t3.ProductName,t4.Name as StationName,
                           (select count(1) from {0}.qms_repairtask t5 where t5.WorkpieceID=t.WorkpieceID group by t5.WorkpieceID) as RepairCount,
                           (case t1.ProcessStatus when 0 then '未加工' when 1 then '加工中' when 2 then '已完成' when 3 then '已报废' else '' end) as ProcessStatusName {1} order by t.FeedingTime", wInstance, wSqlCondition);
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
                    QMSWorkpieceQualityInfo wSpotCheckRecord = new QMSWorkpieceQualityInfo();

                    wSpotCheckRecord.ID = StringUtils.parseInt(wReader["ID"]);
                    wSpotCheckRecord.WorkpieceID = StringUtils.parseInt(wReader["WorkpieceID"]);
                    wSpotCheckRecord.OrderNo = StringUtils.parseString(wReader["OrderNo"]);
                    wSpotCheckRecord.ProductNo = StringUtils.parseString(wReader["ProductNo"]);
                    wSpotCheckRecord.ProductName = StringUtils.parseString(wReader["ProductName"]);
                    wSpotCheckRecord.WorkpieceNo = StringUtils.parseString(wReader["WorkpieceNo"]);
                    wSpotCheckRecord.LargeDiameter = StringUtils.parseDouble(wReader["LargeDiameter"]);
                    wSpotCheckRecord.MiddleDiameter = StringUtils.parseDouble(wReader["MiddleDiameter"]);
                    wSpotCheckRecord.SmallDiameter = StringUtils.parseDouble(wReader["SmallDiameter"]);
                    wSpotCheckRecord.Pitch = StringUtils.parseDouble(wReader["Pitch"]);
                    wSpotCheckRecord.StationID = StringUtils.parseInt(wReader["StationID"]);
                    wSpotCheckRecord.StationName = StringUtils.parseString(wReader["StationName"]);
                    wSpotCheckRecord.SpotCheckResult = StringUtils.parseString(wReader["SpotCheckResult"]);
                    wSpotCheckRecord.PatrolCheckResult = StringUtils.parseString(wReader["PatrolCheckResult"]);
                    wSpotCheckRecord.RepairCount = StringUtils.parseInt(wReader["RepairCount"]);
                    wSpotCheckRecord.FeedingTime = StringUtils.parseDate(wReader["FeedingTime"]);
                    wSpotCheckRecord.BlankingTime = StringUtils.parseDate(wReader["BlankingTime"]);
                    wSpotCheckRecord.ProcessStatusName = StringUtils.parseString(wReader["ProcessStatusName"]);
                    wSpotCheckRecord.ThreeDimensionalResult = StringUtils.parseString(wReader["ThreeDimensionalResult"]);
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
