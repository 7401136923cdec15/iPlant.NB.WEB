using iPlant.FMS.Models;
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

        public ServiceResult<List<QMSWorkpieceCheckResult>> QMS_GetWorkpieceCheckResultList(BMSEmployee wLoginUser, String wOrderNo,
               List<int> wProductIDList, String wWorkpieceNo, String wStartTime, String wEndTime, int wPageSize, int wPageIndex, int wPaging)
        {
            ServiceResult<List<QMSWorkpieceCheckResult>> wResult = new ServiceResult<List<QMSWorkpieceCheckResult>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                OutResult<Int32> wPageCount = new OutResult<Int32>(1);
                wResult.setResult(QMSWorkpieceCheckResultDAO.getInstance().GetAll(wLoginUser, wOrderNo, wProductIDList, wWorkpieceNo, wStartTime, wEndTime, wPageSize, wPageIndex, wPaging, wPageCount, wErrorCode));
                wResult.Put("PageCount", wPageCount.Result);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public ServiceResult<List<QMSWorkpieceQualityInfo>> QMS_GetWorkpieceQualityInfoList(BMSEmployee wLoginUser, String wOrderNo,
                List<int> wProductIDList, String wWorkpieceNo, String wProcessStatus, String wStartTime, String wEndTime, int wPageSize, int wPageIndex, int wPaging)
        {
            ServiceResult<List<QMSWorkpieceQualityInfo>> wResult = new ServiceResult<List<QMSWorkpieceQualityInfo>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                OutResult<Int32> wPageCount = new OutResult<Int32>(1);
                wResult.setResult(QMSWorkpieceQualityInfoDAO.getInstance().GetAll(wLoginUser, wOrderNo, wProductIDList, wWorkpieceNo, wProcessStatus, wStartTime, wEndTime, wPageSize, wPageIndex, wPaging, wPageCount, wErrorCode));
                wResult.Put("PageCount", wPageCount.Result);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public ServiceResult<List<QMSThreeDimensionalCheckResult>> QMS_GetThreeDimensionalCheckResultList(BMSEmployee wLoginUser, int wWorkpieceID, int wPageSize, int wPageIndex, int wPaging)
        {
            ServiceResult<List<QMSThreeDimensionalCheckResult>> wResult = new ServiceResult<List<QMSThreeDimensionalCheckResult>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                OutResult<Int32> wPageCount = new OutResult<Int32>(1);
                wResult.setResult(QMSThreeDimensionalCheckResultDAO.getInstance().GetAll(wLoginUser, wWorkpieceID, wPageSize, wPageIndex, wPaging, wPageCount, wErrorCode));
                wResult.Put("PageCount", wPageCount.Result);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public ServiceResult<List<QMSOneTimePassRate>> QMS_GetOneTimePassRateList(BMSEmployee wLoginUser, List<int> wProductIDList, int wStatType, DateTime wStartTime, DateTime wEndTime, int wPageSize, int wPageIndex)
        {
            ServiceResult<List<QMSOneTimePassRate>> wResult = new ServiceResult<List<QMSOneTimePassRate>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                OutResult<Int32> wPageCount = new OutResult<Int32>(1);
                wResult.setResult(QMSOneTimePassRateDAO.getInstance().GetAll(wLoginUser, wProductIDList, wStatType, wStartTime, wEndTime, wPageSize, wPageIndex, wPageCount, wErrorCode));
                wResult.Put("PageCount", wPageCount.Result);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public ServiceResult<List<QMSOneTimePassRate>> QMS_GetOneTimePassRateForChartList(BMSEmployee wLoginUser, List<int> wProductIDList, int wStatType, DateTime wStartTime, DateTime wEndTime)
        {
            ServiceResult<List<QMSOneTimePassRate>> wResult = new ServiceResult<List<QMSOneTimePassRate>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                OutResult<Int32> wPageCount = new OutResult<Int32>(1);
                wResult.setResult(QMSOneTimePassRateDAO.getInstance().GetAllForChart(wLoginUser, wProductIDList, wStatType, wStartTime, wEndTime, wErrorCode));
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
