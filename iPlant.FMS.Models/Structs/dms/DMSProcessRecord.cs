using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMS.Models
{
    [DataContract]
    public class DMSProcessRecord
    {
        public int ID { get; set; } = 0;

        public int DeviceID { get; set; } = 0;
        [DataMember]
        public String DeviceNo { get; set; } = "";
        [DataMember]
        public String DeviceName { get; set; } = "";
        /// <summary>
        /// 固定资产编码  采集编码
        /// </summary> 
        [DataMember]
        public String AssetNo { get; set; } = "";

        public int OrderID { get; set; } = 0;
        [DataMember]
        public String OrderNo { get; set; } = "";
        [DataMember]
        public String MetroNo { get; set; } = "";
        [DataMember]
        public String WorkPieceNo { get; set; } = "";

        [DataMember]
        public DateTime StartTime { get; set; } = new DateTime(2000, 1, 1);
        [DataMember]
        public DateTime EndTime { get; set; } = new DateTime(2000, 1, 1);

        [DataMember]
        public int Active { get; set; } = 0;
        [DataMember]
        public int Status { get; set; } = 0;

        public String StatusText { get; set; } = "";
        [DataMember]
        public String Remark { get; set; } = "";
        [DataMember]
        public List<DMSProcessRecordItem> ItemList { get; set; } = new List<DMSProcessRecordItem>();
    }
    [DataContract]
    public class DMSProcessRecordItem
    {
        public long ID { get; set; } = 0;

        public int RecordID { get; set; } = 0;
        public int DeviceID { get; set; } = 0;
        [DataMember]
        public String DeviceNo { get; set; } = "";
        [DataMember]
        public String AssetNo { get; set; } = "";
        public int ParameterID { get; set; } = 0;

        public int AnalysisOrder { get; set; } = 0;

        [DataMember]
        public String ParameterNo { get; set; } = "";
        [DataMember]
        public String ParameterName { get; set; } = "";
        [DataMember]
        public String ParameterDesc { get; set; } = "";
        [DataMember]
        public String ParameterValue { get; set; } = "";

        [DataMember]
        public int DataType { get; set; } = 0;
        [DataMember]
        public DateTime SampleTime { get; set; } = new DateTime(2000, 1, 1);

    }
}
