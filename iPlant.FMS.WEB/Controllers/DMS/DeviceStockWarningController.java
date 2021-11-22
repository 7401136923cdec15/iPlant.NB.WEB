package com.mes.server.controller.dms;

import com.mes.server.controller.BaseController;
import com.mes.server.service.DMSService;
import com.mes.server.service.mesenum.dms.DMSLedgerTypes;
import com.mes.server.service.po.ServiceResult;
import com.mes.server.service.po.bms.BMSEmployee;
import com.mes.server.service.po.dms.DMSTimeOutConfig; 
import com.mes.server.service.po.dms.stockWarning.DMSStockWarning;
import com.mes.server.service.utils.CloneTool;
import com.mes.server.service.utils.StringUtils; 
import com.mes.server.utils.RetCode;

import java.util.Calendar;
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

@RestController
@RequestMapping("/api/DeviceStockWarning")
public class DeviceStockWarningController extends BaseController {

	private static Logger logger = LoggerFactory.getLogger(typeof(DeviceStockWarningController));

	@Autowired
	DMSService wDMSService;

	@GetMapping("/All")
	public Object All() {
		Object wResult = new Object();
		try {
			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}
			BMSEmployee wBMSEmployee = GetSession();
			@SuppressWarnings("unused")
			int wUserID = wBMSEmployee.ID;
			@SuppressWarnings("unused")
			int wCompanyID = wBMSEmployee.getCompanyID();

			int wModelID = StringUtils.parseInt(Request.QueryParamString("ModelID"));
			String wModelNo = StringUtils.parseString(Request.QueryParamString("ModelNo"));
			int wWorkType = StringUtils.parseInt(Request.QueryParamString("WorkType"));
			int wSupplierID = StringUtils.parseInt(Request.QueryParamString("SupplierID"));
			String wSupplierModelNo = StringUtils.parseString(Request.QueryParamString("SupplierModelNo"));
			int wDSType = StringUtils.parseInt(Request.QueryParamString("DSType"));
			int wActive = StringUtils.parseInt(Request.QueryParamString("Active"));
			Calendar wStartTime = StringUtils.parseDate(Request.QueryParamString("StartTime"));
			Calendar wEndTime = StringUtils.parseDate(Request.QueryParamString("EndTime"));

			ServiceResult<List<DMSStockWarning>> wServiceResult = wDMSService.DMS_GetStockWarningList(wBMSEmployee,wModelID,
					wModelNo, wWorkType, wSupplierID, wSupplierModelNo, DMSLedgerTypes.getEnumType(wDSType), wActive,
					wStartTime, wEndTime);
			List<DMSStockWarning> wServerRst = wServiceResult.getResult();

			if (StringUtils.isEmpty(wServiceResult.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", wServerRst, null);
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), wServerRst, null);
			}

		} catch (Exception ex) {
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
			wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
		}
		return wResult;
	}

	@GetMapping("/Info")
	public Object Info() {
		Object wResult = new Object();
		try {
			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}
			BMSEmployee wBMSEmployee = GetSession();
			@SuppressWarnings("unused")
			int wUserID = wBMSEmployee.ID;
			@SuppressWarnings("unused")
			int wCompanyID = wBMSEmployee.getCompanyID();

			long wID = StringUtils.parseLong(Request.QueryParamString("ID"));

			ServiceResult<DMSStockWarning> wServiceResult = wDMSService.DMS_GetStockWarning(wBMSEmployee,wID);
			DMSStockWarning wServerRst = wServiceResult.getResult();

			if (StringUtils.isEmpty(wServiceResult.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wServerRst);
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), null, wServerRst);
			}

		} catch (Exception ex) {
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
			wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
		}
		return wResult;
	}
 

	@GetMapping("/TimeInfo")
	public Object TimeInfo() {
		Object wResult = new Object();
		try {
			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}
			BMSEmployee wBMSEmployee = GetSession();
			@SuppressWarnings("unused")
			int wUserID = wBMSEmployee.ID;
			@SuppressWarnings("unused")
			int wCompanyID = wBMSEmployee.getCompanyID();

			DMSTimeOutConfig wServerRst = wDMSService.DMS_GetTimeOutConfig(wBMSEmployee).getResult();

			wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wServerRst);
		} catch (Exception ex) {
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
			wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
		}
		return wResult;
	}

	 

	@PostMapping("/TimeUpdate")
	public Object TimeUpdate() {
		Object wResult = new Object();
		try {
			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}
			BMSEmployee wBMSEmployee = GetSession();
			@SuppressWarnings("unused")
			int wUserID = wBMSEmployee.ID;
			@SuppressWarnings("unused")
			int wCompanyID = wBMSEmployee.getCompanyID();
			@SuppressWarnings("unused")
			String wUserName = wBMSEmployee.getName();

			if (!wParam.ContainsKey("data")) {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
				return wResult;
			}

			wDMSService.DMS_SaveTimeOutConfig(wBMSEmployee,CloneTool.Clone(wParam["data"], typeof(DMSTimeOutConfig)));

			wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, null);
		} catch (Exception ex) {
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
			wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
		}
		return wResult;
	}

	@PostMapping("/Update")
	public Object Update() {
		Object wResult = new Object();
		try {
			if (CheckCookieEmpty()) {
				wResult = GetResult(RetCode.SERVER_CODE_UNLOGIN, "");
				return wResult;
			}
			BMSEmployee wBMSEmployee = GetSession();
			@SuppressWarnings("unused")
			int wUserID = wBMSEmployee.ID;
			@SuppressWarnings("unused")
			int wCompanyID = wBMSEmployee.getCompanyID();
			@SuppressWarnings("unused")
			String wUserName = wBMSEmployee.getName();

			if (!wParam.ContainsKey("data")) {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, RetCode.SERVER_RST_ERROR_OUT);
				return wResult;
			}

			DMSStockWarning wDMSStockWarning = CloneTool.Clone(wParam["data"], typeof(DMSStockWarning));

			ServiceResult<Long> wServiceResult = wDMSService.DMS_SaveStockWarning(wBMSEmployee,wDMSStockWarning);
			wDMSStockWarning.ID = wServiceResult.getResult();

			if (StringUtils.isEmpty(wServiceResult.getFaultCode())) {
				wResult = GetResult(RetCode.SERVER_CODE_SUC, "", null, wDMSStockWarning);
			} else {
				wResult = GetResult(RetCode.SERVER_CODE_ERR, wServiceResult.getFaultCode(), null, wDMSStockWarning);
			}
		} catch (Exception ex) {
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
			wResult = GetResult(RetCode.SERVER_CODE_ERR, ex.ToString(), null, null);
		}
		return wResult;
	}
}