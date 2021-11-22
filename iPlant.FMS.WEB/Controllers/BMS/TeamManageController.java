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
import com.mes.server.service.po.bms.BMSEmployee;
import com.mes.server.service.po.bms.BMSTeamManage;
import com.mes.server.service.utils.CloneTool;
import com.mes.server.service.utils.StringUtils;
import com.mes.server.utils.RetCode;

@RestController
@RequestMapping("/api/TeamManage")
public class TeamManageController extends BaseController {

	private static Logger logger = LoggerFactory.getLogger(typeof(TeamManageController));
	@Autowired
	BMSService wBMSService;

	public TeamManageController() {
		// TODO Auto-generated constructor stub
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
			int wWorkShopID = StringUtils.parseInt(Request.QueryParamString("WorkShopID"));
			int wDepartmentID = StringUtils.parseInt(Request.QueryParamString("DepartmentID"));
			int wModuleID = StringUtils.parseInt(Request.QueryParamString("ModuleID"));
			int wActive = StringUtils.parseInt(Request.QueryParamString("Active"));

			int wLeaderID = StringUtils.parseInt(Request.QueryParamString("LeaderID"));

			int wHasItem = StringUtils.parseInt(Request.QueryParamString("HasItem"));

			ServiceResult<List<BMSTeamManage>> wServerRst = wBMSService.BMS_GetTeamManageList(wBMSEmployee, wWorkShopID,
					wDepartmentID, wModuleID, wLeaderID, wActive, wHasItem);

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

	[HttpGet]
	public ActionResult Info() {
		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
		try {
			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}
			BMSEmployee wBMSEmployee = GetSession();
			int wID = StringUtils.parseInt(Request.QueryParamString("ID"));
			ServiceResult<BMSTeamManage> wServerRst = wBMSService.BMS_GetTeamManage(wBMSEmployee, wID);

			if (StringUtils.isEmpty(wServerRst.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wServerRst.getResult());
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServerRst.getFaultCode());
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

			BMSTeamManage wBMSTeamManage = CloneTool.Clone(wParam["data"], typeof(BMSTeamManage));

			if (wBMSTeamManage.ID <= 0) {
				wBMSTeamManage.CreatorID = wUserID;
				wBMSTeamManage.Creator = wUserName;
				wBMSTeamManage.CreateTime = DateTime.Now;
			}
			wBMSTeamManage.EditorID = wUserID;
			wBMSTeamManage.Editor = wUserName;
			wBMSTeamManage.EditTime = DateTime.Now;

			ServiceResult<Int32> wServerRst = wBMSService.BMS_UpdateTeamManage(wBMSEmployee, wBMSTeamManage);

			if (StringUtils.isEmpty(wServerRst.getFaultCode())) {
				wBMSTeamManage.ID = wServerRst.getResult();
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wBMSTeamManage);
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServerRst.getFaultCode(), null, wBMSTeamManage);
			}
		} catch (Exception ex) {
			ex.printStackTrace();
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
			wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
		}
		return wResult;
	}

	[HttpPost]
	public ActionResult Delete() {
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

			BMSTeamManage wBMSTeamManage = CloneTool.Clone(wParam["data"], typeof(BMSTeamManage));

			ServiceResult<Int32> wServerRst = wBMSService.BMS_DeleteTeamManage(wBMSEmployee, wBMSTeamManage);

			if (StringUtils.isEmpty(wServerRst.getFaultCode())) {
				wBMSTeamManage.ID = wServerRst.getResult();
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

	[HttpPost]
	public ActionResult Active() {
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
			List<BMSTeamManage> wBMSTeamManageList = CloneTool.CloneArray(wParam["data"], typeof(BMSTeamManage));

			ServiceResult<Int32> wServerRst = new ServiceResult<Int32>(0);
			for (BMSTeamManage wBMSTeamManage : wBMSTeamManageList) {
				wServerRst = wBMSService.BMS_ActiveTeamManage(wBMSEmployee, wActive, wBMSTeamManage);
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

	[HttpGet]
	public ActionResult MonitorAll() {
		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
		try {
			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}
			BMSEmployee wBMSEmployee = GetSession();

			int wLeaderID = StringUtils.parseInt(Request.QueryParamString("LeaderID"));

			if (wLeaderID <= 0)
				wLeaderID = wBMSEmployee.ID;
			ServiceResult<List<BMSTeamManage>> wServerRst = wBMSService.BMS_GetTeamManageList(wBMSEmployee, wLeaderID);

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

}
