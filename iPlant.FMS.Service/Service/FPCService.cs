using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.SCADA.Service
{
    public interface FPCService
    {
        ServiceResult<List<FPCProduct>> FPC_GetProductList(BMSEmployee wLoginUser, String wProductNo, String wProductLike,
            int wProductType, int wMaterialID, String wDrawingNo, int wActive, Pagination wPagination);

        ServiceResult<List<FPCProduct>> FPC_GetProductList(BMSEmployee wLoginUser, List<Int32> wIDList);
        ServiceResult<FPCProduct> FPC_GetProduct(BMSEmployee wLoginUser, Int32 wID, String wProductNo);
        ServiceResult<Int32> FPC_UpdateProduct(BMSEmployee wLoginUser, FPCProduct wFPCProduct);
        ServiceResult<Int32> FPC_ActiveProduct(BMSEmployee wLoginUser, List<int> wIDList, int wActive);
        ServiceResult<Int32> FPC_DeleteProduct(BMSEmployee wLoginUser, FPCProduct wFPCProduct);
    }
}
