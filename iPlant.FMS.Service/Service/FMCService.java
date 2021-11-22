package com.mes.server.service;

import java.util.DateTime;
import java.util.List;
import java.util.Dictionary;

import com.mes.server.service.po.OutResult;
import com.mes.server.service.po.ServiceResult;
import com.mes.server.service.po.bms.BMSEmployee;
import com.mes.server.service.po.fmc.FMCBusinessUnit;
import com.mes.server.service.po.fmc.FMCFactory;
import com.mes.server.service.po.fmc.FMCLine;
import com.mes.server.service.po.fmc.FMCLineUnit;
import com.mes.server.service.po.fmc.FMCResource;
import com.mes.server.service.po.fmc.FMCShift;
import com.mes.server.service.po.fmc.FMCStation;
import com.mes.server.service.po.fmc.FMCTimeZone;
import com.mes.server.service.po.fmc.FMCWorkArea;
import com.mes.server.service.po.fmc.FMCWorkDay;
import com.mes.server.service.po.fmc.FMCWorkShop;
import com.mes.server.service.po.fmc.FMCWorkspace;
import com.mes.server.service.po.fmc.FMCWorkspaceRecord;

public interface FMCService {
	// 工厂模型：工厂&事业部&车间&产线&工位
	// 工厂

	ServiceResult<Int32> FMC_AddFactory(int wCompanyID, int wLoginID, FMCFactory wFactory);

	ServiceResult<Int32> FMC_SaveFactory(int wCompanyID, int wLoginID, FMCFactory wFactory);

	ServiceResult<Int32> FMC_DisableFactory(int wCompanyID, int wLoginID, FMCFactory wFactory);

	ServiceResult<Int32> FMC_ActiveFactory(int wCompanyID, int wLoginID, FMCFactory wFactory);

	ServiceResult<Int32> FMC_AuditFactory(int wCompanyID, int wLoginID, FMCFactory wFactory);

	ServiceResult<FMCFactory> FMC_QueryFactoryByID(int wCompanyID, int wLoginID, int wID);

	ServiceResult<FMCFactory> FMC_QueryFactoryByCode(int wCompanyID, int wLoginID, String wCode);

	ServiceResult<List<FMCFactory>> FMC_QueryFactoryList(int wCompanyID, int wLoginID, boolean wLoad);

	// 事业部

	ServiceResult<Int32> FMC_AddBusinessUnit(int wCompanyID, int wLoginID, FMCBusinessUnit wFactory);

	ServiceResult<Int32> FMC_SaveBusinessUnit(int wCompanyID, int wLoginID, FMCBusinessUnit wFactory);

	ServiceResult<Int32> FMC_DisableBusinessUnit(int wCompanyID, int wLoginID, FMCBusinessUnit wFactory);

	ServiceResult<Int32> FMC_ActiveBusinessUnit(int wCompanyID, int wLoginID, FMCBusinessUnit wFactory);

	ServiceResult<Int32> FMC_AuditBusinessUnit(int wCompanyID, int wLoginID, FMCBusinessUnit wFactory);

	ServiceResult<FMCBusinessUnit> FMC_QueryBusinessUnitByID(int wCompanyID, int wLoginID, int wID);

	ServiceResult<FMCBusinessUnit> FMC_QueryBusinessUnitByCode(int wCompanyID, int wLoginID, String wCode);

	ServiceResult<List<FMCBusinessUnit>> FMC_QueryBusinessUnitList(int wCompanyID, int wLoginID, boolean wLoad);

	// 车间

	ServiceResult<Int32> FMC_AddWorkShop(int wCompanyID, int wLoginID, FMCWorkShop wWorkShop);

	ServiceResult<Int32> FMC_SaveWorkShop(int wCompanyID, int wLoginID, FMCWorkShop wWorkShop);

	ServiceResult<Int32> FMC_DisableWorkShop(int wCompanyID, int wLoginID, FMCWorkShop wWorkShop);

	ServiceResult<Int32> FMC_ActiveWorkShop(int wCompanyID, int wLoginID, FMCWorkShop wWorkShop);

	ServiceResult<Int32> FMC_AuditWorkShop(int wCompanyID, int wLoginID, FMCWorkShop wWorkShop);

	ServiceResult<FMCWorkShop> FMC_QueryWorkShopByID(int wCompanyID, int wLoginID, int wID);

	ServiceResult<FMCWorkShop> FMC_QueryWorkShopByCode(int wCompanyID, int wLoginID, String wCode);

