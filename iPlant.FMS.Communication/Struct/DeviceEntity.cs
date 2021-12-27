using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMS.Communication
{

    
    public class DeviceEntity 
    {
         
        public int ID { get; set; }

        /// <summary>
        /// 设备编码
        /// </summary>
        public string Code { get; set; }

        /// <summary>
        /// 设备名称
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 设备类型
        /// </summary>
        public int ModelID { get; set; }
 
        /// <summary>
        /// 产线主键
        /// </summary>
        public int LineID { get; set; }
 

        /// <summary>
        /// 状态采集启用
        /// </summary>
        public bool StatusEnable { get; set; }
        /// <summary>
        /// 报警采集启用
        /// </summary>
        public bool AlarmEnable { get; set; }

        /// <summary>
        /// 参数采集启用
        /// </summary>
        public bool ParmaterEnable { get; set; }

        /// <summary>
        /// 工作参数采集启用
        /// </summary>
        public bool WorkParmaterEnable { get; set; }

        /// <summary>
        /// 刀具管理启用
        /// </summary>
        public bool ToolEnable { get; set; }

        /// <summary>
        /// 加工程序启用
        /// </summary>
        public bool NCEnable { get; set; }



    }

    public class DeviceAlarm
    {

    }

    public class DeviceParamters
    {

    }

    public class DeviceStatus
    {
    }

 
}
