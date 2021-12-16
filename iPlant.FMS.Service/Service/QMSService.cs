using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.SCADA.Service
{
    public interface QMSService
    {
        ServiceResult<List<QMSSpotCheckRecord>> QMS_GetSpotCheckRecordList(BMSEmployee wLoginUser, String wOrderNo,
                List<int> wProductIDList, String wWorkpieceNo, String wSpotCheckResult, String wStartTime, String wEndTime, int wPageSize,int wPageIndex,int wPaging);

        ServiceResult<List<QMSWorkpieceRepairRecord>> QMS_GetWorkpieceRepairRecordList(BMSEmployee wLoginUser, String wOrderNo,
        List<int> wProductIDList, String wWorkpieceNo, String wStartTime, String wEndTime, int wPageSize, int wPageIndex, int wPaging);

        ServiceResult<List<QMSWorkpieceCheckResult>> QMS_GetWorkpieceCheckResultList(BMSEmployee wLoginUser, String wOrderNo,
       List<int> wProductIDList, String wWorkpieceNo, String wStartTime, String wEndTime, int wPageSize, int wPageIndex, int wPaging);

        ServiceResult<List<QMSWorkpieceQualityInfo>> QMS_GetWorkpieceQualityInfoList(BMSEmployee wLoginUser, String wOrderNo,
               List<int> wProductIDList, String wWorkpieceNo, String wProcessStatus, String wStartTime, String wEndTime, int wPageSize, int wPageIndex, int wPaging);

        ServiceResult<List<QMSThreeDimensionalCheckResult>> QMS_GetThreeDimensionalCheckResultList(BMSEmployee wLoginUser, int wWorkpieceID, int wPageSize, int wPageIndex, int wPaging);

        ServiceResult<List<QMSOneTimePassRate>> QMS_GetOneTimePassRateList(BMSEmployee wLoginUser, List<int> wProductIDList,int wStatType, DateTime wStartTime, DateTime wEndTime, int wPageSize, int wPageIndex);

        ServiceResult<List<QMSOneTimePassRate>> QMS_GetOneTimePassRateForChartList(BMSEmployee wLoginUser, List<int> wProductIDList, int wStatType, DateTime wStartTime, DateTime wEndTime);

    }
}
