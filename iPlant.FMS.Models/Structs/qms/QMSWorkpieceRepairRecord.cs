using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMS.Models
{
    public class QMSWorkpieceRepairRecord
    {
        public QMSWorkpieceRepairRecord() { }

        public int ID { get; set; } = 0;

        public int WorkpieceID { get; set; } = 0;

        public int StationID { get; set; } = 0;

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
        /// 工位编号
        /// </summary>
        public String StationNo { get; set; } = "";
        /// <summary>
        /// 工位名称
        /// </summary>
        public String StationName { get; set; } = "";
        /// <summary>
        /// 开始时间
        /// </summary>
        public DateTime RepairStartDate { get; set; } = DateTime.Now;
        /// <summary>
        /// 结束时间
        /// </summary>
        public DateTime RepairEndDate { get; set; } = DateTime.Now;
        /// <summary>
        /// 返修时长(H)
        /// </summary>
        public double RepairTimeCount { get; set; } = 0;
        /// <summary>
        /// 返修原因
        /// </summary>
        public String RepairReason { get; set; } = "";
    }
}
