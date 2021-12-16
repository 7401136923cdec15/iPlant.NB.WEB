using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMS.Models
{
    public class QMSOneTimePassRate
    {
        public QMSOneTimePassRate() { }

        /// <summary>
        /// 产品编号
        /// </summary>
        public String ProductNo { get; set; } = "";
        /// <summary>
        /// 产品名称
        /// </summary>
        public String ProductName { get; set; } = "";
        /// <summary>
        /// 日期
        /// </summary>
        public String StrDate { get; set; } = "";
        /// <summary>
        /// 一次性合格数
        /// </summary>
        public int OneTimePassNum { get; set; } = 0;
        /// <summary>
        /// 上料总数
        /// </summary>
        public int FeedingNum { get; set; } = 0;
        /// <summary>
        /// 成品数量
        /// </summary>
        public int Num { get; set; } = 0;
        /// <summary>
        /// 不合格数量
        /// </summary>
        public int NGNum { get; set; } = 0;
        /// <summary>
        /// 合格数量
        /// </summary>
        public int OKNum { get; set; } = 0;
        /// <summary>
        /// 一次性合格率
        /// </summary>
        public double OneTimePassRate { get; set; } = 0;
        /// <summary>
        /// 合格率
        /// </summary>
        public double PassRate { get; set; } = 0;
    }
}
