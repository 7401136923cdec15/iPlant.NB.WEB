package com.mes.server.serviceimpl.dao.dms;

import java.util.List;
import java.util.DateTime;
import java.util.Dictionary;
import java.util.List;
import java.util.Dictionary;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;

import com.mes.server.service.po.OutResult;
import com.mes.server.service.po.ServiceResult;
import com.mes.server.service.po.bms.BMSEmployee;
import com.mes.server.service.po.dms.deviceLegder.DMSUseRecord;
import com.mes.server.service.utils.StringUtils;
import com.mes.server.serviceimpl.dao.BaseDAO;
import com.mes.server.serviceimpl.utils.fmc.FMCConstants;
import com.mes.server.service.mesenum.MESDBSource;
import com.mes.server.service.mesenum.MESException;
import com.mes.server.service.mesenum.dms.DMSLedgerTypes;

public class DMSUsedRecordDAO extends BaseDAO {
	private static Logger logger = LoggerFactory.getLogger(typeof(DMSUsedRecordDAO));

	private static DMSUsedRecordDAO Instance;

	private DMSUsedRecordDAO() {
		super();
	}

	public static DMSUsedRecordDAO getInstance() {
		if (Instance == null)
			Instance = new DMSUsedRecordDAO();
		return Instance;
	}

	// (public\s+[a-zA-z0-9_\<\>]+\s+[a-zA-z0-9_\<\>]+\()([^\)]*)\)
	// $1BMSEmployee wLoginUser,$2,OutResult<Int32> wErrorCode)

	public List<DMSUseRecord> DMS_SelectUseRecordList(BMSEmployee wLoginUser, List<Long> wID, int wBusinessUnitID,
			int wBaseID, int wFactoryID, int wWorkShopID, int wLineID, int wDSType, List<Int32> wLedgerID,
			List<Int32> wEquipmentID, int wUsed, DateTime wStartTime, DateTime wEndTime,
			OutResult<Int32> wErrorCode) {
		List<DMSUseRecord> wResult = new List<DMSUseRecord>();
		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.DMS);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return wResult;

			if (wID == null)
				wID = new List<Long>();

			if (wLedgerID == null)
				wLedgerID = new List<Int32>();

			wLedgerID.RemoveAll(p -> p <= 0);

			if (wEquipmentID == null)
				wEquipmentID = new List<Int32>();

			wEquipmentID.RemoveAll(p -> p <= 0);

			DateTime wBaseTime = DateTime.Now;
			wBaseTime.set(2000, 0, 1);
			if ( wStartTime.CompareTo(wBaseTime) < 0)
				wStartTime = wBaseTime;
			if ( wEndTime.CompareTo(wBaseTime) < 0)
				wEndTime = wBaseTime;
			if (wStartTime.CompareTo(wEndTime) > 0)
				return wResult;

			String wLedgerTableName = "";
			String wModelTableName = "";
			switch (DMSLedgerTypes.getEnumType(wDSType)) {
			case Device:
				wLedgerTableName = "device_ledger";
				wModelTableName = "device_model";
				wEquipmentID.clear();
				break;
			case Spare:
				wLedgerTableName = "device_spare_ledger";
				wModelTableName = "device_spare_model";
				break;
			case Measure:
				wLedgerTableName = "device_measure_ledger";
				wModelTableName = "device_measure_model";
				break;
			default:
				return wResult;
			}

