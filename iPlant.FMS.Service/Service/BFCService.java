package com.mes.server.service;

import java.util.DateTime;
import java.util.List;
import java.util.Dictionary;

import com.mes.server.service.mesenum.BFCQRTypes;
import com.mes.server.service.po.OutResult;
import com.mes.server.service.po.ServiceResult;
import com.mes.server.service.po.bfc.BFCAuditAction;
import com.mes.server.service.po.bfc.BFCAuditConfig;
import com.mes.server.service.po.bfc.BFCAuditVersion;
import com.mes.server.service.po.bfc.BFCHomePageGroup;
import com.mes.server.service.po.bfc.BFCHomePageModule;
import com.mes.server.service.po.bfc.BFCMessage;
import com.mes.server.service.po.bfc.BFCPlaceQRStruct;
import com.mes.server.service.po.bfc.FPCCustomStruct;
import com.mes.server.service.po.bms.BMSEmployee;
import com.mes.server.service.po.cgs.CGSTable;

public interface BFCService {

	ServiceResult<List<BFCHomePageGroup>> BFC_GetHomePageGroupList(int wType, int wGrad);

	ServiceResult<BFCHomePageGroup> BFC_GetHomePageGroupByID();

	ServiceResult<Int32> BFC_UpdateHomePageGroup(BFCHomePageGroup wBFCHomePageGroup);

	ServiceResult<List<BFCHomePageModule>> BFC_GetHomePageModuleList(int wType, int wGrad);

	ServiceResult<BFCHomePageModule> BFC_GetHomePageModuleByID(int wID);

	ServiceResult<Int32> BFC_UpdateHomePageModule(BFCHomePageModule wBFCHomePageModule);

	ServiceResult<String> BFC_GetQRCode(BMSEmployee wLoginUser, BFCQRTypes wQRTypes, long wID);

	ServiceResult<Int32> BFC_GetIDByQRCode(BMSEmployee wLoginUser, String wCode);

	ServiceResult<List<BFCPlaceQRStruct>> BFC_GetPlaceQRTypeList();

	ServiceResult<Int32> BFC_GetPlaceQRTypeByCode(String Code);

	ServiceResult<List<FPCCustomStruct>> BFC_GetCustomStructList();

	ServiceResult<List<BFCMessage>> BFC_GetMessageList(BMSEmployee wLoginUser, int wResponsorID, int wType,
			int wModuleID, List<Int32> wMessageIDList, int wActive, int wSendStatus, int wShiftID,
			DateTime wStartTime, DateTime wEndTime, int wStepID);

	ServiceResult<List<BFCMessage>> BFC_GetUndoMessageList(BMSEmployee wLoginUser, int wResponsorID, int wModuleID,
			int wMessageID, int wShiftID, DateTime wStartTime, DateTime wEndTime);

	ServiceResult<Int32> BFC_UpdateMessageList(BMSEmployee wLoginUser, List<BFCMessage> wBFCMessageList);

	ServiceResult<Int32> BFC_HandleMessageByIDList(BMSEmployee wLoginUser, List<Long> wMsgIDList, int wStatus,
			int wSendStatus);

	ServiceResult<Int32> BFC_ReceiveMessage(BMSEmployee wLoginUser, int wResponsorID, List<Long> wMsgIDList,
			List<Int32> wStepID, int wModuleID);

	ServiceResult<Int32> BFC_HandleMessage(BMSEmployee wLoginUser, int wResponsorID, List<Long> wMsgIDList,
			List<Int32> wStepID, int wModuleID, int wType, int wStatus);

	ServiceResult<Int32> BFC_ForwardMessage(BMSEmployee wLoginUser, int wResponsorID, List<Int32> wForwarderList,
			int wModuleID, long wMessageID, int wStepID);

	ServiceResult<Int32> BFC_HandleTaskMessage(BMSEmployee wLoginUser, int wResponsorID, List<Int32> wTaskIDList,
			int wModuleID, int wStepID, int wStatus, int wAuto);

