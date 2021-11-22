package com.mes.server.service;

import java.util.DateTime;
import java.util.List;

import com.mes.server.service.po.ServiceResult;
import com.mes.server.service.po.cfg.CFGCalendar;

public interface CFGService {

	ServiceResult<Int32> Cfg_AddHoliday(int wCompanyID, int wLoginID, int WorkShopID, CFGCalendar wCalendarHoliday);

	ServiceResult<Int32> Cfg_AddHolidayList(int wCompanyID, int wLoginID, int WorkShopID,
			List<CFGCalendar> wHolidayList);

	ServiceResult<Int32> Cfg_RemoveHoliday(int wCompanyID, int wLoginID, int WorkShopID,
			CFGCalendar wCalendarHoliday);

	ServiceResult<Int32> Cfg_WorkingDays(int wCompanyID, int wLoginID, int WorkShopID, DateTime wStartDate,
			DateTime wEndDate);

	ServiceResult<Int32> Cfg_WorkingHours(int wCompanyID, int wLoginID, int WorkShopID, DateTime wStartTime,
			DateTime wEndTime);

	ServiceResult<List<CFGCalendar>> Cfg_QueryHoliday(int wCompanyID, int wLoginID, int WorkShopID, int wYear);

	ServiceResult<Int32> Cfg_RemoveYearHoliday(int wCompanyID, int wLoginID, int WorkShopID, int wYear);

	ServiceResult<DateTime> Cfg_ForwardDay(int wCompanyID, int wLoginID, int WorkShopID, DateTime wStartDate, int wForwardDays);

	ServiceResult<DateTime> Cfg_PeriousDay(int wCompanyID, int wLoginID, int WorkShopID, DateTime wStartDate, int wPeriousDays);

	ServiceResult<Boolean> Cfg_IsHoliday(int wCompanyID, int wLoginID, int WorkShopID,  DateTime wDailyDate);
}
