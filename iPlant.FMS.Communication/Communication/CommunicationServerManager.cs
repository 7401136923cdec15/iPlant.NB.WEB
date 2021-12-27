using Opc.Ua;
using Opc.Ua.Client;
using ShrisCommunicationCore.OpcUa;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMS.Communication
{
    /// <summary>
    /// 采集服务管理器
    /// </summary>
    public class CommunicationServerManager
    {

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(CommunicationServerManager));

        /// <summary>
        /// 服务器列表
        /// </summary>
        private readonly List<ServerDescriptionEntity> mServerDescriptionEntities;

        /// <summary>
        /// key=serverName
        /// </summary>
        private Dictionary<Guid, SimpleOpcUaClient> simpleOpcUaClients = new Dictionary<Guid, SimpleOpcUaClient>();


        public CommunicationServerManager(List<ServerDescriptionEntity> wServerDescriptionEntities)
        {
            mServerDescriptionEntities = wServerDescriptionEntities;

            CreateOpcClients();
        }

        /// <summary>
        /// 创建传入的连接对象
        /// </summary>
        private void CreateOpcClients()
        {
            //创建 opc 客户端
            foreach (ServerDescriptionEntity wServerDescriptionEntity in mServerDescriptionEntities)
            {
                if (wServerDescriptionEntity.ServerType == 1)
                {

                    OpcUaServerDescription opcUaServerDescription = new OpcUaServerDescription();
                    opcUaServerDescription.ServerId = wServerDescriptionEntity.ID;
                    opcUaServerDescription.ClientName = wServerDescriptionEntity.ClientName;
                    opcUaServerDescription.ServerUrl = wServerDescriptionEntity.ServerUrl;
                    opcUaServerDescription.Configured = wServerDescriptionEntity.Configured;
                    opcUaServerDescription.IsFilePath = wServerDescriptionEntity.IsFilePath;
                    opcUaServerDescription.ConfigurationSectionName = wServerDescriptionEntity.ConfigurationSectionName;
                    opcUaServerDescription.IsAnonymous = wServerDescriptionEntity.IsAnonymous;
                    opcUaServerDescription.UserName = wServerDescriptionEntity.UserName;
                    opcUaServerDescription.Password = wServerDescriptionEntity.Password;
                    opcUaServerDescription.SecerityPolic = wServerDescriptionEntity.SecerityPolic;
                    opcUaServerDescription.IgnoreVaildServerNonce = wServerDescriptionEntity.IgnoreVaildServerNonce;
                    opcUaServerDescription.ServerName = wServerDescriptionEntity.ServerName;

                    SimpleOpcUaClient sim = null;
                    try
                    {
                        logger.Info("SimpleOpcUaClient-Test");
                        sim = new SimpleOpcUaClient(opcUaServerDescription);

                    }
                    catch (Exception ex)
                    {
                        Exception ee = new Exception(ex.Message + "  创建客户端失败： " + opcUaServerDescription.ServerName + " || " + opcUaServerDescription.ServerId.ToString());
                        throw ee;
                    }
                    try
                    {
                        simpleOpcUaClients.Add(opcUaServerDescription.ServerId, sim);
                    }
                    catch (Exception ex)
                    {
                        Exception ee = new Exception(ex.Message + "  添加客户端失败 ");
                        throw ee;
                    }
                }




                wServerDescriptionEntity.IsConnected = false;
                wServerDescriptionEntity.StatusString = "Disconnected";
                wServerDescriptionEntity.UpdateTime = DateTime.Now;

            }


            //创建其它连接 to do 

        }

        /// <summary>
        /// 创建OPC 客户端连接
        /// </summary>
        /// <returns></returns>
        public async Task ConnectToServers()
        {
            //创建OPC 客户端
            if (simpleOpcUaClients.Count > 0)
            {
                foreach (var sc in simpleOpcUaClients)
                {
                    try
                    {
                        await sc.Value.Connect();
                        sc.Value.OpcStatusChange += Value_OpcStatusChange;
                    }
                    catch (Exception ex)
                    {
                        logger.Error(sc.Value.ServerName + " : " + ex.Message);
                        //simpleOpcUaClients.Remove(sc.Key);
                    }
                }
            }

            //创建其他连接 to do 

        }

        private void Value_OpcStatusChange(object sender, OpcUaStatusEventArgs e)
        {
            //SimpleOpcUaClient
            var opcClient = sender as SimpleOpcUaClient;
            var statusDto = mServerDescriptionEntities.Where(i => i.ID == opcClient.ServerId).First();
            if (statusDto != null)
            {
                statusDto.IsConnected = e.IsConnected;
                statusDto.StatusString = e.Text;
                statusDto.UpdateTime = e.Time;
            }


        }


        /// <summary>
        /// 为传入的opcData 地址，选择对应的OPC 服务器，并在对应服务器上创建其DeviceId 的订阅
        /// </summary>
        /// <param name="opcDataSourceEntities">OPC 数据地址，必须在同一个服务器上</param>
        /// <param name="monitoredItemNotificationEventHandler">该组数据对应的回调方法</param>
        /// <returns></returns>
        public bool CreateOpcSubscription(IEnumerable<OpcDataSourceEntity> opcDataSourceEntities, MonitoredItemNotificationEventHandler monitoredItemNotificationEventHandler, string subscriptionName = "default")
        {

            Boolean wResult = true;

            var wOpcDataSourceEntitiesDic = opcDataSourceEntities.GroupBy(p => p.ServerId).ToDictionary(p => p.Key, p => p.ToList());

            SimpleOpcUaClient simpleOpcUaClient = null;
            foreach (Guid wServerId in wOpcDataSourceEntitiesDic.Keys)
            {

                bool r = simpleOpcUaClients.TryGetValue(wServerId, out simpleOpcUaClient);
                if (r && simpleOpcUaClient != null && simpleOpcUaClient.IsConnected)
                {
                    List<string> tags = new List<string>();
                    List<string> itemNames = new List<string>();
                    int publishTime = 100;
                    foreach (var dataSource in wOpcDataSourceEntitiesDic[wServerId])
                    {
                        tags.Add(dataSource.SourceAddress);
                        itemNames.Add(dataSource.ID.ToString());
                        publishTime = dataSource.InternalTime;
                    }

                    if ("default".Equals(subscriptionName))
                    {
                        subscriptionName = wOpcDataSourceEntitiesDic[wServerId][0].DeviceCode;
                    }
                    try
                    {
                        simpleOpcUaClient.CreateSubscription(subscriptionName, publishTime, publishTime,
                            tags, itemNames, monitoredItemNotificationEventHandler);

                    }
                    catch (Exception ex)
                    {
                        wResult = false;
                        logger.Error(String.Format(" Server:{0} Device:{1}  error: ", wServerId, wOpcDataSourceEntitiesDic[wServerId][0].DeviceCode) + " {0}", ex);
                    }

                }
                else
                {
                    wResult = false;
                }
            }
            return wResult;
        }

        /// <summary>
        /// 获取连接到对应opc server 的client 连接
        /// </summary>
        /// <param name="serverId"></param>
        /// <returns></returns>
        public SimpleOpcUaClient GetOpcClient(Guid serverId)
        {
            SimpleOpcUaClient simpleOpcUaClient = null;
            bool r = simpleOpcUaClients.TryGetValue(serverId, out simpleOpcUaClient);
            if (r)
            {
                return simpleOpcUaClient;
            }
            else
            {
                return null;
            }

        }

        public SimpleOpcUaClient GetOpcClient(String serverId)
        {
            foreach (var item in simpleOpcUaClients.Keys)
            {
                if (item.ToString().Equals(serverId, StringComparison.CurrentCultureIgnoreCase))
                {
                    return simpleOpcUaClients[item];
                }
            }

            return null;
        }


        public bool WriteValue(Guid serverId, string tag, string value)
        {
            SimpleOpcUaClient client = null;
            bool s = simpleOpcUaClients.TryGetValue(serverId, out client);
            if (s)
            {
                return client.WriteNode(tag, value);
            }

            else
            {
                return false;
            }
        }

        public bool WriteValue<T>(Guid serverId, string tag, T value)
        {
            SimpleOpcUaClient client = null;
            bool s = simpleOpcUaClients.TryGetValue(serverId, out client);
            if (s)
            {
                return client.WriteNode(tag, value);
            }

            else
            {
                return false;
            }
        }

        public bool WriteValues(Guid serverId, List<string> tags, List<string> values)
        {
            SimpleOpcUaClient client = null;
            bool s = simpleOpcUaClients.TryGetValue(serverId, out client);
            if (s)
            {
                return client.WriteNodes(tags, values);
            }

            else
            {
                return false;
            }
        }


        public DataValue ReadValue(Guid serverId, string tag)
        {
            SimpleOpcUaClient client = null;
            bool s = simpleOpcUaClients.TryGetValue(serverId, out client);
            if (s)
            {
                return client.ReadNode(tag);
            }
            else
            {
                return null;
            }
        }

        public List<DataValue> ReadValues(Guid serverId, List<string> nodeIds)
        {
            SimpleOpcUaClient client = null;
            bool s = simpleOpcUaClients.TryGetValue(serverId, out client);
            if (s)
            {
                return client.ReadNodes(nodeIds);
            }

            else
            {
                return null;
            }
        }

    }
}
