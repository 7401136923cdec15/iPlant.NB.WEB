using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMS.Models
{
    public class QMSWorkpieceQualityInfo
    {
        public QMSWorkpieceQualityInfo() { }

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
        /// 所在工位ID
        /// </summary>
        public int StationID { get; set; } = 0;
        /// <summary>
        /// 所在工位名称
        /// </summary>
        public String StationName { get; set; } = "";
        /// <summary>
        /// 车间抽检结果
        /// </summary>
        public String SpotCheckResult { get; set; } = "";
        /// <summary>
        /// 车间巡检结果
        /// </summary>
        public String PatrolCheckResult { get; set; } = "";
        /// <summary>
        /// 返修次数
        /// </summary>
        public int RepairCount { get; set; } = 0;
        /// <summary>
        /// 产线上料时间
        /// </summary>
        public DateTime FeedingTime { get; set; } = DateTime.Now;
        /// <summary>
        /// 产线下料时间
        /// </summary>
        public DateTime BlankingTime { get; set; } = DateTime.Now;
        /// <summary>
        /// 工件状态
        /// </summary>
        public int ProcessStatus { get; set; } = 0;
        /// <summary>
        /// 工件状态名称
        /// </summary>
        public String ProcessStatusName { get; set; } = "";
        /// <summary>
        /// 三坐标结果
        /// </summary>
        public String ThreeDimensionalResult { get; set; } = "";
    }
}
