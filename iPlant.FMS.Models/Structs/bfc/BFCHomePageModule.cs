using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models
{
    public class BFCHomePageModule
    {
        public int ID { get; set; }

        public String Name { get; set; }

        public int GroupID { get; set; }

        public int MessageCount { get; set; }

        public int EventModule { get; set; }

        public String Icon { get; set; }

        public String IconColor { get; set; } = "";

        public String Icon_S { get; set; } = "";

        public String Url { get; set; }

        public int Type { get; set; }

        public int Grad { get; set; } = 0;

        /**
         *  权限ID  为0不做权限控制   
         */
        public int RoleID { get; set; } = 0;

        public int Active { get; set; }=0;

        public DateTime CreateTime { get; set; }=DateTime.Now;

        public DateTime EditTime { get; set; } = DateTime.Now;

        public int CreatorID { get; set; }

        public int EditorID { get; set; }

        public int IsDefault { get; set; }

        public String SecretKey { get; set; }="";

        public int OrderNum { get; set; }

    }
}
