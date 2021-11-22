using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models
{
    public enum DMSEnergyTypes : int
    {
        [Description("默认")]
        Default = 0, 
        [Description("电")]
        Electric = 1,
        [Description("气")]
        Gas = 2,
        [Description("水")]
        Water = 3,
        [Description("油")]
        Oil = 4 
    }

    public enum DMSStatTypes : int
    {
        [Description("默认")]
        Default = 0,
        [Description("日")]
        Day = 1,
        [Description("周")]
        Week = 2,
        [Description("月")]
        Month = 3,
        [Description("季")]
        Quarter = 4,
        [Description("年")]
        Year = 5,
    }
}
