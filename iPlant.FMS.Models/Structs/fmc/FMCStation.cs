using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace iPlant.FMS.Models
{
    [DataContract]
    public class FMCStation
    {
        public FMCStation()
        {
        }

        public int ID { get; set; } = 0; // 1--8;
        /// <summary>
        /// 名称
        /// </summary>
        [DataMember]
        public String Name { get; set; } = "";
        [DataMember]
        public String Code { get; set; } = "";

        /// <summary>
        /// 版本   不用
        /// </summary>
        public String Version { get; set; } = "";

        public DateTime CreateTime { get; set; } = DateTime.Now;

        public int CreatorID { get; set; } = 0;

        public DateTime EditTime { get; set; } = DateTime.Now;

        public int EditorID { get; set; } = 0;

        /// <summary>
        /// 产线  不用
        /// </summary>
        public int LineID { get; set; } = 0;
        /// <summary>
        /// 区域  需要选择
        /// </summary>
        
        public int AreaID { get; set; } = 0;
        [DataMember]
        public String AreaCode { get; set; } = "";
        [DataMember]
        public String AreaName { get; set; } = "";

        /// <summary>
        /// 车间 不管
        /// </summary>
        public int WorkShopID { get; set; } = 0;

        /// <summary>
        /// 工位资源组   不管
        /// </summary>
        [DataMember]
        public List<FMCResource> ResourceList { get; set; } = new List<FMCResource>();

        /**
         * 资质证书   不管
         */
        public List<String> CERT { get; set; } = new List<String>();

        /**
         * 所需环境    不管
         */
        public List<String> ENVIR { get; set; } = new List<String>();

        /**
         * 检测方法  不管
         */
        public List<String> TestMethod { get; set; } = new List<String>();

        /// <summary>
        ///  基地  不管
        /// </summary>
        public String Factory { get; set; } = "";

        public String BusinessUnit { get; set; } = "";

        public String WorkShop { get; set; } = "";

        public String Line { get; set; } = "";

        public String Creator { get; set; } = "";

        public String Editor { get; set; } = "";
        [DataMember]
        public int Active { get; set; } = 0; // 状态
        [DataMember]
        public String Remark { get; set; } = "";
        [DataMember]
        public String WorkName { get; set; } = "";
        /**
         * 遏制工位1 正常工位0
         */
        public int IPTModuleID { get; set; } = 0; // 工位点检模板ID

        /**
         * 是否计算
         */
        public int IsCalcPD { get; set; } = 0;

    }
}
