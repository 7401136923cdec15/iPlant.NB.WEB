using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models
{
    public class FPCPartPoint
    {


        public FPCPartPoint()
        {
        }

        public int ID { get; set; } = 0;

        public int WorkShopID { get; set; } = 0;

        public String WorkShopName = "";

        public int LineID { get; set; } = 0;

        public String LineName { get; set; } = "";

        public int PartID { get; set; } = 0;

        public String PartName { get; set; } = "";

        public String Name { get; set; } = "";

        public String Code { get; set; } = "";

        public String OperateContent { get; set; } = "";

        public DateTime CreateTime { get; set; } = DateTime.Now;

        public int CreatorID { get; set; } = 0;

        public DateTime EditTime { get; set; } = DateTime.Now;

        public int EditorID { get; set; } = 0; 
         

        /**
         * 工序类型 普通工序-1 预检工序-2 质量检查工序-3 普查工序-4
         */
        public int StepType { get; set; } = 0;

        /**
         * 质量工序类型 1 试运前 2试运后
         */
        public int QTType { get; set; } = 0;

        public int FactoryID { get; set; } = 0; // 工厂

        public int BusinessUnitID { get; set; } = 0; // 事业部

        public int ProductTypeID { get; set; } = 0; // 产品类型

        public String Factory { get; set; } = "";

        public String BusinessUnit { get; set; } = "";

        public String ProductType { get; set; } = "";

        public String Creator { get; set; } = "";
          
        public String Editor { get; set; } = "";
        public int Active { get; set; } = 0;
        public int ERPID { get; set; } = 0;
    }
}
