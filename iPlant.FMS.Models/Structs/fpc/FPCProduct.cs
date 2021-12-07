using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMS.Models
{
    public class FPCProduct
    {

        public FPCProduct() { }

		public int ID { get; set; } = 0;

		/// <summary>
		/// 产品编码
		/// </summary>
		public String ProductNo { get; set; } = "";

		/// <summary>
		/// 产品名称
		/// </summary>
		public String ProductName { get; set; } = "";
	}
}
