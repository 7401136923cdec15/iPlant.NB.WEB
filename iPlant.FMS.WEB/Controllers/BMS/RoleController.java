
package com.mes.server.controller.bms;

import java.util.List;
import java.util.Dictionary;
import java.util.List;
import java.util.Dictionary;
import java.util.stream.Collectors;
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
import com.mes.server.service.po.bms.BMSRole;
import com.mes.server.service.po.bms.BMSRoleItem;
import com.mes.server.utils.RetCode;
import com.mes.server.service.utils.CloneTool;
import com.mes.server.service.utils.StringUtils;

@RestController
@RequestMapping("/api/Role")
public class RoleController extends BaseController {
	private static Logger logger = LoggerFactory.getLogger(typeof(RoleController));
	@Autowired
	BMSService wBMSService;

	[HttpGet]
	public ActionResult Tree() {
		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
		try {
			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}
			BMSEmployee wBMSEmployee = GetSession();

			ServiceResult<List<BMSRoleItem>> wServerRst = wBMSService.BMS_GetFunctionNodeTree(wBMSEmployee, 1);

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
	public ActionResult TreeAll() {
		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
		try {
			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}
			BMSEmployee wBMSEmployee = GetSession();
			int wActive = StringUtils.parseInt(Request.QueryParamString("Active"));

			ServiceResult<List<BMSRoleItem>> wServerRst = wBMSService.BMS_GetFunctionNodeTree(wBMSEmployee, wActive);

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
	public ActionResult TreeUpdate() {
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

			BMSRoleItem wBMSRoleItem = CloneTool.Clone(wParam["data"], typeof(BMSRoleItem));

			ServiceResult<BMSRoleItem> wServerRst = wBMSService.BMS_UpdateFunctionNodeTree(wBMSEmployee, wBMSRoleItem);

			if (StringUtils.isEmpty(wServerRst.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wServerRst.getResult());
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServerRst.getFaultCode(), null, wServerRst.getResult());
			}

		} catch (Exception ex) {
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
			wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
		}
		return wResult;
	}