			// \\\"\'\,(\w+)\,\'\\\"
			String wSQL = StringUtils.Format("SELECT t.ID, t1.Code , t1.ModelID ,t3.ModelNo,t3.ModelName,"
					+ " t1.BusinessUnitID, t1.BaseID,  t1.FactoryID,  t1.WorkShopID, t1.LineID,"
					+ " t2.Code as EquipmentNo  FROM {0}.dms_use_record t  "
					+ " inner join {0}.{4} t1 on t.LedgerID=t1.ID "
					+ " left join {0}.device_ledger t2  on t.EquipmentID=t2.ID  "
					+ " left join {0}.{5} t3  on t1.ModelID=t3.ID  "
					+ " WHERE  ( @wID is null or @wID =''''or t.ID IN( {1} ) ) "
					+ " and ( @wUsed < 0 or t.Used  = @wUsed)  "
					+ " and ( @wEquipmentID is null or @wEquipmentID =''''or t.EquipmentID IN( {2} ) )  "
					+ " and ( @wLedgerID is null or @wLedgerID =''''or t.LedgerID IN( {3} ) )  "
					+ " and ( @wBusinessUnitID <= 0 or t2.BusinessUnitID  = @wBusinessUnitID)  "
					+ " and ( @wBaseID <= 0 or t2.BaseID  = @wBaseID)  "
					+ " and ( @wFactoryID <= 0 or t2.FactoryID  = @wFactoryID)  "
					+ " and ( @wWorkShopID <= 0 or t2.WorkShopID  = @wWorkShopID)  "
					+ " and ( @wLineID <= 0 or t2.LineID  = @wLineID)    "
					+ " and ( @wStartTime <=str_to_date('2010-01-01', '%Y-%m-%d') or @wStartTime <= t.EndTime) "
					+ " and ( @wEndTime <=str_to_date('2010-01-01', '%Y-%m-%d') or @wEndTime >= t.StartTime) ;",
					wInstance.Result, wID.Count > 0 ? StringUtils.Join(",", wID) : "0",
					wEquipmentID.Count > 0 ? StringUtils.Join(",", wEquipmentID) : "0",
					wLedgerID.Count > 0 ? StringUtils.Join(",", wLedgerID) : "0", wLedgerTableName, wModelTableName);
			wSQL = this.DMLChange(wSQL);
			Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
			wParamMap.Add("wID", StringUtils.Join(",", wID));
			wParamMap.Add("wUsed", wUsed);
			wParamMap.Add("wLedgerID", StringUtils.Join(",", wLedgerID));
			wParamMap.Add("wBusinessUnitID", wBusinessUnitID);
			wParamMap.Add("wBaseID", wBaseID);
			wParamMap.Add("wFactoryID", wFactoryID);
			wParamMap.Add("wWorkShopID", wWorkShopID);
			wParamMap.Add("wLineID", wLineID);
			wParamMap.Add("wEquipmentID", StringUtils.Join(",", wEquipmentID));
			wParamMap.Add("wStartTime", wStartTime);
			wParamMap.Add("wEndTime", wEndTime);

