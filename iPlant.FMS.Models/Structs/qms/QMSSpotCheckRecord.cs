using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMS.Models
{
    public class QMSSpotCheckRecord
    {
        public QMSSpotCheckRecord() { }

        public int ID { get; set; } = 0;

        public int WorkpieceID { get; set; } = 0;

        /// <summary>
        /// 订单号
        /// </summary>
        public String OrderNo { get; set; } = "";
        /// <summary>
        /// 产品编号
        /// </summary>
        public String ProductNo { get; set; } = "";
        /// <summary>
        /// 产品名称
        /// </summary>
        public String ProductName { get; set; } = "";
        /// <summary>
        /// 工件编码
        /// </summary>
        public String WorkpieceNo { get; set; } = "";
        /// <summary>
        /// 大径
        /// </summary>
        public double LargeDiameter { get; set; } = 0;
        /// <summary>
        /// 中径
        /// </summary>
        public double MiddleDiameter { get; set; } = 0;
        /// <summary>
        /// 小径
        /// </summary>
        public double SmallDiameter { get; set; } = 0;
        /// <summary>
        /// 螺距
        /// </summary>
        public double Pitch { get; set; } = 0;
        /// <summary>
        /// 抽检人ID
        /// </summary>
        public int CreatorID { get; set; } = 0;
        /// <summary>
        /// 抽检人名称
        /// </summary>
        public String Creator { get; set; } = "";
        /// <summary>
        /// 抽检时间
        /// </summary>
        public DateTime CreateTime { get; set; } = DateTime.Now;
        /// <summary>
        /// 抽检结果
        /// </summary>
        public String SpotCheckResult { get; set; } = "";
        /// <summary>
        /// 不合格原因
        /// </summary>
        public String NokReason { get; set; } = "";
    }
}
