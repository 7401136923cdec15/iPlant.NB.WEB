package com.mes.server.service;

import java.util.List;
import java.util.Dictionary;

import com.mes.server.service.po.ServiceResult;
import com.mes.server.service.po.bms.BMSChargeGroup;
import com.mes.server.service.po.bms.BMSDepartment;
import com.mes.server.service.po.bms.BMSEmployee;
import com.mes.server.service.po.bms.BMSMenuControl;
import com.mes.server.service.po.bms.BMSPosition;
import com.mes.server.service.po.bms.BMSRole;
import com.mes.server.service.po.bms.BMSRoleItem;
import com.mes.server.service.po.bms.BMSTeamCharge;
import com.mes.server.service.po.bms.BMSTeamItem;
import com.mes.server.service.po.bms.BMSTeamManage;

public interface BMSService {

	// Function01:User Manager Interface
	ServiceResult<BMSEmployee> BMS_LoginEmployee(String wLoginName, String wPassword, long wMAC);

	ServiceResult<BMSEmployee> BMS_LoginEmployeeByUserName(String wUserName, String wPassword);

	ServiceResult<BMSEmployee> BMS_LoginEmployeeByToken(String wLoginName, String wToken);

	ServiceResult<BMSEmployee> BMS_LoginEmployeeByOne(String wLoginID);

	ServiceResult<List<BMSEmployee>> BMS_QueryEmployeeList(BMSEmployee wLoginUser, int wDepartmentID, int wPosition,
			int wDepartmentType, int wPositionType, int wActive);

	ServiceResult<List<BMSEmployee>> BMS_QueryEmployeeList(BMSEmployee wLoginUser, List<Int32> wIDList);

	ServiceResult<Dictionary<Int32, BMSEmployee>> BMS_QueryEmployeeDic();

	ServiceResult<BMSEmployee> BMS_QueryEmployeeByID(BMSEmployee wLoginUser, int wID);

	ServiceResult<Int32> BMS_AddEmployee(BMSEmployee wLoginUser, BMSEmployee wEmployee);

	ServiceResult<Int32> BMS_AutoSetEmployeeSuperior(BMSEmployee wLoginUser, List<BMSEmployee> wEmployee,
			List<Int32> DutyOrders);

	ServiceResult<Int32> BMS_GetEmployeeSuperior(BMSEmployee wLoginUser, BMSEmployee wEmployee,
			List<Int32> wDutyOrders, List<BMSPosition> wBMSPositionAllList,
			Dictionary<Int32, BMSPosition> wBMSPositionDic);

	ServiceResult<Int32> BMS_SaveEmployee(BMSEmployee wLoginUser, BMSEmployee wEmployee);

	ServiceResult<Int32> BMS_SavePassword(BMSEmployee wLoginUser, BMSEmployee wEmployee);

	ServiceResult<Int32> BMS_DeleteEmployee(BMSEmployee wLoginUser, BMSEmployee wEmployee);

	ServiceResult<Int32> BMS_DisableEmployee(BMSEmployee wLoginUser, BMSEmployee wEmployee);

	ServiceResult<Int32> BMS_ActiveEmployee(BMSEmployee wLoginUser, BMSEmployee wEmployee);

	ServiceResult<Int32> BMS_ResetPassword(BMSEmployee wLoginUser, BMSEmployee wEmployee);

	// Function03:Power Manager Interface
	ServiceResult<List<BMSMenuControl>> BMS_QueryMenuControlList(BMSEmployee wLoginUser);

	ServiceResult<BMSRole> BMS_AddRole(BMSEmployee wLoginUser, BMSRole wRole);

	ServiceResult<List<BMSRole>> BMS_GetRoleList(BMSEmployee wLoginUser, int wActive);

	ServiceResult<Int32> BMS_RemoveRole(BMSEmployee wLoginUser, int wID);

	ServiceResult<Int32> BMS_SaveRole(BMSEmployee wLoginUser, BMSRole wRole);

	ServiceResult<Int32> BMS_SaveRoleRangeList(BMSEmployee wLoginUser, int wRoleID, List<BMSRoleItem> wFunctionList);

	ServiceResult<Int32> BMS_SaveRoleFunctionList(BMSEmployee wLoginUser, int wRoleID,
			List<BMSRoleItem> wFunctionList);

	ServiceResult<Int32> BMS_SaveRoleUserList(BMSEmployee wLoginUser, int wRoleID, List<BMSRoleItem> wUserList);

	ServiceResult<List<BMSRoleItem>> BMS_QueryRangeListByRoleID(BMSEmployee wLoginUser, int wRoleID);

	ServiceResult<List<BMSRoleItem>> BMS_QueryRangeListByOperatorID(BMSEmployee wLoginUser, int wOperatorID,
			int wFunctionID);

	ServiceResult<List<BMSRoleItem>> BMS_QueryFunctionListByRoleID(BMSEmployee wLoginUser, int wRoleID);

	ServiceResult<List<BMSRoleItem>> BMS_QueryUserListByRoleID(BMSEmployee wLoginUser, int wRoleID);

	ServiceResult<Int32> BMS_DisableRole(BMSEmployee wLoginUser, int wID);

	ServiceResult<Int32> BMS_ActiveRole(BMSEmployee wLoginUser, int wID);

	ServiceResult<Boolean> BMS_CheckPowerByLoginID(int wCompanyID, int wLoginID, int wAuthorityID, int wRangeID,
			int wRangeType);

