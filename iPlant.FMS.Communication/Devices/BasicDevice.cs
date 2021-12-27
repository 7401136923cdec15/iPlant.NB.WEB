using iPlant.Common.Tools;
using Opc.Ua;
using Opc.Ua.Client;
using ShrisCommunicationCore.OpcUa;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMS.Communication
{

    public class BasicDevice
    {

        protected readonly CommunicationServerManager mCommunicationServerManager;

        protected readonly Dictionary<Guid, SimpleOpcUaClient> mSimpleOpcUaClientDic = new Dictionary<Guid, SimpleOpcUaClient>();

        protected readonly List<OpcDataSourceEntity> mOPCDataSourceEntities;


        protected List<OpcDataSourceEntity> GetOpcDataSourceEntities(int wDatalo)
        {
            return mOPCDataSourceEntities.FindAll(p => p.DataCatalog == wDatalo).ToList();
        }


        public BasicDevice(DeviceEntity deviceEntity, CommunicationServerManager wCommunicationServerManager, List<OpcDataSourceEntity> wOPCDataSourceEntities)
        {
            mOPCDataSourceEntities = wOPCDataSourceEntities;
            DeviceEntity = deviceEntity ?? throw new ArgumentNullException(nameof(deviceEntity));
            mCommunicationServerManager = wCommunicationServerManager ?? throw new ArgumentNullException(nameof(wCommunicationServerManager));

            var wServerIDs = wOPCDataSourceEntities.Select(p => p.ServerId).Distinct().ToList();
            foreach (var item in wServerIDs)
            {
                mSimpleOpcUaClientDic.Add(item, wCommunicationServerManager.GetOpcClient(item));
            }


        }

        public DeviceEntity DeviceEntity { get; }

        public event EventHandler<DeviceValueChangedEventArgs> PropertyChanged;

        protected void OnPropertyChanged(string propertyName, object previewValue, object currentValue)
        {
            PropertyChanged?.Invoke(this, new DeviceValueChangedEventArgs(DeviceEntity, propertyName, previewValue, currentValue));
        }

        public bool SetParameter<T>(string properName, T value)
        {
            bool result = false;
            PropertyInfo property = GetType().GetProperty(properName);
            if (property != null)
            {
                try
                {
                    property.SetValue(this, value, null);
                    result = true;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }

            return result;
        }

        public object GetParameter(string properName)
        {
            PropertyInfo property = GetType().GetProperty(properName);

            return property.GetValue(this, null);
        }

        public string GetDeviceCode()
        {
            return DeviceEntity.Code;
        }

        public string GetDeviceName()
        {
            return DeviceEntity.Name;
        }

        public int GetDeviceTypeCode()
        {
            return DeviceEntity.ModelID;
        }
        public virtual void InitalDevice()
        {
            InitalDeviceDefault();
        }

        protected void InitalDeviceDefault()
        {
            if (mOPCDataSourceEntities == null || mOPCDataSourceEntities.Count() <= 0)
                return;

            //创建opc 订阅  就分成一个通道，数据收集由LineManager完成


            //状态通道  程序号；状态  模式
            var subscriptionStatus = mOPCDataSourceEntities.Where(i => i.DataAction == 4);
            //找出订阅数据的服务器列表 

            if (mSimpleOpcUaClientDic != null)
            {
                mCommunicationServerManager.CreateOpcSubscription(subscriptionStatus, DataHandlerStatus);
            }
        }


        protected virtual void DataHandlerStatus(MonitoredItem monitoredItem, MonitoredItemNotificationEventArgs e)
        {

            MonitoredItemNotification notification = e.NotificationValue as MonitoredItemNotification;
            if (notification != null)
            {
                Guid dataId = Guid.NewGuid();
                bool isId = Guid.TryParse(monitoredItem.DisplayName, out dataId);
                if (isId && (!dataId.IsGuidNullOrEmpty()))
                {
                    var dataSource = mOPCDataSourceEntities.Where(i => i.ID == dataId).First();
                    DataHandlerStatusDefault(dataSource, notification);
                }
            }
        }
        protected void DataHandlerStatusDefault(OpcDataSourceEntity dataSource, MonitoredItemNotification notification)
        {
            if (notification.Value.Value != null)
            {
            }



            switch (dataSource.DataName)
            {
                //什么变量有触发效果
                default:

                    break;



            }

        }

        /// <summary>
        /// 设备报警保存
        /// </summary>
        /// <returns></returns>
        public async Task DeviceAlarms(OpcDataSourceEntity dataSource, object wValue)
        {

            //判断报警的数据类型 如果是bit/bool  则是普通报警  获取参数ID对应的解释  0关闭 1开启
            //如果是字符串或者是int 则是报警号报警  报警号报警使用配置解释含义或直接读取含义 并解除之前使用报警号的报警

        }

        /// <summary>
        /// 设备状态保存
        /// </summary>
        /// <returns></returns>
        public async Task DeviceStatus(OpcDataSourceEntity dataSource, object wValue)
        {
        }
        /// <summary>
        /// 设备参数保存
        /// </summary>
        /// <returns></returns>
        public async Task DeviceParameters(OpcDataSourceEntity dataSource, object wValue)
        {
        }

        /// <summary>
        /// 生成过程数据并保存
        /// </summary>
        /// <returns></returns>
        public async Task ProcessData()
        {

            //如何单独获取大批变量的值

        }

    }


    public class DeviceValueChangedEventArgs : EventArgs
    {
        public DeviceEntity DeviceEntity { get; }
        public string PropertyName { get; }
        public object PreviewValue { get; }
        public object CurrentValue { get; }
        public DeviceValueChangedEventArgs(DeviceEntity deviceEntity, string propertyName, object preValue, object currentValue)
        {
            DeviceEntity = deviceEntity;
            PropertyName = propertyName;
            PreviewValue = preValue;
            CurrentValue = currentValue;
        }
    }




}
