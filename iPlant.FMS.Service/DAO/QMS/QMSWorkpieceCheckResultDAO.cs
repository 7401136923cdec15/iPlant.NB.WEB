using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.SCADA.Service
{
    public class QMSWorkpieceCheckResultDAO : BaseDAO
    {
        private static readonly log4net.ILog logger = log4net.LogManager.GetLogger(typeof(QMSWorkpieceCheckResultDAO));
        private static QMSWorkpieceCheckResultDAO Instance = null;

        private QMSWorkpieceCheckResultDAO() : base()
        {

        }

        public static QMSWorkpieceCheckResultDAO getInstance()
        {
            if (Instance == null)
                Instance = new QMSWorkpieceCheckResultDAO();
            return Instance;
        }

        public List<QMSWorkpieceCheckResult> GetAll(BMSEmployee wLoginUser, String wOrderNo,
                List<int> wProductIDList, String wWorkpieceNo, String wStartTime, String wEndTime, int wPageSize, int wPageIndex, int wPaging, OutResult<Int32> wPageCount, OutResult<Int32> wErrorCode)
        {
            List<QMSWorkpieceCheckResult> wResult = new List<QMSWorkpieceCheckResult>();
            try
            {

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();
                String LineID = iPlant.Data.EF.MESDBSource.getLineID();
                if (wErrorCode.Result != 0)
                    return wResult;

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                string wSqlCondition = string.Format(@" FROM {0}.qms_workpiece_checkresult t 
                                                   left join {0}.oms_workpiece t1 on t1.ID = t.WorkpieceID
                                                   left join {0}.oms_order t2 on t2.ID = t1.OrderID
                                                   left join {0}.fpc_product t3 on t3.ID = t2.ProductID
                                                   where t2.LineID={1} ", wInstance, LineID);
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
                    wSqlCondition += " and t.CreateTime >= @wStartTime ";
                    wParamMap.Add("wStartTime", Convert.ToDateTime(wStartTime));
                }
                if (!string.IsNullOrEmpty(wEndTime))
                {
                    wSqlCondition += " and t.CreateTime <= @wEndTime ";
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

                String wSQL = "select t.*,t1.WorkpieceNo,t2.OrderNo,t3.ProductNo,t3.ProductName  " + wSqlCondition + " order by t.CreateTime";
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
                    QMSWorkpieceCheckResult wSpotCheckRecord = new QMSWorkpieceCheckResult();

                    wSpotCheckRecord.ID = StringUtils.parseInt(wReader["ID"]);
                    wSpotCheckRecord.OrderNo = StringUtils.parseString(wReader["OrderNo"]);
                    wSpotCheckRecord.ProductNo = StringUtils.parseString(wReader["ProductNo"]);
                    wSpotCheckRecord.ProductName = StringUtils.parseString(wReader["ProductName"]);
                    wSpotCheckRecord.WorkpieceNo = StringUtils.parseString(wReader["WorkpieceNo"]);
                    wSpotCheckRecord.LargeDiameter = StringUtils.parseDouble(wReader["LargeDiameter"]);
                    wSpotCheckRecord.MiddleDiameter = StringUtils.parseDouble(wReader["MiddleDiameter"]);
                    wSpotCheckRecord.SmallDiameter = StringUtils.parseDouble(wReader["SmallDiameter"]);
                    wSpotCheckRecord.Pitch = StringUtils.parseDouble(wReader["Pitch"]);
                    wSpotCheckRecord.CheckParameter1 = StringUtils.parseDouble(wReader["CheckParameter1"]);
                    wSpotCheckRecord.CheckParameter2 = StringUtils.parseDouble(wReader["CheckParameter2"]);
                    wSpotCheckRecord.CheckParameter3 = StringUtils.parseDouble(wReader["CheckParameter3"]);
                    wSpotCheckRecord.CheckParameter4 = StringUtils.parseDouble(wReader["CheckParameter4"]);
                    wSpotCheckRecord.CheckParameter5 = StringUtils.parseDouble(wReader["CheckParameter5"]);
                    wSpotCheckRecord.CheckParameter6 = StringUtils.parseDouble(wReader["CheckParameter6"]);
                    wSpotCheckRecord.CheckParameter7 = StringUtils.parseDouble(wReader["CheckParameter7"]);
                    wSpotCheckRecord.CheckParameter8 = StringUtils.parseDouble(wReader["CheckParameter8"]);
                    wSpotCheckRecord.CheckParameter9 = StringUtils.parseDouble(wReader["CheckParameter9"]);
                    wSpotCheckRecord.CheckParameter10 = StringUtils.parseDouble(wReader["CheckParameter10"]);
                    wSpotCheckRecord.CheckParameter11 = StringUtils.parseDouble(wReader["CheckParameter11"]);
                    wSpotCheckRecord.CheckParameter12 = StringUtils.parseDouble(wReader["CheckParameter12"]);
                    wSpotCheckRecord.CheckParameter13 = StringUtils.parseDouble(wReader["CheckParameter13"]);
                    wSpotCheckRecord.CheckParameter14 = StringUtils.parseDouble(wReader["CheckParameter14"]);
                    wSpotCheckRecord.CheckParameter15 = StringUtils.parseDouble(wReader["CheckParameter15"]);
                    wSpotCheckRecord.CreateTime = StringUtils.parseDate(wReader["CreateTime"]);
                    wSpotCheckRecord.CheckResult = StringUtils.parseString(wReader["CheckResult"]);
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
