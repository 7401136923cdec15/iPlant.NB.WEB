using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMS.Models
{
    public class QMSWorkpieceCheckResult
    {
        public QMSWorkpieceCheckResult() { }

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
        /// 检测参数1
        /// </summary>
        public double CheckParameter1 { get; set; } = 0;
        /// <summary>
        /// 检测参数2
        /// </summary>
        public double CheckParameter2 { get; set; } = 0;
        /// <summary>
        /// 检测参数3
        /// </summary>
        public double CheckParameter3 { get; set; } = 0;
        /// <summary>
        /// 检测参数4
        /// </summary>
        public double CheckParameter4 { get; set; } = 0;
        /// <summary>
        /// 检测参数5
        /// </summary>
        public double CheckParameter5 { get; set; } = 0;
        /// <summary>
        /// 检测参数6
        /// </summary>
        public double CheckParameter6 { get; set; } = 0;
        /// <summary>
        /// 检测参数7
        /// </summary>
        public double CheckParameter7 { get; set; } = 0;
        /// <summary>
        /// 检测参数8
        /// </summary>
        public double CheckParameter8 { get; set; } = 0;
        /// <summary>
        /// 检测参数9
        /// </summary>
        public double CheckParameter9 { get; set; } = 0;
        /// <summary>
        /// 检测参数10
        /// </summary>
        public double CheckParameter10 { get; set; } = 0;
        /// <summary>
        /// 检测参数11
        /// </summary>
        public double CheckParameter11 { get; set; } = 0;
        /// <summary>
        /// 检测参数12
        /// </summary>
        public double CheckParameter12 { get; set; } = 0;
        /// <summary>
        /// 检测参数13
        /// </summary>
        public double CheckParameter13 { get; set; } = 0;
        /// <summary>
        /// 检测参数14
        /// </summary>
        public double CheckParameter14 { get; set; } = 0;
        /// <summary>
        /// 检测参数15
        /// </summary>
        public double CheckParameter15 { get; set; } = 0;
        /// <summary>
        /// 检测时间
        /// </summary>
        public DateTime CreateTime { get; set; } = DateTime.Now;
        /// <summary>
        /// 检测结果
        /// </summary>
        public String CheckResult { get; set; } = "";
    }
}
