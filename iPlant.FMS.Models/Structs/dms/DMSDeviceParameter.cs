using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models
{
    /// <summary>
    /// 设备型号
    /// </summary> 
    public class DMSDeviceParameter
    {
        public int ID { get; set; } = 0;

        /// <summary>
        /// 参数代码
        /// </summary>
        public String Code { get; set; } = "";

        /// <summary>
        ///  参数名称   同设备 同数据分类下Name唯一
        /// </summary>
        public String Name { get; set; } = "";

        /// <summary>
        /// 变量名称
        /// </summary>
        public String VariableName { get; set; } = "";
        /// <summary>
        /// 设备ID
        /// </summary>
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
        /// 通讯协议
        /// </summary>
        public String Protocol { get; set; } = "";

        /// <summary>
        /// Kepserver 名称
        /// </summary>
        public String OPCClass { get; set; } = "";
        /// <summary>
        /// 数据类型
        /// </summary>
        public int DataType { get; set; } = 0;
        /// <summary>
        /// 数据类型文本
        /// </summary>
        public String DataTypeText { get; set; } = "";
        /// <summary>
        /// 数据分类
        /// </summary>
        public int DataClass { get; set; } = 0;
        /// <summary>
        /// 数据分类文本
        /// </summary>
        public String DataClassText { get; set; } = "";
        /// <summary>
        /// 数据长度 0不显示
        /// </summary>
        public int DataLength { get; set; } = 0;
        /// <summary>
        /// 字符主键
        /// </summary>
        public String KeyChar { get; set; } = "";

        /// <summary>
        /// 字符辅键
        /// </summary>
        public String AuxiliaryChar { get; set; } = "";
        /// <summary>
        /// 备注
        /// </summary>
        public String ParameterDesc { get; set; } = "";
        /// <summary>
        /// 录入人
        /// </summary>
        public int CreatorID { get; set; } = 0;

        public String CreatorName { get; set; } = "";
        /// <summary>
        /// 录入时刻
        /// </summary>
        public DateTime CreateTime { get; set; } = DateTime.Now;

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
        /// <summary>
        /// 分析顺序
        /// </summary>
        public int AnalysisOrder { get; set; } = 0;
    }
}
