using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.SCADA.Service
{
    public class FPCProductDAO : BaseDAO
    {
        private static readonly log4net.ILog logger = log4net.LogManager.GetLogger(typeof(FPCProductDAO));
        private static FPCProductDAO Instance = null;

        private FPCProductDAO() : base()
        {

        }

        public static FPCProductDAO getInstance()
        {
            if (Instance == null)
                Instance = new FPCProductDAO();
            return Instance;
        }

        public List<FPCProduct> GetAll(BMSEmployee wLoginUser, int wActive, int wPageSize, int wPageIndex,int wPaging, OutResult<Int32> wPageCount, OutResult<Int32> wErrorCode)
        {
            List<FPCProduct> wResult = new List<FPCProduct>();
            try
            {

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                string wSqlCondition = @" from " + wInstance + ".fpc_product t  where 1=1 ";
                if (wActive >= 0)
                {
                    wSqlCondition += " and t.Active = @wActive";
                    wParamMap.Add("wActive", wActive);
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

                String wSQL = "select t.ID,t.ProductNo,t.ProductName " + wSqlCondition + " order by t.ProductNo";
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
                    FPCProduct wProduct = new FPCProduct();

                    wProduct.ID = StringUtils.parseInt(wReader["ID"]);
                    wProduct.ProductNo = StringUtils.parseString(wReader["ProductNo"]);
                    wProduct.ProductName = StringUtils.parseString(wReader["ProductName"]);
                    wResult.Add(wProduct);
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