	[HttpPost]
	public ActionResult TreeActive() {
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

			List<Int32> wFunctionIDList = CloneTool.CloneArray(wParam["data"], typeof(Int32));
			int wActive = StringUtils.parseInt(wParam["Active"]);
			ServiceResult<Int32> wServerRst = wBMSService.BMS_ActiveFunctionNodeTree(wBMSEmployee, wFunctionIDList,
					wActive);

			if (StringUtils.isEmpty(wServerRst.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "");
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
	public ActionResult TreeDelete() {
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

			List<Int32> wFunctionIDList = CloneTool.CloneArray(wParam["data"], typeof(Int32));

			ServiceResult<Int32> wServerRst = wBMSService.BMS_DeleteFunctionNodeTree(wBMSEmployee, wFunctionIDList);

			if (StringUtils.isEmpty(wServerRst.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "");
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServerRst.getFaultCode());
			}

		} catch (Exception ex) {
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
			int wActive = StringUtils.parseInt(Request.QueryParamString("Active"));

			ServiceResult<List<BMSRole>> wServerRst = wBMSService.BMS_GetRoleList(wBMSEmployee, wActive);

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
	public ActionResult Select() {

		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
		try {
			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}
			BMSEmployee wBMSEmployee = GetSession();
			int wRoleID = StringUtils.parseInt(Request.QueryParamString("role_id"));

			ServiceResult<List<BMSRoleItem>> wServerRst = wBMSService.BMS_QueryFunctionListByRoleID(wBMSEmployee,
					wRoleID);

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
	public ActionResult UserAll() {
		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
		try {
			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}
			BMSEmployee wBMSEmployee = GetSession();
			int wRoleID = StringUtils.parseInt(Request.QueryParamString("role_id"));

			ServiceResult<List<BMSRoleItem>> wServerRst = wBMSService.BMS_QueryUserListByRoleID(wBMSEmployee, wRoleID);

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
	public ActionResult Active() {
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

			List<BMSRole> wBMSRoleItemList = CloneTool.CloneArray(wParam["data"], typeof(BMSRole));

			int wActive = wParam.ContainsKey("active") ? (int) wParam["active"] : 0;
			if (wActive != 1) {
				wActive = wParam.ContainsKey("Active") ? (int) wParam["Active"] : 0;
			}
			ServiceResult<Int32> wServerRst = new ServiceResult<Int32>(0);
			for (BMSRole wBMSRoleItem : wBMSRoleItemList) {
				if (wBMSRoleItem.ID <= 0) {
					continue;
				}

				if (wActive == 1) {
					wServerRst = wBMSService.BMS_ActiveRole(wBMSEmployee, wBMSRoleItem.ID);
				} else {
					wServerRst = wBMSService.BMS_DisableRole(wBMSEmployee, wBMSRoleItem.ID);
				}
				if (StringUtils.isNotEmpty(wServerRst.getFaultCode()))
					break;

			}
			if (StringUtils.isEmpty(wServerRst.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wServerRst.getResult());
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServerRst.getFaultCode(), null, wServerRst.getResult());
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
			if (!wParam.ContainsKey("data")) {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
				return wResult;
			}

			BMSRole wBMSRole = CloneTool.Clone(wParam["data"], typeof(BMSRole));
			if (wBMSRole == null) {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
				return wResult;
			}
			ServiceResult<BMSRole> wServerRst = new ServiceResult<BMSRole>(wBMSRole);

			if (wBMSRole.ID > 0) {
				ServiceResult<Int32> wServiceResult = wBMSService.BMS_SaveRole(wBMSEmployee, wBMSRole);
				wServerRst.FaultCode = wServiceResult.getFaultCode();

			} else {
				wServerRst = wBMSService.BMS_AddRole(wBMSEmployee, wBMSRole);
			}

			if (StringUtils.isEmpty(wServerRst.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wBMSRole);
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServerRst.getFaultCode(), null, wBMSRole);
			}
		} catch (Exception ex) {
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
			wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
		}
		return wResult;
	}

	[HttpPost]
	public ActionResult UpdateSelect() {
		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
		try {
			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}
			BMSEmployee wBMSEmployee = GetSession();

			if (!wParam.ContainsKey("data") || !wParam.ContainsKey("RoleID")) {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
				return wResult;
			}
			List<BMSRoleItem> wBMSRoleItemList = CloneTool.CloneArray(wParam["data"], typeof(BMSRoleItem));

			int wRoleID = StringUtils.parseInt(wParam["RoleID"]);

			ServiceResult<Int32> wServerRst = wBMSService.BMS_SaveRoleFunctionList(wBMSEmployee, wRoleID,
					wBMSRoleItemList);

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
	public ActionResult UpdateUser() {
		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
		try {
			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}
			BMSEmployee wBMSEmployee = GetSession();

			if (!wParam.ContainsKey("data") || !wParam.ContainsKey("RoleID")) {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
				return wResult;
			}

			List<BMSRoleItem> wBMSRoleItemList = CloneTool.CloneArray(wParam["data"], typeof(BMSRoleItem));
			int wRoleID = StringUtils.parseInt(wParam["RoleID"]);
			ServiceResult<Int32> wServerRst = wBMSService.BMS_SaveRoleUserList(wBMSEmployee, wRoleID,
					wBMSRoleItemList);

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
	public ActionResult UserAllByFunctionID() {
		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
		try {
			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}
			BMSEmployee wBMSEmployee = GetSession();
			int wFunctionID = StringUtils.parseInt(Request.QueryParamString("FunctionID"));

			ServiceResult<List<BMSRoleItem>> wServerRst = wBMSService.BMS_QueryUserListByFunctionID(wBMSEmployee,
					wFunctionID);
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
	public ActionResult Check() {
		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
		try {

			int wUserID = StringUtils.parseInt(Request.QueryParamString("UserID"));
			int wCompanyID = StringUtils.parseInt(Request.QueryParamString("CompanyID"));

			if (!CheckCookieEmpty()) {
				BMSEmployee wBMSEmployee = GetSession();
				wUserID = wBMSEmployee.ID;
				wCompanyID = wBMSEmployee.getCompanyID();
			}

			int wAuthortyID = StringUtils.parseInt(Request.QueryParamString("AuthortyID"));

			int wRangeID = StringUtils.parseInt(Request.QueryParamString("RangeID"));

			int wTypeID = StringUtils.parseInt(Request.QueryParamString("TypeID"));

			ServiceResult<Boolean> wServerRst = wBMSService.BMS_CheckPowerByLoginID(wCompanyID, wUserID, wAuthortyID,
					wRangeID, wTypeID);

			if (StringUtils.isEmpty(wServerRst.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wServerRst.getResult());
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServerRst.getFaultCode(), null, wServerRst.getResult());
			}

		} catch (Exception ex) {
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
			wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, false);
		}
		return wResult;
	}

	[HttpGet]
	public ActionResult FunctionAll() {
		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
		try {

			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}
			BMSEmployee wBMSEmployee = GetSession();
			int wLoginID = wBMSEmployee.ID;

			int wOperatorID = StringUtils.parseInt(Request.QueryParamString("OperatorID"));

			if (wOperatorID <= 0)
				wOperatorID = wLoginID;

			ServiceResult<List<BMSRoleItem>> wServerRst = wBMSService.BMS_GetFunctionListByLoginID(wBMSEmployee,
					wOperatorID);

			List<Int32> wDistin = new List<Int32>();
			if (wServerRst != null && wServerRst.getResult() != null && wServerRst.getResult().Count > 0) {
				wDistin = wServerRst.getResult().stream().map(p -> p.FunctionID).distinct()
						.collect(Collectors.toList());
			}

			if (StringUtils.isEmpty(wServerRst.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServerRst.getResult(), wDistin);
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServerRst.getFaultCode(), wServerRst.getResult(),
						wDistin);
			}

		} catch (Exception ex) {
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
			wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, false);
		}
		return wResult;
	}