	ServiceResult<List<FMCWorkShop>> FMC_QueryWorkShopList(int wCompanyID, int wLoginID, int wFactoryID,
			int wBusinessUnitID, boolean wLoad);

	// 产线

	ServiceResult<Int32> FMC_AddLine(int wCompanyID, int wLoginID, FMCLine wLine);

	ServiceResult<Int32> FMC_SaveLine(int wCompanyID, int wLoginID, FMCLine wLine);

	ServiceResult<Int32> FMC_DisableLine(int wCompanyID, int wLoginID, FMCLine wLine);

	ServiceResult<Int32> FMC_ActiveLine(int wCompanyID, int wLoginID, FMCLine wLine);

	ServiceResult<Int32> FMC_AuditLine(int wCompanyID, int wLoginID, FMCLine wLine);

	ServiceResult<FMCLine> FMC_QueryLineByID(int wCompanyID, int wLoginID, int wID);

	ServiceResult<FMCLine> FMC_QueryLineByCode(int wCompanyID, int wLoginID, String wCode);

	ServiceResult<List<FMCLine>> FMC_QueryLineList(int wCompanyID, int wLoginID, int wBusinessUnitID, int wFactoryID,
			int wWorkShopID, boolean wLoad);

	ServiceResult<Dictionary<Int32, FMCLine>> FMC_QueryLineDic();

	// 产线工艺配置

	ServiceResult<Int32> FMC_AddLineUnit(int wCompanyID, int wLoginID, FMCLineUnit wLineUnit);

	ServiceResult<Int32> FMC_CopyLineUnit(int wCompanyID, int wLoginID, int wOldLineID, int wOldProductID,
			int wOldCustomerID, int wLineID, int wProductID, int wCustomerID);

	ServiceResult<Int32> FMC_SaveLineUnit(int wCompanyID, int wLoginID, FMCLineUnit wLineUnit);

	ServiceResult<Int32> FMC_DeleteLineUnitByID(int wCompanyID, int wLoginID, int wID);

	ServiceResult<Int32> FMC_ActiveLineUnit(int wCompanyID, int wLoginID, FMCLineUnit wLineUnit);

	ServiceResult<Int32> FMC_DisableLineUnit(int wCompanyID, int wLoginID, FMCLineUnit wLineUnit);

	ServiceResult<List<FMCLineUnit>> FMC_QueryLineUnitListByLineID(int wCompanyID, int wLoginID, int wProductID,
			int wCustomerID, int wLineID, int wID, boolean wIsList);

	ServiceResult<List<FMCLineUnit>> FMC_QueryLineUnitListByPartID(int wCompanyID, int wLoginID, int wProductID,
			int wCustomerID, int wLineID, int wPartID);

	ServiceResult<List<FMCStation>> FMC_QueryStationListByPartID(int wCompanyID, int wLoginID, int wProductID,
			int wCustomerID, int wLineID, int wPartID);

	ServiceResult<List<FMCLineUnit>> FMC_QueryLineUnitListByStationID(int wCompanyID, int wLoginID, int wProductID,
			int wCustomerID, int wLineID, int wStationID);

	// 制造资源

	ServiceResult<Int32> FMC_AddResource(BMSEmployee wLoginUser, FMCResource wResource);

	ServiceResult<Int32> FMC_SaveResource(BMSEmployee wLoginUser, FMCResource wResource);

	ServiceResult<Int32> FMC_DisableResource(BMSEmployee wLoginUser, FMCResource wResource);

	ServiceResult<Int32> FMC_ActiveResource(BMSEmployee wLoginUser, FMCResource wResource);

	ServiceResult<FMCResource> FMC_QueryResourceByID(BMSEmployee wLoginUser, int wID);

	ServiceResult<List<FMCResource>> FMC_QueryResourceList(BMSEmployee wLoginUser, int wWorkShopID, int wLineID,
			int wStationID, int wAreaID, int wResourceID, int wType, int wActive);

	// 工区

	ServiceResult<Int32> FMC_AddWorkArea(BMSEmployee wLoginUser, FMCWorkArea wWorkArea);

	ServiceResult<Int32> FMC_SaveWorkArea(BMSEmployee wLoginUser, FMCWorkArea wWorkArea);

	ServiceResult<Int32> FMC_DisableWorkArea(BMSEmployee wLoginUser, FMCWorkArea wWorkArea);

	ServiceResult<Int32> FMC_ActiveWorkArea(BMSEmployee wLoginUser, FMCWorkArea wWorkArea);

	ServiceResult<FMCWorkArea> FMC_QueryWorkArea(BMSEmployee wLoginUser, int wID, String wCode);

