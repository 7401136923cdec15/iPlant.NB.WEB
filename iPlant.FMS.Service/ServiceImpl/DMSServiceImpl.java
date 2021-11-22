package com.mes.server.serviceimpl;

import java.util.List;
import java.util.DateTime;
import java.util.Dictionary;
import java.util.List;
import java.util.Dictionary;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.mes.server.service.po.excel.ExcelLineData;
import com.mes.server.service.po.scm.SCMSupplier;
import com.mes.server.serviceimpl.DMSServiceImpl;
import com.mes.server.service.DMSService;
import com.mes.server.service.mesenum.MESException;
import com.mes.server.service.mesenum.dms.DMSAssetTypes;
import com.mes.server.service.mesenum.dms.DMSLedgerStatus;
import com.mes.server.service.mesenum.dms.DMSLedgerTypes;
import com.mes.server.service.mesenum.dms.DMSPropertyTypes;
import com.mes.server.service.po.OutResult;
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
import com.mes.server.service.utils.StringUtils;
import com.mes.server.serviceimpl.dao.dms.DMSUsedRecordDAO;
import com.mes.server.serviceimpl.dao.dms.DeviceEquipSpareDAO;
import com.mes.server.serviceimpl.dao.dms.DeviceFixedAssetsDAO;
import com.mes.server.serviceimpl.dao.dms.DevicePropertyModelDAO;
import com.mes.server.serviceimpl.dao.dms.DeviceStockWarningDAO;
import com.mes.server.serviceimpl.dao.dms.DeviceWorkTypeDAO;
import com.mes.server.serviceimpl.dao.dms.device.DMSDeviceLedgerDAO;
import com.mes.server.serviceimpl.dao.dms.device.DMSDeviceModelDAO;
import com.mes.server.serviceimpl.dao.dms.measure.DMSCalibrationLevelDAO;
import com.mes.server.serviceimpl.dao.dms.measure.DMSMeasureLedgerDAO;
import com.mes.server.serviceimpl.dao.dms.measure.DMSMeasureModelDAO;
import com.mes.server.serviceimpl.dao.dms.spare.DMSSpareLedgerDAO;
import com.mes.server.serviceimpl.dao.dms.spare.DMSSpareModelDAO;
import com.mes.server.serviceimpl.dao.scm.SCMSupplierDAO;
import com.mes.server.serviceimpl.utils.bfc.BFCConstants;
import com.mes.server.serviceimpl.utils.dms.DMSConstants;
import com.mes.server.serviceimpl.utils.dms.LedgerDAOUtils;

@Service
public class DMSServiceImpl implements DMSService {

	private static Logger logger = LoggerFactory.getLogger(typeof(DMSServiceImpl));

	private static DMSService _instance;

	public static DMSService getInstance() {
		if (_instance == null)
			_instance = new DMSServiceImpl();

		return _instance;
	}

