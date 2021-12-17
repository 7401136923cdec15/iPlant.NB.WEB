using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace iPlant.FMS.Models
{
    /// <summary>
    /// 刀具信息
    /// </summary> 

    public class DMSToolInfo
    {

        public int ID { get; set; } = 0;

        public int ToolIndex { get; set; } = 0;

        public int ToolHouseIndex { get; set; } = 0;


        public double ToolOffsetX { get; set; } = 0;
        public double ToolOffsetZ { get; set; } = 0;
        public double ToolOffsetR { get; set; } = 0;

        /// <summary>
        /// 当前位置
        /// </summary>
        public double ToolPositionX { get; set; } = 0;
        public double ToolPositionZ { get; set; } = 0;
        public double ToolPositionR { get; set; } = 0;

  
        public int DeviceID { get; set; } = 0;
        /// <summary>
        /// 设备编码
        /// </summary>
        
        public String DeviceNo { get; set; } = "";

        /// <summary>
        ///  设备名称
        /// </summary>
        
        public String DeviceName { get; set; } = "";


        /// <summary>
        /// 采集编号  
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
        

        public int FactoryID { get; set; } = 0;

        public String FactoryName { get; set; } = "";
        public String FactoryCode { get; set; } = "";

        /// <summary>
        /// 车间ID
        /// </summary>
        public int WorkShopID { get; set; } = 0;

        public String WorkShopName { get; set; } = "";
        public String WorkShopCode { get; set; } = "";
        /// <summary>
        /// 产线ID
        /// </summary>
        public int LineID { get; set; } = 0;

        public String LineName { get; set; } = "";
        public String LineCode { get; set; } = "";

        public int AreaID { get; set; } = 0;

        public String AreaNo { get; set; } = "";
        /// <summary>
        /// 位置信息
        /// </summary>
        public String PositionText { get; set; } = "";
        /// <summary>
        /// 刀具描述
        /// </summary>

        public String Description { get; set; } = "";

 
 
        /// <summary>
        /// 编辑人
        /// </summary>
        public int EditorID { get; set; } = 0;

        public String EditorName { get; set; } = "";
        /// <summary>
        /// 编辑时刻
        /// </summary>
        public DateTime EditTime { get; set; } = DateTime.Now;
 

        /// <summary>
        /// 是否激活： 1为激活 2为禁用
        /// </summary>
        
        public int Active { get; set; } = 0;
    }
}