	/**
	 * 直接发，不保存
	 * 
	 * @param wBFCMessageList
	 * @return
	 */
	ServiceResult<Int32> BFC_SendMessageList(BMSEmployee wLoginUser, List<BFCMessage> wBFCMessageList);

	/**
	 * 获取模块代办消息数
	 * 
	 * @param wCompanyID
	 * @param wResponsorID
	 * @param wShiftID
	 * @return
	 */
	ServiceResult<Dictionary<Int32, Int32>> BFC_GetUndoMessagCount(BMSEmployee wLoginUser, int wResponsorID, int wShiftID);

	ServiceResult<List<BFCAuditConfig>> BFC_GetAuditConfigList(BMSEmployee wLoginUser, String wName, int wEventModule,
			String wVersionNo, int wActive, int wFunctionID);

	ServiceResult<List<BFCAuditVersion>> BFC_GetVersionList(BMSEmployee wLoginUser, int wEventModule);

	ServiceResult<Int32> BFC_OtherSaveAuditConfigList(BMSEmployee wLoginUser, int wEventModule, String wVersionNo,
			List<BFCAuditConfig> wBFCAuditConfigList);

	ServiceResult<Int32> BFC_UpdateAuditConfig(BMSEmployee wLoginUser, BFCAuditConfig wBFCAuditConfig);

	ServiceResult<Int32> BFC_ActiveAuditConfig(BMSEmployee wLoginUser, int wEventModule, String wVersionNo,
			int wActive);

	ServiceResult<Int32> BFC_DelectAuditConfig(BMSEmployee wLoginUser, BFCAuditConfig wBFCAuditConfig,
			String wVersion);

	ServiceResult<List<BFCAuditAction>> BFC_GetAuditActionList(BMSEmployee wLoginUser, int wTaskID, int wEventModule);

	ServiceResult<BFCAuditConfig> BFC_GetCurrentConfig(BMSEmployee wLoginUser, int wUserID, int wTaskID,
			int wEventModule);

	ServiceResult<List<BFCAuditConfig>> BFC_GetTaskConfigList(BMSEmployee wLoginUser, int wTaskID, int wEventModule);

	ServiceResult<Int32> BFC_UpdateAuditAction(BMSEmployee wLoginUser, BFCAuditAction wBFCAuditAction, String wTitle);

	/**
	 * 获取模块代办通知消息集合
	 * 
	 * @param wCompanyID
	 * @param wResponsorID
	 * @param wShiftID
	 * @return
	 */
	ServiceResult<List<BFCMessage>> BFC_GetNoticeList(BMSEmployee wLoginUser, int wResponsorID, int wStatus,
			int wUseTime, DateTime wStartTime, DateTime wEndTime, OutResult<Int32> wCount);

	/**
	 * 已办消息数
	 * 
	 * @param wCompanyID
	 * @param wResponsorID
	 * @param wStartTime
	 * @param wEndTime
	 * @return
	 */
	ServiceResult<List<BFCMessage>> BFC_GetHasDoNoticeCount(BMSEmployee wLoginUser, int wResponsorID,
			DateTime wStartTime, DateTime wEndTime);

	// 查询表格配置集合
	ServiceResult<List<CGSTable>> CGS_SelectCGTableByName(BMSEmployee wLoginUser, int wUserID, String TableName,
			String ModleName);

	// 保存表格配置
	ServiceResult<Int32> CGS_SaveCGTable(BMSEmployee wLoginUser, List<CGSTable> wCGTable);

	// 删除表格配置
	ServiceResult<Int32> CGS_DeleteCGTable(BMSEmployee wLoginUser, List<CGSTable> wCGTable);

	ServiceResult<List<Dictionary<String, Object>>> CGS_GetDataTableList(BMSEmployee wLoginUser, int wSqlType);

	ServiceResult<List<Dictionary<String, Object>>> CGS_GetDataTableInfo(BMSEmployee wLoginUser, int wSqlType, String wDBName,
			String wTableName);

}
