using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Text;

namespace iPlant.FMS.Models
{
    [DataContract]
    public class BMSDepartment
    { 
        public int ID { get; set; } = 0;
        [DataMember]
        public String Name { get; set; } = "";
        [DataMember]
        public String Code { get; set; } = "";
        [DataMember]
        public int Active { get; set; } = 0;
       
        public int ParentID { get; set; } = 0;
        [DataMember]
        public String ParentName { get; set; } = "";
        [DataMember]
        public String ParentCode { get; set; } = "";
        public int CreatorID { get; set; } = 0;

        public String Creator { get; set; } = "";

        public int EditorID { get; set; } = 0;

        public String Editor { get; set; } = "";
        [DataMember]
        public int Type { get; set; } = 0;


        public List<int> ManagerIDList { get; set; } = new List<int>();

        public string ManagerName { get; set; } = "";

        public int EmployeeCount { get; set; } = 0;

        public DateTime EditTime { get; set; } = DateTime.Now;
        public DateTime CreateTime { get; set; } = DateTime.Now;

        [DataMember]
        public String Remark { get; set; } = "";

        public List<BMSDepartment> SonList { get; set; } = new List<BMSDepartment>();




    }
}
