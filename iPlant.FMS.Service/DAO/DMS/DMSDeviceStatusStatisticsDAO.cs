﻿using iPlant.Common.Tools;
using iPlant.Data.EF;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.SCADA.Service
{
    public class DMSDeviceStatusStatisticsDAO : BaseDAO
    {


        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(DMSDeviceStatusStatisticsDAO));

        private static DMSDeviceStatusStatisticsDAO Instance;


        public List<Int32> mStatusList = new List<int>();


        public int DevicePlanWorkHours = StringUtils.parseInt( GlobalConstant.GlobalConfiguration.GetValue("DevicePlanWorkHours"));


        private DMSDeviceStatusStatisticsDAO() : base()
        {
            mStatusList.Clear();
            mStatusList.AddRange(DMSDeviceStatusEnumTool.getInstance().Values);
        }

        public static DMSDeviceStatusStatisticsDAO getInstance()
        {
            if (Instance == null)
                Instance = new DMSDeviceStatusStatisticsDAO();
            return Instance;
        }

        public List<DMSDeviceStatusStatistics> DMS_SelectDeviceStatusStatisticsList(BMSEmployee wLoginUser, int wDeviceID, String wDeviceNo, String wDeviceName,
                String wAssetNo, int wDeviceType, int wModelID, int wFactoryID, int wWorkShopID, int wLineID, int wAreaID, int wTeamID, int wStatus, DateTime wStartTime, DateTime wEndTime,
                OutResult<Int32> wErrorCode)
        {
            List<DMSDeviceStatusStatistics> wResult = new List<DMSDeviceStatusStatistics>();
            try
            {
                List<DMSDeviceStatus> wDMSDeviceStatusList = DMSDeviceStatusDAO.getInstance().DMS_CurrentDeviceStatusList(wLoginUser,
                    wDeviceID, wDeviceNo, wDeviceName, wAssetNo, wDeviceType, wModelID, wFactoryID, wWorkShopID, wLineID, wAreaID, wTeamID, wStatus, wErrorCode);

                foreach (DMSDeviceStatus wDeviceStatus in wDMSDeviceStatusList)
                {
                    wResult.Add(new DMSDeviceStatusStatistics(wDeviceStatus));
                }


                this.DMS_SelectDeviceStatusDetailStatisticsTime(wLoginUser, wResult, wStartTime, wEndTime, wErrorCode);

                //List<Int32> wDeviceIDList = wResult.Select(p => p.DeviceID).Distinct().ToList();
                //if (wDeviceIDList.Count <= 0)
                //{
                //    wDMSDeviceAlarmStatisticsList.re;
                //    wDMSDeviceAlarmFrequencyList = new List<DMSDeviceAlarmFrequency>();
                //    return wResult;
                //}

                //wDMSDeviceAlarmStatisticsList = DMSDeviceAlarmDAO.getInstance().DMS_SelectDeviceAlarmStatisticsList(wLoginUser, wDeviceIDList,APSShiftPeriod.Day, wStartTime, wEndTime,wErrorCode);
                //wDMSDeviceAlarmStatisticsList = DMSDeviceAlarmDAO.getInstance().DMS_SelectDeviceAlarmStatisticsList(wLoginUser, wDeviceIDList, APSShiftPeriod.Day, wStartTime, wEndTime, wErrorCode);
            }
            catch (Exception e)
            {

                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        private Dictionary<int, int> DMS_SelectDeviceStatusDays(BMSEmployee wLoginUser, List<Int32> wDeviceIDList, DMSDeviceStatusEnum wDeviceStatusEnum, DateTime wStartTime, DateTime wEndTime, OutResult<Int32> wErrorCode)
        {
            Dictionary<int, int> wResult = new Dictionary<int, int>();
            try
            {
                if (wDeviceIDList != null && wDeviceIDList.Count > 0)
                {

                    foreach (Int32 wDevice in wDeviceIDList)
                    {
                        if (wDevice <= 0)
                            continue;
                        if (wResult.ContainsKey(wDevice))
                            continue;

                        wResult.Add(wDevice, 0);

                    }
                }

                if ((int)wDeviceStatusEnum <= 0)
                {
                    return wResult;
                }
                DateTime wBaseTime = new DateTime(2000, 1, 1);
                if ( wStartTime.CompareTo(wBaseTime) < 0)
                    wStartTime = wBaseTime;
                if ( wEndTime.CompareTo(wBaseTime) < 0)
                    wEndTime = wBaseTime;
                if (wStartTime.CompareTo(wEndTime) > 0)
                {
                    return wResult;
                }

                 


                String wSQL = StringUtils.Format(" select p.DeviceID,COUNT(p.DeviceID) as DayCount  " +
                    " FROM ( select t.ID as DeviceID, date_format(t1.StartDate, '%Y-%m-%d') FROM {0}.dms_device_detailstatus t1 " +
                    " inner  join {0}.dms_device_ledger t on t.AssetNo = t1.DeviceID  " +
                    " where ( @wDeviceIDList = '' or t.ID IN({1})) AND t1.DeviceStatus=@wDeviceStatusEnum  " +
                    " and ( @wStartTime <= str_to_date('2010-01-01', '%Y-%m-%d')  or @wStartTime <= t1.UpdateDate) " +
                    " and ( @wEndTime <= str_to_date('2010-01-01', '%Y-%m-%d') or @wEndTime >= t1.StartDate)  " +
                    " group by t.ID, date_format(t1.StartDate,'%Y-%m-%d')) p group by p.DeviceID;  "
                           , MESDBSource.DMS.getDBName(), wDeviceIDList.Count > 0 ? StringUtils.Join(",", wDeviceIDList) : "0");
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                wParamMap.Add("wDeviceIDList", StringUtils.Join(",", wDeviceIDList));
                wParamMap.Add("wDeviceStatusEnum", (int)wDeviceStatusEnum);
                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wEndTime", wEndTime);
                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);

                int wDeviceID = 0;
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    wDeviceID = StringUtils.parseInt(wReader["DeviceID"]);
                    if (!wResult.ContainsKey(wDeviceID))
                        wResult.Add(wDeviceID, 0);

                    wResult[wDeviceID] = StringUtils.parseInt(wReader["DayCount"]);

                }

            }
            catch (Exception e)
            {

                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;

        }

        private Dictionary<int, Dictionary<long, int>> DMS_SelectDeviceStatusDays(BMSEmployee wLoginUser, List<Int32> wDeviceIDList, int wStatType,
            DMSDeviceStatusEnum wDeviceStatusEnum, DateTime wStartTime, DateTime wEndTime, OutResult<Int32> wErrorCode)
        {
            Dictionary<int, Dictionary<long, int>> wResult = new Dictionary<int, Dictionary<long, int>>();
            try
            {
                if (wDeviceIDList != null && wDeviceIDList.Count > 0)
                {

                    foreach (Int32 wDevice in wDeviceIDList)
                    {
                        if (wDevice <= 0)
                            continue;
                        if (wResult.ContainsKey(wDevice))
                            continue;

                        wResult.Add(wDevice, new Dictionary<long, int>());

                    }
                }

                if ((int)wDeviceStatusEnum <= 0)
                {
                    return wResult;
                }
                DateTime wBaseTime = new DateTime(2000, 1, 1);
                if ( wStartTime.CompareTo(wBaseTime) < 0)
                    wStartTime = wBaseTime;
                if ( wEndTime.CompareTo(wBaseTime) < 0)
                    wEndTime = wBaseTime;
                if (wStartTime.CompareTo(wEndTime) > 0)
                {
                    return wResult;
                }

             


                String wGroupType = "";

                switch (wStatType)
                {
                    case ((int)DMSStatTypes.Week):
                        wGroupType = " str_to_date( DATE_FORMAT(p.WorkDayDate,'%Y-%u-1'),'%Y-%u-%w') ";

                        break;
                    case ((int)DMSStatTypes.Month):
                        wGroupType = " str_to_date( DATE_FORMAT(p.WorkDayDate,'%Y-%m-1'),'%Y-%m-%d') ";

                        break;
                    case ((int)DMSStatTypes.Quarter):
                        wGroupType = " str_to_date( concat(  year(p.WorkDayDate),'-',(quarter(p.WorkDayDate) * 3)-2,'-1'),'%Y-%m-%d') ";

                        break;
                    case ((int)DMSStatTypes.Year):
                        wGroupType = " str_to_date( concat(  year(p.WorkDayDate),'-01','-01'),'%Y-%m-%d')  ";

                        break;
                    default:
                        wGroupType = " str_to_date( DATE_FORMAT(p.WorkDayDate,'%Y-%m-%d'),'%Y-%m-%d') ";
                        break;
                }



                String wSQL = StringUtils.Format(" select p.DeviceID,COUNT(p.DeviceID) as DayCount, {2}   as StatTypeDate " +
                    " FROM ( select t.ID as DeviceID, date_format(t1.StartDate, '%Y-%m-%d') as WorkDayDate FROM {0}.dms_device_detailstatus t1 " +
                    " inner  join {0}.dms_device_ledger t on t.AssetNo = t1.DeviceID  " +
                    " where ( @wDeviceIDList = '' or t.ID IN({1})) AND t1.DeviceStatus=@wDeviceStatusEnum  " +
                    " and ( @wStartTime <= str_to_date('2010-01-01', '%Y-%m-%d')  or @wStartTime <= t1.UpdateDate) " +
                    " and ( @wEndTime <= str_to_date('2010-01-01', '%Y-%m-%d') or @wEndTime >= t1.StartDate)  " +
                    " group by t.ID, WorkDayDate) p group by p.DeviceID,StatTypeDate ;  "
                           , MESDBSource.DMS.getDBName(), wDeviceIDList.Count > 0 ? StringUtils.Join(",", wDeviceIDList) : "0", wGroupType);
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                wParamMap.Add("wDeviceIDList", StringUtils.Join(",", wDeviceIDList));
                wParamMap.Add("wDeviceStatusEnum", (int)wDeviceStatusEnum);
                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wEndTime", wEndTime);
                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);

                int wDeviceID = 0;
                DateTime wStatTypeDate = new DateTime(2000, 1, 1);
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    wDeviceID = StringUtils.parseInt(wReader["DeviceID"]);
                    wStatTypeDate = StringUtils.parseDate(wReader["StatTypeDate"]);
                    if (!wResult.ContainsKey(wDeviceID))
                        wResult.Add(wDeviceID, new Dictionary<long, int>());
                    if (!wResult[wDeviceID].ContainsKey(wStatTypeDate.Ticks))
                    {
                        wResult[wDeviceID].Add(wStatTypeDate.Ticks, 0);
                    }
                    wResult[wDeviceID][wStatTypeDate.Ticks] = StringUtils.parseInt(wReader["DayCount"]);

                }

            }
            catch (Exception e)
            {

                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;

        }

        private void DMS_SelectDeviceStatusStatisticsTime(BMSEmployee wLoginUser, List<DMSDeviceStatusStatistics> wDMSDeviceStatusStatisticsList,
              DateTime wStartTime, DateTime wEndTime, OutResult<Int32> wErrorCode)
        {

            try
            {


                DateTime wBaseTime = new DateTime(2000, 1, 1);
                if ( wStartTime.CompareTo(wBaseTime) < 0)
                    wStartTime = wBaseTime;
                if ( wEndTime.CompareTo(wBaseTime) < 0)
                    wEndTime = wBaseTime;
                if (wStartTime.CompareTo(wEndTime) > 0)
                {
                    return;
                }
                if (wDMSDeviceStatusStatisticsList == null || wDMSDeviceStatusStatisticsList.Count <= 0)
                    return;

                wDMSDeviceStatusStatisticsList.RemoveAll(p => p.DeviceID <= 0);

                List<Int32> wDeviceIDList = wDMSDeviceStatusStatisticsList.Select(p => p.DeviceID).Distinct().ToList();
                if (wDeviceIDList.Count <= 0)
                    return;


                
                StringBuilder wSB = new StringBuilder();
                String wColTemp = ", sum(case when (p.DeviceStatus&{0})>0 then p.Duration else 0 end) as Status{0} , count((p.DeviceStatus&{0})>0 or NULL) as CountStatus{0} ";
                foreach (int wStatus in mStatusList)
                {
                    wSB.Append(StringUtils.Format(wColTemp, wStatus));
                }


                String wSQL = StringUtils.Format(
                        " SELECT t.ID as DeviceID" + wSB.ToString()
                        + " FROM {0}.dms_device_ledger t  "
                        + " left join {0}.dms_device_hisstatus p on t.AssetNo=p.DeviceID  "
                        + " WHERE  t.ID IN( {1} )  "
                        + " and ( @wStartTime <= str_to_date('2010-01-01', '%Y-%m-%d')   or @wStartTime <= p.UpdateDate) "
                        + " and ( @wEndTime <= str_to_date('2010-01-01', '%Y-%m-%d')   or @wEndTime >= p.StartDate) group by t.ID  ;"
                        , MESDBSource.DMS.getDBName(), StringUtils.Join(",", wDeviceIDList));
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wEndTime", wEndTime);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);

                if (wQueryResult.Count <= 0)
                {
                    return;
                }

                Dictionary<int, DMSDeviceStatusStatistics> wDMSDeviceStatusStatisticsDic = wDMSDeviceStatusStatisticsList.GroupBy(p => p.DeviceID).ToDictionary(p => p.Key, p => p.First());


                Dictionary<int, int> wDeviceStatusDaysDic = this.DMS_SelectDeviceStatusDays(wLoginUser, wDeviceIDList, DMSDeviceStatusEnum.TurnOn, wStartTime, wEndTime, wErrorCode);


                int wDeviceID = 0;
                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    wDeviceID = StringUtils.parseInt(wReader["DeviceID"]);
                    if (!wDMSDeviceStatusStatisticsDic.ContainsKey(wDeviceID))
                        continue;

                    if (wDMSDeviceStatusStatisticsDic[wDeviceID].StatusDurationDic == null)
                    {
                        wDMSDeviceStatusStatisticsDic[wDeviceID].StatusDurationDic = new Dictionary<string, int>();
                    }
                    else if (wDMSDeviceStatusStatisticsDic[wDeviceID].StatusDurationDic.Count > 0)
                    {
                        wDMSDeviceStatusStatisticsDic[wDeviceID].StatusDurationDic.Clear();
                    }

                    if (wDMSDeviceStatusStatisticsDic[wDeviceID].StatusTimesDic == null)
                    {
                        wDMSDeviceStatusStatisticsDic[wDeviceID].StatusTimesDic = new Dictionary<string, int>();
                    }
                    else if (wDMSDeviceStatusStatisticsDic[wDeviceID].StatusTimesDic.Count > 0)
                    {
                        wDMSDeviceStatusStatisticsDic[wDeviceID].StatusTimesDic.Clear();
                    }

                    foreach (int wStatus in mStatusList)
                    {
                        wDMSDeviceStatusStatisticsDic[wDeviceID].StatusDurationDic.Add(wStatus + "", StringUtils.parseInt(wReader["Status" + wStatus]));

                        wDMSDeviceStatusStatisticsDic[wDeviceID].StatusTimesDic.Add(wStatus + "", StringUtils.parseInt(wReader["CountStatus" + wStatus]));

                    }

                    if (wDeviceStatusDaysDic.ContainsKey(wDeviceID))
                        wDMSDeviceStatusStatisticsDic[wDeviceID].PlanDuration = wDeviceStatusDaysDic[wDeviceID] * (DevicePlanWorkHours > 0 ? DevicePlanWorkHours : 8);

                }

            }
            catch (Exception e)
            {

                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }


        private void DMS_SelectDeviceStatusDetailStatisticsTime(BMSEmployee wLoginUser, List<DMSDeviceStatusStatistics> wDMSDeviceStatusStatisticsList,
              DateTime wStartTime, DateTime wEndTime, OutResult<Int32> wErrorCode)
        {

            try
            {


                DateTime wBaseTime = new DateTime(2000, 1, 1);
                if ( wStartTime.CompareTo(wBaseTime) < 0)
                    wStartTime = wBaseTime;
                if ( wEndTime.CompareTo(wBaseTime) < 0)
                    wEndTime = wBaseTime;
                if (wStartTime.CompareTo(wEndTime) > 0)
                {
                    return;
                }
                if (wDMSDeviceStatusStatisticsList == null || wDMSDeviceStatusStatisticsList.Count <= 0)
                    return;

                wDMSDeviceStatusStatisticsList.RemoveAll(p => p.DeviceID <= 0);

                List<Int32> wDeviceIDList = wDMSDeviceStatusStatisticsList.Select(p => p.DeviceID).Distinct().ToList();
                if (wDeviceIDList.Count <= 0)
                    return;


                

                StringBuilder wSB = new StringBuilder();
                String wColTemp = ", sum(case when p.DeviceStatus={0} then p.Duration else 0 end) as Status{0} ," +
                    " count(p.DeviceStatus={0} or NULL) as CountStatus{0} ";
                foreach (int wStatus in mStatusList)
                {
                    wSB.Append(StringUtils.Format(wColTemp, wStatus));
                }


                String wSQL = StringUtils.Format(
                        " SELECT t.ID as DeviceID" + wSB.ToString()
                        + " FROM {0}.dms_device_ledger t  "
                        + " left join {0}.dms_device_detailstatus p on t.AssetNo=p.DeviceID  "
                        + " WHERE  t.ID IN( {1} )  "
                        + " and ( @wStartTime <= str_to_date('2010-01-01', '%Y-%m-%d') or @wStartTime <= p.UpdateDate) "
                        + " and ( @wEndTime <= str_to_date('2010-01-01', '%Y-%m-%d')   or @wEndTime >= p.StartDate) group by t.ID  ;"
                        , MESDBSource.DMS.getDBName(), StringUtils.Join(",", wDeviceIDList));
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wEndTime", wEndTime);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);

                if (wQueryResult.Count <= 0)
                {
                    return;
                }

                Dictionary<int, DMSDeviceStatusStatistics> wDMSDeviceStatusStatisticsDic = wDMSDeviceStatusStatisticsList.GroupBy(p => p.DeviceID).ToDictionary(p => p.Key, p => p.First());


                Dictionary<int, int> wDeviceStatusDaysDic = this.DMS_SelectDeviceStatusDays(wLoginUser, wDeviceIDList, DMSDeviceStatusEnum.TurnOn, wStartTime, wEndTime, wErrorCode);


                int wDeviceID = 0;
                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    wDeviceID = StringUtils.parseInt(wReader["DeviceID"]);
                    if (!wDMSDeviceStatusStatisticsDic.ContainsKey(wDeviceID))
                        continue;

                    if (wDMSDeviceStatusStatisticsDic[wDeviceID].StatusDurationDic == null)
                    {
                        wDMSDeviceStatusStatisticsDic[wDeviceID].StatusDurationDic = new Dictionary<string, int>();
                    }
                    else if (wDMSDeviceStatusStatisticsDic[wDeviceID].StatusDurationDic.Count > 0)
                    {
                        wDMSDeviceStatusStatisticsDic[wDeviceID].StatusDurationDic.Clear();
                    }

                    if (wDMSDeviceStatusStatisticsDic[wDeviceID].StatusTimesDic == null)
                    {
                        wDMSDeviceStatusStatisticsDic[wDeviceID].StatusTimesDic = new Dictionary<string, int>();
                    }
                    else if (wDMSDeviceStatusStatisticsDic[wDeviceID].StatusTimesDic.Count > 0)
                    {
                        wDMSDeviceStatusStatisticsDic[wDeviceID].StatusTimesDic.Clear();
                    }

                    foreach (int wStatus in mStatusList)
                    {
                        wDMSDeviceStatusStatisticsDic[wDeviceID].StatusDurationDic.Add(wStatus + "", StringUtils.parseInt(wReader["Status" + wStatus]));

                        wDMSDeviceStatusStatisticsDic[wDeviceID].StatusTimesDic.Add(wStatus + "", StringUtils.parseInt(wReader["CountStatus" + wStatus]));

                    }

                    if (wDeviceStatusDaysDic.ContainsKey(wDeviceID))
                        wDMSDeviceStatusStatisticsDic[wDeviceID].PlanDuration = wDeviceStatusDaysDic[wDeviceID] * (DevicePlanWorkHours > 0 ? DevicePlanWorkHours : 8);

                }

            }
            catch (Exception e)
            {

                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }


        public List<DMSDeviceStatistics> DMS_SelectDeviceStatusDetailStatisticsTime(BMSEmployee wLoginUser, List<int> wDeviceIDList, int wStatType,
              DateTime wStartTime, DateTime wEndTime, OutResult<Int32> wErrorCode)
        {
            Dictionary<int, DMSDeviceStatistics> wResult = new Dictionary<int, DMSDeviceStatistics>();
            try
            {
                DateTime wBaseTime = new DateTime(2000, 1, 1);
                if ( wStartTime.CompareTo(wBaseTime) < 0)
                    wStartTime = wBaseTime;
                if ( wEndTime.CompareTo(wBaseTime) < 0)
                    wEndTime = wBaseTime;
                if (wStartTime.CompareTo(wEndTime) > 0)
                {
                    return wResult.Values.ToList();
                }
                if (wDeviceIDList == null || wDeviceIDList.Count <= 0)
                    return wResult.Values.ToList();

                wDeviceIDList.RemoveAll(p => p <= 0);

                if (wDeviceIDList.Count <= 0)
                    return wResult.Values.ToList();


                List<DMSDeviceLedger> wDMSDeviceLedgerList = DMSDeviceLedgerDAO.getInstance().DMS_SelectDeviceLedgerList(wLoginUser, wDeviceIDList, wErrorCode);

                if (wErrorCode.Result != 0)
                    return wResult.Values.ToList();

                if (wDMSDeviceLedgerList.Count <= 0)
                    return wResult.Values.ToList();

                Dictionary<int, DMSDeviceLedger> wDMSDeviceLedgerDic = wDMSDeviceLedgerList.ToDictionary(p => p.ID, p => p);

                 

                StringBuilder wSB = new StringBuilder();
                String wColTemp = ", sum(case when p.DeviceStatus={0} then p.Duration else 0 end) as Status{0} ," +
                    " count(p.DeviceStatus={0} or NULL) as CountStatus{0} ";
                foreach (int wStatus in mStatusList)
                {
                    wSB.Append(StringUtils.Format(wColTemp, wStatus));
                }

                String wGroupType = "";

                switch (wStatType)
                {
                    case ((int)DMSStatTypes.Week):
                        wGroupType = " str_to_date( DATE_FORMAT(p.StartDate,'%Y-%u-1'),'%Y-%u-%w') ";

                        break;
                    case ((int)DMSStatTypes.Month):
                        wGroupType = " str_to_date( DATE_FORMAT(p.StartDate,'%Y-%m-1'),'%Y-%m-%d') ";

                        break;
                    case ((int)DMSStatTypes.Quarter):
                        wGroupType = " str_to_date( concat(  year(p.StatStartDate),'-',(quarter(p.StatStartDate) * 3)-2,'-1'),'%Y-%m-%d') ";

                        break;
                    case ((int)DMSStatTypes.Year):
                        wGroupType = " str_to_date( concat(  year(p.StatStartDate),'-01','-01'),'%Y-%m-%d')  ";

                        break;
                    default:
                        wGroupType = " str_to_date( DATE_FORMAT(p.StartDate,'%Y-%m-%d'),'%Y-%m-%d') ";
                        break;
                }



                String wSQL = StringUtils.Format(
                        " SELECT t.ID as DeviceID, {2} as StatTypeDate " + wSB.ToString()
                        + " FROM {0}.dms_device_ledger t  "
                        + " left join {0}.dms_device_detailstatus p on t.AssetNo=p.DeviceID  "
                        + " WHERE  t.ID IN( {1} )  "
                        + " and ( @wStartTime <= str_to_date('2010-01-01', '%Y-%m-%d') or @wStartTime <= p.UpdateDate) "
                        + " and ( @wEndTime <= str_to_date('2010-01-01', '%Y-%m-%d')   or @wEndTime >= p.StartDate) group by t.ID,StatTypeDate  ;"
                        , MESDBSource.DMS.getDBName(), StringUtils.Join(",", wDeviceIDList), wGroupType);
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wEndTime", wEndTime);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);

                if (wQueryResult.Count <= 0)
                {
                    return wResult.Values.ToList();
                }

                Dictionary<int, Dictionary<long, int>> wDeviceStatusDaysDic = this.DMS_SelectDeviceStatusDays(wLoginUser, wDeviceIDList,
                    wStatType, DMSDeviceStatusEnum.TurnOn, wStartTime, wEndTime, wErrorCode);


                int wDeviceID = 0;
                DateTime wStatTypeDate = new DateTime(2000, 1, 1);

                DMSDeviceStatisticsInfo wDMSDeviceStatisticsInfo = null;
                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    wDeviceID = StringUtils.parseInt(wReader["DeviceID"]);
                    wStatTypeDate = StringUtils.parseDate(wReader["StatTypeDate"]);
                    if (!wDMSDeviceLedgerDic.ContainsKey(wDeviceID))
                        continue;


                    if (!wResult.ContainsKey(wDeviceID))
                    {

                        wResult.Add(wDeviceID, new DMSDeviceStatistics()
                        {
                            DeviceID = wDeviceID,
                            StatType = wStatType,
                            StatStartDate = wStartTime,
                            StatEndDate = wEndTime,
                            DeviceNo = wDMSDeviceLedgerDic[wDeviceID].Code,
                            DeviceName = wDMSDeviceLedgerDic[wDeviceID].Name,
                            AssetNo = wDMSDeviceLedgerDic[wDeviceID].AssetNo,
                            ModelID = wDMSDeviceLedgerDic[wDeviceID].ModelID,
                            ModelName = wDMSDeviceLedgerDic[wDeviceID].ModelName,
                            ModelNo = wDMSDeviceLedgerDic[wDeviceID].ModelNo,
                            Remark = wDMSDeviceLedgerDic[wDeviceID].Remark

                        });
                    }



                    wDMSDeviceStatisticsInfo = new DMSDeviceStatisticsInfo()
                    {
                        DeviceID = wDeviceID,
                        StatStartDate = wStatTypeDate,
                        StatEndDate = wStatTypeDate,
                        DeviceNo = wDMSDeviceLedgerDic[wDeviceID].Code,
                        DeviceName = wDMSDeviceLedgerDic[wDeviceID].Name,
                        AssetNo = wDMSDeviceLedgerDic[wDeviceID].AssetNo,
                        ModelID = wDMSDeviceLedgerDic[wDeviceID].ModelID,
                        ModelName = wDMSDeviceLedgerDic[wDeviceID].ModelName,
                        ModelNo = wDMSDeviceLedgerDic[wDeviceID].ModelNo,
                        Remark = wDMSDeviceLedgerDic[wDeviceID].Remark
                    };

                    switch (wStatType)
                    {
                        case ((int)DMSStatTypes.Week):
                            wDMSDeviceStatisticsInfo.StatEndDate = wDMSDeviceStatisticsInfo.StatEndDate.AddDays(7).AddMilliseconds(-1);

                            break;
                        case ((int)DMSStatTypes.Month):
                            wDMSDeviceStatisticsInfo.StatEndDate = wDMSDeviceStatisticsInfo.StatEndDate.AddMonths(1).AddMilliseconds(-1);
                            break;
                        case ((int)DMSStatTypes.Quarter):
                            wDMSDeviceStatisticsInfo.StatEndDate = wDMSDeviceStatisticsInfo.StatEndDate.AddMonths(3).AddMilliseconds(-1);
                            break;
                        case ((int)DMSStatTypes.Year):
                            wDMSDeviceStatisticsInfo.StatEndDate = wDMSDeviceStatisticsInfo.StatEndDate.AddYears(1).AddMilliseconds(-1);
                            break;
                        default:
                            wDMSDeviceStatisticsInfo.StatEndDate = wDMSDeviceStatisticsInfo.StatEndDate.AddDays(1).AddMilliseconds(-1);
                            break;
                    }


                    foreach (int wStatus in mStatusList)
                    {
                        wDMSDeviceStatisticsInfo.StatusDurationDic.Add(wStatus + "", StringUtils.parseInt(wReader["Status" + wStatus]));

                        wDMSDeviceStatisticsInfo.StatusTimesDic.Add(wStatus + "", StringUtils.parseInt(wReader["CountStatus" + wStatus]));

                    }

                    if (wDeviceStatusDaysDic.ContainsKey(wDeviceID) && wDeviceStatusDaysDic[wDeviceID].ContainsKey(wStatTypeDate.Ticks))
                    {
                        wDMSDeviceStatisticsInfo.PlanDuration = wDeviceStatusDaysDic[wDeviceID][wStatTypeDate.Ticks] * (DevicePlanWorkHours > 0 ? DevicePlanWorkHours : 8) * 3600;
                    }

                    if (wResult[wDeviceID].StatisticsInfoList == null)
                    {
                        wResult[wDeviceID].StatisticsInfoList = new List<DMSDeviceStatisticsInfo>();
                    }

                    wResult[wDeviceID].StatisticsInfoList.Add(wDMSDeviceStatisticsInfo);
                }

            }
            catch (Exception e)
            {

                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult.Values.ToList();
        }



    }
}
