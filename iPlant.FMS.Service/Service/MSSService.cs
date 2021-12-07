using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.SCADA.Service
{
    public interface MSSService
    {
        ServiceResult<List<MSSMaterial>> MSS_GetMaterialList(BMSEmployee wLoginUser, String wMaterialNo,
                String wMaterialName, String wGroes, int wActive,int wPageSize,int wPageIndex,int wPaging);

        ServiceResult<Int32> MSS_SaveMaterial(BMSEmployee wLoginUser, MSSMaterial wMMSMaterial);

        ServiceResult<Int32> MSS_ActiveMaterialList(BMSEmployee wLoginUser, List<Int32> wIDList,
        int wActive);

        ServiceResult<Int32> MSS_DeleteMaterialList(BMSEmployee wLoginUser, MSSMaterial wMaterial);

        ServiceResult<List<MSSMaterialOperationRecord>> MSS_GetMaterialStock(BMSEmployee wLoginUser, String wMaterialStoragePoint, String wMaterialNo,
                String wMaterialName, String wMaterialBatch, int wPageSize, int wPageIndex, int wPaging);

        ServiceResult<Int32> MSS_SaveMaterialOperationRecord(BMSEmployee wLoginUser, MSSMaterialOperationRecord wMMSMaterialOperationRecord);

        ServiceResult<List<MSSMaterialOperationRecord>> MSS_GetMaterialOperationRecord(BMSEmployee wLoginUser, String wMaterialStoragePoint, String wMaterialNo,
        String wMaterialName, String wMaterialBatch,int wOperationType, int wPageSize, int wPageIndex, int wPaging);
    }
}
