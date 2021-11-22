package com.mes.server.service;

import java.util.DateTime;
import java.util.List;

import com.mes.server.service.mesenum.dms.DMSAssetTypes;
import com.mes.server.service.mesenum.dms.DMSLedgerStatus;
import com.mes.server.service.mesenum.dms.DMSLedgerTypes;
import com.mes.server.service.mesenum.dms.DMSPropertyTypes; 
import com.mes.server.service.po.ServiceResult;
import com.mes.server.service.po.bms.BMSEmployee;
import com.mes.server.service.po.dms.DMSTimeOutConfig;
import com.mes.server.service.po.dms.deviceLegder.DMSEquipSpare;
import com.mes.server.service.po.dms.deviceLegder.DMSFixedAssets;
import com.mes.server.service.po.dms.deviceLegder.DMSPropertyModel;
import com.mes.server.service.po.dms.deviceLegder.DMSUseRecord;
import com.mes.server.service.po.dms.deviceLegder.DMSWorkType;
import com.mes.server.service.po.dms.deviceLegder.device.DMSDeviceLedger;
import com.mes.server.service.po.dms.deviceLegder.device.DMSDeviceModel;
import com.mes.server.service.po.dms.deviceLegder.measure.DMSCalibrationLevel;
import com.mes.server.service.po.dms.deviceLegder.measure.DMSMeasureLedger;
import com.mes.server.service.po.dms.deviceLegder.measure.DMSMeasureModel;
import com.mes.server.service.po.dms.deviceLegder.spare.DMSSpareLedger;
import com.mes.server.service.po.dms.deviceLegder.spare.DMSSpareModel;
import com.mes.server.service.po.dms.stockWarning.DMSStockWarning;
import com.mes.server.service.po.excel.ExcelData;

public interface DMSService {

	ServiceResult<List<DMSDeviceLedger>> DMS_GetDeviceLedgerList(BMSEmployee wLoginUser, int wModelID,
			int wBusinessUnitID, int wBaseID, int wFactoryID, int wWorkShopID, int wLineID,
			DMSLedgerStatus wDMSLedgerStatus);

	ServiceResult<DMSDeviceLedger> DMS_GetDeviceLedger(BMSEmployee wLoginUser, int wID, String wDeviceNo, int wAssetID);

	ServiceResult<Int32> DMS_SaveDeviceLedger(BMSEmployee wLoginUser, DMSDeviceLedger wDMSDeviceLedger);

	ServiceResult<List<DMSDeviceModel>> DMS_GetDeviceModelList(BMSEmployee wLoginUser, int wDeviceWorkType,
			int wSupplierID, String wSupplierModelNo, int wModelPropertyID, int wSystemID, String wSystemVersion,
			int wSystemPropertyID, int wControllerID, String wControllerModel, int wControllerPropertyID, int wActive);

	ServiceResult<Int32> DMS_SaveDeviceModel(BMSEmployee wLoginUser, DMSDeviceModel wDMSDeviceModel);

	ServiceResult<Int32> DMS_ActiveDeviceModelList(BMSEmployee wLoginUser, List<Int32> wIDList, int wActive);

	ServiceResult<List<DMSSpareLedger>> DMS_GetSpareLedgerList(BMSEmployee wLoginUser, int wModelID, int wEquipID,
			int wDeviceLedgerID, int wBusinessUnitID, int wBaseID, int wFactoryID, int wWorkShopID, int wLineID,
			DMSLedgerStatus wDMSLedgerStatus);

	ServiceResult<DMSSpareLedger> DMS_GetSpareLedger(BMSEmployee wLoginUser, int wID, String wSpareNo);

	ServiceResult<Int32> DMS_SaveSpareLedger(BMSEmployee wLoginUser, DMSSpareLedger wDMSSpareLedger);

	ServiceResult<List<DMSSpareModel>> DMS_GetSpareModelList(BMSEmployee wLoginUser, int wSpareWorkType,
			int wModelPropertyID, int wSupplierID, String wSupplierModelNo, int wActive);

	ServiceResult<Int32> DMS_SaveSpareModel(BMSEmployee wLoginUser, DMSSpareModel wDMSSpareModel);

	ServiceResult<Int32> DMS_ActiveSpareModelList(BMSEmployee wLoginUser, List<Int32> wIDList, int wActive);

	ServiceResult<List<DMSMeasureLedger>> DMS_GetMeasureLedgerList(BMSEmployee wLoginUser, int wWorkType,
			  int wSupplierID, String wSupplierModelNo, int wCalibrationLevel, int wModelID,
			int wWorkShopID, int wLineID, int wPartID, int wDeviceID, List<Int32> wStatus);

	ServiceResult<DMSMeasureLedger> DMS_GetMeasureLedger(BMSEmployee wLoginUser, int wID, String wMeasureNo);

	ServiceResult<Int32> DMS_SaveMeasureLedger(BMSEmployee wLoginUser, DMSMeasureLedger wDMSMeasureLedger);

	ServiceResult<List<DMSMeasureLedger>> DMS_ImportMeasureLedger(BMSEmployee wLoginUser, ExcelData wExcelData);

	ServiceResult<Int32> DMS_DeleteMeasureLedger(BMSEmployee wLoginUser, DMSMeasureLedger wDMSMeasureLedger);

	ServiceResult<List<DMSMeasureModel>> DMS_GetMeasureModelList(BMSEmployee wLoginUser, int wWorkType, int wSupplierID,
			String wSupplierModelNo, int wCalibrationLevel, int wActive);

	ServiceResult<DMSMeasureModel> DMS_GetMeasureModel(BMSEmployee wLoginUser, int wID, String wModelNo);

