﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models
{
    /// <summary>
    /// 设备状态统计
    /// </summary> 
    public class DMSDeviceStatusStatistics
    {

        /// <summary>
        /// 设备编码
        /// </summary>
        public String DeviceNo { get; set; } = "";


        public int DeviceID { get; set; } = 0;

        /// <summary>
        ///  设备名称
        /// </summary>
        public String DeviceName { get; set; } = "";

        /// <summary>
        /// 固定资产编码
        /// </summary>
        public String AssetNo { get; set; } = "";
        /// <summary>
        /// 设备型号ID
        /// </summary>
        public int ModelID { get; set; } = 0;
        /// <summary>
        /// 设备型号名称
        /// </summary>
        public String ModelName { get; set; } = "";
        /// <summary>
        /// 设备型号ID
        /// </summary>
        public String ModelNo { get; set; } = "";



        public String Remark { get; set; } = "";

        /// <summary>
        /// 设备类型编码
        /// </summary>
        public int DeviceType { get; set; } = 0;

        /// <summary>
        /// 设备类型名称
        /// </summary>
        public String DeviceTypeName { get; set; } = "";
        /// <summary>
        /// 设备类型编码
        /// </summary>
        public String DeviceTypeCode { get; set; } = "";

        public int AreaID { get; set; } = 0;

        public String AreaNo { get; set; } = "";
        /// <summary>
        /// 位置信息
        /// </summary>
        public String PositionText { get; set; } = "";

        public String ImageIcon { get; set; } = "";
        /// <summary>
        /// 当前状态
        /// </summary>
        public int Status { get; set; } = 0;

        /// <summary>
        /// 历史状态
        /// </summary>
        public int StatusHistory { get; set; } = 0;

        /// <summary>
        /// 状态改变时刻
        /// </summary>
        public DateTime StatusTime { get; set; } = new DateTime(2000, 1, 1);

        /// <summary>
        /// 当前状态持续时长
        /// </summary>
        public int Duration { get; set; } = 0;



        public Dictionary<String, int> StatusDurationDic { get; set; } = new Dictionary<string, int>();



        public Dictionary<String, int> StatusTimesDic { get; set; } = new Dictionary<string, int>();

        /// <summary>
        /// 计划工作时长   工作日历的工作日*8小时
        /// </summary>
        public int PlanDuration { get; set; } = 0;

        /// <summary>
        /// 故障次数
        /// </summary>
        public int FailTimes
        {
            get
            {
                if (StatusTimesDic != null && StatusTimesDic.ContainsKey(((int)DMSDeviceStatusEnum.Alarm).ToString()))
                {
                    return StatusTimesDic[((int)DMSDeviceStatusEnum.Alarm).ToString()];
                }
                return 0;
            }
            set { }
        }


        /// <summary>
        /// 开机时长
        /// </summary>
        public int TurnOnDuration
        {
            get
            {
                if (StatusDurationDic != null && StatusDurationDic.ContainsKey(((int)DMSDeviceStatusEnum.TurnOn).ToString()))
                {
                    return StatusDurationDic[((int)DMSDeviceStatusEnum.TurnOn).ToString()];
                }
                return 0;

            }
            set { }
        }

        /// <summary>
        /// 故障时长
        /// </summary>
        public int AlarmDuration
        {
            get
            {
                if (StatusDurationDic != null && StatusDurationDic.ContainsKey(((int)DMSDeviceStatusEnum.Alarm).ToString()))
                {
                    return StatusDurationDic[((int)DMSDeviceStatusEnum.Alarm).ToString()];
                }
                return 0;

            }
            set { }
        }


        /// <summary>
        /// 平均无故障时间  = 无故障时间/故障次数 =（开机时间-故障时间）/故障次数
        /// </summary>
        public int MTTF
        {
            get
            {

                return (TurnOnDuration - AlarmDuration) / (FailTimes <= 0 ? 1 : FailTimes);

            }
            set { }
        }

        /// <summary>
        /// 平均故障间隔时间  = 开机时间/故障次数
        /// </summary>
        public int MTBF
        {
            get
            {
                return TurnOnDuration / (FailTimes <= 0 ? 1 : FailTimes);
            }
            set { }
        }
        /// <summary>
        /// 平均修复时间   =  故障时间/故障次数
        /// </summary>
        public int MTTR
        {
            get
            {
                return AlarmDuration / (FailTimes <= 0 ? 1 : FailTimes);
            }
            set { }
        }

        public DMSDeviceStatusStatistics() { }
        public DMSDeviceStatusStatistics(DMSDeviceStatus wDMSDeviceStatus)
        {
            this.DeviceNo = wDMSDeviceStatus.DeviceNo;
            this.DeviceName = wDMSDeviceStatus.DeviceName;
            this.DeviceID = wDMSDeviceStatus.DeviceID;
            this.AssetNo = wDMSDeviceStatus.AssetNo;


            this.ModelID = wDMSDeviceStatus.ModelID;
            this.ModelNo = wDMSDeviceStatus.ModelNo;
            this.ModelName = wDMSDeviceStatus.ModelName;
            this.Remark = wDMSDeviceStatus.Remark;


            this.DeviceType = wDMSDeviceStatus.DeviceType;
            this.DeviceTypeCode = wDMSDeviceStatus.DeviceTypeCode;
            this.DeviceTypeName = wDMSDeviceStatus.DeviceTypeName;

            this.PositionText = wDMSDeviceStatus.PositionText;
            this.AreaID = wDMSDeviceStatus.AreaID;
            this.AreaNo = wDMSDeviceStatus.AreaNo;

            this.ImageIcon = wDMSDeviceStatus.ImageIcon;

            this.Status = wDMSDeviceStatus.Status;
            this.StatusTime = wDMSDeviceStatus.StatusTime;
            this.StatusHistory = wDMSDeviceStatus.StatusHistory;
            this.Duration = wDMSDeviceStatus.Duration;

        }

    }


    public class DMSDeviceStatistics
    {
        /// <summary>
        /// 设备编码
        /// </summary>
        public String DeviceNo { get; set; } = "";

        public int DeviceID { get; set; } = 0;

        /// <summary>
        ///  设备名称
        /// </summary>
        public String DeviceName { get; set; } = "";

        /// <summary>
        /// 固定资产编码
        /// </summary>
        public String AssetNo { get; set; } = "";

        /// <summary>
        /// 设备型号ID
        /// </summary>
        public int ModelID { get; set; } = 0;
        /// <summary>
        /// 设备型号名称
        /// </summary>
        public String ModelName { get; set; } = "";
        /// <summary>
        /// 设备型号ID
        /// </summary>
        public String ModelNo { get; set; } = "";



        public String Remark { get; set; } = "";
        /// <summary>
        /// 开始时刻
        /// </summary>
        public DateTime StatStartDate { get; set; } = new DateTime(2000, 1, 1);

        /// <summary>
        /// 结束时刻
        /// </summary>
        public DateTime StatEndDate { get; set; } = new DateTime(2000, 1, 1);

        /// <summary>
        /// 统计类型
        /// </summary>
        public int StatType { get; set; } = 0;

        /// <summary>
        /// 统计信息
        /// </summary>
        public List<DMSDeviceStatisticsInfo> StatisticsInfoList { get; set; } = new List<DMSDeviceStatisticsInfo>();

    }


    public class DMSDeviceStatisticsInfo
    {
        /// <summary>
        /// 设备编码
        /// </summary>
        public String DeviceNo { get; set; } = "";


        public int DeviceID { get; set; } = 0;

        /// <summary>
        ///  设备名称
        /// </summary>
        public String DeviceName { get; set; } = "";

        /// <summary>
        /// 固定资产编码
        /// </summary>
        public String AssetNo { get; set; } = "";

        /// <summary>
        /// 设备型号ID
        /// </summary>
        public int ModelID { get; set; } = 0;
        /// <summary>
        /// 设备型号名称
        /// </summary>
        public String ModelName { get; set; } = "";
        /// <summary>
        /// 设备型号ID
        /// </summary>
        public String ModelNo { get; set; } = "";



        public String Remark { get; set; } = "";

        /// <summary>
        /// 开始时刻
        /// </summary>
        public DateTime StatStartDate { get; set; } = new DateTime(2000, 1, 1);

        /// <summary>
        /// 结束时刻
        /// </summary>
        public DateTime StatEndDate { get; set; } = new DateTime(2000, 1, 1);

        /// <summary>
        /// 统计周期日期
        /// </summary>

        public DateTime StatDate
        {
            get
            {
                return StatStartDate.Date;

            }
            set
            {
                return;
            }
        }


        public Dictionary<String, int> StatusTimesDic { get; set; } = new Dictionary<string, int>();

        public Dictionary<String, int> StatusDurationDic { get; set; } = new Dictionary<string, int>();

        /// <summary>
        /// 计划工作时长   工作日历的工作日*8小时
        /// </summary>
        public int PlanDuration { get; set; } = 0;

        /// <summary>
        /// 故障次数
        /// </summary>
        public int FailTimes
        {
            get
            {
                if (StatusTimesDic != null && StatusTimesDic.ContainsKey(((int)DMSDeviceStatusEnum.Alarm).ToString()))
                {
                    return StatusTimesDic[((int)DMSDeviceStatusEnum.Alarm).ToString()];
                }
                return 0;
            }
            set { }
        }


        /// <summary>
        /// 开机时长
        /// </summary>
        public int TurnOnDuration
        {
            get
            {
                if (StatusDurationDic != null && StatusDurationDic.ContainsKey(((int)DMSDeviceStatusEnum.TurnOn).ToString()))
                {
                    return StatusDurationDic[((int)DMSDeviceStatusEnum.TurnOn).ToString()];
                }
                return 0;

            }
            set { }
        }

        /// <summary>
        /// 故障时长
        /// </summary>
        public int AlarmDuration
        {
            get
            {
                if (StatusDurationDic != null && StatusDurationDic.ContainsKey(((int)DMSDeviceStatusEnum.Alarm).ToString()))
                {
                    return StatusDurationDic[((int)DMSDeviceStatusEnum.Alarm).ToString()];
                }
                return 0;

            }
            set { }
        }


        /// <summary>
        /// 有效率
        /// </summary>

        public double Efficiency
        {
            get
            {

                return TurnOnDuration * 1.0 / (PlanDuration <= 0 ? 1 : PlanDuration);
            }
            set { }
        }

        /// <summary>
        /// 平均无故障时间  = 无故障时间/故障次数 =（开机时间-故障时间）/故障次数
        /// </summary>
        public int MTTF
        {
            get
            {

                return (TurnOnDuration - AlarmDuration) / (FailTimes <= 0 ? 1 : FailTimes);

            }
            set { }
        }

        /// <summary>
        /// 平均故障间隔时间  = 开机时间/故障次数
        /// </summary>
        public int MTBF
        {
            get
            {
                return TurnOnDuration / (FailTimes <= 0 ? 1 : FailTimes);
            }
            set { }
        }
        /// <summary>
        /// 平均修复时间   =  故障时间/故障次数
        /// </summary>
        public int MTTR
        {
            get
            {
                return AlarmDuration / (FailTimes <= 0 ? 1 : FailTimes);
            }
            set { }
        }



    }
}
