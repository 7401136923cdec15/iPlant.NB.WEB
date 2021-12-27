using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace iPlant.FMS.Communication
{
    public class InitHelper
    {
        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(InitHelper));
        #region 单实例
        private static InitHelper _Instance;
        public static InitHelper Instance
        {
            get
            {
                return _Instance;
            }
        }
        static InitHelper()
        {
            _Instance = new InitHelper();
        }
        private InitHelper()
        {

        }
        #endregion

        public Dictionary<String, BasicDevice> mBasicDeviceDic = new Dictionary<string, BasicDevice>();
        public Dictionary<Guid, ServerDescriptionEntity> mServerDescriptionEntityDic = new Dictionary<Guid, ServerDescriptionEntity>();
        public CommunicationServerManager mCommunicationServerManager;

        public async Task Init()
        {
            //加载采集服务配置
            List<ServerDescriptionEntity> wServerDescriptionEntityList = new List<ServerDescriptionEntity>();


            //初始化服务管理器
            mCommunicationServerManager = new CommunicationServerManager(wServerDescriptionEntityList);

            try
            {
                //连接到相关opc服务器
                await mCommunicationServerManager.ConnectToServers();

            }
            catch (Exception ex)
            {
                logger.Error("ConnectToServers error {0}", ex);
            }

            //加载设备配置
            List<DeviceEntity> wDeviceEntityList = new List<DeviceEntity>();

            //加载所有设备参数配置
            List<OpcDataSourceEntity> wOPCDataSourceEntities = new List<OpcDataSourceEntity>();

            Dictionary<String, List<OpcDataSourceEntity>> wOPCDataSourceEntityDic = wOPCDataSourceEntities.GroupBy(p => p.DeviceCode).ToDictionary(p => p.Key, p => p.ToList());

            //创建所有设备实例
            CreateDevices(wDeviceEntityList, wOPCDataSourceEntityDic);
            //


            //从设备参数配置中加载设备报警、设备状态、设备实时参数、设备能源参数、 
            //从设备参数配置中获取每个设备的作业参数 并对作业参数设定获取变量与写入变量
            //从设备参数配置中获取每个设备的订单参数 并对订单设定获取变量与写入变量  （可定义某个变量是全部写入） 机床的订单写入可以在上料完成信号后
            //
        }

        /// <summary>
        /// 创建产线中的所有设备，不单单是OPC设备
        /// </summary>
        /// <returns></returns>
        private void CreateDevices(List<DeviceEntity> wDeviceEntityList, Dictionary<String, List<OpcDataSourceEntity>> wOPCDataSourceEntityDic)
        {


            foreach (DeviceEntity wDeviceEntity in wDeviceEntityList)
            {
                //获取该设备opc 数据地址
                List<OpcDataSourceEntity> opcDataSourceEntities;
                wOPCDataSourceEntityDic.TryGetValue(wDeviceEntity.Code, out opcDataSourceEntities);
                BasicDevice wDevice = null;
                try
                {
                    switch (wDeviceEntity.ModelID)
                    {

                        default:
                            wDevice = new BasicDevice(wDeviceEntity, mCommunicationServerManager, opcDataSourceEntities);
                            wDevice.PropertyChanged += MonitorPropertyChanged;
                            wDevice.InitalDevice();
                            mBasicDeviceDic.Add(wDeviceEntity.Code, wDevice);
                            break;
                    }
                }
                catch (Exception ex)
                {
                     
                    logger.Error("CreateDevice "+ wDeviceEntity.Name + " error {0}", ex);
                }
                finally
                {
                    logger.InfoFormat("CreateDevice {0}" , wDeviceEntity.Name);
                }
            }
        }


        #region 各个设备抛出来的值处理
        public void MonitorPropertyChanged(object sender, DeviceValueChangedEventArgs e)
        {
            
        }
        #endregion



    }
}
