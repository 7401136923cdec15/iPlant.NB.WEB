﻿using iPlant.Common.Tools;
using iPlant.Data.EF;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.SCADA.Service
{


    public class BFCServiceImpl : BFCService
    {

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(BFCServiceImpl));
        private static BFCService _instance = new BFCServiceImpl();

        public static BFCService getInstance()
        {
            if (_instance == null)
                _instance = new BFCServiceImpl();

            return _instance;
        }


        public ServiceResult<List<BFCHomePageGroup>> BFC_GetHomePageGroupList(BMSEmployee wLoginUser, int wType, int wGrad)
        {
            ServiceResult<List<BFCHomePageGroup>> wResult = new ServiceResult<List<BFCHomePageGroup>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.setResult(BFCHomePageGroupDAO.getInstance().SelectAll(wLoginUser, wType, wGrad, wErrorCode));
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
            }
            catch (Exception e)
            {
                wResult.FaultCode += e.Message;
            }
            return wResult;
        }

 
        public ServiceResult<Int32> BFC_UpdateHomePageGroup(BMSEmployee wLoginUser, BFCHomePageGroup wBFCHomePageGroup)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>();

            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.setResult(BFCHomePageGroupDAO.getInstance().Update(wLoginUser,wBFCHomePageGroup, wErrorCode));
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
            }
            catch (Exception e)
            {
                wResult.FaultCode += e.Message;
            }
            return wResult;
        }

        public ServiceResult<List<BFCHomePageModule>> BFC_GetHomePageModuleList(BMSEmployee wLoginUser, int wType, int wGrad)
        {
            ServiceResult<List<BFCHomePageModule>> wResult = new ServiceResult<List<BFCHomePageModule>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.setResult(BFCHomePageModuleDAO.getInstance().SelectAll(wLoginUser,0, wType, wGrad, wErrorCode));
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
            }
            catch (Exception e)
            {
                wResult.FaultCode += e.Message;
            }
            return wResult;
        }


        public ServiceResult<BFCHomePageModule> BFC_GetHomePageModuleByID(BMSEmployee wLoginUser, int wID)
        {
            // TODO Auto-generated method stub
            ServiceResult<BFCHomePageModule> wResult = new ServiceResult<BFCHomePageModule>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.setResult(BFCHomePageModuleDAO.getInstance().Select(wLoginUser,wID, wErrorCode));
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
            }
            catch (Exception e)
            {
                wResult.FaultCode += e.Message;
            }
            return wResult;
        }


        public ServiceResult<Int32> BFC_UpdateHomePageModule(BMSEmployee wLoginUser, BFCHomePageModule wBFCHomePageModule)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.setResult(BFCHomePageModuleDAO.getInstance().Update(wLoginUser,wBFCHomePageModule, wErrorCode));
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
            }
            catch (Exception e)
            {
                wResult.FaultCode += e.Message;
            }
            return wResult;
        }


        public ServiceResult<List<BFCMessage>> BFC_GetMessageList(BMSEmployee wLoginUser, int wResponsorID, int wType,
                int wModuleID, List<Int32> wMessageIDList, int wActive, int wSendStatus, int wShiftID,
                DateTime wStartTime, DateTime wEndTime, int wStepID)
        {
            ServiceResult<List<BFCMessage>> wResult = new ServiceResult<List<BFCMessage>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.setResult(BFCMessageDAO.getInstance().BFC_GetMessageList(wLoginUser, wResponsorID, wType, wModuleID,
                        wMessageIDList, wActive, wSendStatus, wShiftID, wStartTime, wEndTime, wStepID, wErrorCode));

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
            }
            catch (Exception e)
            {
                logger.Error("BFCServiceImpl BFC_GetMessageList ERROR:", e);
                wResult.FaultCode += e.Message;
            }

            return wResult;
        }


        public ServiceResult<List<BFCMessage>> BFC_GetUndoMessageList(BMSEmployee wLoginUser, int wResponsorID,
                int wModuleID, int wMessageID, int wShiftID, DateTime wStartTime, DateTime wEndTime)
        {
            ServiceResult<List<BFCMessage>> wResult = new ServiceResult<List<BFCMessage>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);

                wResult.setResult(BFCMessageDAO.getInstance().BFC_GetUndoMessageList(wLoginUser, wResponsorID, wModuleID,
                        wMessageID, wShiftID, wStartTime, wEndTime, wErrorCode));
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
            }
            catch (Exception e)
            {
                logger.Error("BFCServiceImpl BFC_GetUndoMessageList ERROR:", e);
                wResult.FaultCode += e.Message;
            }
            return wResult;
        }


        public ServiceResult<Int32> BFC_UpdateMessageList(BMSEmployee wLoginUser, List<BFCMessage> wBFCMessageList)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);

                if (wBFCMessageList != null && wBFCMessageList.Count > 0)
                {
                    foreach (BFCMessage wBFCMessage in wBFCMessageList)
                    {
                        BFCMessageDAO.getInstance().BFC_UpdateMessage(wLoginUser, wBFCMessage, wErrorCode);
                        wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
                    }
                }
            }
            catch (Exception e)
            {
                logger.Error("BFCServiceImpl BFC_UpdateMessageList ERROR:", e);
                wResult.FaultCode += e.Message;
            }
            return wResult;
        }


        public ServiceResult<Int32> BFC_SendMessageList(BMSEmployee wLoginUser, List<BFCMessage> wBFCMessageList)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                if (wLoginUser == null)
                    wLoginUser = BaseDAO.SysAdmin;
                if (wBFCMessageList != null && wBFCMessageList.Count > 0)
                {
                    foreach (BFCMessage wBFCMessage in wBFCMessageList)
                    {
                        BFCMessageDAO.getInstance().BFC_SendMessageList(wLoginUser, wBFCMessage, wErrorCode);
                        wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
                    }
                }

            }
            catch (Exception e)
            {
                logger.Error("BFCServiceImpl BFC_SendMessageList ERROR:", e);
                wResult.FaultCode += e.Message;
            }
            return wResult;
        }


        public ServiceResult<Dictionary<Int32, Int32>> BFC_GetUndoMessagCount(BMSEmployee wLoginUser, int wResponsorID,
                int wShiftID)
        {
            ServiceResult<Dictionary<Int32, Int32>> wResult = new ServiceResult<Dictionary<Int32, Int32>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);

                wResult.setResult(BFCMessageDAO.getInstance().BFC_GetUndoMessageCount(wLoginUser, wResponsorID, wShiftID,
                        wErrorCode));
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
            }
            catch (Exception e)
            {
                logger.Error("BFCServiceImpl BFC_GetUndoMessagCount ERROR:", e);
                wResult.FaultCode += e.Message;
            }
            return wResult;
        }


        public ServiceResult<Int32> BFC_ReceiveMessage(BMSEmployee wLoginUser, int wResponsorID, List<Int64> wMsgIDList,
                List<Int32> wStepID, int wModuleID)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                if (wMsgIDList != null && wMsgIDList.Count > 0)
                {
                    BFCMessageDAO.getInstance().BFC_ReceiveMessage(wLoginUser, wResponsorID, wMsgIDList, wStepID, wModuleID,
                            wErrorCode);
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
                }
            }
            catch (Exception e)
            {
                logger.Error("BFCServiceImpl BFC_ReceiveMessage ERROR:", e);
                wResult.FaultCode += e.Message;
            }
            return wResult;
        }


        public ServiceResult<Int32> BFC_HandleMessageByIDList(BMSEmployee wLoginUser, List<Int64> wMsgIDList, int wStatus,
                int wSendStatus)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                if (wMsgIDList != null && wMsgIDList.Count > 0)
                {
                    BFCMessageDAO.getInstance().BFC_HandleMessageByIDList(wLoginUser, wMsgIDList, wStatus, wSendStatus,
                            wErrorCode);
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
                }
            }
            catch (Exception e)
            {
                logger.Error("BFCServiceImpl BFC_ReceiveMessage ERROR:", e);
                wResult.FaultCode += e.Message;
            }
            return wResult;
        }


        public ServiceResult<Int32> BFC_HandleMessage(BMSEmployee wLoginUser, int wResponsorID, List<Int64> wMsgIDList,
                List<Int32> wStepID, int wModuleID, int wType, int wStatus)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                if (wMsgIDList != null && wMsgIDList.Count > 0)
                {
                    BFCMessageDAO.getInstance().BFC_HandleMessage(wLoginUser, wResponsorID, wMsgIDList, wStepID, wModuleID,
                            wType, wStatus, wErrorCode);
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
                }
            }
            catch (Exception e)
            {
                logger.Error("BFCServiceImpl BFC_HandleMessage ERROR:", e);
                wResult.FaultCode += e.Message;
            }
            return wResult;
        }


        public ServiceResult<Int32> BFC_ForwardMessage(BMSEmployee wLoginUser, int wResponsorID,
                List<Int32> wForwarderList, int wModuleID, long wMessageID, int wStepID)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);

                if (wModuleID <= 0 || wMessageID <= 0 || wStepID <= 0 || (wResponsorID <= 0 && wResponsorID != -100)
                        || wForwarderList == null || wForwarderList.Count <= 0)
                {
                    return wResult;
                }

                BFCMessageDAO.getInstance().BFC_ForwardMessage(wLoginUser, wResponsorID, wForwarderList, wModuleID,
                        (int)wMessageID, wStepID, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();

            }
            catch (Exception e)
            {
                logger.Error("BFCServiceImpl BFC_HandleMessage ERROR:", e);
                wResult.FaultCode += e.Message;
            }
            return wResult;
        }


        public ServiceResult<Int32> BFC_HandleTaskMessage(BMSEmployee wLoginUser, int wResponsorID,
                List<Int32> wTaskIDList, int wModuleID, int wStepID, int wStatus, int wAuto)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                if (wTaskIDList != null && wTaskIDList.Count > 0)
                {
                    BFCMessageDAO.getInstance().BFC_HandleTaskMessage(wLoginUser, wResponsorID, wTaskIDList, wModuleID,
                            wStepID, wStatus, wAuto, wErrorCode);
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
                }
            }
            catch (Exception e)
            {
                logger.Error("BFCServiceImpl BFC_HandleTaskMessage ERROR:", e);
                wResult.FaultCode += e.Message;
            }
            return wResult;
        }

 
        // 查询通知列表

        public ServiceResult<List<BFCMessage>> BFC_GetNoticeList(BMSEmployee wLoginUser, int wResponsorID, int wStatus,
                int wUseTime, DateTime wStartTime, DateTime wEndTime, OutResult<Int32> wCount)
        {
            ServiceResult<List<BFCMessage>> wResult = new ServiceResult<List<BFCMessage>>();
            wCount.set(0);

            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                // 消息集合
                List<BFCMessage> wBFCMessageList = new List<BFCMessage>();

                if (wStatus <= 0)
                {
                    if (wUseTime > 0)
                    {
                        wBFCMessageList = BFCMessageDAO.getInstance().BFC_GetMessageList(wLoginUser, wResponsorID,
                                (int)BFCMessageType.Notify, -1, -1, -1, (int)BFCMessageStatus.Sent, -1, -1,
                                wStartTime, wEndTime, wErrorCode);

                        wBFCMessageList.AddRange(BFCMessageDAO.getInstance().BFC_GetMessageList(wLoginUser, wResponsorID,
                                (int)BFCMessageType.Notify, -1, -1, -1, (int)BFCMessageStatus.Default, -1, -1,
                                wStartTime, wEndTime, wErrorCode));
                    }
                    else
                    {
                        wBFCMessageList = BFCMessageDAO.getInstance().BFC_GetMessageList(wLoginUser, wResponsorID,
                                (int)BFCMessageType.Notify, -1, (int)BFCMessageStatus.Sent, -1, wErrorCode);

                        wBFCMessageList.AddRange(BFCMessageDAO.getInstance().BFC_GetMessageList(wLoginUser, wResponsorID,
                               (int)BFCMessageType.Notify, -1, (int)BFCMessageStatus.Default, -1, wErrorCode));
                    }

                    wCount.Result = wBFCMessageList.Count;

                    List<BFCMessage> wBFCMessageTemp = BFCMessageDAO.getInstance().BFC_GetMessageList(wLoginUser,
                            wResponsorID, (int)BFCMessageType.Notify, -1, -1, -1, (int)BFCMessageStatus.Read,
                            -1, -1, wStartTime, wEndTime, wErrorCode);

                    wBFCMessageList.AddRange(wBFCMessageTemp);

                }
                else if (wStatus == (int)BFCMessageStatus.Read)
                {
                    wBFCMessageList.AddRange(BFCMessageDAO.getInstance().BFC_GetMessageList(wLoginUser, wResponsorID,
                            (int)BFCMessageType.Notify, -1, -1, -1, (int)BFCMessageStatus.Read, -1, -1,
                            wStartTime, wEndTime, wErrorCode));
                }

                if (wBFCMessageList.Count > 0)
                {
                    wBFCMessageList.Sort((o1, o2)=>o2.CreateTime.CompareTo(o1.CreateTime));
                }

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
                wResult.Result = wBFCMessageList;

            }
            catch (Exception e)
            {
                // TODO: handle exception
                wResult.FaultCode += e.Message;
                logger.Error("BFCServiceImpl BFC_GetWaitNoticeList Error:", e);
            }

            return wResult;
        }


        public ServiceResult<List<CGSTable>> CGS_SelectCGTableByName(BMSEmployee wLoginUser, int wUserID, String wTableName,
                String wModleName)
        {
            ServiceResult<List<CGSTable>> wResult = new ServiceResult<List<CGSTable>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.Result = CGSTableConfigDAO.getInstance().CGS_GetTableConfigList(wLoginUser, wUserID, wTableName,
                        wModleName, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
            }
            catch (Exception e)
            {
                wResult.FaultCode += e.Message;
                logger.Error("BFCServiceImpl SelectCGTableByName Error:", e);
            }
            return wResult;
        }

        // 保存表格配置

        public ServiceResult<Int32> CGS_SaveCGTable(BMSEmployee wLoginUser, List<CGSTable> wCGTable)
        {
            // TODO Auto-generated method stub
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                CGSTableConfigDAO.getInstance().CGS_SaveTableConfigList(wLoginUser, wCGTable, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
            }
            catch (Exception e)
            {
                wResult.FaultCode += e.Message;
                logger.Error("BFCServiceImpl SaveCGTable Error:", e);
            }
            return wResult;

        }


        public ServiceResult<Int32> CGS_DeleteCGTable(BMSEmployee wLoginUser, List<CGSTable> wCGTable)
        {
            // TODO Auto-generated method stub
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                CGSTableConfigDAO.getInstance().CGS_DeleteTableConfigList(wLoginUser, wCGTable, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
            }
            catch (Exception e)
            {
                wResult.FaultCode += e.Message;
                logger.Error("BFCServiceImpl CGS_DeleteCGTable Error:", e);
            }

            return wResult;
        }


        public ServiceResult<List<Dictionary<String, Object>>> CGS_GetDataTableList(BMSEmployee wLoginUser, int wSqlType)
        {
            ServiceResult<List<Dictionary<String, Object>>> wResult = new ServiceResult<List<Dictionary<String, Object>>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.Result = CGSDataBaseTableDAO.getInstance((DBEnumType)wSqlType).CGS_GetDataTableList(wLoginUser,
                        wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
            }
            catch (Exception e)
            {
                wResult.FaultCode += e.Message;
                logger.Error("BFCServiceImpl CGS_DeleteCGTable Error:", e);
            }

            return wResult;
        }


        public ServiceResult<List<Dictionary<String, Object>>> CGS_GetDataTableInfo(BMSEmployee wLoginUser, int wSqlType,
                String wDBName, String wTableName)
        {
            ServiceResult<List<Dictionary<String, Object>>> wResult = new ServiceResult<List<Dictionary<String, Object>>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.Result = CGSDataBaseTableDAO.getInstance((DBEnumType)wSqlType).CGS_GetDataTableInfo(wLoginUser, wDBName,
                        wTableName, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
            }
            catch (Exception e)
            {
                wResult.FaultCode += e.Message;
                logger.Error("BFCServiceImpl CGS_DeleteCGTable Error:", e);
            }

            return wResult;
        }

        public ServiceResult<List<BFCMessage>> BFC_GetHasDoNoticeCount(BMSEmployee wLoginUser, int wResponsorID, DateTime wStartTime, DateTime wEndTime)
        {
            ServiceResult<List<BFCMessage>> wResult = new ServiceResult<List<BFCMessage>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                List<BFCMessage> wBFCMessageList = new List<BFCMessage>();

                wBFCMessageList = BFCMessageDAO.getInstance().BFC_GetMessageList(wLoginUser, wResponsorID,
                        (int)BFCMessageType.Task, 0, 0, -1, (int)BFCMessageStatus.Finished, -1, 0, wStartTime,
                        wEndTime, wErrorCode);

                wResult.setResult(wBFCMessageList);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
            }
            catch (Exception e)
            {
                // TODO: handle exception
                wResult.FaultCode += e.Message;
            }

            return wResult;
        }

       
    }
}
