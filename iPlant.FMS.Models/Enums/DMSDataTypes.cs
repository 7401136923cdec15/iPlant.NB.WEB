using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models
{
    public enum DMSDataTypes : int
    {
        [Description("默认")]
        Default = 0, 
        [Description("bool")]
        Bool = 1,
        [Description("int")]
        Int = 2,
        [Description("string")]
        String = 3,
        [Description("float")]
        Float = 4,
        [Description("double")]
        Double = 5
    }

    public enum DMSDataClass : int
    {
        [Description("默认")]
        Default = 0,
        [Description("状态")]
        Status = 1,
        [Description("报警")]
        Alarm = 2,
        [Description("设备参数")]
        Params = 3,
        [Description("作业参数")]
        WorkParams = 4,
        [Description("能源参数")]
        PowerParams = 5,
    }
}
