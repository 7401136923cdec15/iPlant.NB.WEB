using iPlant.Common.Tools;
using iPlant.Data.EF.Repository;
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

        public List<FPCProduct> FPC_GetProductAll(BMSEmployee wLoginUser,List<Int32> wIDs, String wProductNo, String wProductLike, 
            int wProductType,int wMaterialID,String wDrawingNo, int wActive, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            List<FPCProduct> wResult = new List<FPCProduct>();
            try
            {

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();

 

                String wSQL = StringUtils.Format(
                        "SELECT t.*,t1.MaterialNo, t2.Name as CreatorName,t3.Name as EditorName  FROM {0}.fpc_product t"
                                + " left join {0}.mss_material t1 on t.MaterialID=t1.ID " 
                                + " left join {0}.mbs_user t2 on t.CreatorID=t2.ID "
                                + " left join {0}.mbs_user t3 on t.EditorID=t3.ID WHERE  1=1  "
                                + " and ( @wID ='' or t.ID IN( {1} ) )  "
                        + " and ( @wProductNo ='' or t.Code  = @wProductNo  )  "
                        + " and ( @wProductLike ='' or t.Code  like @wProductLike or t.ProductName  like @wProductLike "
                        + "  or t.ProductCode  like @wProductLike or t1.MaterialNo  like @wProductLike or t.DrawingNo  like @wProductLike )  " 
                        + " and ( @wProductType <= 0 or t.ProductType  = @wProductType)   "
                        + " and ( @wMaterialID <= 0 or t.MaterialID  = @wMaterialID)   "
                        + " and ( @wActive < 0 or t.Active  = @wActive)   " 
                        + " and ( @wDrawingNo ='' or t.DrawingNo  = @wDrawingNo ) "
                        , wInstance, wIDs.Count > 0 ? StringUtils.Join(",", wIDs) : "0");
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                wParamMap.Add("wID", StringUtils.Join(",", wIDs));
                wParamMap.Add("wProductLike", StringUtils.isEmpty(wProductLike) ? wProductLike : "%" + wProductLike + "%");
                wParamMap.Add("wProductNo", wProductNo);
                wParamMap.Add("wProductType", wProductType);
                wParamMap.Add("wDrawingNo", wDrawingNo);
                wParamMap.Add("wMaterialID", wMaterialID);
                wParamMap.Add("wActive", wActive); 


                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap, wPagination);

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
