using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.NB.WEB.Models
{
    public class BMSEmployee
    {
        public int ID { get; set; } = 0;
        public string LoginName { get; set; } = "";
    }

    public class MTSSingleResult
    {
        public string PackageNo { get; set; } = "";
        public string Status { get; set; } = "";
        public string StatusTime { get; set; } = "";
        public string OperatorName { get; set; } = "";
        public double ChannelAvgPositive { get; set; } = 0;
        public double ChannelAvgNegative { get; set; } = 0;


        public int DifferenceNumber { get; set; } = 0;
        public double MaxAvgVal { get; set; } = 0;


        public double MinAvgVal { get; set; } = 0;
        public double TotalVoltage { get; set; } = 0;

        public double[] NumArray { get; set; } = new double[0];
        public int NumArrayCount { get; set; } = 0;



    }
}
