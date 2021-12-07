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
    }
}
