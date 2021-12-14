﻿
using iPlant.Common.Tools;
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

        public ServiceResult<List<FPCProduct>> FPC_GetProductList(BMSEmployee wLoginUser, String wProductNo, String wProductLike,
            int wProductType, int wMaterialID, String wDrawingNo, int wActive, Pagination wPagination)
        {
            ServiceResult<List<FPCProduct>> wResult = new ServiceResult<List<FPCProduct>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.setResult(FPCProductDAO.getInstance().FPC_GetProductAll(wLoginUser, wProductNo, wProductLike,
                        wProductType, wMaterialID, wDrawingNo, wActive, wPagination, wErrorCode));
                wResult.Put("PageCount", wPagination.TotalPage);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }
        public ServiceResult<List<FPCProduct>> FPC_GetProductList(BMSEmployee wLoginUser, List<Int32> wIDList)
        {
            ServiceResult<List<FPCProduct>> wResult = new ServiceResult<List<FPCProduct>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.setResult(FPCProductDAO.getInstance().FPC_GetProductAllByIDs(wLoginUser, wIDList, wErrorCode));

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public ServiceResult<FPCProduct> FPC_GetProduct(BMSEmployee wLoginUser, Int32 wID, String wProductNo)
        {
            ServiceResult<FPCProduct> wResult = new ServiceResult<FPCProduct>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.setResult(FPCProductDAO.getInstance().FPC_GetProduct(wLoginUser, wID, wProductNo, wErrorCode));

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }
        public ServiceResult<Int32> FPC_UpdateProduct(BMSEmployee wLoginUser, FPCProduct wFPCProduct)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                FPCProductDAO.getInstance().FPC_UpdateProduct(wLoginUser, wFPCProduct, wErrorCode);

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> FPC_ActiveProduct(BMSEmployee wLoginUser, List<int> wIDList, int wActive)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                FPCProductDAO.getInstance().FPC_ActiveProduct(wLoginUser, wIDList,  wActive, wErrorCode);

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }
        public ServiceResult<Int32> FPC_DeleteProduct(BMSEmployee wLoginUser, FPCProduct wFPCProduct)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                FPCProductDAO.getInstance().FPC_DeleteProduct(wLoginUser, wFPCProduct, wErrorCode);

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