	ServiceResult<Int32> DMS_SaveMeasureModel(BMSEmployee wLoginUser, DMSMeasureModel wDMSMeasureModel);

	ServiceResult<Int32> DMS_ActiveMeasureModelList(BMSEmployee wLoginUser, List<Int32> wIDList, int wActive);

	ServiceResult<Int32> DMS_DeleteMeasureModel(BMSEmployee wLoginUser, DMSMeasureModel wDMSMeasureModel);

	ServiceResult<List<DMSCalibrationLevel>> DMS_GetCalibrationLevelList(BMSEmployee wLoginUser, int wActive);

	ServiceResult<DMSCalibrationLevel> DMS_GetCalibrationLevel(BMSEmployee wLoginUser, int wID, String wCode);

	ServiceResult<Int32> DMS_SaveCalibrationLevel(BMSEmployee wLoginUser, DMSCalibrationLevel wDMSCalibrationLevel);

	ServiceResult<Int32> DMS_ActiveCalibrationLevelList(BMSEmployee wLoginUser, List<Int32> wIDList, int wActive);

	ServiceResult<Int32> DMS_DeleteCalibrationLevel(BMSEmployee wLoginUser, DMSCalibrationLevel wDMSCalibrationLevel);

	ServiceResult<List<DMSUseRecord>> DMS_GetUseRecordList(BMSEmployee wLoginUser, int wDSType, int wLedgerID,
			int wEquipID, int wUsed, DateTime wStartTime, DateTime wEndTime);

	ServiceResult<List<DMSUseRecord>> DMS_GetUseRecordList(BMSEmployee wLoginUser, List<Long> wID, int wBusinessUnitID,
			int wBaseID, int wFactoryID, int wWorkShopID, int wLineID, int wDSType, List<Int32> wSpareLedgerID,
			List<Int32> wDeviceLedgerID, int wUsed, DateTime wStartTime, DateTime wEndTime);

	ServiceResult<Int32> DMS_InsertUseRecord(BMSEmployee wLoginUser, DMSUseRecord wDMSSpareRecord);

	ServiceResult<List<DMSEquipSpare>> DMS_GetEquipSpareList(BMSEmployee wLoginUser, String wDeviceSpareName,
			int wDeviceModelID, int wSpareModelID, int wActive, DateTime wStartTime, DateTime wEndTime);

	ServiceResult<Int32> DMS_SaveEquipSpare(BMSEmployee wLoginUser, DMSEquipSpare wDMSEquipSpare);

	ServiceResult<Int32> DMS_ActiveEquipSpareList(BMSEmployee wLoginUser, List<Int32> wIDList, int wActive);

	ServiceResult<List<DMSFixedAssets>> DMS_GetFixedAssetsList(BMSEmployee wLoginUser, DMSAssetTypes wAssetType,
			int wOperatorID, int wActive, DateTime wStartTime, DateTime wEndTime);

	ServiceResult<DMSFixedAssets> DMS_GetFixedAssetsByID(BMSEmployee wLoginUser, int wID, String wAssetNo);

	ServiceResult<Int32> DMS_SaveFixedAssets(BMSEmployee wLoginUser, DMSFixedAssets wDMSFixedAssets);

	ServiceResult<List<DMSPropertyModel>> DMS_GetPropertyModelList(BMSEmployee wLoginUser, int wPropertyID,
			String wPropertyNo, String wPropertyName, DMSPropertyTypes wDMSPropertyTypes,
			DMSLedgerTypes wDMSLedgerTypes, int wActive);

	ServiceResult<Int32> DMS_SavePropertyModel(BMSEmployee wLoginUser, DMSPropertyModel wDMSPropertyModel);

	ServiceResult<Int32> DMS_ActivePropertyModelList(BMSEmployee wLoginUser, List<Int32> wIDList, int wActive);

	ServiceResult<List<DMSStockWarning>> DMS_GetStockWarningList(BMSEmployee wLoginUser, int wModelID, String wModelNo,
			int wWorkType, int wSupplierID, String wSupplierModelNo, DMSLedgerTypes wDMSLedgerTypes, int wActive,
			DateTime wStartTime, DateTime wEndTime);

	ServiceResult<DMSStockWarning> DMS_GetStockWarning(BMSEmployee wLoginUser, long wID);

	ServiceResult<Long> DMS_SaveStockWarning(BMSEmployee wLoginUser, DMSStockWarning wDMSStockWarning);

	ServiceResult<List<DMSWorkType>> DMS_GetWorkTypeList(BMSEmployee wLoginUser, DMSLedgerTypes wDMSLedgerTypes,
			int wActive);

	ServiceResult<Int32> DMS_SaveWorkType(BMSEmployee wLoginUser, DMSWorkType wDMSWorkType);

	ServiceResult<Int32> DMS_ActiveWorkTypeList(BMSEmployee wLoginUser, List<Int32> wIDList, int wDSType,
			int wActive);

	ServiceResult<Int32> DMS_DeleteWorkTypeList(BMSEmployee wLoginUser, List<Int32> wIDList, int wDSType);

	ServiceResult<DMSTimeOutConfig> DMS_GetTimeOutConfig(BMSEmployee wLoginUser);

	ServiceResult<Int32> DMS_SaveTimeOutConfig(BMSEmployee wLoginUser, DMSTimeOutConfig wDMSTimeOutConfig);

	ServiceResult<DateTime> DMS_DeviceLedgerReplaceMinTime(BMSEmployee wLoginUser, DMSDeviceLedger wDMSDeviceLedger);

	ServiceResult<DateTime> DMS_SpareLedgerReplaceMinTime(BMSEmployee wLoginUser, DMSSpareLedger wDMSSpareLedger);
}
