using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.SCADA.Service
{
    public interface OMSService
    {
        ServiceResult<Int32> OMS_UpdateCommand(BMSEmployee wLoginUser, OMSCommand wOMSCommand);

        ServiceResult<Int32> OMS_DeleteCommandList(BMSEmployee wLoginUser, List<OMSCommand> wList);
        ServiceResult<OMSCommand> OMS_SelectCommandByID(BMSEmployee wLoginUser, int wID);
        ServiceResult<OMSCommand> OMS_SelectCommandByCode(BMSEmployee wLoginUser, String wWBSNo);
        ServiceResult<OMSCommand> OMS_SelectCommandByPartNo(BMSEmployee wLoginUser, String wPartNo);

        ServiceResult<List<OMSCommand>> OMS_SelectCommandList(BMSEmployee wLoginUser, int wFactoryID,
               int wBusinessUnitID, int wWorkShopID, int wCustomerID, int wProductID, DateTime wStartTime, DateTime wEndTime);


        ServiceResult<Int32> OMS_UpdateOrder(BMSEmployee wLoginUser, OMSOrder wOMSOrder);

        ServiceResult<Int32> OMS_DeleteOrderList(BMSEmployee wLoginUser,  List<OMSOrder> wList);

        ServiceResult<OMSOrder> OMS_SelectOrderByID(BMSEmployee wLoginUser, int wID);

        ServiceResult<OMSOrder> OMS_QueryOrderByNo(BMSEmployee wLoginUser, String wOrderNo);
        ServiceResult<List<OMSOrder>> OMS_SelectList(BMSEmployee wLoginUser, int wCommandID, int wFactoryID, int wWorkShopID,
                int wLineID, int wStationID, int wProductID, int wCustomerID, int wTeamID, String wPartNo,
                List<Int32> wStateIDList, String wOrderNoLike, DateTime wPreStartTime, DateTime wPreEndTime, DateTime wRelStartTime,
                DateTime wRelEndTime, Pagination wPagination);

        ServiceResult<Dictionary<String, int>> OMS_SelectStatusCount(BMSEmployee wLoginUser, int wCommandID, int wFactoryID, int wWorkShopID,
              int wLineID, int wStationID, int wProductID, int wCustomerID, int wTeamID, String wPartNo,
              List<Int32> wStateIDList, String wOrderNoLike, DateTime wPreStartTime, DateTime wPreEndTime, DateTime wRelStartTime,
              DateTime wRelEndTime);


        ServiceResult<List<OMSOrder>> OMS_QueryOrderByStatus(BMSEmployee wLoginUser, int wWorkShopID, int wLineID, List<Int32> wStateIDList, Pagination wPagination);


        ServiceResult<List<OMSOrder>> OMS_JudgeOrderImport(BMSEmployee wLoginUser, List<OMSOrder> wOMSOrderList,out List<OMSOrder> wBadOrderList);



        ServiceResult<List<OMSOrder>> OMS_SelectListByIDList(BMSEmployee wLoginUser, List<Int32> wIDList);


        ServiceResult<List<OMSOrder>> OMS_SelectFinishListByTime(BMSEmployee wLoginUser, DateTime wStartTime, DateTime wEndTime, Pagination wPagination);
         
        ServiceResult<List<OMSOrder>> OMS_SelectList_RF(BMSEmployee wLoginUser, int wCustomerID, int wWorkShopID, int wLineID,
                int wProductID, String wPartNo,  DateTime wStartTime, DateTime wEndTime, Pagination wPagination);


        ServiceResult<List<OMSOrder>> OMS_ConditionAll(BMSEmployee wLoginUser, int wProductID, int wWorkShopID, int wLine,
               int wCustomerID, String wWBSNo, DateTime wStartTime, DateTime wEndTime, int wStatus, Pagination wPagination);


        ServiceResult<Int32> OMS_AuditOrder(BMSEmployee wLoginUser, List<OMSOrder> wResultList);


        ServiceResult<List<String>> OMS_SyncOrderList(BMSEmployee wLoginUser, List<OMSOrder> wOrderList);

        ServiceResult<List<String>> OMS_SyncOrderChangeList(BMSEmployee wLoginUser, List<OMSOrder> wOrderList);
    }



}
