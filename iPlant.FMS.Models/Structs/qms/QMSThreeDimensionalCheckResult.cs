using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMS.Models
{
    public class QMSThreeDimensionalCheckResult
    {
        public QMSThreeDimensionalCheckResult() { }

        public int ID { get; set; } = 0;

        public int WorkpieceID { get; set; } = 0;

        /// <summary>
        /// 检测参数
        /// </summary>
        public String CheckParameter { get; set; } = "";
        /// <summary>
        /// 理论值
        /// </summary>
        public Double TheoreticalValue { get; set; } = 0;
        /// <summary>
        /// 实际值
        /// </summary>
        public Double ActualValue { get; set; } = 0;
        /// <summary>
        /// 误差
        /// </summary>
        public Double ErrorValue { get; set; } = 0;
        /// <summary>
        /// 下公差
        /// </summary>
        public Double LowerTolerance { get; set; } = 0;
        /// <summary>
        /// 上公差
        /// </summary>
        public Double UpperTolerance { get; set; } = 0;
        /// <summary>
        /// 超差
        /// </summary>
        public Double OutOfTolerance { get; set; } = 0;

        /// <summary>
        /// 结果
        /// </summary>
        public String Result { get; set; } = "";
    }
}
