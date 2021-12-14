using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMS.Models
{
    
    public class DMSProcessRecord
    {
        public int ID { get; set; } = 0;

        public int DeviceID { get; set; } = 0;
        
        public String DeviceNo { get; set; } = "";
        
        public String DeviceName { get; set; } = "";
        /// <summary>
        /// 固定资产编码  采集编码
        /// </summary> 
        
        public String AssetNo { get; set; } = "";

        public int OrderID { get; set; } = 0;
        
        public String OrderNo { get; set; } = "";
        
        public String MetroNo { get; set; } = "";
        
        public String WorkPieceNo { get; set; } = "";

        
        public DateTime StartTime { get; set; } = new DateTime(2000, 1, 1);
        
        public DateTime EndTime { get; set; } = new DateTime(2000, 1, 1);

        
        public int Active { get; set; } = 0;
        
        public int Status { get; set; } = 0;

        public String StatusText { get; set; } = "";
        
        public String Remark { get; set; } = "";
        
        public List<DMSProcessRecordItem> ItemList { get; set; } = new List<DMSProcessRecordItem>();
    }
    
    public class DMSProcessRecordItem
    {
        public long ID { get; set; } = 0;

        public int RecordID { get; set; } = 0;
        public int DeviceID { get; set; } = 0;
        
        public String DeviceNo { get; set; } = "";
        
        public String AssetNo { get; set; } = "";
        public int ParameterID { get; set; } = 0;

        public int AnalysisOrder { get; set; } = 0;

        
        public String ParameterNo { get; set; } = "";
        
        public String ParameterName { get; set; } = "";
        
        public String ParameterDesc { get; set; } = "";
        
        public String ParameterValue { get; set; } = "";

        
        public int DataType { get; set; } = 0;
        
        public DateTime SampleTime { get; set; } = new DateTime(2000, 1, 1);

    }
}