	ServiceResult<List<FMCWorkArea>> FMC_QueryWorkAreaList(BMSEmployee wLoginUser, int wWorkShopID, int wLineID,
			int wParentID, int wActive);

	// 工位

	ServiceResult<Int32> FMC_AddStation(BMSEmployee wLoginUser, FMCStation wStation);

	ServiceResult<Int32> FMC_SaveStation(BMSEmployee wLoginUser, FMCStation wStation);

	ServiceResult<Int32> FMC_DisableStation(BMSEmployee wLoginUser, FMCStation wStation);

	ServiceResult<Int32> FMC_ActiveStation(BMSEmployee wLoginUser, FMCStation wStation);

	ServiceResult<FMCStation> FMC_QueryStation(BMSEmployee wLoginUser, int wID, String wCode);

	ServiceResult<List<FMCStation>> FMC_QueryStationList(BMSEmployee wLoginUser, int wWorkShopID, int wLineID,
			int wWorkAreaID, int wActive);

	// 班次模板管理

	ServiceResult<Int32> FMC_AddWorkDay(int wCompanyID, int wLoginID, FMCWorkDay wShift);

	ServiceResult<Int32> FMC_SaveWorkDay(int wCompanyID, int wLoginID, FMCWorkDay wShift);

	ServiceResult<Int32> FMC_DisableWorkDay(int wCompanyID, int wLoginID, FMCWorkDay wShift);

	ServiceResult<Int32> FMC_ActiveWorkDay(int wCompanyID, int wLoginID, FMCWorkDay wShift);

	ServiceResult<Int32> FMC_AuditWorkDay(int wCompanyID, int wLoginID, FMCWorkDay wShift);

	ServiceResult<FMCWorkDay> FMC_QueryWorkDayByID(int wCompanyID, int wLoginID, int wID);

	ServiceResult<FMCWorkDay> FMC_QueryActiveWorkDay(int wCompanyID, int wLoginID, int wFactoryID, int wWorkShopID);

	ServiceResult<List<FMCWorkDay>> FMC_QueryWorkDayList(int wCompanyID, int wLoginID, int wFactoryID, int wWorkShopID,
			int wActive);

	ServiceResult<List<FMCTimeZone>> FMC_QueryShiftTimeZoneList(int wCompanyID, int wLoginID, int wShiftID);

	ServiceResult<Int32> FMC_SaveShiftTimeZoneList(int wCompanyID, int wLoginID, List<FMCTimeZone> wTimeZoneList,
			int wShiftID);

	ServiceResult<List<FMCShift>> FMC_QueryShiftList(int wCompanyID, int wLoginID, int wWorkDayID, int wActive);

	ServiceResult<Int32> FMC_SaveShiftList(int wCompanyID, int wLoginID, List<FMCShift> wShiftList);

	ServiceResult<Int32> FMC_SaveShift(int wCompanyID, int wLoginID, FMCShift wShift);

	ServiceResult<FMCShift> FMC_QueryShiftByID(int wCompanyID, int wLoginID, int wWorkDayID);

	ServiceResult<Int32> FMC_DeleteShiftByID(int wCompanyID, int wLoginID, int wID);
	// 工作日历设置

	ServiceResult<List<FMCWorkspace>> FMC_GetFMCWorkspaceList(int wCompanyID, int wLoginID, int wProductID, int wPartID,
			String wPartNo, int wPlaceType, int wActive);

	ServiceResult<FMCWorkspace> FMC_GetFMCWorkspace(int wCompanyID, int wLoginID, int wID, String wCode);

	ServiceResult<Int32> FMC_SaveFMCWorkspace(int wCompanyID, int wLoginID, FMCWorkspace wFMCWorkspace);

	ServiceResult<Int32> FMC_BindFMCWorkspace(int wCompanyID, int wLoginID, FMCWorkspace wFMCWorkspace);

	ServiceResult<Int32> FMC_ActiveFMCWorkspace(int wCompanyID, int wLoginID, int wActive,
			FMCWorkspace wFMCWorkspace);

	ServiceResult<List<FMCWorkspaceRecord>> FMC_GetFMCWorkspaceRecordList(int wCompanyID, int wLoginID, int wProductID,
			int wPartID, String wPartNo, int wPlaceID, int wPlaceType, int wLimit, DateTime wStartTime,
			DateTime wEndTime);

	public ServiceResult<Int32> FMC_QueryShiftID(int wCompanyID, int wLoginID, int wWorkShopID, DateTime wShiftTime,
			int wShifts, OutResult<Int32> wShiftIndex);

}
