using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.SCADA.Service
{
    public class QMSOneTimePassRateDAO : BaseDAO
    {
        private static readonly log4net.ILog logger = log4net.LogManager.GetLogger(typeof(QMSOneTimePassRateDAO));
        private static QMSOneTimePassRateDAO Instance = null;

        private QMSOneTimePassRateDAO() : base()
        {

        }

        public static QMSOneTimePassRateDAO getInstance()
        {
            if (Instance == null)
                Instance = new QMSOneTimePassRateDAO();
            return Instance;
        }

        public List<QMSOneTimePassRate> GetAll(BMSEmployee wLoginUser,
                List<int> wProductIDList, int wStatType, int wLineID, DateTime wStartTime, DateTime wEndTime, int wPageSize, int wPageIndex, OutResult<Int32> wPageCount, OutResult<Int32> wErrorCode)
        {
            List<QMSOneTimePassRate> wResult = new List<QMSOneTimePassRate>();
            try
            {
                switch (wStatType)
                {
                    case ((int)DMSStatTypes.Week):
                        wResult = this.GetOneTimePassRateWeekList(wLoginUser, wProductIDList, wLineID,
                             wStartTime, wEndTime, wPageSize, wPageIndex, wPageCount,
                             wErrorCode);
                        break;
                    case ((int)DMSStatTypes.Month):
                        wResult = this.GetOneTimePassRateMonthList(wLoginUser, wProductIDList, wLineID,
                             wStartTime, wEndTime, wPageSize, wPageIndex, wPageCount,
                             wErrorCode);
                        break;
                    default:
                        wResult = this.GetOneTimePassRateList(wLoginUser, wProductIDList, wLineID,
                             wStartTime, wEndTime, wPageSize, wPageIndex, wPageCount,
                             wErrorCode);
                        break;
                }
            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public List<QMSOneTimePassRate> GetOneTimePassRateList(BMSEmployee wLoginUser,
                List<int> wProductIDList, int wLineID, DateTime wStartTime, DateTime wEndTime, int wPageSize, int wPageIndex, OutResult<Int32> wPageCount, OutResult<Int32> wErrorCode)
        {
            List<QMSOneTimePassRate> wResult = new List<QMSOneTimePassRate>();
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
                                                   where (@wLineID<=0 or t2.LineID=@wLineID) ", wInstance);
                if (wProductIDList.Count > 0)
                {
                    wSqlCondition += " and t3.ID IN (" + StringUtils.Join(",", wProductIDList) + ")";
                }
                wSqlCondition += " and t.FeedingTime >= @wStartTime ";
                wParamMap.Add("wStartTime", wStartTime);

                wParamMap.Add("wLineID", wLineID);

                wSqlCondition += " and t.FeedingTime < @wEndTime ";
                wParamMap.Add("wEndTime", wEndTime);

                wSqlCondition += "  group by t3.ProductNo,t3.ProductName,DATE_FORMAT(t.FeedingTime,'%Y-%m-%d')";
                if (wPageSize > 0)
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

                String wSQL = @"select t3.ProductNo,t3.ProductName,DATE_FORMAT(t.FeedingTime,'%Y-%m-%d') as StrDate,
                      COUNT((t1.ProcessStatus = 2 and IFNULL((select count(1) from " + wInstance + ".qms_repairtask t5 where t5.WorkpieceID = t.WorkpieceID " +
                      "group by t5.WorkpieceID), 0) = 0) or null) as OneTimePassNum,COUNT(1) as FeedingNum,COUNT(t1.ProcessStatus = 2 or null) as Num," +
                      "COUNT(((t.SpotCheckResult = 'NG' or t.PatrolCheckResult = 'NG' or t.ThreeDimensionalResult = 'NG') and t1.ProcessStatus = 2 ) or null) as NGNum "
                      + wSqlCondition + " order by DATE_FORMAT(t.FeedingTime,'%Y-%m-%d')";
                if (wPageSize > 0)
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
                    QMSOneTimePassRate wSpotCheckRecord = new QMSOneTimePassRate();
                    wSpotCheckRecord.ProductNo = StringUtils.parseString(wReader["ProductNo"]);
                    wSpotCheckRecord.ProductName = StringUtils.parseString(wReader["ProductName"]);
                    DateTime strDate = StringUtils.parseDate(wReader["StrDate"]);
                    wSpotCheckRecord.StrDate = strDate.Year.ToString() + "年" + strDate.Month.ToString() + "月" + strDate.Day.ToString() + "日";
                    wSpotCheckRecord.OneTimePassNum = StringUtils.parseInt(wReader["OneTimePassNum"]);
                    wSpotCheckRecord.FeedingNum = StringUtils.parseInt(wReader["FeedingNum"]);
                    wSpotCheckRecord.Num = StringUtils.parseInt(wReader["Num"]);
                    wSpotCheckRecord.NGNum = StringUtils.parseInt(wReader["NGNum"]);
                    wSpotCheckRecord.OKNum = wSpotCheckRecord.Num - wSpotCheckRecord.NGNum;
                    wSpotCheckRecord.OneTimePassRate = Math.Round(Convert.ToDouble(wSpotCheckRecord.OneTimePassNum) / Convert.ToDouble(wSpotCheckRecord.Num) * 100, 2);
                    wSpotCheckRecord.PassRate = Math.Round(Convert.ToDouble(wSpotCheckRecord.OKNum) / Convert.ToDouble(wSpotCheckRecord.Num) * 100, 2); ;
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

        public List<QMSOneTimePassRate> GetOneTimePassRateWeekList(BMSEmployee wLoginUser,
        List<int> wProductIDList, int wLineID, DateTime wStartTime, DateTime wEndTime, int wPageSize, int wPageIndex, OutResult<Int32> wPageCount, OutResult<Int32> wErrorCode)
        {
            List<QMSOneTimePassRate> wResult = new List<QMSOneTimePassRate>();
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
                                                   where (@wLineID<=0 or t2.LineID=@wLineID) ", wInstance);


                wParamMap.Add("wLineID", wLineID);

                if (wProductIDList.Count > 0)
                {
                    wSqlCondition += " and t3.ID IN (" + StringUtils.Join(",", wProductIDList) + ")";
                }
                wSqlCondition += " and str_to_date( DATE_FORMAT(t.FeedingTime,'%Y-%u-1'),'%Y-%u-%w') >= str_to_date( DATE_FORMAT(@wStartTime,'%Y-%u-1'),'%Y-%u-%w') ";
                wParamMap.Add("wStartTime", Convert.ToDateTime(wStartTime));

                wSqlCondition += " and str_to_date( DATE_FORMAT(t.FeedingTime,'%Y-%u-1'),'%Y-%u-%w') < str_to_date( DATE_FORMAT(@wEndTime,'%Y-%u-1'),'%Y-%u-%w')";
                wParamMap.Add("wEndTime", Convert.ToDateTime(wEndTime));

                wSqlCondition += "  group by t3.ProductNo,t3.ProductName,str_to_date( DATE_FORMAT(t.FeedingTime,'%Y-%u-1'),'%Y-%u-%w')";
                if (wPageSize > 0)
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

                String wSQL = @"select t3.ProductNo,t3.ProductName,str_to_date( DATE_FORMAT(t.FeedingTime,'%Y-%u-1'),'%Y-%u-%w') as StrDate,
                      COUNT((t1.ProcessStatus = 2 and IFNULL((select count(1) from " + wInstance + ".qms_repairtask t5 where t5.WorkpieceID = t.WorkpieceID " +
                      "group by t5.WorkpieceID), 0) = 0) or null) as OneTimePassNum,COUNT(1) as FeedingNum,COUNT(t1.ProcessStatus = 2 or null) as Num," +
                      "COUNT(((t.SpotCheckResult = 'NG' or t.PatrolCheckResult = 'NG' or t.ThreeDimensionalResult = 'NG') and t1.ProcessStatus = 2 ) or null) as NGNum "
                      + wSqlCondition + " order by str_to_date( DATE_FORMAT(t.FeedingTime,'%Y-%u-1'),'%Y-%u-%w')";
                if (wPageSize > 0)
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
                    QMSOneTimePassRate wSpotCheckRecord = new QMSOneTimePassRate();
                    wSpotCheckRecord.ProductNo = StringUtils.parseString(wReader["ProductNo"]);
                    wSpotCheckRecord.ProductName = StringUtils.parseString(wReader["ProductName"]);
                    DateTime strDate = StringUtils.parseDate(wReader["StrDate"]);
                    wSpotCheckRecord.StrDate = strDate.Year.ToString() + "年第" + (strDate.DayOfYear / 7 + 1).ToString() + "周";
                    wSpotCheckRecord.OneTimePassNum = StringUtils.parseInt(wReader["OneTimePassNum"]);
                    wSpotCheckRecord.FeedingNum = StringUtils.parseInt(wReader["FeedingNum"]);
                    wSpotCheckRecord.Num = StringUtils.parseInt(wReader["Num"]);
                    wSpotCheckRecord.NGNum = StringUtils.parseInt(wReader["NGNum"]);
                    wSpotCheckRecord.OKNum = wSpotCheckRecord.Num - wSpotCheckRecord.NGNum;
                    wSpotCheckRecord.OneTimePassRate = Math.Round(Convert.ToDouble(wSpotCheckRecord.OneTimePassNum) / Convert.ToDouble(wSpotCheckRecord.Num) * 100, 2);
                    wSpotCheckRecord.PassRate = Math.Round(Convert.ToDouble(wSpotCheckRecord.OKNum) / Convert.ToDouble(wSpotCheckRecord.Num) * 100, 2); ;
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

        public List<QMSOneTimePassRate> GetOneTimePassRateMonthList(BMSEmployee wLoginUser,
        List<int> wProductIDList, int wLineID, DateTime wStartTime, DateTime wEndTime, int wPageSize, int wPageIndex, OutResult<Int32> wPageCount, OutResult<Int32> wErrorCode)
        {
            List<QMSOneTimePassRate> wResult = new List<QMSOneTimePassRate>();
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
                                                    where (@wLineID<=0 or t2.LineID=@wLineID) ", wInstance);

                wParamMap.Add("wLineID", wLineID);
                if (wProductIDList.Count > 0)
                {
                    wSqlCondition += " and t3.ID IN (" + StringUtils.Join(",", wProductIDList) + ")";
                }
                wSqlCondition += " and str_to_date( DATE_FORMAT(t.FeedingTime,'%Y-%m-1'),'%Y-%m-%d') >= str_to_date( DATE_FORMAT(@wStartTime,'%Y-%m-1'),'%Y-%m-%d')";
                wParamMap.Add("wStartTime", Convert.ToDateTime(wStartTime));

                wSqlCondition += " and str_to_date( DATE_FORMAT(t.FeedingTime,'%Y-%m-1'),'%Y-%m-%d') < str_to_date( DATE_FORMAT(@wEndTime,'%Y-%m-1'),'%Y-%m-%d')";
                wParamMap.Add("wEndTime", Convert.ToDateTime(wEndTime));

                wSqlCondition += "  group by t3.ProductNo,t3.ProductName,str_to_date( DATE_FORMAT(t.FeedingTime,'%Y-%m-1'),'%Y-%m-%d')";
                if (wPageSize > 0)
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

                String wSQL = @"select t3.ProductNo,t3.ProductName,str_to_date( DATE_FORMAT(t.FeedingTime,'%Y-%m-1'),'%Y-%m-%d') as StrDate,
                      COUNT((t1.ProcessStatus = 2 and IFNULL((select count(1) from " + wInstance + ".qms_repairtask t5 where t5.WorkpieceID = t.WorkpieceID " +
                      "group by t5.WorkpieceID), 0) = 0) or null) as OneTimePassNum,COUNT(1) as FeedingNum,COUNT(t1.ProcessStatus = 2 or null) as Num," +
                      "COUNT(((t.SpotCheckResult = 'NG' or t.PatrolCheckResult = 'NG' or t.ThreeDimensionalResult = 'NG') and t1.ProcessStatus = 2 ) or null) as NGNum "
                      + wSqlCondition + " order by str_to_date( DATE_FORMAT(t.FeedingTime,'%Y-%m-1'),'%Y-%m-%d')";
                if (wPageSize > 0)
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
                    QMSOneTimePassRate wSpotCheckRecord = new QMSOneTimePassRate();
                    wSpotCheckRecord.ProductNo = StringUtils.parseString(wReader["ProductNo"]);
                    wSpotCheckRecord.ProductName = StringUtils.parseString(wReader["ProductName"]);
                    DateTime strDate = StringUtils.parseDate(wReader["StrDate"]);
                    wSpotCheckRecord.StrDate = strDate.Year.ToString() + "年" + strDate.Month.ToString() + "月";
                    wSpotCheckRecord.OneTimePassNum = StringUtils.parseInt(wReader["OneTimePassNum"]);
                    wSpotCheckRecord.FeedingNum = StringUtils.parseInt(wReader["FeedingNum"]);
                    wSpotCheckRecord.Num = StringUtils.parseInt(wReader["Num"]);
                    wSpotCheckRecord.NGNum = StringUtils.parseInt(wReader["NGNum"]);
                    wSpotCheckRecord.OKNum = wSpotCheckRecord.Num - wSpotCheckRecord.NGNum;
                    wSpotCheckRecord.OneTimePassRate = Math.Round(Convert.ToDouble(wSpotCheckRecord.OneTimePassNum) / Convert.ToDouble(wSpotCheckRecord.Num) * 100, 2);
                    wSpotCheckRecord.PassRate = Math.Round(Convert.ToDouble(wSpotCheckRecord.OKNum) / Convert.ToDouble(wSpotCheckRecord.Num) * 100, 2); ;
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

        public List<QMSOneTimePassRate> GetAllForChart(BMSEmployee wLoginUser,
        List<int> wProductIDList, int wStatType, int wLineID, DateTime wStartTime, DateTime wEndTime, OutResult<Int32> wErrorCode)
        {
            List<QMSOneTimePassRate> wResult = new List<QMSOneTimePassRate>();
            try
            {
                switch (wStatType)
                {
                    case ((int)DMSStatTypes.Week):
                        wResult = this.GetOneTimePassRateForChartWeekList(wLoginUser, wProductIDList, wLineID,
                             wStartTime, wEndTime, wErrorCode);
                        break;
                    case ((int)DMSStatTypes.Month):
                        wResult = this.GetOneTimePassRateForChartMonthList(wLoginUser, wProductIDList, wLineID,
                             wStartTime, wEndTime, wErrorCode);
                        break;
                    default:
                        wResult = this.GetOneTimePassRateForChartList(wLoginUser, wProductIDList, wLineID,
                            wStartTime, wEndTime, wErrorCode);
                        break;
                }
            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public List<QMSOneTimePassRate> GetOneTimePassRateForChartList(BMSEmployee wLoginUser,
                List<int> wProductIDList, int wLineID, DateTime wStartTime, DateTime wEndTime, OutResult<Int32> wErrorCode)
        {
            List<QMSOneTimePassRate> wResult = new List<QMSOneTimePassRate>();
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
                                                  where (@wLineID<=0 or t2.LineID=@wLineID) ", wInstance);

                wParamMap.Add("wLineID", wLineID);
                if (wProductIDList.Count > 0)
                {
                    wSqlCondition += " and t3.ID IN (" + StringUtils.Join(",", wProductIDList) + ")";
                }
                wSqlCondition += " and t.FeedingTime >= @wStartTime ";
                wParamMap.Add("wStartTime", Convert.ToDateTime(wStartTime));

                wSqlCondition += " and t.FeedingTime < @wEndTime ";
                wParamMap.Add("wEndTime", Convert.ToDateTime(wEndTime));

                wSqlCondition += "  group by DATE_FORMAT(t.FeedingTime,'%Y-%m-%d')";

                String wSQL = @"select DATE_FORMAT(t.FeedingTime,'%Y-%m-%d') as StrDate,
                      COUNT((t1.ProcessStatus = 2 and IFNULL((select count(1) from " + wInstance + ".qms_repairtask t5 where t5.WorkpieceID = t.WorkpieceID " +
                      "group by t5.WorkpieceID), 0) = 0) or null) as OneTimePassNum,COUNT(1) as FeedingNum,COUNT(t1.ProcessStatus = 2 or null) as Num," +
                      "COUNT(((t.SpotCheckResult = 'NG' or t.PatrolCheckResult = 'NG' or t.ThreeDimensionalResult = 'NG') and t1.ProcessStatus = 2 ) or null) as NGNum "
                      + wSqlCondition + " order by DATE_FORMAT(t.FeedingTime,'%Y-%m-%d')";

                wSQL = this.DMLChange(wSQL);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);

                if (wQueryResult.Count <= 0)
                {
                    return wResult;
                }
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    QMSOneTimePassRate wSpotCheckRecord = new QMSOneTimePassRate();
                    DateTime strDate = StringUtils.parseDate(wReader["StrDate"]);
                    wSpotCheckRecord.StrDate = strDate.Year.ToString() + "年" + strDate.Month.ToString() + "月" + strDate.Day.ToString() + "日";
                    wSpotCheckRecord.OneTimePassNum = StringUtils.parseInt(wReader["OneTimePassNum"]);
                    wSpotCheckRecord.FeedingNum = StringUtils.parseInt(wReader["FeedingNum"]);
                    wSpotCheckRecord.Num = StringUtils.parseInt(wReader["Num"]);
                    wSpotCheckRecord.NGNum = StringUtils.parseInt(wReader["NGNum"]);
                    wSpotCheckRecord.OKNum = wSpotCheckRecord.Num - wSpotCheckRecord.NGNum;
                    wSpotCheckRecord.OneTimePassRate = Math.Round(Convert.ToDouble(wSpotCheckRecord.OneTimePassNum) / Convert.ToDouble(wSpotCheckRecord.Num) * 100, 2);
                    wSpotCheckRecord.PassRate = Math.Round(Convert.ToDouble(wSpotCheckRecord.OKNum) / Convert.ToDouble(wSpotCheckRecord.Num) * 100, 2); ;
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

        public List<QMSOneTimePassRate> GetOneTimePassRateForChartWeekList(BMSEmployee wLoginUser,
        List<int> wProductIDList, int wLineID, DateTime wStartTime, DateTime wEndTime, OutResult<Int32> wErrorCode)
        {
            List<QMSOneTimePassRate> wResult = new List<QMSOneTimePassRate>();
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
                                                  where (@wLineID<=0 or t2.LineID=@wLineID) ", wInstance);
                wParamMap.Add("wLineID", wLineID);
                if (wProductIDList.Count > 0)
                {
                    wSqlCondition += " and t3.ID IN (" + StringUtils.Join(",", wProductIDList) + ")";
                }
                wSqlCondition += " and str_to_date( DATE_FORMAT(t.FeedingTime,'%Y-%u-1'),'%Y-%u-%w') >= str_to_date( DATE_FORMAT(@wStartTime,'%Y-%u-1'),'%Y-%u-%w')";
                wParamMap.Add("wStartTime", Convert.ToDateTime(wStartTime));

                wSqlCondition += " and str_to_date( DATE_FORMAT(t.FeedingTime,'%Y-%u-1'),'%Y-%u-%w') < str_to_date( DATE_FORMAT(@wEndTime,'%Y-%u-1'),'%Y-%u-%w')";
                wParamMap.Add("wEndTime", Convert.ToDateTime(wEndTime));

                wSqlCondition += "  group by str_to_date( DATE_FORMAT(t.FeedingTime,'%Y-%u-1'),'%Y-%u-%w')";

                String wSQL = @"select str_to_date( DATE_FORMAT(t.FeedingTime,'%Y-%u-1'),'%Y-%u-%w') as StrDate,
                      COUNT((t1.ProcessStatus = 2 and IFNULL((select count(1) from " + wInstance + ".qms_repairtask t5 where t5.WorkpieceID = t.WorkpieceID " +
                      "group by t5.WorkpieceID), 0) = 0) or null) as OneTimePassNum,COUNT(1) as FeedingNum,COUNT(t1.ProcessStatus = 2 or null) as Num," +
                      "COUNT(((t.SpotCheckResult = 'NG' or t.PatrolCheckResult = 'NG' or t.ThreeDimensionalResult = 'NG') and t1.ProcessStatus = 2 ) or null) as NGNum "
                      + wSqlCondition + " order by str_to_date( DATE_FORMAT(t.FeedingTime,'%Y-%u-1'),'%Y-%u-%w')";

                wSQL = this.DMLChange(wSQL);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);

                if (wQueryResult.Count <= 0)
                {
                    return wResult;
                }
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    QMSOneTimePassRate wSpotCheckRecord = new QMSOneTimePassRate();
                    DateTime strDate = StringUtils.parseDate(wReader["StrDate"]);
                    wSpotCheckRecord.StrDate = strDate.Year.ToString() + "年第" + (strDate.DayOfYear / 7 + 1).ToString() + "周";
                    wSpotCheckRecord.OneTimePassNum = StringUtils.parseInt(wReader["OneTimePassNum"]);
                    wSpotCheckRecord.FeedingNum = StringUtils.parseInt(wReader["FeedingNum"]);
                    wSpotCheckRecord.Num = StringUtils.parseInt(wReader["Num"]);
                    wSpotCheckRecord.NGNum = StringUtils.parseInt(wReader["NGNum"]);
                    wSpotCheckRecord.OKNum = wSpotCheckRecord.Num - wSpotCheckRecord.NGNum;
                    wSpotCheckRecord.OneTimePassRate = Math.Round(Convert.ToDouble(wSpotCheckRecord.OneTimePassNum) / Convert.ToDouble(wSpotCheckRecord.Num) * 100, 2);
                    wSpotCheckRecord.PassRate = Math.Round(Convert.ToDouble(wSpotCheckRecord.OKNum) / Convert.ToDouble(wSpotCheckRecord.Num) * 100, 2); ;
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

        public List<QMSOneTimePassRate> GetOneTimePassRateForChartMonthList(BMSEmployee wLoginUser,
        List<int> wProductIDList, int wLineID, DateTime wStartTime, DateTime wEndTime, OutResult<Int32> wErrorCode)
        {
            List<QMSOneTimePassRate> wResult = new List<QMSOneTimePassRate>();
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
                                                    where(@wLineID <= 0 or t2.LineID = @wLineID) ", wInstance);
                wParamMap.Add("wLineID", wLineID);
                if (wProductIDList.Count > 0)
                {
                    wSqlCondition += " and t3.ID IN (" + StringUtils.Join(",", wProductIDList) + ")";
                }
                wSqlCondition += " and str_to_date( DATE_FORMAT(t.FeedingTime,'%Y-%m-1'),'%Y-%m-%d') >= str_to_date( DATE_FORMAT(@wStartTime,'%Y-%m-1'),'%Y-%m-%d')";
                wParamMap.Add("wStartTime", Convert.ToDateTime(wStartTime));

                wSqlCondition += " and str_to_date( DATE_FORMAT(t.FeedingTime,'%Y-%m-1'),'%Y-%m-%d') < str_to_date( DATE_FORMAT(@wEndTime,'%Y-%m-1'),'%Y-%m-%d')";
                wParamMap.Add("wEndTime", Convert.ToDateTime(wEndTime));

                wSqlCondition += "  group by str_to_date( DATE_FORMAT(t.FeedingTime,'%Y-%m-1'),'%Y-%m-%d')";

                String wSQL = @"select str_to_date( DATE_FORMAT(t.FeedingTime,'%Y-%m-1'),'%Y-%m-%d') as StrDate,
                      COUNT((t1.ProcessStatus = 2 and IFNULL((select count(1) from " + wInstance + ".qms_repairtask t5 where t5.WorkpieceID = t.WorkpieceID " +
                      "group by t5.WorkpieceID), 0) = 0) or null) as OneTimePassNum,COUNT(1) as FeedingNum,COUNT(t1.ProcessStatus = 2 or null) as Num," +
                      "COUNT(((t.SpotCheckResult = 'NG' or t.PatrolCheckResult = 'NG' or t.ThreeDimensionalResult = 'NG') and t1.ProcessStatus = 2 ) or null) as NGNum "
                      + wSqlCondition + " order by str_to_date( DATE_FORMAT(t.FeedingTime,'%Y-%m-1'),'%Y-%m-%d')";

                wSQL = this.DMLChange(wSQL);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);

                if (wQueryResult.Count <= 0)
                {
                    return wResult;
                }
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    QMSOneTimePassRate wSpotCheckRecord = new QMSOneTimePassRate();
                    DateTime strDate = StringUtils.parseDate(wReader["StrDate"]);
                    wSpotCheckRecord.StrDate = strDate.Year.ToString() + "年" + strDate.Month.ToString() + "月";
                    wSpotCheckRecord.OneTimePassNum = StringUtils.parseInt(wReader["OneTimePassNum"]);
                    wSpotCheckRecord.FeedingNum = StringUtils.parseInt(wReader["FeedingNum"]);
                    wSpotCheckRecord.Num = StringUtils.parseInt(wReader["Num"]);
                    wSpotCheckRecord.NGNum = StringUtils.parseInt(wReader["NGNum"]);
                    wSpotCheckRecord.OKNum = wSpotCheckRecord.Num - wSpotCheckRecord.NGNum;
                    wSpotCheckRecord.OneTimePassRate = Math.Round(Convert.ToDouble(wSpotCheckRecord.OneTimePassNum) / Convert.ToDouble(wSpotCheckRecord.Num) * 100, 2);
                    wSpotCheckRecord.PassRate = Math.Round(Convert.ToDouble(wSpotCheckRecord.OKNum) / Convert.ToDouble(wSpotCheckRecord.Num) * 100, 2); ;
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
