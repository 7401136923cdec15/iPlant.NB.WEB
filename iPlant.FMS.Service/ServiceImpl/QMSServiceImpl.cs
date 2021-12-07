﻿using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.SCADA.Service
{
    public class QMSServiceImpl : QMSService
    {
        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(QMSServiceImpl));
        private static QMSService _instance = new QMSServiceImpl();

        public static QMSService getInstance()
        {
            if (_instance == null)
                _instance = new QMSServiceImpl();

            return _instance;
        }

        public ServiceResult<List<QMSSpotCheckRecord>> QMS_GetSpotCheckRecordList(BMSEmployee wLoginUser, String wOrderNo,
                List<int> wProductIDList, String wWorkpieceNo, String wSpotCheckResult, String wStartTime, String wEndTime, int wPageSize, int wPageIndex, int wPaging)
        {
            ServiceResult<List<QMSSpotCheckRecord>> wResult = new ServiceResult<List<QMSSpotCheckRecord>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                OutResult<Int32> wPageCount = new OutResult<Int32>(1);
                wResult.setResult(QMSSpotCheckRecordDAO.getInstance().GetAll(wLoginUser, wOrderNo, wProductIDList, wWorkpieceNo, wSpotCheckResult, wStartTime, wEndTime, wPageSize, wPageIndex, wPaging, wPageCount, wErrorCode));
                wResult.Put("PageCount", wPageCount.Result);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public ServiceResult<List<QMSWorkpieceRepairRecord>> QMS_GetWorkpieceRepairRecordList(BMSEmployee wLoginUser, String wOrderNo,
                List<int> wProductIDList, String wWorkpieceNo, String wStartTime, String wEndTime, int wPageSize, int wPageIndex, int wPaging)
        {
            ServiceResult<List<QMSWorkpieceRepairRecord>> wResult = new ServiceResult<List<QMSWorkpieceRepairRecord>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                OutResult<Int32> wPageCount = new OutResult<Int32>(1);
                wResult.setResult(QMSWorkpieceRepairRecordDAO.getInstance().GetAll(wLoginUser, wOrderNo, wProductIDList, wWorkpieceNo, wStartTime, wEndTime, wPageSize, wPageIndex, wPaging, wPageCount, wErrorCode));
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