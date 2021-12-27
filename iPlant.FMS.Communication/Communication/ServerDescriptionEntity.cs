using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace iPlant.FMS.Communication
{
    [Table("mds_serverdescription")]
    public class ServerDescriptionEntity
    {
        /// <summary>
        /// 服务器唯一ID
        /// </summary> 
        public Guid ID { get; set; }


        /// <summary>
        /// Opc Client 客户端名称，如果采用配置，会被Configuration 里的客户端名称覆盖
        /// </summary>
        
        public string ClientName { get; set; } = "MyClient";

        /// <summary>
        /// OpcServer 的地址
        /// </summary>
        
        public string ServerUrl { get; set; }

        /// <summary>
        /// 是否使用配置文件初始化链接
        /// </summary>
        
        public bool Configured { get; set; } = false;

        /// <summary>
        /// ConfigurationSectionName 是文件名还是绝对文件路径
        /// </summary>
        
        public bool IsFilePath { get; set; } = false;


        /// <summary>
        /// 配置文件的名称，例如"Opc.Ua.SampleClient"
        /// </summary>
        
        public string ConfigurationSectionName { get; set; } = "Opc.Ua.SampleClient";

        /// <summary>
        /// 是否匿名连接
        /// </summary>
        
        public bool IsAnonymous { get; set; }

        /// <summary>
        /// 用户名
        /// </summary>
        
        public string UserName { get; set; }

        /// <summary>
        /// 密码
        /// </summary>
        
        public string Password { get; set; }

        /// <summary>
        /// 数据安全策略 
        /// 0= select best endpointUrl
        /// 1="http://opcfoundation.org/UA/SecurityPolicy#None"
        /// 2="http://opcfoundation.org/UA/SecurityPolicy#Basic128Rsa15"
        /// 3="http://opcfoundation.org/UA/SecurityPolicy#Basic256"
        /// 4="http://opcfoundation.org/UA/SecurityPolicy#Basic256Sha256"
        /// </summary>
        
        public int SecerityPolic { get; set; }

        /// <summary>
        /// 忽略服务器 server nonce 验证，828D 无法连接时，建议置 TRUE
        /// </summary>
        
        public bool IgnoreVaildServerNonce { get; set; }

        /// <summary>
        /// OPC 服务器名称
        /// </summary>
        
        public string ServerName { get; set; }

        /// <summary>
        /// 服务器类型  1 OPC  2 Tcp  3 Fanuc
        /// </summary>
        public int ServerType { get; set; } = 1;


        /// <summary>
        /// 服务器状态,true=connected
        /// </summary>
        [NotMapped]
        public bool IsConnected { get; set; }

        /// <summary>
        /// 服务器状态发生变更时刻
        /// </summary>
        [NotMapped]
        public DateTime UpdateTime { get; set; }

        /// <summary>
        /// 服务器字段描述
        /// </summary>
        [NotMapped]
        public string StatusString { get; set; }
    }


    [Table("mds_opcDataSource")]
    public class OpcDataSourceEntity
    {
        /// <summary>
        /// 数据源唯一ID
        /// </summary>
        [Key]
        
        public Guid ID { get; set; }

        /// <summary>
        /// 服务器ID
        /// </summary>
        [Required]
        public Guid ServerId { get; set; }

        /// <summary>
        /// 数据源IP
        /// </summary>
        [Required]
        public string SourceIp { get; set; }

        /// <summary>
        /// 数据源端口
        /// </summary>
        [Required]
        public int SourcePort { get; set; }

        /// <summary>
        /// 数据源地址
        /// </summary>
        [Required]
        public string SourceAddress { get; set; }

        /// <summary>
        /// 数据类型
        /// </summary>
        [Required]
        public int DataTypeCode { get; set; }

        /// <summary>
        /// 数据分类
        /// </summary>
        [Required]
        public int DataCatalog { get; set; }

        /// <summary>
        /// 数据标签
        /// </summary>
        [Required]
        public int DataIndex { get; set; }

        /// <summary>
        /// 数据名称
        /// </summary>
        [Required]
        public string DataName { get; set; }

        /// <summary>
        /// 参数所属设备
        /// </summary>
        [Required]
        public string DeviceCode { get; set; }

        /// <summary>
        /// 数据通道
        /// </summary>
        [Required]
        public string DataChannel { get; set; }

        /// <summary>
        /// 数据读写操作 0=不使用，1=ReadOnly; 2=WriteOnly; 3=ReadWrite; 4=Subscription
        /// </summary>
        [Required]
        public int DataAction { get; set; }

        /// <summary>
        /// 数据更新时间(ms)
        /// </summary>
        public int InternalTime { get; set; }

        /// <summary>
        /// 说明
        /// </summary>
        public string Description { get; set; }
    }

}
