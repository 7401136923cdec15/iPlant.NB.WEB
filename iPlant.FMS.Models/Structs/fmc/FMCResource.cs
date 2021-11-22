﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace iPlant.FMS.Models
{
    [DataContract]
    public class FMCResource
    {  
        public FMCResource()
        {
        }

        public int ID { get; set; } = 0; // 1--8;
        [DataMember]
        public String Name { get; set; } = "";
        [DataMember]
        public String Code { get; set; } = "";
         
        public int StationID { get; set; } = 0;

        [DataMember]
        public String StationName { get; set; } = "";
        [DataMember]
        public String StationCode { get; set; } = "";

        public DateTime CreateTime { get; set; } = DateTime.Now;

        public int CreatorID { get; set; } = 0;

        public DateTime EditTime { get; set; } = DateTime.Now;

        public int EditorID { get; set; } = 0;

        public int WorkShopID { get; set; } = 0;

        public int LineID { get; set; } = 0;

        public String WorkShopName { get; set; } = "";

        public String LineName { get; set; } = "";

        public String Creator { get; set; } = "";

        public String Editor { get; set; } = "";
        [DataMember]
        public int Active { get; set; } = 0; // 状态
        [DataMember]
        public int Type { get; set; } = 0;
        /**
         * 暂时指向 设备 工装 量具 备件等等 物料与BOM相关 工艺与BOP相关 人员与排班相关
         */
        [DataMember]
        public int ResourceID { get; set; } = 0;
    }
}
