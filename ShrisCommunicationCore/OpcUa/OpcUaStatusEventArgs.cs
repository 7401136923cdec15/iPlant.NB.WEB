using System;
using System.Collections.Generic;
using System.Text;

namespace ShrisCommunicationCore.OpcUa
{
    public class OpcUaStatusEventArgs : EventArgs
    {
        public OpcUaStatusEventArgs(bool isConnected,DateTime time, string status, params object[] args)
        {
            IsConnected = isConnected;
            Text = string.Format(status, args);
            Time = time.ToLocalTime();
        }

        /// <summary>
        /// 是否异常
        /// </summary>
        public bool IsConnected { get; set; }
        /// <summary>
        /// 时间
        /// </summary>
        public DateTime Time { get; set; }
        /// <summary>
        /// 文本
        /// </summary>
        public string Text { get; set; }

        /// <summary>
        /// 转化为字符串
        /// </summary>
        /// <returns></returns>
        public override string ToString()
        {
            return IsConnected ? "[连接]" : "[断开]" + Time.ToString("  yyyy-MM-dd HH:mm:ss  ") + Text;
        }
    }
}
