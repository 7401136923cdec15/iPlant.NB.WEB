using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.SCADA.Service
{
    public interface DMSService
    {

        ServiceResult<List<DMSDeviceLedger>> DMS_GetDeviceLedgerList(BMSEmployee wLoginUser, String wName,
                String wAssetNo, int wDeviceType, int wModelID, int wFactoryID, int wWorkShopID, int wLineID, int wAreaID, int wTeamID,
               int wActive);

        ServiceResult<DMSDeviceLedger> DMS_GetDeviceLedger(BMSEmployee wLoginUser, int wID, String wDeviceNo, String wAssetNo);

        ServiceResult<Int32> DMS_SaveDeviceLedger(BMSEmployee wLoginUser, DMSDeviceLedger wDMSDeviceLedger);

        ServiceResult<Int32> DMS_ActiveDeviceLedgerList(BMSEmployee wLoginUser, List<Int32> wIDList,
        int wActive);

        ServiceResult<List<String>> DMS_SyncDeviceLedgerList(BMSEmployee wLoginUser, List<DMSDeviceLedger> wDeviceLedgerList);

        ServiceResult<Int32> DMS_DeleteDeviceLedgerList(BMSEmployee wLoginUser, DMSDeviceLedger wDeviceLedger);
        ServiceResult<List<DMSDeviceModel>> DMS_GetDeviceModelList(BMSEmployee wLoginUser, String wName,
                int wDeviceType, String wDeviceTypeName, String wDeviceTypeCode, int wOperatorID, int wActive);

        ServiceResult<Int32> DMS_SaveDeviceModel(BMSEmployee wLoginUser, DMSDeviceModel wDMSDeviceModel);

        ServiceResult<Int32> DMS_ActiveDeviceModelList(BMSEmployee wLoginUser, List<Int32> wIDList, int wActive);

        ServiceResult<Int32> DMS_DeleteDeviceModelList(BMSEmployee wLoginUser, DMSDeviceModel wDMSDeviceModel);
        ServiceResult<List<DMSDeviceType>> DMS_GetDeviceTypeList(BMSEmployee wLoginUser, String wName, int wActive);

        ServiceResult<Int32> DMS_SaveDeviceType(BMSEmployee wLoginUser, DMSDeviceType wDMSDeviceType);

        ServiceResult<Int32> DMS_ActiveDeviceTypeList(BMSEmployee wLoginUser, List<Int32> wIDList,
                int wActive);

        ServiceResult<Int32> DMS_DeleteDeviceTypeList(BMSEmployee wLoginUser, List<Int32> wIDList);


        ServiceResult<List<DMSDeviceParameter>> DMS_QueryDeviceParameterList(BMSEmployee wLoginUser, String wName, String wVariableName,

                int wDeviceID, String wDeviceNo, String wAssetNo, String wDeviceName, String wProtocol, String wOPCClass, int wDataType, int wDataClass,
               int wActive);

        ServiceResult<DMSDeviceParameter> DMS_QueryDeviceParameter(BMSEmployee wLoginUser, int wID, String wCode);

        ServiceResult<Int32> DMS_UpdateDeviceParameter(BMSEmployee wLoginUser, DMSDeviceParameter wDeviceParameter);

        ServiceResult<List<String>> DMS_UpdateDeviceParameterList(BMSEmployee wLoginUser, List<DMSDeviceParameter> wDeviceParameterList);


        ServiceResult<Int32> DMS_DeleteDeviceParameter(BMSEmployee wLoginUser, DMSDeviceParameter wDeviceParameter);
        ServiceResult<Int32> DMS_ActiveDeviceParameter(BMSEmployee wLoginUser, List<Int32> wIDList, int wActive);



        ServiceResult<Dictionary<int, Dictionary<String, int>>> DMS_SelectDeviceStatusTime(BMSEmployee wLoginUser, List<Int32> wID, String wCode, String wName,
                String wAssetNo, int wDeviceType, int wModelID, int wFactoryID, int wWorkShopID, int wLineID, int wAreaID, int wTeamID,
               DateTime wStartTime, DateTime wEndTime);

        ServiceResult<List<DMSDeviceStatus>> DMS_CurrentDeviceStatusList(BMSEmployee wLoginUser, int wDeviceID, String wDeviceNo, String wDeviceName,
               String wAssetNo, int wDeviceType, int wModelID, int wFactoryID, int wWorkShopID, int wLineID, int wAreaID, int wTeamID, int wStatus);


        ServiceResult<List<DMSDeviceAreaStatus>> DMS_CurrentDeviceStatusStatistics(BMSEmployee wLoginUser, String wName,
            String wAssetNo, int wDeviceType, int wModelID, int wFactoryID, int wWorkShopID, int wLineID, int wAreaID, int wTeamID, int wStatus);


        ServiceResult<List<DMSDeviceStatus>> DMS_SelectDeviceStatusList(BMSEmployee wLoginUser, String wName,
                String wAssetNo, int wDeviceType, int wModelID, int wFactoryID, int wWorkShopID, int wLineID, int wAreaID, int wTeamID,
               int wActive, DateTime wStartTime, DateTime wEndTime, int wPageSize, int wPageIndex);
        ServiceResult<List<DMSDeviceStatus>> DMS_SelectDeviceStatus(BMSEmployee wLoginUser, int wID, String wCode,
            String wAssetNo, DateTime wStartTime, DateTime wEndTime, int wPageSize, int wPageIndex);

        ServiceResult<List<DMSDeviceStatus>> DMS_SelectDeviceStatusList(BMSEmployee wLoginUser, List<Int32> wIDList,
            DateTime wStartTime, DateTime wEndTime, int wPageSize, int wPageIndex);



        ServiceResult<List<DMSDeviceStatus>> DMS_SelectDeviceStatusDetailList(BMSEmployee wLoginUser, String wName,
            String wAssetNo, int wDeviceType, int wModelID, int wFactoryID, int wWorkShopID, int wLineID, int wAreaID, int wTeamID,
           int wStatus, DateTime wStartTime, DateTime wEndTime, int wPageSize, int wPageIndex);
        ServiceResult<List<DMSDeviceStatus>> DMS_SelectDeviceStatusDetail(BMSEmployee wLoginUser, int wDeviceID, String wDeviceNo,
            String wAssetNo, int wStatus, DateTime wStartTime, DateTime wEndTime, int wPageSize, int wPageIndex);

        ServiceResult<List<DMSDeviceStatus>> DMS_SelectDeviceStatusDetailList(BMSEmployee wLoginUser,
            List<Int32> wDeviceIDList, int wStatus, DateTime wStartTime, DateTime wEndTime, int wPageSize, int wPageIndex);



        ServiceResult<List<DMSDeviceAlarm>> DMS_CurrentDeviceAlarmList(BMSEmployee wLoginUser, int wDeviceID, String wDeviceNo, String wAssetNo,
                int wDeviceType, int wModelID, int wFactoryID, int wWorkShopID, int wLineID, int wAreaID, int wTeamID);


        ServiceResult<List<DMSDeviceAlarm>> DMS_SelectDeviceAlarmList(BMSEmployee wLoginUser, String wName,
              String wAssetNo, int wDeviceType, int wModelID, int wFactoryID, int wWorkShopID, int wLineID, int wAreaID, int wTeamID,
           int wEventType, DateTime wStartTime, DateTime wEndTime, int wPageSize, int wPageIndex);

        ServiceResult<List<DMSDeviceAlarm>> DMS_SelectDeviceAlarm(BMSEmployee wLoginUser, int wID, String wCode, String wAssetNo,
            int wEventType, DateTime wStartTime, DateTime wEndTime, int wPageSize, int wPageIndex);


        ServiceResult<List<DMSDeviceAlarm>> DMS_SelectDeviceAlarmList(BMSEmployee wLoginUser,
            List<Int32> wIDList, int wEventType, DateTime wStartTime, DateTime wEndTime, int wPageSize, int wPageIndex);


        ServiceResult<List<DMSDeviceRealParameter>> DMS_SelectDeviceRealParameterList(BMSEmployee wLoginUser, String wName, String wVariableName,

                int wAreaID, int wDeviceID, String wDeviceNo, String wAssetNo, String wDeviceName, int wDataType, int wDataClass);

        ServiceResult<List<DMSDeviceRealParameter>> DMS_SelectDeviceRealParameterList(BMSEmployee wLoginUser, List<Int32> wIDList);

        ServiceResult<DMSDeviceRealParameter> DMS_SelectDeviceRealParameter(BMSEmployee wLoginUser, int wID, String wCode);

        ServiceResult<List<DMSDeviceAlarmStatistics>> DMS_SelectDeviceAlarmStatisticsList(BMSEmployee wLoginUser,
           int wDeviceID, String wDeviceNo, String wDeviceName, String wAssetNo, int wDeviceType, int wModelID, int wFactoryID,
           int wWorkShopID, int wLineID, int wAreaID, int wTeamID, int wStatus, DateTime wStartTime, DateTime wEndTime);
        ServiceResult<Dictionary<int, Dictionary<String, Object>>> DMS_SelectDeviceRealParameterStructList(BMSEmployee wLoginUser, String wName, String wVariableName,

             int wAreaID, int wDeviceID, String wDeviceNo, String wAssetNo, String wDeviceName, int wDataType, int wDataClass);

        ServiceResult<Dictionary<String, Object>> DMS_SelectDeviceCurrentStruct(BMSEmployee wLoginUser, int wDeviceID, String wDeviceNo, String wAssetNo);


        ServiceResult<List<DMSDeviceStatusStatistics>> DMS_SelectDeviceStatusStatisticsList(BMSEmployee wLoginUser,
           int wDeviceID, String wDeviceNo, String wDeviceName, String wAssetNo, int wDeviceType, int wModelID, int wFactoryID,
           int wWorkShopID, int wLineID, int wAreaID, int wTeamID, int wStatus, DateTime wStartTime, DateTime wEndTime, int wHasAlarm);


        ServiceResult<List<DMSProcessRecord>> DMS_CurrentProcessRecordList(BMSEmployee wLoginUser, int wDeviceID, String wDeviceNo, int wActive);


        ServiceResult<List<DMSProcessRecord>> DMS_SelectProcessRecordList(BMSEmployee wLoginUser, int wOrderID, String wOrderNo, int wDeviceID, String wDeviceNo,
            int wActive, int wStatus, DateTime wStartTime, DateTime wEndTime, int wPageSize, int wPageIndex);

        ServiceResult<List<DMSProcessRecord>> DMS_SelectProcessRecordUploadList(BMSEmployee wLoginUser);

        ServiceResult<Int32> DMS_UpdateProcessRecordUploadStatus(BMSEmployee wLoginUser, List<Int32> wRecordIDList, int wUploadStatus);

        ServiceResult<DMSProcessRecord> DMS_SelectProcessRecord(BMSEmployee wLoginUser, int wID);


        ServiceResult<List<DMSProcessRecordItem>> DMS_SelectProcessRecordItemList(BMSEmployee wLoginUser, int wRecordID);
        ServiceResult<List<DMSProcessRecordItem>> DMS_SelectProcessRecordItemList(BMSEmployee wLoginUser, int wDeviceID, String wDeviceNo, int wRecordID,
           int wParameterID, String wParameterNo, int wActive, int wStatus, DateTime wStartTime, DateTime wEndTime);

        ServiceResult<List<DMSDeviceRepair>> DMS_SelectDeviceRepairList(BMSEmployee wLoginUser, int wDeviceID, String wDeviceNo,
           int wAlarmType, int wAlarmLevel, int wStatus, DateTime wStartTime, DateTime wEndTime, int wPageSize, int wPageIndex);


        ServiceResult<DMSDeviceRepair> DMS_SelectDeviceRepair(BMSEmployee wLoginUser, int wID, string wCode);

        ServiceResult<Int32> DMS_UpdateDeviceRepair(BMSEmployee wLoginUser, DMSDeviceRepair wDMSDeviceRepair);

        ServiceResult<Int32> DMS_DeleteDeviceRepair(BMSEmployee wLoginUser, List<Int32> wIDList);


        /// <summary>
        /// 同步设备当前状态  
        /// </summary>
        /// <param name="wLoginUser"></param>
        /// <param name="wDMSDeviceStatusList">当前状态列表</param>
        /// <returns>错误信息</returns>

        ServiceResult<List<String>> DMS_SyncDeviceStatusList(BMSEmployee wLoginUser, List<DMSDeviceStatus> wDMSDeviceStatusList);

        /// <summary>
        /// 填补历史状态 （备用）
        /// </summary>
        /// <param name="wLoginUser"></param>
        /// <param name="wDMSDeviceStatusList">历史状态列表</param>
        /// <returns>错误信息</returns>
        ServiceResult<List<String>> DMS_SyncDeviceStatusHistoryList(BMSEmployee wLoginUser, List<DMSDeviceStatus> wDMSDeviceStatusList);


        /// <summary>
        /// 同步设备当前报警
        /// </summary>
        /// <param name="wLoginUser"></param>
        /// <param name="wDMSDeviceAlarmList">当前报警列表</param>
        /// <returns>错误信息</returns>
        ServiceResult<List<String>> DMS_SyncDeviceAlarmList(BMSEmployee wLoginUser, List<String> wAssetNoList, List<DMSDeviceAlarm> wDMSDeviceAlarmList);

        /// <summary>
        /// 同步设备历史报警（备用）
        /// </summary>
        /// <param name="wLoginUser"></param>
        /// <param name="wDMSDeviceAlarmList">历史报警列表</param>
        /// <returns>错误信息</returns>
        ServiceResult<List<String>> DMS_SyncDeviceAlarmHistoryList(BMSEmployee wLoginUser, List<DMSDeviceAlarm> wDMSDeviceAlarmList);

        /// <summary>
        /// 同步设备参数列表
        /// </summary>
        /// <param name="wLoginUser"></param>
        /// <param name="wDMSDeviceRealParameterList">设备参数列表</param>
        /// <returns>错误信息</returns>
        ServiceResult<List<String>> DMS_SyncDeviceRealParameterList(BMSEmployee wLoginUser, List<DMSDeviceRealParameter> wDMSDeviceRealParameterList);

        /// <summary>
        /// 同步设备加工过程数据
        /// </summary>
        /// <param name="wBMSEmployee"></param>
        /// <param name="wDMSProcessRecordList">加工过程数据列表</param>
        /// <returns>错误信息</returns>
        ServiceResult<List<String>> DMS_SyncProcessRecordList(BMSEmployee wBMSEmployee, List<DMSProcessRecord> wDMSProcessRecordList);



        ServiceResult<List<DMSDeviceStatistics>> DMS_SelectDeviceStatusDetailStatisticsTime(BMSEmployee wLoginUser, List<int> wDeviceIDList, int wStatType,
              DateTime wStartTime, DateTime wEndTime);


        ServiceResult<List<DMSEnergyStatistics>> DMS_SelectEnergyStatisticsList(BMSEmployee wLoginUser, List<int> wDeviceIDList,
            int wAreaID, int wStatType, int wEnergyType, DateTime wStartTime, DateTime wEndTime,
              int wActive);


        ServiceResult<List<DMSEnergyStatistics>> DMS_SelectEnergyStatisticsList(BMSEmployee wLoginUser, List<int> wDeviceIDList,
            int wAreaID, int wStatType, int wEnergyType, DateTime wStartTime, DateTime wEndTime);
        ServiceResult<Int32> DMS_UpdateEnergyStatistics(BMSEmployee wLoginUser, DMSEnergyStatistics wDMSEnergyStatistics);


        ServiceResult<Int32> DMS_ActiveEnergyStatistics(BMSEmployee wLoginUser, List<Int32> wIDList, int wActive);


        ServiceResult<Int32> DMS_DeleteEnergyStatistics(BMSEmployee wLoginUser, List<Int32> wIDList);


        ServiceResult<List<DMSProgramNC>> DMS_GetProgramNCList(BMSEmployee wLoginUser, int wDeviceID, String wDeviceNo,
                String wAssetNo, int wDeviceType, int wModelID, int wFactoryID,
                int wWorkShopID, int wLineID, int wAreaID, int wProductID, String wProductNo, Pagination wPagination);

        ServiceResult<List<DMSProgramNCRecord>> DMS_GetProgramNCRecordList(BMSEmployee wLoginUser, int wDeviceID, String wDeviceNo,
                String wAssetNo, int wDeviceType, int wModelID, int wFactoryID, int wWorkShopID, int wLineID, int wAreaID, int wProductID, String wProductNo,
                int wEditorID, int wRecordType, DateTime wStarTime, DateTime wEndTime, Pagination wPagination);

        ServiceResult<Int32> DMS_UpdateProgramNCRecord(BMSEmployee wLoginUser, DMSProgramNCRecord wProgramNCRecord);


        ServiceResult<List<DMSToolInfo>> DMS_GetToolInfoList(BMSEmployee wLoginUser, int wDeviceID, String wDeviceNo,
                String wAssetNo, int wDeviceType, int wModelID, int wFactoryID, int wWorkShopID, int wLineID,
                int wAreaID, int wToolHouseIndex, int wToolIndex, Pagination wPagination);

        ServiceResult<List<DMSToolOffset>> DMS_GetToolOffsetList(BMSEmployee wLoginUser, int wDeviceID, String wDeviceNo,
               String wAssetNo, int wDeviceType, int wModelID, int wFactoryID, int wWorkShopID, int wLineID, int wAreaID,
               int wToolID, int wToolHouseIndex, int wToolIndex, 
               int wEditorID, DateTime wStarTime, DateTime wEndTime, Pagination wPagination);

        ServiceResult<Int32> DMS_UpdateToolInfo(BMSEmployee wLoginUser, DMSToolInfo wDMSToolInfo);

        ServiceResult<Int32> DMS_UpdateToolOffset(BMSEmployee wLoginUser, DMSToolOffset wDMSToolOffset);
    }
}
