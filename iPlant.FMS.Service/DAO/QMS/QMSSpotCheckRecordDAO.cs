using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.SCADA.Service
{
    public class QMSSpotCheckRecordDAO : BaseDAO
    {
        private static readonly log4net.ILog logger = log4net.LogManager.GetLogger(typeof(QMSSpotCheckRecordDAO));
        private static QMSSpotCheckRecordDAO Instance = null;

        private QMSSpotCheckRecordDAO() : base()
        {

        }

        public static QMSSpotCheckRecordDAO getInstance()
        {
            if (Instance == null)
                Instance = new QMSSpotCheckRecordDAO();
            return Instance;
        }

        public List<QMSSpotCheckRecord> GetAll(BMSEmployee wLoginUser, String wOrderNo,
                List<int> wProductIDList, String wWorkpieceNo, String wSpotCheckResult, String wStartTime, String wEndTime, int wPageSize, int wPageIndex, int wPaging, OutResult<Int32> wPageCount, OutResult<Int32> wErrorCode)
        {
            List<QMSSpotCheckRecord> wResult = new List<QMSSpotCheckRecord>();
            try
            {

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();
                String LineID = iPlant.Data.EF.MESDBSource.getLineID();
                if (wErrorCode.Result != 0)
                    return wResult;

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                string wSqlCondition = string.Format(@" FROM {0}.qms_spotcheck_record t 
                                                   left join {0}.oms_workpiece t1 on t1.ID = t.WorkpieceID
                                                   left join {0}.oms_order t2 on t2.ID = t1.OrderID
                                                   left join {0}.fpc_product t3 on t3.ID = t2.ProductID
                                                   left join {0}.mbs_user t4 on t4.ID = t.CreatorID
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
                if (wSpotCheckResult != "-1")
                {
                    wSqlCondition += " and t.SpotCheckResult = @wSpotCheckResult ";
                    wParamMap.Add("wSpotCheckResult", wSpotCheckResult);
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

                String wSQL = "select t.*,t1.WorkpieceNo,t2.OrderNo,t3.ProductNo,t3.ProductName,t4.Name as Creator " + wSqlCondition + " order by t.CreateTime";
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
                    QMSSpotCheckRecord wSpotCheckRecord = new QMSSpotCheckRecord();

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
                    wSpotCheckRecord.CreatorID = StringUtils.parseInt(wReader["CreatorID"]);
                    wSpotCheckRecord.Creator = StringUtils.parseString(wReader["Creator"]);
                    wSpotCheckRecord.CreateTime = StringUtils.parseDate(wReader["CreateTime"]);
                    wSpotCheckRecord.SpotCheckResult = StringUtils.parseString(wReader["SpotCheckResult"]);
                    wSpotCheckRecord.NokReason = StringUtils.parseString(wReader["NokReason"]);
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
