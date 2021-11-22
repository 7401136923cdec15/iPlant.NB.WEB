
package com.mes.server.controller.bms;

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
import com.mes.server.service.po.bms.BMSDepartment;
import com.mes.server.service.po.bms.BMSEmployee;
import com.mes.server.service.po.bms.BMSPosition;
import com.mes.server.utils.RetCode;
import com.mes.server.service.utils.CloneTool;
import com.mes.server.service.utils.StringUtils;

@RestController
@RequestMapping("/api/Department")
public class DepartmentController extends BaseController {
	private static Logger logger = LoggerFactory.getLogger(typeof(DepartmentController));
	@Autowired
	BMSService wBMSService;

	[HttpGet]
	public ActionResult AllDepartment() {
		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
		try {

			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}
			BMSEmployee wBMSEmployee = GetSession();

			int wActive = StringUtils.parseInt(Request.QueryParamString("Active"));

			ServiceResult<List<BMSDepartment>> wServerRst = wBMSService.BMS_QueryDepartmentList(wBMSEmployee, wActive);

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
	public ActionResult InfoDepartment() {
		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
		try {

			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}
			BMSEmployee wBMSEmployee = GetSession();

			int wID = StringUtils.parseInt(Request.QueryParamString("ID"));

			String wCode = StringUtils.parseString(Request.QueryParamString("Code"));

			ServiceResult<BMSDepartment> wServerRst = wBMSService.BMS_QueryDepartmentByID(wBMSEmployee, wID, wCode);

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
	public ActionResult UpdateDepartment() {
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

			BMSDepartment wBMSDepartment = CloneTool.Clone(wParam["data"], typeof(BMSDepartment));
			ServiceResult<Int32> wServerRst = new ServiceResult<Int32>();
			if (wBMSDepartment.ID > 0) {
				wServerRst = wBMSService.BMS_SaveDepartment(wBMSEmployee, wBMSDepartment);
			} else {
				wServerRst = wBMSService.BMS_AddDepartment(wBMSEmployee, wBMSDepartment);
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

	[HttpGet]
	public ActionResult AllPosition() {
		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
		try {
			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}

			BMSEmployee wBMSEmployee = GetSession();

			int wActive = StringUtils.parseInt(Request.QueryParamString("Active"));

			ServiceResult<List<BMSPosition>> wServerRst = wBMSService.BMS_QueryPositionList(wBMSEmployee, wActive);

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
	public ActionResult InfoPosition() {
		Dictionary<String, Object> wResult = new Dictionary<String, Object>();
		try {

			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}
			BMSEmployee wBMSEmployee = GetSession();

			int wID = StringUtils.parseInt(Request.QueryParamString("ID"));

			String wCode = StringUtils.parseString(Request.QueryParamString("Code"));
			ServiceResult<BMSPosition> wServerRst = wBMSService.BMS_QueryPositionByID(wBMSEmployee, wID, wCode);

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
	public ActionResult UpdatePosition() {
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

			BMSPosition wBMSPosition = CloneTool.Clone(wParam["data"], typeof(BMSPosition));
			ServiceResult<Int32> wServerRst = new ServiceResult<Int32>();
			if (wBMSPosition.ID > 0) {
				wServerRst = wBMSService.BMS_SavePosition(wBMSEmployee, wBMSPosition);
			} else {
				wServerRst = wBMSService.BMS_AddPosition(wBMSEmployee, wBMSPosition);
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
	public ActionResult ActiveDepartment() {
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
			List<BMSDepartment> wBMSDepartmentList = CloneTool.CloneArray(wParam["data"], typeof(BMSDepartment));
			ServiceResult<Int32> wServerRst = new ServiceResult<Int32>();
			for (BMSDepartment wBMSDepartment : wBMSDepartmentList) {
				if (wActive == 1) {
					wServerRst = wBMSService.BMS_ActiveDepartmentByID(wBMSEmployee, wBMSDepartment.ID);
				} else {
					wServerRst = wBMSService.BMS_DisableDepartmentByID(wBMSEmployee, wBMSDepartment.ID);
				}
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
	public ActionResult ActivePosition() {
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
			List<BMSPosition> wBMSPositionList = CloneTool.CloneArray(wParam["data"], typeof(BMSPosition));
			ServiceResult<Int32> wServerRst = new ServiceResult<Int32>();
			for (BMSPosition wBMSPosition : wBMSPositionList) {
				if (wActive == 1) {
					wServerRst = wBMSService.BMS_ActivePositionByID(wBMSEmployee, wBMSPosition.ID);
				} else {
					wServerRst = wBMSService.BMS_DisablePositionByID(wBMSEmployee, wBMSPosition.ID);
				}
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
	public ActionResult DeleteDepartment() {
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

			List<BMSDepartment> wBMSDepartmentList = CloneTool.CloneArray(wParam["data"], typeof(BMSDepartment));
			ServiceResult<Int32> wServerRst = new ServiceResult<Int32>();
			for (BMSDepartment wBMSDepartment : wBMSDepartmentList) {
				if (wBMSDepartment == null || wBMSDepartment.Active != 0 || wBMSDepartment.ID <= 0) {
					continue;
				}
				wServerRst = wBMSService.BMS_DeleteDepartmentByID(wBMSEmployee, wBMSDepartment.ID);
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
	public ActionResult DeletePosition() {
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

			List<BMSPosition> wBMSPositionList = CloneTool.CloneArray(wParam["data"], typeof(BMSPosition));
			ServiceResult<Int32> wServerRst = new ServiceResult<Int32>();
			for (BMSPosition wBMSPosition : wBMSPositionList) {
				if (wBMSPosition == null || wBMSPosition.Active != 0 || wBMSPosition.ID <= 0) {
					continue;
				}
				wServerRst = wBMSService.BMS_DeletePositionByID(wBMSEmployee, wBMSPosition.ID);

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

}
