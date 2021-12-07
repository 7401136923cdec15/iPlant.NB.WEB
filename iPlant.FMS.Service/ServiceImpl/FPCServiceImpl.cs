using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.SCADA.Service
{
    public class FPCServiceImpl : FPCService
    {
        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(FPCServiceImpl));
        private static FPCService _instance = new FPCServiceImpl();

        public static FPCService getInstance()
        {
            if (_instance == null)
                _instance = new FPCServiceImpl();

            return _instance;
        }

        public ServiceResult<List<FPCProduct>> FPC_GetProductList(BMSEmployee wLoginUser, int wActive, int wPageSize, int wPageIndex,int wPaging)
        {
            ServiceResult<List<FPCProduct>> wResult = new ServiceResult<List<FPCProduct>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                OutResult<Int32> wPageCount = new OutResult<Int32>(1);
                wResult.setResult(FPCProductDAO.getInstance().GetAll(wLoginUser, wActive, wPageSize, wPageIndex, wPaging, wPageCount, wErrorCode));
                wResult.Put("PageCount", wPageCount.Result);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }
    }
}