	ServiceResult<Int32> BMS_ActiveFunctionNodeTree(BMSEmployee wLoginUser, List<Int32> wFunctionIDList,
			int wActive);

	ServiceResult<Int32> BMS_DeleteFunctionNodeTree(BMSEmployee wLoginUser, List<Int32> wFunctionIDList);

	ServiceResult<BMSRoleItem> BMS_UpdateFunctionNodeTree(BMSEmployee wLoginUser, BMSRoleItem wBMSRoleItem);

	ServiceResult<List<BMSRoleItem>> BMS_GetFunctionNodeTree(BMSEmployee wLoginUser, int wActive);

	ServiceResult<List<BMSRoleItem>> BMS_GetFunctionListByLoginID(BMSEmployee wLoginUser, int wUserID);

	ServiceResult<List<BMSRoleItem>> BMS_QueryUserListByFunctionID(BMSEmployee wLoginUser, int wFunctionID);

	// Function Department&Position
	// Function02:Department Manager Interface
	ServiceResult<Int32> BMS_AddPosition(BMSEmployee wLoginUser, BMSPosition wPosition);

	ServiceResult<Int32> BMS_SavePosition(BMSEmployee wLoginUser, BMSPosition wPosition);

	ServiceResult<Int32> BMS_ActivePositionByID(BMSEmployee wLoginUser, int wID);

	ServiceResult<Int32> BMS_DisablePositionByID(BMSEmployee wLoginUser, int wID);

	ServiceResult<Int32> BMS_DeletePositionByID(BMSEmployee wLoginUser, int wID);

	ServiceResult<List<BMSPosition>> BMS_QueryPositionList(BMSEmployee wLoginUser, int wActive);

	ServiceResult<BMSPosition> BMS_QueryPositionByID(BMSEmployee wLoginUser, int wID, String wCode);

	ServiceResult<Int32> BMS_AddDepartment(BMSEmployee wLoginUser, BMSDepartment wDepartment);

	ServiceResult<Int32> BMS_SaveDepartment(BMSEmployee wLoginUser, BMSDepartment wDepartment);

	ServiceResult<Int32> BMS_ActiveDepartmentByID(BMSEmployee wLoginUser, int wID);

	ServiceResult<Int32> BMS_DeleteDepartmentByID(BMSEmployee wLoginUser, int wID);

	ServiceResult<Int32> BMS_DisableDepartmentByID(BMSEmployee wLoginUser, int wID);

	ServiceResult<List<BMSDepartment>> BMS_QueryDepartmentList(BMSEmployee wLoginUser, int wActive);

	ServiceResult<BMSDepartment> BMS_QueryDepartmentByID(BMSEmployee wLoginUser, int wID, String wCode);

	// region 班组管理
	ServiceResult<List<BMSTeamManage>> BMS_GetTeamManageList(BMSEmployee wLoginUser, int wWorkShopID, int wDepartmentID,
			int wModuleID, int wLeaderID, int wActive, int wHasItem);

	ServiceResult<List<BMSTeamManage>> BMS_GetTeamManageList(BMSEmployee wLoginUser, int wLeaderID);

	ServiceResult<List<BMSTeamManage>> BMS_GetTeamManageList(BMSEmployee wLoginUser, List<Int32> wIDList);

	ServiceResult<BMSTeamManage> BMS_GetTeamManage(BMSEmployee wLoginUser, int wID);

	ServiceResult<Int32> BMS_UpdateTeamManage(BMSEmployee wLoginUser, BMSTeamManage wBMSTeamManage);

	ServiceResult<Int32> BMS_ActiveTeamManage(BMSEmployee wLoginUser, int wActive, BMSTeamManage wBMSTeamManage);

	ServiceResult<Int32> BMS_DeleteTeamManage(BMSEmployee wLoginUser, BMSTeamManage wBMSTeamManage);

	ServiceResult<List<BMSTeamCharge>> BMS_GetTeamChargeList(BMSEmployee wLoginUser, int wTeamID, int wGroupID,
			int wWorkShopID, int wDepartmentID, int wModuleID, int wLineID, int wPartID, int wPartPointID,
			int wStationID, int wMateUserID,int wShiftIndex, int wActive);

	ServiceResult<List<BMSChargeGroup>> BMS_GetChargeGroupList(BMSEmployee wLoginUser, int wTeamID, int wActive);

	ServiceResult<Int32> BMS_UpdateChargeGroup(BMSEmployee wLoginUser, BMSChargeGroup wChargeGroup);

	ServiceResult<Int32> BMS_UpdateTeamCharge(BMSEmployee wLoginUser, BMSTeamCharge wBMSTeamCharge);

	ServiceResult<List<BMSTeamItem>> BMS_GetTeamItemList(BMSEmployee wLoginUser, int wTeamID, int wWorkShopID,
			int wDepartmentID, int wModuleID, int wLineID, int wPartID, int wPartPointID, int wStationID, int wActive);

	ServiceResult<Int32> BMS_UpdateTeamItem(BMSEmployee wLoginUser, BMSTeamItem wBMSTeamItem);

	ServiceResult<Int32> BMS_ActiveTeamItem(BMSEmployee wLoginUser, int wActive, BMSTeamItem wBMSTeamItem);

	ServiceResult<Int32> BMS_DeleteTeamItem(BMSEmployee wLoginUser, BMSTeamItem wBMSTeamItem);

	// endRegion

	ServiceResult<String> ADC_GetLoginIDByCardID(String wCardID);

}
