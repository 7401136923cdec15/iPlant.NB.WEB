using iPlant.Common.Tools;
using iPlant.NB.WEB.Daos;
using iPlant.NB.WEB.Utils;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Threading;

namespace iPlant.NB.WEB
{
    public class Program
    {
        public static void Main(string[] args)
        {
            //new Thread(() => UpdateCapacity()).Start();

            CreateHostBuilder(args).Build().Run();
        }

        private static void UpdateCapacity()
        {
            try
            {
                Thread.Sleep(10000);
                while (true)
                {
                    List<SFCModuleRecord> wList = MysqlDAO.Instance.GetSFCModuleRecordList();
                    foreach (SFCModuleRecord wSFCModuleRecord in wList)
                    {
                        string wGear = MysqlDAO.Instance.GetGear(wSFCModuleRecord.ProductID, wSFCModuleRecord.Capacity);
                        if (string.IsNullOrWhiteSpace(wGear))
                            continue;
                        MysqlDAO.Instance.UpdateModuleRecord(wGear, wSFCModuleRecord.ID);

                        int wStandardID = MysqlDAO.Instance.GetStandardID(wSFCModuleRecord.ProductID, 7);
                        if (wStandardID <= 0)
                            continue;
                        //ÈÝÁ¿
                        MysqlDAO.Instance.DeleteItem_Number(wSFCModuleRecord.SerialNumber, wStandardID);
                        MysqlDAO.Instance.InsertItem(wSFCModuleRecord, wSFCModuleRecord.Capacity, wStandardID);
                        //ÄÚ×è
                        wStandardID = MysqlDAO.Instance.GetStandardID(wSFCModuleRecord.ProductID, 8);
                        if (wStandardID <= 0)
                            continue;
                        MysqlDAO.Instance.DeleteItem_Number(wSFCModuleRecord.SerialNumber, wStandardID);
                        MysqlDAO.Instance.InsertItem(wSFCModuleRecord, wSFCModuleRecord.InternalResistance, wStandardID);
                    }

                    Thread.Sleep(1000);
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();

                }).UseLog4Net(GlobalConstant.LogRepositoryName);
    }
}
