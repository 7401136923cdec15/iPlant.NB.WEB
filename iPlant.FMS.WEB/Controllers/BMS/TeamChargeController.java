package com.mes.server.controller.bms;

import java.util.Calendar;
import java.util.Dictionary;
import java.util.List;
import java.util.Dictionary;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mes.server.controller.BaseController;
import com.mes.server.service.BMSService;
import com.mes.server.service.po.ServiceResult;
import com.mes.server.service.po.bms.BMSChargeGroup;
import com.mes.server.service.po.bms.BMSEmployee;
import com.mes.server.service.po.bms.BMSTeamCharge;
import com.mes.server.service.po.bms.BMSTeamItem;
import com.mes.server.service.utils.CloneTool;
import com.mes.server.service.utils.StringUtils;
import com.mes.server.utils.RetCode;

@RestController
@RequestMapping("/api/TeamCharge")
public class TeamChargeController extends BaseController {

	private static Logger logger = LoggerFactory.getLogger(typeof(TeamChargeController));
	@Autowired
	BMSService wBMSService;

	public TeamChargeController() {
		// TODO Auto-generated constructor stub
	}

	[HttpGet]
	public ActionResult GroupAll() {
		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
		try {
			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}
			BMSEmployee wBMSEmployee = GetSession();
			int wTeamID = StringUtils.parseInt(Request.QueryParamString("TeamID"));
			int wActive = StringUtils.parseInt(Request.QueryParamString("Active"));

			ServiceResult<List<BMSChargeGroup>> wServerRst = wBMSService.BMS_GetChargeGroupList(wBMSEmployee, wTeamID,
					wActive);

			if (StringUtils.isEmpty(wServerRst.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServerRst.getResult(), null);
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServerRst.getFaultCode(), wServerRst.getResult(), null);
			}
		} catch (Exception ex) {
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
			wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
		}
		return wResult;
	}

	[HttpPost]
	public ActionResult GroupUpdate() {
		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
		try {

			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}

			BMSEmployee wBMSEmployee = GetSession();
			int wUserID = wBMSEmployee.ID;
			String wUserName = wBMSEmployee.getName();

			if (!wParam.ContainsKey("data")) {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
				return wResult;
			}

			BMSChargeGroup wBMSChargeGroup = CloneTool.Clone(wParam["data"], typeof(BMSChargeGroup));

			if (wBMSChargeGroup.ID <= 0) {
				wBMSChargeGroup.CreatorID = wUserID;
				wBMSChargeGroup.CreatorName = wUserName;
				wBMSChargeGroup.CreateTime = DateTime.Now;
			}
			wBMSChargeGroup.EditorID = wUserID;
			wBMSChargeGroup.EditorName = wUserName;
			wBMSChargeGroup.EditTime = DateTime.Now;

			ServiceResult<Int32> wServerRst = wBMSService.BMS_UpdateChargeGroup(wBMSEmployee, wBMSChargeGroup);

			if (StringUtils.isEmpty(wServerRst.getFaultCode())) {
				wBMSChargeGroup.ID = wServerRst.getResult();
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wBMSChargeGroup);
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServerRst.getFaultCode(), null, wBMSChargeGroup);
			}
		} catch (Exception ex) {
			ex.printStackTrace();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
			wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
		}
		return wResult;
	}

	[HttpGet]
	public ActionResult All() {
		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
		try {
			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}
			BMSEmployee wBMSEmployee = GetSession();
			int wStationID = StringUtils.parseInt(Request.QueryParamString("StationID"));
			int wTeamID = StringUtils.parseInt(Request.QueryParamString("TeamID"));
			int wGroupID = StringUtils.parseInt(Request.QueryParamString("GroupID"));

			int wShiftIndex = StringUtils.parseInt(Request.QueryParamString("ShiftIndex"));
			int wWorkShopID = StringUtils.parseInt(Request.QueryParamString("WorkShopID"));
			int wDepartmentID = StringUtils.parseInt(Request.QueryParamString("DepartmentID"));
			int wModuleID = StringUtils.parseInt(Request.QueryParamString("ModuleID"));
			int wLineID = StringUtils.parseInt(Request.QueryParamString("LineID"));
			int wPartID = StringUtils.parseInt(Request.QueryParamString("PartID"));
			int wPartPointID = StringUtils.parseInt(Request.QueryParamString("PartPointID"));
			int wActive = StringUtils.parseInt(Request.QueryParamString("Active"));
			int wMateUserID = StringUtils.parseInt(Request.QueryParamString("MateUserID"));

			ServiceResult<List<BMSTeamCharge>> wServerRst = wBMSService.BMS_GetTeamChargeList(wBMSEmployee, wTeamID,
					wGroupID, wWorkShopID, wDepartmentID, wModuleID, wLineID, wPartID, wPartPointID, wStationID,
					wMateUserID, wShiftIndex, wActive);

			if (StringUtils.isEmpty(wServerRst.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServerRst.getResult(), null);
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServerRst.getFaultCode(), wServerRst.getResult(), null);
			}
		} catch (Exception ex) {
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
			wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
		}
		return wResult;
	}

	[HttpPost]
	public ActionResult Update() {
		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
		try {

			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}

			BMSEmployee wBMSEmployee = GetSession();
			int wUserID = wBMSEmployee.ID;
			String wUserName = wBMSEmployee.getName();

			if (!wParam.ContainsKey("data")) {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
				return wResult;
			}

			BMSTeamCharge wBMSTeamCharge = CloneTool.Clone(wParam["data"], typeof(BMSTeamCharge));

			if (wBMSTeamCharge.ID <= 0) {
				wBMSTeamCharge.CreatorID = wUserID;
				wBMSTeamCharge.Creator = wUserName;
				wBMSTeamCharge.CreateTime = DateTime.Now;
			}
			wBMSTeamCharge.EditorID = wUserID;
			wBMSTeamCharge.Editor = wUserName;
			wBMSTeamCharge.EditTime = DateTime.Now;

			ServiceResult<Int32> wServerRst = wBMSService.BMS_UpdateTeamCharge(wBMSEmployee, wBMSTeamCharge);

			if (StringUtils.isEmpty(wServerRst.getFaultCode())) {
				wBMSTeamCharge.ID = wServerRst.getResult();
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wBMSTeamCharge);
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServerRst.getFaultCode(), null, wBMSTeamCharge);
			}
		} catch (Exception ex) {
			ex.printStackTrace();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
			wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
		}
		return wResult;
	}

	[HttpGet]
	public ActionResult ItemAll() {
		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
		try {
			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}
			BMSEmployee wBMSEmployee = GetSession();
			int wStationID = StringUtils.parseInt(Request.QueryParamString("StationID"));
			int wTeamID = StringUtils.parseInt(Request.QueryParamString("TeamID"));

			int wWorkShopID = StringUtils.parseInt(Request.QueryParamString("WorkShopID"));
			int wDepartmentID = StringUtils.parseInt(Request.QueryParamString("DepartmentID"));
			int wModuleID = StringUtils.parseInt(Request.QueryParamString("ModuleID"));
			int wLineID = StringUtils.parseInt(Request.QueryParamString("LineID"));
			int wPartID = StringUtils.parseInt(Request.QueryParamString("PartID"));
			int wPartPointID = StringUtils.parseInt(Request.QueryParamString("PartPointID"));
			int wActive = StringUtils.parseInt(Request.QueryParamString("Active"));

			ServiceResult<List<BMSTeamItem>> wServerRst = wBMSService.BMS_GetTeamItemList(wBMSEmployee, wTeamID,
					wWorkShopID, wDepartmentID, wModuleID, wLineID, wPartID, wPartPointID, wStationID, wActive);

			if (StringUtils.isEmpty(wServerRst.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServerRst.getResult(), null);
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServerRst.getFaultCode(), wServerRst.getResult(), null);
			}
		} catch (Exception ex) {
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
			wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
		}
		return wResult;
	}

	[HttpPost]
	public ActionResult ItemUpdate() {
		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
		try {

			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}

			BMSEmployee wBMSEmployee = GetSession();
			int wUserID = wBMSEmployee.ID;
			String wUserName = wBMSEmployee.getName();

			if (!wParam.ContainsKey("data")) {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
				return wResult;
			}

			BMSTeamItem wBMSTeamCharge = CloneTool.Clone(wParam["data"], typeof(BMSTeamItem));

			if (wBMSTeamCharge.ID <= 0) {
				wBMSTeamCharge.CreatorID = wUserID;
				wBMSTeamCharge.Creator = wUserName;
				wBMSTeamCharge.CreateTime = DateTime.Now;
			}
			wBMSTeamCharge.EditorID = wUserID;
			wBMSTeamCharge.Editor = wUserName;
			wBMSTeamCharge.EditTime = DateTime.Now;

			ServiceResult<Int32> wServerRst = wBMSService.BMS_UpdateTeamItem(wBMSEmployee, wBMSTeamCharge);

			if (StringUtils.isEmpty(wServerRst.getFaultCode())) {
				wBMSTeamCharge.ID = wServerRst.getResult();
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wBMSTeamCharge);
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServerRst.getFaultCode(), null, wBMSTeamCharge);
			}
		} catch (Exception ex) {
			ex.printStackTrace();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
			wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
		}
		return wResult;
	}

	[HttpPost]
	public ActionResult ItemDelete() {
		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
		try {

			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}

			BMSEmployee wBMSEmployee = GetSession();

			if (!wParam.ContainsKey("data")) {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
				return wResult;
			}

			BMSTeamItem wBMSTeamItem = CloneTool.Clone(wParam["data"], typeof(BMSTeamItem));

			ServiceResult<Int32> wServerRst = wBMSService.BMS_DeleteTeamItem(wBMSEmployee, wBMSTeamItem);

			if (StringUtils.isEmpty(wServerRst.getFaultCode())) {
				wBMSTeamItem.ID = wServerRst.getResult();
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wBMSTeamItem);
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServerRst.getFaultCode(), null, wBMSTeamItem);
			}
		} catch (Exception ex) {
			ex.printStackTrace();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
			wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
		}
		return wResult;
	}

	[HttpPost]
	public ActionResult ItemActive() {
		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
		try {

			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}

			BMSEmployee wBMSEmployee = GetSession();

			if (!wParam.ContainsKey("data") || !wParam.ContainsKey("Active")) {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
				return wResult;
			}
			int wActive = StringUtils.parseInt(wParam["Active"]);
			List<BMSTeamItem> wBMSTeamChargeList = CloneTool.CloneArray(wParam["data"], typeof(BMSTeamItem));

			ServiceResult<Int32> wServerRst = new ServiceResult<Int32>(0);
			for (BMSTeamItem wBMSTeamItem : wBMSTeamChargeList) {
				wServerRst = wBMSService.BMS_ActiveTeamItem(wBMSEmployee, wActive, wBMSTeamItem);
				if (StringUtils.isNotEmpty(wServerRst.getFaultCode()))
					break;
			}

			if (StringUtils.isEmpty(wServerRst.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "");
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServerRst.getFaultCode());
			}
		} catch (Exception ex) {
			ex.printStackTrace();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
			wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
		}
		return wResult;
	}

}
