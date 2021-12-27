using System.Collections.Generic;

namespace iPlant.FMS.Communication
{
    public class LinePLCDevice : BasicDevice
    {
        public LinePLCDevice(DeviceEntity deviceEntity,
            CommunicationServerManager wCommunicationServerManager, List<OpcDataSourceEntity> wOPCDataSourceEntities) : base(deviceEntity,
                wCommunicationServerManager, wOPCDataSourceEntities)
        {

        }


        ///位置
        ///料框


    }


}
