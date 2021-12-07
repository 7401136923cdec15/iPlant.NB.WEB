using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.IO;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models.Entity
{
    [Table("tb_device")]
    public class DeviceEntity 
    {
        /// <summary>
        /// 记录主键
        /// </summary>
        [Key]
        [Column("DeviceId")]
        public Guid ID { get; set; }

        /// <summary>
        /// 设备编码
        /// </summary>
        [Required]
        public string DeviceCode { get; set; }

        /// <summary>
        /// 设备名称
        /// </summary>
        public string DeviceName { get; set; }

        /// <summary>
        /// 设备类型
        /// </summary>
        public int DeviceTypeCode { get; set; }

        /// <summary>
        /// 设备类型名称
        /// </summary>
        public string DeviceTypeName { get; set; }

        /// <summary>
        /// 采购时间
        /// </summary>
        public DateTimeOffset PurchaseDate { get; set; }

        /// <summary>
        /// 投产时间
        /// </summary>
        public DateTimeOffset MoveInDate { get; set; }

        /// <summary>
        /// 产线主键
        /// </summary>
        public Guid LineId { get; set; }

        /// <summary>
        /// 产线名称
        /// </summary>
        public string LineName { get; set; }

        /// <summary>
        /// 工位编号
        /// </summary>
        public string StationId { get; set; }

        /// <summary>
        /// 工位名称
        /// </summary>
        public string StationName { get; set; }
    }
}