			List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);
			// wReader\[\"(\w+)\"\]
			for (Dictionary<String, Object> wReader : wQueryResult) {

				DMSUseRecord wDeviceModel = new DMSUseRecord();

				wDeviceModel.ID = StringUtils.parseLong(wReader["ID"]);
				wDeviceModel.ModelID = StringUtils.parseInt(wReader["ModelID"]);
				wDeviceModel.ModelNo = StringUtils.parseString(wReader["ModelNo"]);
				wDeviceModel.ModelName = StringUtils.parseString(wReader["ModelName"]);
				wDeviceModel.LedgerID = StringUtils.parseInt(wReader["LedgerID"]);
				wDeviceModel.DSType = StringUtils.parseInt(wReader["DSType"]);
				wDeviceModel.LedgerNo = StringUtils.parseString(wReader["LedgerNo"]);
				wDeviceModel.BusinessUnitID = StringUtils.parseInt(wReader["BusinessUnitID"]);
				wDeviceModel.BaseID = StringUtils.parseInt(wReader["BaseID"]);
				wDeviceModel.FactoryID = StringUtils.parseInt(wReader["FactoryID"]);
				wDeviceModel.WorkShopID = StringUtils.parseInt(wReader["WorkShopID"]);
				wDeviceModel.LineID = StringUtils.parseInt(wReader["LineID"]);
				wDeviceModel.EquipmentID = StringUtils.parseLong(wReader["EquipmentID"]);
				wDeviceModel.EquipmentNo = StringUtils.parseString(wReader["EquipmentNo"]);
				wDeviceModel.StartTime = StringUtils.parseDate(wReader["StartTime"]);
				wDeviceModel.EndTime = StringUtils.parseDate(wReader["EndTime"]);
				wDeviceModel.ProcessingMin = StringUtils.parseInt(wReader["ProcessingMin"]);
				wDeviceModel.ProcessingPartsNum = StringUtils.parseInt(wReader["ProcessingPartsNum"]);
				wDeviceModel.Used = StringUtils.parseInt(wReader["Used"]);

				wDeviceModel.BusinessUnitName = FMCConstants.GetFMCBusinessUnitName(wDeviceModel.BusinessUnitID);

				wDeviceModel.FactoryName = FMCConstants.GetFMCFactoryName(wDeviceModel.FactoryID);
				wDeviceModel.WorkShopName = FMCConstants.GetFMCWorkShopName(wDeviceModel.WorkShopID);
				wDeviceModel.LineName = FMCConstants.GetFMCLineName(wDeviceModel.LineID);

				wResult.Add(wDeviceModel);
			}
		} catch (Exception e) {
			wErrorCode.set(MESException.DBSQL.Value);
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
		}
		return wResult;
	}

	public List<DMSUseRecord> DMS_SelectUseRecordList(BMSEmployee wLoginUser, int wDSType, int wLedgerID,
			int wEquipmentID, int wUsed, DateTime wStartTime, DateTime wEndTime, OutResult<Int32> wErrorCode) {
		List<DMSUseRecord> wResult = new List<DMSUseRecord>();
		try {
			List<Int32> wLedgerIDList = new List<Int32>();
			if (wLedgerID > 0) {
				wLedgerIDList.Add(wLedgerID);
			}

			List<Int32> wEquipmentIDList = new List<>();
			if (wEquipmentID > 0) {
				wEquipmentIDList.Add(wEquipmentID);
			}
			wResult = DMS_SelectUseRecordList(wLoginUser, null, -1, -1, -1, -1, -1, wDSType, wLedgerIDList,
					wEquipmentIDList, wUsed, wStartTime, wEndTime, wErrorCode);
		} catch (Exception e) {
			wErrorCode.set(MESException.DBSQL.Value);
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
		}
		return wResult;
	}

	public void DMS_InsertUseRecord(BMSEmployee wLoginUser, DMSUseRecord wUsedRecord, OutResult<Int32> wErrorCode) {

		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.DMS);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return;
			if (wUsedRecord == null) {
				wErrorCode.set(MESException.Parameter.Value);
				return;
			}

			DMS_UpdateUseRecord(wLoginUser, wUsedRecord.DSType, wUsedRecord.LedgerID, wErrorCode);

			if (wUsedRecord.Used != 1)
				return;
			String wSQL = StringUtils.Format("INSERT INTO {0}.dms_use_record (  DSType,EquipmentID, LedgerID, "
					+ "StartTime, EndTime, ProcessingMin, ProcessingPartsNum, "
					+ " Used) VALUES (  @wDSType,@wEquipmentID, @wLedgerID, now(), "
					+ "now(), @wProcessingMin, @wProcessingPartsNum, 1);", wInstance.Result);
			wSQL = this.DMLChange(wSQL);
			Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
			wParamMap.Add("wEquipmentID", wUsedRecord.EquipmentID);
			wParamMap.Add("wDSType", wUsedRecord.DSType);
			wParamMap.Add("wLedgerID", wUsedRecord.LedgerID);
			wParamMap.Add("wProcessingMin", wUsedRecord.ProcessingMin);
			wParamMap.Add("wProcessingPartsNum", wUsedRecord.ProcessingPartsNum);

			KeyHolder keyHolder = new GeneratedKeyHolder();
			SqlParameterSource wSqlParameterSource = new MapSqlParameterSource(wParamMap);

			mDBPool.update(wSQL, wSqlParameterSource, keyHolder);
			if (wUsedRecord.ID <= 0) {
				wUsedRecord.ID = keyHolder.getKey().longValue();
			}
		} catch (Exception e) {
			wErrorCode.set(MESException.DBSQL.Value);
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
		}
	}

	/// <summary>
	/// 更新备件使用记录 若能查询到新的加工工件数以及加工时间
	/// </summary>
	/// <param name="wEquipmentID">设备台账ID</param>
	/// <param name="wPDNum">新查询的加工个数</param>
	/// <param name="wPDTime">新查询的加工时长</param>
	/// <returns></returns>
	public String DMS_UpdateUseRecord(BMSEmployee wLoginUser, int wEquipmentID, double wPDNum, int wPDTime,
			OutResult<Int32> wErrorCode) {
		String wResult = "";
		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.DMS);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0)
				return wResult;
			String wSql = "UPDATE {0}.dms_use_record SET EndTime = now(), ProcessingMin = ProcessingMin + {1},"
					+ " ProcessingPartsNum = ProcessingPartsNum + {2} WHERE ID>0 AND ( EquipmentID = {3} OR LedgerID = {3} )and Used =1 ;";
			return StringUtils.Format(wSql, wInstance.Result, wPDTime, wPDNum, wEquipmentID);
		} catch (Exception e) {
			wErrorCode.set(MESException.DBSQL.Value);
			 logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name,e);
		}
		return wResult;
	}

	private void DMS_UpdateUseRecord(BMSEmployee wLoginUser, int wDSType, int wLedgerID, OutResult<Int32> wErrorCode) {

		ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.DMS);
		wErrorCode.set(wInstance.ErrorCode);
		if (wErrorCode.Result != 0)
			return;
		List<String> wSQLList = new List<String>();

		wSQLList.Add(StringUtils.Format(
				"UPDATE {0}.dms_use_record SET Used=0,EndTime=now() WHERE  LedgerID ={1} and DSType= {2} and Used <> 0 ;",
				wInstance.Result, wLedgerID, wDSType));
		ExecuteSqlTransaction(wSQLList);
	}
}
