using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.SCADA.Service
{
    public class QMSThreeDimensionalCheckResultDAO : BaseDAO
    {
        private static readonly log4net.ILog logger = log4net.LogManager.GetLogger(typeof(QMSThreeDimensionalCheckResultDAO));
        private static QMSThreeDimensionalCheckResultDAO Instance = null;

        private QMSThreeDimensionalCheckResultDAO() : base()
        {

        }

        public static QMSThreeDimensionalCheckResultDAO getInstance()
        {
            if (Instance == null)
                Instance = new QMSThreeDimensionalCheckResultDAO();
            return Instance;
        }

        public List<QMSThreeDimensionalCheckResult> GetAll(BMSEmployee wLoginUser, int wWorkpieceID, int wPageSize, int wPageIndex, int wPaging, OutResult<Int32> wPageCount, OutResult<Int32> wErrorCode)
        {
            List<QMSThreeDimensionalCheckResult> wResult = new List<QMSThreeDimensionalCheckResult>();
            try
            {

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                string wSqlCondition = string.Format(@" FROM {0}.qms_threedimensional_checkresult t 
                                                   where 1=1 ", wInstance);
                if (wWorkpieceID > 0)
                {
                    wSqlCondition += " and t.WorkpieceID = @wWorkpieceID ";
                    wParamMap.Add("wWorkpieceID", wWorkpieceID);
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

                String wSQL = "select t.* " + wSqlCondition ;
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
                    QMSThreeDimensionalCheckResult wSpotCheckRecord = new QMSThreeDimensionalCheckResult();

                    wSpotCheckRecord.ID = StringUtils.parseInt(wReader["ID"]);
                    wSpotCheckRecord.WorkpieceID = StringUtils.parseInt(wReader["WorkpieceID"]);
                    wSpotCheckRecord.CheckParameter = StringUtils.parseString(wReader["CheckParameter"]);
                    wSpotCheckRecord.TheoreticalValue = StringUtils.parseDouble(wReader["TheoreticalValue"]);
                    wSpotCheckRecord.ActualValue = StringUtils.parseDouble(wReader["ActualValue"]);
                    wSpotCheckRecord.ErrorValue = StringUtils.parseDouble(wReader["ErrorValue"]);
                    wSpotCheckRecord.LowerTolerance = StringUtils.parseDouble(wReader["LowerTolerance"]);
                    wSpotCheckRecord.UpperTolerance = StringUtils.parseDouble(wReader["UpperTolerance"]);
                    wSpotCheckRecord.OutOfTolerance = StringUtils.parseDouble(wReader["OutOfTolerance"]);
                    wSpotCheckRecord.Result = StringUtils.parseString(wReader["Result"]);
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