	@Override
	public ServiceResult<List<DMSDeviceLedger>> DMS_GetDeviceLedgerList(BMSEmployee wLoginUser, int wModelID,
			int wBusinessUnitID, int wBaseID, int wFactoryID, int wWorkShopID, int wLineID,
			DMSLedgerStatus wDMSLedgerStatus) {
		ServiceResult<List<DMSDeviceLedger>> wResult = new ServiceResult<List<DMSDeviceLedger>>();
		try {
			OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
			List<DMSDeviceLedger> wList = DMSDeviceLedgerDAO.getInstance().DMS_SelectDeviceLedgerList(wLoginUser,
					wModelID, wBusinessUnitID, wBaseID, wFactoryID, wWorkShopID, wLineID, wDMSLedgerStatus, wErrorCode);
			wResult.setResult(wList);
			wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
		} catch (Exception ex) {
			wResult.FaultCode += ex.getMessage();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

	@Override
	public ServiceResult<DMSDeviceLedger> DMS_GetDeviceLedger(BMSEmployee wLoginUser, int wID, String wDeviceNo,
			int wAssetID) {
		ServiceResult<DMSDeviceLedger> wResult = new ServiceResult<DMSDeviceLedger>();
		try {
			OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
			DMSDeviceLedger wServerRst = DMSDeviceLedgerDAO.getInstance().DMS_SelectDeviceLedger(wLoginUser, wID,
					wDeviceNo, wAssetID, wErrorCode);
			wResult.setResult(wServerRst);
			wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
		} catch (Exception ex) {
			wResult.FaultCode += ex.getMessage();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

	// (try\s*\{[\s\n]*)([^O\s\n])
	// $1OutResult<Int32> wErrorCode = new OutResult<Int32>(0);\n$2

	// (getInstance\(\)\.[A-Za-z0-9_]+\(wLoginUser[^\)]*)\)\;
	// $1 ,wErrorCode);

	@Override
	public ServiceResult<Int32> DMS_SaveDeviceLedger(BMSEmployee wLoginUser, DMSDeviceLedger wDMSDeviceLedger) {
		ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
		try {
			OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
			DMSDeviceLedgerDAO.getInstance().DMS_UpdateDeviceLedger(wLoginUser, wDMSDeviceLedger, wErrorCode);
			wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
		} catch (Exception ex) {
			wResult.FaultCode += ex.ToString();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

	@Override
	public ServiceResult<List<DMSDeviceModel>> DMS_GetDeviceModelList(BMSEmployee wLoginUser, int wDeviceWorkType,
			int wSupplierID, String wSupplierModelNo, int wModelPropertyID, int wSystemID, String wSystemVersion,
			int wSystemPropertyID, int wControllerID, String wControllerModel, int wControllerPropertyID, int wActive) {
		ServiceResult<List<DMSDeviceModel>> wResult = new ServiceResult<List<DMSDeviceModel>>();
		try {
			OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
			List<DMSDeviceModel> wServerRst = DMSDeviceModelDAO.getInstance().DMS_SelectDeviceModelList(wLoginUser,
					wDeviceWorkType, wSupplierID, wSupplierModelNo, wModelPropertyID, wSystemID, wSystemVersion,
					wSystemPropertyID, wControllerID, wControllerModel, wControllerPropertyID, wActive, wErrorCode);
			wResult.setResult(wServerRst);
			wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
		} catch (Exception ex) {
			wResult.FaultCode += ex.ToString();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

	@Override
	public ServiceResult<Int32> DMS_SaveDeviceModel(BMSEmployee wLoginUser, DMSDeviceModel wDMSDeviceModel) {
		ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
		try {
			OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
			DMSDeviceModelDAO.getInstance().DMS_UpdateDeviceModel(wLoginUser, wDMSDeviceModel, wErrorCode);
			wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
		} catch (Exception ex) {
			wResult.FaultCode += ex.ToString();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

	@Override
	public ServiceResult<Int32> DMS_ActiveDeviceModelList(BMSEmployee wLoginUser, List<Int32> wIDList,
			int wActive) {
		ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
		try {
			OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
			DMSDeviceModelDAO.getInstance().DMS_ActiveDeviceModel(wLoginUser, wIDList, wActive, wErrorCode);
			wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
		} catch (Exception ex) {
			wResult.FaultCode += ex.ToString();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

	@Override
	public ServiceResult<List<DMSSpareLedger>> DMS_GetSpareLedgerList(BMSEmployee wLoginUser, int wModelID,
			int wEquipID, int wDeviceLedgerID, int wBusinessUnitID, int wBaseID, int wFactoryID, int wWorkShopID,
			int wLineID, DMSLedgerStatus wDMSLedgerStatus) {
		ServiceResult<List<DMSSpareLedger>> wResult = new ServiceResult<List<DMSSpareLedger>>();
		try {
			OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
			List<DMSSpareLedger> wServerRst = DMSSpareLedgerDAO.getInstance().DMS_SelectSpareLedgerList(wLoginUser,
					wModelID, wEquipID, wDeviceLedgerID, wBusinessUnitID, wBaseID, wFactoryID, wWorkShopID, wLineID,
					wDMSLedgerStatus, wErrorCode);
			wResult.setResult(wServerRst);
			wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
		} catch (Exception ex) {
			wResult.FaultCode += ex.ToString();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

	@Override
	public ServiceResult<DMSSpareLedger> DMS_GetSpareLedger(BMSEmployee wLoginUser, int wID, String wSpareNo) {
		ServiceResult<DMSSpareLedger> wResult = new ServiceResult<DMSSpareLedger>();
		try {
			OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
			DMSSpareLedger wServerRst = DMSSpareLedgerDAO.getInstance().DMS_SelectSpareLedger(wLoginUser, wID, wSpareNo,
					wErrorCode);
			wResult.setResult(wServerRst);
			wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
		} catch (Exception ex) {
			wResult.FaultCode += ex.ToString();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

	@Override
	public ServiceResult<Int32> DMS_SaveSpareLedger(BMSEmployee wLoginUser, DMSSpareLedger wDMSSpareLedger) {
		ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
		try {
			OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
			DMSSpareLedgerDAO.getInstance().DMS_UpdateSpareLedger(wLoginUser, wDMSSpareLedger, wErrorCode);
			wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
		} catch (Exception ex) {
			wResult.FaultCode += ex.ToString();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

	@Override
	public ServiceResult<List<DMSSpareModel>> DMS_GetSpareModelList(BMSEmployee wLoginUser, int wSpareWorkType,
			int wModelPropertyID, int wSupplierID, String wSupplierModelNo, int wActive) {
		ServiceResult<List<DMSSpareModel>> wResult = new ServiceResult<List<DMSSpareModel>>();
		try {
			OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
			List<DMSSpareModel> wServerRst = DMSSpareModelDAO.getInstance().DMS_SelectSpareModelList(wLoginUser,
					wSpareWorkType, wModelPropertyID, wSupplierID, wSupplierModelNo, wActive, wErrorCode);
			wResult.setResult(wServerRst);
			wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
		} catch (Exception ex) {
			wResult.FaultCode += ex.ToString();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

	@Override
	public ServiceResult<Int32> DMS_SaveSpareModel(BMSEmployee wLoginUser, DMSSpareModel wDMSSpareModel) {
		ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
		try {
			OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
			DMSSpareModelDAO.getInstance().DMS_UpdateSpareModel(wLoginUser, wDMSSpareModel, wErrorCode);
			wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
		} catch (Exception ex) {
			wResult.FaultCode += ex.ToString();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

	@Override
	public ServiceResult<Int32> DMS_ActiveSpareModelList(BMSEmployee wLoginUser, List<Int32> wIDList, int wActive) {
		ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
		try {
			OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
			DMSSpareModelDAO.getInstance().DMS_ActiveSpareModel(wLoginUser, wIDList, wActive, wErrorCode);
			wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
		} catch (Exception ex) {
			wResult.FaultCode += ex.ToString();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

	@Override
	public ServiceResult<List<DMSMeasureLedger>> DMS_GetMeasureLedgerList(BMSEmployee wLoginUser, int wWorkType,
			int wSupplierID, String wSupplierModelNo, int wCalibrationLevel, int wModelID, int wWorkShopID, int wLineID,
			int wPartID, int wDeviceID, List<Int32> wStatus) {
		ServiceResult<List<DMSMeasureLedger>> wResult = new ServiceResult<List<DMSMeasureLedger>>();
		try {
			OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
			List<DMSMeasureLedger> wServerRst = DMSMeasureLedgerDAO.getInstance().DMS_SelectMeasureLedgerList(
					wLoginUser, wWorkType, wSupplierID, wSupplierModelNo, wCalibrationLevel, wModelID, wWorkShopID,
					wLineID, wPartID, wDeviceID, wStatus, wErrorCode);
			wResult.setResult(wServerRst);
			wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
		} catch (Exception ex) {
			wResult.FaultCode += ex.ToString();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

	@Override
	public ServiceResult<DMSMeasureLedger> DMS_GetMeasureLedger(BMSEmployee wLoginUser, int wID, String wMeasureNo) {
		ServiceResult<DMSMeasureLedger> wResult = new ServiceResult<DMSMeasureLedger>();
		try {
			OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
			DMSMeasureLedger wServerRst = DMSMeasureLedgerDAO.getInstance().DMS_SelectMeasureLedger(wLoginUser, wID,
					wMeasureNo, wErrorCode);
			wResult.setResult(wServerRst);
			wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
		} catch (Exception ex) {
			wResult.FaultCode += ex.ToString();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

	@Override
	public ServiceResult<Int32> DMS_SaveMeasureLedger(BMSEmployee wLoginUser, DMSMeasureLedger wDMSMeasureLedger) {
		ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
		try {
			OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
			DMSMeasureLedgerDAO.getInstance().DMS_UpdateMeasureLedger(wLoginUser, wDMSMeasureLedger, wErrorCode);
			wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
		} catch (Exception ex) {
			wResult.FaultCode += ex.ToString();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

	@Override
	public synchronized ServiceResult<List<DMSMeasureLedger>> DMS_ImportMeasureLedger(BMSEmployee wLoginUser,
			ExcelData wExcelData) {
		ServiceResult<List<DMSMeasureLedger>> wResult = new ServiceResult<List<DMSMeasureLedger>>();
		OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
		wResult.Result = new List<DMSMeasureLedger>();
		try {
			List<String> wFaultCodeList = new List<String>();
			if (wExcelData.sheetData.Count > 0 && wExcelData.sheetData[0].lineData != null
					&& wExcelData.sheetData[0].lineData.Count > 0) {
				wExcelData.sheetData[0].lineData.RemoveAll(p -> p.colData != null && p.colData.Count > 0
						&& p.colData.stream().allMatch(q -> StringUtils.isEmpty(q)));
			}
			if (wExcelData.sheetData[0].lineData.Count <= 2) {
				wResult.FaultCode = "导入量具数据条目<=0";
				return wResult;
			}

			// 补全数据 空的补""
			int wTotalSum = wExcelData.sheetData[0].lineData[0].colSum;
			for (int i = 2; i < wExcelData.sheetData[0].lineData.Count; i++) {
				int wSum = wExcelData.sheetData[0].lineData.get(i).colSum;
				if (wSum < wTotalSum) {
					for (int j = wSum; j < wTotalSum; j++) {
						wExcelData.sheetData[0].lineData.get(i).colData.Add("");
						wExcelData.sheetData[0].lineData.get(i).colSum = wTotalSum;
					}
				}
			}

			List<ExcelLineData> wExcelLineDataList = wExcelData.sheetData[0].lineData;
			ExcelLineData wExcelLineData = null;
			int wColNum = 0;

			Dictionary<String, DMSMeasureModel> wDMSMeasureModelUpdateList = new Dictionary<String, DMSMeasureModel>();

			List<DMSMeasureModel> wDMSMeasureModelList = DMSMeasureModelDAO.getInstance()
					.DMS_SelectMeasureModelList(wLoginUser, -1, -1, "", -1, -1, wErrorCode);
			wFaultCodeList.Add(MESException.getEnumType(wErrorCode.get()).getLable());
			Dictionary<String, DMSMeasureModel> wMeasureModelMap = wDMSMeasureModelList.stream()
					.collect(Collectors.toMap(p -> p.ModelNo, p -> p, (o1, o2) -> o1.Active == 1 ? o1 : o2));

			List<SCMSupplier> wSCMSupplierList = SCMSupplierDAO.getInstance().SCM_QuerySupplierList(wLoginUser, "", -1,
					-1, -1, 1, wErrorCode);
			wFaultCodeList.Add(MESException.getEnumType(wErrorCode.get()).getLable());
			Dictionary<String, SCMSupplier> wSupplierMap = wSCMSupplierList.stream()
					.collect(Collectors.toMap(p -> p.SupplierName, p -> p, (o1, o2) -> o1.Active == 1 ? o1 : o2));

			List<DMSWorkType> wDMSWorkTypeList = DeviceWorkTypeDAO.getInstance().DMS_SelectWorkTypeList(wLoginUser, -1,
					"", "", DMSLedgerTypes.Measure, 1, wErrorCode);
			wFaultCodeList.Add(MESException.getEnumType(wErrorCode.get()).getLable());

			Dictionary<String, DMSWorkType> wWorkTypeMap = wDMSWorkTypeList.stream()
					.collect(Collectors.toMap(p -> p.Name, p -> p,(o1, o2) -> o1.Active == 1 ? o1 : o2));

			List<DMSCalibrationLevel> wDMSCalibrationLevelList = DMSCalibrationLevelDAO.getInstance()
					.DMS_SelectCalibrationLevelList(wLoginUser, -1, "", -1, wErrorCode);
			wFaultCodeList.Add(MESException.getEnumType(wErrorCode.get()).getLable());

			Dictionary<String, DMSCalibrationLevel> wCalibrationLevelMap = wDMSCalibrationLevelList.stream()
					.collect(Collectors.toMap(p -> p.Code, p -> p));

			Dictionary<String, BMSEmployee> wBMSEmployeeMap = BFCConstants.GetBMSEmployeeList().values().stream()
					.collect(Collectors.toMap(p -> p.Name, p -> p, (o1, o2) -> o2.Active == 1 ? o2 : o1));

			DMSMeasureModel wDMSMeasureModel = null;
			DMSMeasureLedger wMeasureLedger = null;

			List<DMSMeasureLedger> wDMSMeasureLedgerList = DMSMeasureLedgerDAO.getInstance()
					.DMS_SelectMeasureLedgerList(wLoginUser, -1, -1, "", -1, -1, -1, -1, -1, -1, null, wErrorCode);
			wFaultCodeList.Add(MESException.getEnumType(wErrorCode.get()).getLable());
			Dictionary<String, DMSMeasureLedger> wDMSMeasureLedgerMap = wDMSMeasureLedgerList.stream()
					.collect(Collectors.toMap(p -> p.Code, p -> p,(o1, o2) -> o2.Active == 1 ? o2 : o1));

			for (int i = 2; i < wExcelLineDataList.Count; i++) {
				wMeasureLedger = new DMSMeasureLedger();
				wExcelLineData = wExcelLineDataList.get(i);
				wColNum = 1;
				wMeasureLedger.Code = wExcelLineData.colData.get(wColNum);
				wColNum++;

				if (StringUtils.isEmpty(wMeasureLedger.Code)) {
					wFaultCodeList.Add(StringUtils.Format("提示：第{0}行数据不合法，【{1}】量具编码不能为空!", i + 1, wMeasureLedger.Code));
				} else if (wDMSMeasureLedgerMap.ContainsKey(wMeasureLedger.Code)) {
					wMeasureLedger.ID = wDMSMeasureLedgerMap.get(wMeasureLedger.Code).ID;
				}

				wMeasureLedger.Name = wExcelLineData.colData.get(wColNum);
				if (StringUtils.isEmpty(wMeasureLedger.Name)) {
					wFaultCodeList.Add(StringUtils.Format("提示：第{0}行数据不合法，【{1}】量具名称不能为空!", i + 1, wMeasureLedger.Name));
				}
				wColNum++;
				wMeasureLedger.SupplierName = wExcelLineData.colData.get(wColNum);
				wColNum++;

				// 检查厂家名称是否存在
				if (StringUtils.isNotEmpty(wMeasureLedger.SupplierName)) {
					if (!wSupplierMap.ContainsKey(wMeasureLedger.SupplierName)) {
						wFaultCodeList.Add(
								StringUtils.Format("提示：第{0}行数据不合法，【{1}】供应商不存在!", i + 1, wMeasureLedger.SupplierName));
					} else {
						wMeasureLedger.SupplierID = wSupplierMap.get(wMeasureLedger.SupplierName).ID;
					}
				}
				wMeasureLedger.ManufacturerNo = wExcelLineData.colData.get(wColNum);
				wColNum++;
				wMeasureLedger.AssetsNo = wExcelLineData.colData.get(wColNum);
				wColNum++;
				wMeasureLedger.WorkTypeName = wExcelLineData.colData.get(wColNum);
				wColNum++;
				if (StringUtils.isEmpty(wMeasureLedger.WorkTypeName)) {
					wFaultCodeList.Add(
							StringUtils.Format("提示：第{0}行数据不合法，【{1}】量具类型不能为空!", i + 1, wMeasureLedger.WorkTypeName));
				} else {
					if (!wWorkTypeMap.ContainsKey(wMeasureLedger.WorkTypeName)) {

						wFaultCodeList.Add(
								StringUtils.Format("提示：第{0}行数据不合法，【{1}】量具类型不存在!", i + 1, wMeasureLedger.WorkTypeName));
					} else {
						wMeasureLedger.WorkType = wWorkTypeMap.get(wMeasureLedger.WorkTypeName).ID;
					}
				}

				wMeasureLedger.ModelNo = wExcelLineData.colData.get(wColNum);
				wColNum++;
				if (StringUtils.isEmpty(wMeasureLedger.ModelNo)) {
					wFaultCodeList
							.Add(StringUtils.Format("提示：第{0}行数据不合法，【{1}】量具规格不能为空!", i + 1, wMeasureLedger.ModelNo));
					continue;
				} else if (!wMeasureModelMap.ContainsKey(wMeasureLedger.ModelNo)) {
					if (wMeasureLedger.WorkType <= 0) {
						// 量具类型不存在无法创建量具规格
						continue;
					}

					wDMSMeasureModel = new DMSMeasureLedger();
					wDMSMeasureModel.ModelNo = wMeasureLedger.ModelNo;
					wDMSMeasureModel.ModelName = wMeasureLedger.ModelNo;
					wDMSMeasureModel.WorkType = wMeasureLedger.WorkType;
					wDMSMeasureModel.WorkTypeName = wMeasureLedger.WorkTypeName;
					wDMSMeasureModel.SupplierID = wMeasureLedger.SupplierID;
					wDMSMeasureModel.SupplierName = wMeasureLedger.SupplierName;
					wDMSMeasureModel.CreatorID = wLoginUser.ID;
					wDMSMeasureModel.CreatorName = wLoginUser.Name;
					wDMSMeasureModel.Active = 1;

					DMSMeasureModelDAO.getInstance().DMS_UpdateMeasureModel(wLoginUser, wDMSMeasureModel, wErrorCode);

					wFaultCodeList.Add(MESException.getEnumType(wErrorCode.get()).getLable());
					if (wDMSMeasureModel.ModelID <= 0)
						continue;

					wMeasureModelMap.Add(wDMSMeasureModel.ModelNo, wDMSMeasureModel);

				} else {
					wDMSMeasureModel = wMeasureModelMap.get(wMeasureLedger.ModelNo);
					wDMSMeasureModel.Active = 1;
				}

				wDMSMeasureModel.EditorID = wLoginUser.ID;
				wDMSMeasureModel.EditorName = wLoginUser.Name;
				wDMSMeasureModel.EditTime = DateTime.Now;

				// 判断规格与量具类型是否匹配
				wMeasureLedger.ModelID = wDMSMeasureModel.ModelID;
				wMeasureLedger.ModelName = wDMSMeasureModel.ModelName;
				if (wMeasureLedger.WorkType > 0 && wMeasureLedger.ModelID > 0
						&& wMeasureModelMap.get(wMeasureLedger.ModelNo).WorkType != wMeasureLedger.WorkType) {

					wFaultCodeList.Add(StringUtils.Format("提示：第{0}行数据不合法，【{1}】量具规格对应的量具类型【{2}】与当前量具类型【{3}】不匹配!", i + 1,
							wMeasureLedger.ModelNo));
				}

				wMeasureLedger.MeasureRange = wExcelLineData.colData.get(wColNum);
				wDMSMeasureModel.MeasureRange = wMeasureLedger.MeasureRange;
				wColNum++;
				if (StringUtils.isEmpty(wMeasureLedger.MeasureRange)) {
					wFaultCodeList
							.Add(StringUtils.Format("提示：第{0}行数据不合法，【{1}】量程范围不能为空!", i + 1, wMeasureLedger.ModelNo));
					continue;
				}

				wMeasureLedger.Cost = StringUtils.parseDouble(wExcelLineData.colData.get(wColNum));
				wColNum++;
				wMeasureLedger.Accuracy = wExcelLineData.colData.get(wColNum);
				wDMSMeasureModel.Accuracy = wMeasureLedger.Accuracy;
				wColNum++;
				wMeasureLedger.Mistake = wExcelLineData.colData.get(wColNum);
				wDMSMeasureModel.Mistake = wMeasureLedger.Mistake;
				wColNum++;
				wMeasureLedger.Environment = wExcelLineData.colData.get(wColNum);
				wDMSMeasureModel.Environment = wMeasureLedger.Environment;
				wColNum++;
				wMeasureLedger.StorageLocation = wExcelLineData.colData.get(wColNum);
				wColNum++;
				wMeasureLedger.OwnerName = wExcelLineData.colData.get(wColNum);
				wColNum++;
				if (wBMSEmployeeMap.ContainsKey(wMeasureLedger.OwnerName)) {
					wMeasureLedger.OwnerID = wBMSEmployeeMap.get(wMeasureLedger.OwnerName).ID;
				} else {
					wMeasureLedger.OwnerID = wLoginUser.ID;
					wMeasureLedger.OwnerName = wLoginUser.Name;
				}
				wMeasureLedger.BorrowerName = wExcelLineData.colData.get(wColNum);
				wColNum++;
				if (wBMSEmployeeMap.ContainsKey(wMeasureLedger.BorrowerName)) {
					wMeasureLedger.BorrowerID = wBMSEmployeeMap.get(wMeasureLedger.BorrowerName).ID;
				} else {
					wMeasureLedger.BorrowerID = wLoginUser.ID;
					wMeasureLedger.BorrowerName = wLoginUser.Name;
				}

				wMeasureLedger.FirstTime = StringUtils.parseDate(wExcelLineData.colData.get(wColNum));
				wColNum++;
				if (wMeasureLedger.BorrowerID <= 0)
					wMeasureLedger.BorrowTime.set(2000, 0, 1);
				wMeasureLedger.CalibrationManufacturer = wExcelLineData.colData.get(wColNum);
				wColNum++;
				wMeasureLedger.CalibrationPersonName = wExcelLineData.colData.get(wColNum);
				wColNum++;
				if (wBMSEmployeeMap.ContainsKey(wMeasureLedger.CalibrationPersonName)) {
					wMeasureLedger.CalibrationPersonID = wBMSEmployeeMap.get(wMeasureLedger.CalibrationPersonName)
							.ID;
				} else {
					wMeasureLedger.CalibrationPersonID = wLoginUser.ID;
					wMeasureLedger.CalibrationPersonName = wLoginUser.Name;
				}
				wMeasureLedger.CalibrationDate = StringUtils.parseDate(wExcelLineData.colData.get(wColNum));
				wColNum++;
				wMeasureLedger.CalibrationNo = wExcelLineData.colData.get(wColNum);
				wColNum++;
				wMeasureLedger.NextCalibrationDate = StringUtils.parseDate(wExcelLineData.colData.get(wColNum));
				wColNum++;
				wMeasureLedger.CalibrationLevelCode = wExcelLineData.colData.get(wColNum);
				wDMSMeasureModel.CalibrationLevelCode = wMeasureLedger.CalibrationLevelCode;
				wColNum++;

				if (StringUtils.isEmpty(wMeasureLedger.CalibrationLevelCode)) {
					wFaultCodeList.Add(
							StringUtils.Format("提示：第{0}行数据不合法，【{1}】校准等级不能为空!", i + 1, wMeasureLedger.WorkTypeName));
				} else {
					if (!wCalibrationLevelMap.ContainsKey(wMeasureLedger.CalibrationLevelCode)) {

						wFaultCodeList.Add(StringUtils.Format("提示：第{0}行数据不合法，【{1}】校准等级不存在!", i + 1,
								wMeasureLedger.CalibrationLevelCode));
					} else {
						wMeasureLedger.CalibrationLevel = wCalibrationLevelMap
								.get(wMeasureLedger.CalibrationLevelCode).ID;
						wDMSMeasureModel.CalibrationLevel = wMeasureLedger.CalibrationLevel;
					}
				}
				wMeasureLedger.CalibrationCycle = StringUtils.parseDouble(wExcelLineData.colData.get(wColNum));
				wColNum++;
				wMeasureLedger.CalibrationBasis = wExcelLineData.colData.get(wColNum);
				wDMSMeasureModel.CalibrationBasis = wMeasureLedger.CalibrationBasis;
				wColNum++;
				wMeasureLedger.Remark = wExcelLineData.colData.get(wColNum);
				wColNum++;
				wMeasureLedger.Status = DMSLedgerStatus.getEnumType(wExcelLineData.colData.get(wColNum)).getValue();
				wColNum++;

				if (!wDMSMeasureModelUpdateList.ContainsKey(wMeasureLedger.ModelNo))
					wDMSMeasureModelUpdateList.Add(wDMSMeasureModel.ModelNo, wDMSMeasureModel);

				wResult.Result.Add(wMeasureLedger);
			}
			wFaultCodeList.RemoveAll(p -> StringUtils.isEmpty(p));
			if (wFaultCodeList.Count > 0) {
				wResult.FaultCode += StringUtils.Join("\n", wFaultCodeList);
				return wResult;
			}

			for (DMSMeasureModel wMeasureModel : wDMSMeasureModelUpdateList.values()) {
				DMSMeasureModelDAO.getInstance().DMS_UpdateMeasureModel(wLoginUser, wMeasureModel, wErrorCode);
				wFaultCodeList.Add(MESException.getEnumType(wErrorCode.get()).getLable());
			}
			wFaultCodeList.RemoveAll(p -> StringUtils.isEmpty(p));
			if (wFaultCodeList.Count > 0) {
				wResult.FaultCode += StringUtils.Join("\n", wFaultCodeList);
				return wResult;
			}
			// 更新规格数据
			for (DMSMeasureModel wMeasureModel : wDMSMeasureModelUpdateList.values()) {
				DMSMeasureModelDAO.getInstance().DMS_UpdateMeasureModel(wLoginUser, wMeasureModel, wErrorCode);
				wFaultCodeList.Add(MESException.getEnumType(wErrorCode.get()).getLable());
			}
			wFaultCodeList.RemoveAll(p -> StringUtils.isEmpty(p));
			if (wFaultCodeList.Count > 0) {
				wResult.FaultCode += StringUtils.Join("\n", wFaultCodeList);
				return wResult;
			}
			// 插入数据
			for (DMSMeasureLedger wDMSMeasureLedger : wResult.Result) {
				DMSMeasureLedgerDAO.getInstance().DMS_UpdateMeasureLedger(wLoginUser, wDMSMeasureLedger, wErrorCode);
				wFaultCodeList.Add(MESException.getEnumType(wErrorCode.get()).getLable());
			} 
			wFaultCodeList.RemoveAll(p -> StringUtils.isEmpty(p));
			if (wFaultCodeList.Count > 0) {
				wResult.FaultCode += StringUtils.Join("\n", wFaultCodeList);
				return wResult;
			}
		} catch (Exception ex) {
			wResult.FaultCode += ex.ToString();
			logger.error("DMSServerImpl DMS_ImportMeasureLedger error:",ex);
		}
		return wResult;
	}

	@Override
	public ServiceResult<Int32> DMS_DeleteMeasureLedger(BMSEmployee wLoginUser, DMSMeasureLedger wDMSMeasureLedger) {
		ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
		try {
			OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
			DMSMeasureLedgerDAO.getInstance().DMS_DeleteMeasureLedger(wLoginUser, wDMSMeasureLedger, wErrorCode);
			wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
		} catch (Exception ex) {
			wResult.FaultCode += ex.ToString();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

	@Override
	public ServiceResult<List<DMSMeasureModel>> DMS_GetMeasureModelList(BMSEmployee wLoginUser, int wWorkType,
			int wSupplierID, String wSupplierModelNo, int wCalibrationLevel, int wActive) {
		ServiceResult<List<DMSMeasureModel>> wResult = new ServiceResult<List<DMSMeasureModel>>();
		try {
			OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
			List<DMSMeasureModel> wServerRst = DMSMeasureModelDAO.getInstance().DMS_SelectMeasureModelList(wLoginUser,
					wWorkType, wSupplierID, wSupplierModelNo, wCalibrationLevel, wActive, wErrorCode);
			wResult.setResult(wServerRst);
			wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
		} catch (Exception ex) {
			wResult.FaultCode += ex.ToString();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

	@Override
	public ServiceResult<DMSMeasureModel> DMS_GetMeasureModel(BMSEmployee wLoginUser, int wID, String wModelNo) {
		ServiceResult<DMSMeasureModel> wResult = new ServiceResult<DMSMeasureModel>();
		try {
			OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
			wResult.Result = DMSMeasureModelDAO.getInstance().DMS_SelectMeasureModel(wLoginUser, wID, wModelNo,
					wErrorCode);
			wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
		} catch (Exception ex) {
			wResult.FaultCode += ex.ToString();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

	@Override
	public ServiceResult<Int32> DMS_SaveMeasureModel(BMSEmployee wLoginUser, DMSMeasureModel wDMSMeasureModel) {
		ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
		try {
			OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
			DMSMeasureModelDAO.getInstance().DMS_UpdateMeasureModel(wLoginUser, wDMSMeasureModel, wErrorCode);
			wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
		} catch (Exception ex) {
			wResult.FaultCode += ex.ToString();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

	@Override
	public ServiceResult<Int32> DMS_ActiveMeasureModelList(BMSEmployee wLoginUser, List<Int32> wIDList,
			int wActive) {
		ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
		try {
			OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
			DMSMeasureModelDAO.getInstance().DMS_ActiveMeasureModel(wLoginUser, wIDList, wActive, wErrorCode);
			wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
		} catch (Exception ex) {
			wResult.FaultCode += ex.ToString();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

	@Override
	public ServiceResult<Int32> DMS_DeleteMeasureModel(BMSEmployee wLoginUser, DMSMeasureModel wDMSMeasureModel) {
		ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
		try {
			OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
			DMSMeasureModelDAO.getInstance().DMS_DeleteMeasureModel(wLoginUser, wDMSMeasureModel, wErrorCode);
			wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
		} catch (Exception ex) {
			wResult.FaultCode += ex.ToString();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

	@Override
	public ServiceResult<List<DMSCalibrationLevel>> DMS_GetCalibrationLevelList(BMSEmployee wLoginUser, int wActive) {
		ServiceResult<List<DMSCalibrationLevel>> wResult = new ServiceResult<List<DMSCalibrationLevel>>();
		try {
			OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
			List<DMSCalibrationLevel> wServerRst = DMSCalibrationLevelDAO.getInstance()
					.DMS_SelectCalibrationLevelList(wLoginUser, -1, "", wActive, wErrorCode);
			wResult.setResult(wServerRst);
			wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
		} catch (Exception ex) {
			wResult.FaultCode += ex.ToString();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

	@Override
	public ServiceResult<DMSCalibrationLevel> DMS_GetCalibrationLevel(BMSEmployee wLoginUser, int wID, String wCode) {
		ServiceResult<DMSCalibrationLevel> wResult = new ServiceResult<DMSCalibrationLevel>();
		try {
			OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
			wResult.Result = DMSCalibrationLevelDAO.getInstance().DMS_SelectCalibrationLevel(wLoginUser, wID, wCode,
					wErrorCode);
			wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
		} catch (Exception ex) {
			wResult.FaultCode += ex.ToString();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

	@Override
	public ServiceResult<Int32> DMS_SaveCalibrationLevel(BMSEmployee wLoginUser,
			DMSCalibrationLevel wDMSCalibrationLevel) {
		ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
		try {
			OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
			DMSCalibrationLevelDAO.getInstance().DMS_UpdateCalibrationLevel(wLoginUser, wDMSCalibrationLevel,
					wErrorCode);
			wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
		} catch (Exception ex) {
			wResult.FaultCode += ex.ToString();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

	@Override
	public ServiceResult<Int32> DMS_ActiveCalibrationLevelList(BMSEmployee wLoginUser, List<Int32> wIDList,
			int wActive) {
		ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
		try {
			OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
			DMSCalibrationLevelDAO.getInstance().DMS_ActiveCalibrationLevel(wLoginUser, wIDList, wActive, wErrorCode);
			wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
		} catch (Exception ex) {
			wResult.FaultCode += ex.ToString();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

	@Override
	public ServiceResult<Int32> DMS_DeleteCalibrationLevel(BMSEmployee wLoginUser,
			DMSCalibrationLevel wDMSCalibrationLevel) {
		ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
		try {
			OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
			DMSCalibrationLevelDAO.getInstance().DMS_DeleteCalibrationLevel(wLoginUser, wDMSCalibrationLevel,
					wErrorCode);
			wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
		} catch (Exception ex) {
			wResult.FaultCode += ex.ToString();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

	@Override
	public ServiceResult<List<DMSUseRecord>> DMS_GetUseRecordList(BMSEmployee wLoginUser, int wDSType, int wLedgerID,
			int wEquipID, int wUsed, DateTime wStartTime, DateTime wEndTime) {
		ServiceResult<List<DMSUseRecord>> wResult = new ServiceResult<List<DMSUseRecord>>();
		try {
			OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
			List<DMSUseRecord> wServerRst = DMSUsedRecordDAO.getInstance().DMS_SelectUseRecordList(wLoginUser, wDSType,
					wLedgerID, wEquipID, wUsed, wStartTime, wEndTime, wErrorCode);
			wResult.setResult(wServerRst);
			wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
		} catch (Exception ex) {
			wResult.FaultCode += ex.ToString();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

	@Override
	public ServiceResult<List<DMSUseRecord>> DMS_GetUseRecordList(BMSEmployee wLoginUser, List<Long> wID,
			int wBusinessUnitID, int wBaseID, int wFactoryID, int wWorkShopID, int wLineID, int wDSType,
			List<Int32> wSpareLedgerID, List<Int32> wDeviceLedgerID, int wUsed, DateTime wStartTime,
			DateTime wEndTime) {
		ServiceResult<List<DMSUseRecord>> wResult = new ServiceResult<List<DMSUseRecord>>();
		try {
			OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
			List<DMSUseRecord> wServerRst = DMSUsedRecordDAO.getInstance().DMS_SelectUseRecordList(wLoginUser, wID,
					wBusinessUnitID, wBaseID, wFactoryID, wWorkShopID, wLineID, wDSType, wSpareLedgerID,
					wDeviceLedgerID, wUsed, wStartTime, wEndTime, wErrorCode);
			wResult.setResult(wServerRst);
			wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
		} catch (Exception ex) {
			wResult.FaultCode += ex.ToString();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

	@Override
	public ServiceResult<Int32> DMS_InsertUseRecord(BMSEmployee wLoginUser, DMSUseRecord wDMSSpareRecord) {
		ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
		try {
			OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
			DMSUsedRecordDAO.getInstance().DMS_InsertUseRecord(wLoginUser, wDMSSpareRecord, wErrorCode);

			wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
		} catch (Exception ex) {
			wResult.FaultCode += ex.ToString();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

	@Override
	public ServiceResult<List<DMSEquipSpare>> DMS_GetEquipSpareList(BMSEmployee wLoginUser, String wDeviceSpareName,
			int wDeviceModelID, int wSpareModelID, int wActive, DateTime wStartTime, DateTime wEndTime) {
		ServiceResult<List<DMSEquipSpare>> wResult = new ServiceResult<List<DMSEquipSpare>>();
		try {
			OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
			List<DMSEquipSpare> wServerRst = DeviceEquipSpareDAO.getInstance().DMS_SelectEquipSpareList(wLoginUser,
					wDeviceSpareName, wDeviceModelID, wSpareModelID, wActive, wStartTime, wEndTime, wErrorCode);
			wResult.setResult(wServerRst);
			wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
		} catch (Exception ex) {
			wResult.FaultCode += ex.ToString();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

	@Override
	public ServiceResult<Int32> DMS_SaveEquipSpare(BMSEmployee wLoginUser, DMSEquipSpare wDMSEquipSpare) {
		ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
		try {
			OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
			DeviceEquipSpareDAO.getInstance().DMS_UpdateEquipSpare(wLoginUser, wDMSEquipSpare, wErrorCode);

			wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
		} catch (Exception ex) {
			wResult.FaultCode += ex.ToString();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

	@Override
	public ServiceResult<Int32> DMS_ActiveEquipSpareList(BMSEmployee wLoginUser, List<Int32> wIDList, int wActive) {
		ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
		try {
			OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
			DeviceEquipSpareDAO.getInstance().DMS_ActiveEquipSpare(wLoginUser, wIDList, wActive, wErrorCode);
			wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
		} catch (Exception ex) {
			wResult.FaultCode += ex.ToString();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

	@Override
	public ServiceResult<List<DMSFixedAssets>> DMS_GetFixedAssetsList(BMSEmployee wLoginUser, DMSAssetTypes wAssetType,
			int wOperatorID, int wActive, DateTime wStartTime, DateTime wEndTime) {
		ServiceResult<List<DMSFixedAssets>> wResult = new ServiceResult<List<DMSFixedAssets>>();
		try {
			OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
			List<DMSFixedAssets> wServerRst = DeviceFixedAssetsDAO.getInstance().DMS_SelectFixedAssetsAll(wLoginUser,
					wAssetType, wOperatorID, wActive, wStartTime, wEndTime, wErrorCode);
			wResult.setResult(wServerRst);
			wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
		} catch (Exception ex) {
			wResult.FaultCode += ex.ToString();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

	@Override
	public ServiceResult<DMSFixedAssets> DMS_GetFixedAssetsByID(BMSEmployee wLoginUser, int wID, String wAssetNo) {
		ServiceResult<DMSFixedAssets> wResult = new ServiceResult<DMSFixedAssets>();
		try {
			OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
			DMSFixedAssets wServerRst = DeviceFixedAssetsDAO.getInstance().DMS_SelectFixedAssets(wLoginUser, wID,
					wAssetNo, wErrorCode);
			wResult.setResult(wServerRst);
			wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
		} catch (Exception ex) {
			wResult.FaultCode += ex.ToString();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

	@Override
	public ServiceResult<Int32> DMS_SaveFixedAssets(BMSEmployee wLoginUser, DMSFixedAssets wDMSFixedAssets) {
		ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
		try {
			OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
			DeviceFixedAssetsDAO.getInstance().DMS_UpdateFixedAssets(wLoginUser, wDMSFixedAssets, wErrorCode);
			wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
		} catch (Exception ex) {
			wResult.FaultCode += ex.ToString();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

	@Override
	public ServiceResult<List<DMSPropertyModel>> DMS_GetPropertyModelList(BMSEmployee wLoginUser, int wPropertyID,
			String wPropertyNo, String wPropertyName, DMSPropertyTypes wDMSPropertyTypes,
			DMSLedgerTypes wDMSLedgerTypes, int wActive) {
		ServiceResult<List<DMSPropertyModel>> wResult = new ServiceResult<List<DMSPropertyModel>>();
		try {
			OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
			wResult.Result = DevicePropertyModelDAO.getInstance().DMS_SelectPropertyModelList(wLoginUser, wPropertyID,
					wPropertyNo, wPropertyName, wDMSPropertyTypes, wDMSLedgerTypes, wActive, wErrorCode);

			wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
		} catch (Exception ex) {
			wResult.FaultCode += ex.ToString();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

	@Override
	public ServiceResult<Int32> DMS_SavePropertyModel(BMSEmployee wLoginUser, DMSPropertyModel wDMSPropertyModel) {
		ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
		try {
			OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
			DevicePropertyModelDAO.getInstance().DMS_UpdatePropertyModel(wLoginUser, wDMSPropertyModel, wErrorCode);
			wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
		} catch (Exception ex) {
			wResult.FaultCode += ex.ToString();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

	@Override
	public ServiceResult<Int32> DMS_ActivePropertyModelList(BMSEmployee wLoginUser, List<Int32> wIDList,
			int wActive) {
		ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
		try {
			OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
			DevicePropertyModelDAO.getInstance().DMS_ActivePropertyModel(wLoginUser, wIDList, wActive, wErrorCode);
			wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
		} catch (Exception ex) {
			wResult.FaultCode += ex.ToString();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

	@Override
	public ServiceResult<List<DMSStockWarning>> DMS_GetStockWarningList(BMSEmployee wLoginUser, int wModelID,
			String wModelNo, int wWorkType, int wSupplierID, String wSupplierModelNo, DMSLedgerTypes wDMSLedgerTypes,
			int wActive, DateTime wStartTime, DateTime wEndTime) {
		ServiceResult<List<DMSStockWarning>> wResult = new ServiceResult<List<DMSStockWarning>>();
		try {
			OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
			List<DMSStockWarning> wServerRst = DeviceStockWarningDAO.getInstance().SelectAll(wLoginUser, wModelID,
					wModelNo, wWorkType, wSupplierID, wSupplierModelNo, wDMSLedgerTypes, wActive, wStartTime, wEndTime,
					wErrorCode);
			wResult.setResult(wServerRst);
			wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
		} catch (Exception ex) {
			wResult.FaultCode += ex.ToString();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

	@Override
	public ServiceResult<DMSStockWarning> DMS_GetStockWarning(BMSEmployee wLoginUser, long wID) {
		ServiceResult<DMSStockWarning> wResult = new ServiceResult<DMSStockWarning>();
		try {
			OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
			DMSStockWarning wServerRst = DeviceStockWarningDAO.getInstance().Select(wLoginUser, wID, wErrorCode);
			wResult.setResult(wServerRst);
			wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
		} catch (Exception ex) {
			wResult.FaultCode += ex.ToString();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

	@Override
	public ServiceResult<Long> DMS_SaveStockWarning(BMSEmployee wLoginUser, DMSStockWarning wDMSStockWarning) {
		ServiceResult<Long> wResult = new ServiceResult<Long>(0L);
		try {
			OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
			Long wID = DeviceStockWarningDAO.getInstance().Update(wLoginUser, wDMSStockWarning, wErrorCode);
			wResult.setResult(wID);
			wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
		} catch (Exception ex) {
			wResult.FaultCode += ex.ToString();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

	@Override
	public ServiceResult<List<DMSWorkType>> DMS_GetWorkTypeList(BMSEmployee wLoginUser, DMSLedgerTypes wDMSLedgerTypes,
			int wActive) {
		ServiceResult<List<DMSWorkType>> wResult = new ServiceResult<List<DMSWorkType>>();
		try {
			OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
			List<DMSWorkType> wServerRst = DeviceWorkTypeDAO.getInstance().DMS_SelectWorkTypeList(wLoginUser, 0, "", "",
					wDMSLedgerTypes, wActive, wErrorCode);
			wResult.setResult(wServerRst);
			wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
		} catch (Exception ex) {
			wResult.FaultCode += ex.ToString();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

	@Override
	public ServiceResult<Int32> DMS_SaveWorkType(BMSEmployee wLoginUser, DMSWorkType wDMSWorkType) {
		ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
		try {
			OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
			DeviceWorkTypeDAO.getInstance().DMS_UpdateWorkType(wLoginUser, wDMSWorkType, wErrorCode);
			wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
		} catch (Exception ex) {
			wResult.FaultCode += ex.ToString();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

	@Override
	public ServiceResult<Int32> DMS_ActiveWorkTypeList(BMSEmployee wLoginUser, List<Int32> wIDList, int wDSType,
			int wActive) {
		ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
		try {
			OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
			DeviceWorkTypeDAO.getInstance().DMS_ActiveWorkType(wLoginUser, wIDList, wDSType, wActive, wErrorCode);
			wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
		} catch (Exception ex) {
			wResult.FaultCode += ex.ToString();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

	@Override
	public ServiceResult<Int32> DMS_DeleteWorkTypeList(BMSEmployee wLoginUser, List<Int32> wIDList, int wDSType) {
		ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
		try {
			OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
			DeviceWorkTypeDAO.getInstance().DMS_DeleteWorkType(wLoginUser, wIDList, wDSType, wErrorCode);
			wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
		} catch (Exception ex) {
			wResult.FaultCode += ex.ToString();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

	@Override
	public ServiceResult<DMSTimeOutConfig> DMS_GetTimeOutConfig(BMSEmployee wLoginUser) {
		ServiceResult<DMSTimeOutConfig> wResult = new ServiceResult<DMSTimeOutConfig>(new DMSTimeOutConfig());
		try {
			OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
			wResult.setResult(DMSConstants.getDMSTimeOutConfig());
			wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
		} catch (Exception ex) {
			wResult.FaultCode += ex.ToString();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

	@Override
	public ServiceResult<Int32> DMS_SaveTimeOutConfig(BMSEmployee wLoginUser, DMSTimeOutConfig wDMSTimeOutConfig) {
		ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
		try {
			OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
			DMSConstants.setDMSTimeOutConfig(wDMSTimeOutConfig);
			wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
		} catch (Exception ex) {
			wResult.FaultCode += ex.ToString();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

	@Override
	public ServiceResult<DateTime> DMS_DeviceLedgerReplaceMinTime(BMSEmployee wLoginUser,
			DMSDeviceLedger wDMSDeviceLedger) {

		ServiceResult<DateTime> wResult = new ServiceResult<DateTime>();
		try {
			OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
			wResult.setResult(
					LedgerDAOUtils.getInstance().DeviceLedgerReplaceMinTime(wLoginUser, wDMSDeviceLedger, wErrorCode));
			wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
		} catch (Exception ex) {
			wResult.FaultCode += ex.ToString();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

	@Override
	public ServiceResult<DateTime> DMS_SpareLedgerReplaceMinTime(BMSEmployee wLoginUser,
			DMSSpareLedger wDMSSpareLedger) {
		ServiceResult<DateTime> wResult = new ServiceResult<DateTime>();
		try {
			OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
			wResult.setResult(
					LedgerDAOUtils.getInstance().SpareLedgerReplaceMinTime(wLoginUser, wDMSSpareLedger, wErrorCode));
			wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
		} catch (Exception ex) {
			wResult.FaultCode += ex.ToString();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

}