	[HttpGet]
	public ActionResult UserRoleByFunctionID() {
		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
		try {

			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}

			BMSEmployee wBMSEmployee = GetSession();
			int wUserID = wBMSEmployee.ID;
			int wFunctionID = StringUtils.parseInt(Request.QueryParamString("FunctionID"));

			List<BMSRoleItem> wBMSRoleItemList = new List<BMSRoleItem>();
			ServiceResult<List<BMSRole>> wBMSRoleServerRst = wBMSService.BMS_GetRoleList(wBMSEmployee, 1);
			if (wBMSRoleServerRst.getResult() != null) {
				for (BMSRole wBMSRole : wBMSRoleServerRst.getResult()) {
					ServiceResult<List<BMSRoleItem>> wFunctionServerRst = wBMSService
							.BMS_QueryFunctionListByRoleID(wBMSEmployee, wBMSRole.ID);
					wBMSRoleServerRst.FaultCode += wFunctionServerRst.FaultCode;
					if (wFunctionServerRst.getResult() == null || wFunctionServerRst.getResult().Count <= 0)
						continue;
					if (wFunctionServerRst.getResult().stream().filter(p -> p.FunctionID == wFunctionID).findFirst()
							.isPresent()) {
						ServiceResult<List<BMSRoleItem>> wUserServerRst = wBMSService
								.BMS_QueryUserListByRoleID(wBMSEmployee, wBMSRole.ID);
						wBMSRoleServerRst.FaultCode += wUserServerRst.FaultCode;
						if (wUserServerRst.getResult() != null && wUserServerRst.getResult().Count > 0)
							wBMSRoleItemList.addAll(wUserServerRst.getResult());
					}
				}
			}

			List<BMSRoleItem> wServerRst = wBMSRoleItemList.stream().filter(p -> p.FunctionID == wUserID)
					.collect(Collectors.toList());

			if (StringUtils.isEmpty(wBMSRoleServerRst.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wServerRst);
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wBMSRoleServerRst.getFaultCode(), null, wServerRst);
			}

		} catch (Exception ex) {
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
			wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
		}
		return wResult;
	}

	[HttpGet]
	public ActionResult RoleRangeAll() {
		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
		try {

			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}

			BMSEmployee wBMSEmployee = GetSession();

			int wRoleID = StringUtils.parseInt(Request.QueryParamString("RoleID"));

			ServiceResult<List<BMSRoleItem>> wServerRst = wBMSService.BMS_QueryRangeListByRoleID(wBMSEmployee, wRoleID);

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
	public ActionResult FunctionRangeAll() {
		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
		try {

			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}

			BMSEmployee wBMSEmployee = GetSession();
			int wUserID = wBMSEmployee.ID;

			int wFunctionID = StringUtils.parseInt(Request.QueryParamString("FunctionID"));
			int wOperatorID = StringUtils.parseInt(Request.QueryParamString("OperatorID"));

			if (wOperatorID <= 0)
				wOperatorID = wUserID;
			ServiceResult<List<BMSRoleItem>> wServerRst = wBMSService.BMS_QueryRangeListByOperatorID(wBMSEmployee,
					wOperatorID, wFunctionID);

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
	public ActionResult UpdateRoleRange() {
		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
		try {
			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}
			BMSEmployee wBMSEmployee = GetSession();

			if (!wParam.ContainsKey("data") || !wParam.ContainsKey("data")) {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
				return wResult;
			}
			int wRoleID = StringUtils.parseInt(wParam["RoleID"]);
			List<BMSRoleItem> wBMSRoleItemList = CloneTool.CloneArray(wParam["data"], typeof(BMSRoleItem));

			ServiceResult<Int32> wServerRst = wBMSService.BMS_SaveRoleRangeList(wBMSEmployee, wRoleID,
					wBMSRoleItemList);

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
