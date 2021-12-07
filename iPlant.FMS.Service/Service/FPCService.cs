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
        ServiceResult<List<FPCProduct>> FPC_GetProductList(BMSEmployee wLoginUser, int wActive,int wPageSize,int wPageIndex,int wPaging);
    }
}
