using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.SCADA.Service
{
    public class DMSDeviceParameterDAO : BaseDAO
    {


        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(DMSDeviceParameterDAO));

        private static DMSDeviceParameterDAO Instance;

        private DMSDeviceParameterDAO() : base()
        {

        }

        public static DMSDeviceParameterDAO getInstance()
        {
            if (Instance == null)
                Instance = new DMSDeviceParameterDAO();
            return Instance;
        }

        private List<DMSDeviceParameter> DMS_SelectDeviceParameterList(BMSEmployee wLoginUser, List<Int32> wID,
               String wCode, String wName, String wVariableName,
                int wDeviceID, String wDeviceNo, String wAssetNo, String wDeviceName, String wProtocol, String wOPCClass, int wDataType, int wDataClass,
               int wActive, OutResult<Int32> wErrorCode)
        {
            List<DMSDeviceParameter> wResult = new List<DMSDeviceParameter>();
            try
            {

                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;

                if (wID == null)
                    wID = new List<Int32>();
                wID.RemoveAll(p => p <= 0);
                if (wCode == null)
                    wCode = "";

                String wSQL = StringUtils.Format(
                        "SELECT t.*,t1.Code as  DeviceNo,t1.Name as DeviceName, t5.Name as CreatorName," +
                        " t6.Name as EditorName  FROM {0}.dms_device_parameter t"
                                + " inner join {0}.dms_device_ledger t1 on t.DeviceID=t1.ID "
                                + " left join {0}.mbs_user t5 on t.CreatorID=t5.ID "
                                + " left join {0}.mbs_user t6 on t.EditorID=t6.ID    WHERE  1=1  "
                                + " and ( @wID ='' or t.ID IN( {1} ) )  "
                        + " and ( @wCode ='' or t.Code  = @wCode)  "
                        + " and ( @wName ='' or t.Name   = @wName )  "
                        + " and ( @wDeviceID <= 0 or t.DeviceID  = @wDeviceID)   "
                        + " and ( @wDeviceNo ='' or t1.Code  = @wDeviceNo)  "
                        + " and ( @wAssetNo ='' or t1.AssetNo  = @wAssetNo)  "
                        + " and ( @wDataClass <= 0 or t.DataClass  = @wDataClass)   "
                        + " and ( @wDataType <= 0 or t.DataType  = @wDataType)   "
                        + " and ( @wDeviceName ='' or t1.Name   = @wDeviceName )  "
                        + " and ( @wVariableName ='' or t.VariableName like @wVariableName )  " 
                        + " and ( @wProtocol ='' or t.Protocol  like @wProtocol )  "
                        + " and ( @wOPCClass ='' or t.OPCClass  like @wOPCClass )  "
                        + " and ( @wActive < 0 or t.Active  = @wActive)     ;"
                        , wInstance, wID.Count > 0 ? StringUtils.Join(",", wID) : "0");
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                wParamMap.Add("wID", StringUtils.Join(",", wID));
                wParamMap.Add("wName", wName);
                wParamMap.Add("wCode", wCode);
                wParamMap.Add("wDeviceID", wDeviceID);
                wParamMap.Add("wDeviceNo", wDeviceNo);
                wParamMap.Add("wAssetNo", wAssetNo);
                wParamMap.Add("wDeviceName", wDeviceName);
                wParamMap.Add("wVariableName", StringUtils.isNotEmpty(wVariableName) ? ("%" + wVariableName + "%") : "" );
                wParamMap.Add("wProtocol", StringUtils.isNotEmpty(wProtocol) ? ("%" + wProtocol + "%") : "");
                wParamMap.Add("wOPCClass", StringUtils.isNotEmpty(wOPCClass) ? ("%" + wOPCClass + "%") : "");
                wParamMap.Add("wDataType", wDataType);
                wParamMap.Add("wDataClass", wDataClass);
                wParamMap.Add("wActive", wActive);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);



                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    DMSDeviceParameter wDeviceParameter = new DMSDeviceParameter();

                    wDeviceParameter.ID = StringUtils.parseInt(wReader["ID"]);
                    wDeviceParameter.Code = StringUtils.parseString(wReader["Code"]);
                    wDeviceParameter.Name = StringUtils.parseString(wReader["Name"]);
                    wDeviceParameter.VariableName = StringUtils.parseString(wReader["VariableName"]);
                    wDeviceParameter.DeviceID = StringUtils.parseInt(wReader["DeviceID"]);
                    wDeviceParameter.DeviceName = StringUtils.parseString(wReader["DeviceName"]);
                    wDeviceParameter.DeviceNo = StringUtils.parseString(wReader["DeviceNo"]);
                    wDeviceParameter.Protocol = StringUtils.parseString(wReader["Protocol"]);
                    wDeviceParameter.OPCClass = StringUtils.parseString(wReader["OPCClass"]);
                    wDeviceParameter.DataType = StringUtils.parseInt(wReader["DataType"]);

                    wDeviceParameter.DataTypeText = EnumTool.GetEnumDesc<DMSDataTypes>(wDeviceParameter.DataType);
                    wDeviceParameter.DataClass = StringUtils.parseInt(wReader["DataClass"]);
                    wDeviceParameter.DataClassText = EnumTool.GetEnumDesc<DMSDataClass>(wDeviceParameter.DataClass);

                    wDeviceParameter.DataLength = StringUtils.parseInt(wReader["DataLength"]);
                    wDeviceParameter.KeyChar = StringUtils.parseString(wReader["KeyChar"]);
                    wDeviceParameter.AuxiliaryChar = StringUtils.parseString(wReader["AuxiliaryChar"]);
                    wDeviceParameter.ParameterDesc = StringUtils.parseString(wReader["ParameterDesc"]);

                    wDeviceParameter.CreatorID = StringUtils.parseInt(wReader["CreatorID"]);
                    wDeviceParameter.CreatorName = StringUtils.parseString(wReader["CreatorName"]);
                    wDeviceParameter.CreateTime = StringUtils.parseDate(wReader["CreateTime"]);
                    wDeviceParameter.EditorID = StringUtils.parseInt(wReader["EditorID"]);
                    wDeviceParameter.EditorName = StringUtils.parseString(wReader["EditorName"]);
                    wDeviceParameter.EditTime = StringUtils.parseDate(wReader["EditTime"]);
                    wDeviceParameter.Active = StringUtils.parseInt(wReader["Active"]);
                    wDeviceParameter.AnalysisOrder = StringUtils.parseInt(wReader["AnalysisOrder"]);
                    wResult.Add(wDeviceParameter);
                }

            }
            catch (Exception e)
            {

                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public List<DMSDeviceParameter> DMS_SelectDeviceParameterList(BMSEmployee wLoginUser, String wName, String wVariableName,

                int wDeviceID, String wDeviceNo, String wAssetNo, String wDeviceName, String wProtocol, String wOPCClass, int wDataType, int wDataClass,
               int wActive,
                OutResult<Int32> wErrorCode)
        {
            List<DMSDeviceParameter> wResult = new List<DMSDeviceParameter>();
            try
            {
                wResult = DMS_SelectDeviceParameterList(wLoginUser, null, "", wName, wVariableName, wDeviceID, wDeviceNo, wAssetNo, wDeviceName, wProtocol,
                    wOPCClass, wDataType, wDataClass, wActive,
                        wErrorCode);
            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public DMSDeviceParameter DMS_SelectDeviceParameter(BMSEmployee wLoginUser, int wID, String wCode,
                OutResult<Int32> wErrorCode)
        {
            DMSDeviceParameter wResult = new DMSDeviceParameter();
            try
            {
                List<DMSDeviceParameter> wDMSDeviceParameterList = null;
                if (wID > 0)
                {
                    List<Int32> wIDList = new List<Int32>();
                    wIDList.Add(wID);
                    wDMSDeviceParameterList = this.DMS_SelectDeviceParameterList(wLoginUser, wIDList, "", "", "", -1, "", "", "", "",
                    "", -1, -1, -1, wErrorCode);
                }
                else if (StringUtils.isNotEmpty(wCode))
                {
                    wDMSDeviceParameterList = this.DMS_SelectDeviceParameterList(wLoginUser, null, wCode, "", "", -1, "", "", "", "",
                    "", -1, -1, -1, wErrorCode);
                }

                else
                {
                    return wResult;
                }

                if (wDMSDeviceParameterList.Count > 0)
                    return wResult;

                wResult = wDMSDeviceParameterList[0];
            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public List<DMSDeviceParameter> DMS_SelectDeviceParameterList(BMSEmployee wLoginUser, int wDeviceID, String wDeviceNo, String wAssetNo,int wDataClass,
             OutResult<Int32> wErrorCode)
        {
            List<DMSDeviceParameter> wResult = new List<DMSDeviceParameter>();
            try
            {
                if (wDeviceID > 0 || StringUtils.isNotEmpty(wDeviceNo) || StringUtils.isNotEmpty(wAssetNo))

                    wResult = this.DMS_SelectDeviceParameterList(wLoginUser, null, "", "", "", wDeviceID, wDeviceNo, wAssetNo, "", "",
                        "", -1, wDataClass, 1, wErrorCode);

            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }



        public List<DMSDeviceParameter> DMS_SelectDeviceParameterList(BMSEmployee wLoginUser, List<Int32> wIDList,
                OutResult<Int32> wErrorCode)
        {
            List<DMSDeviceParameter> wResult = new List<DMSDeviceParameter>();
            try
            {
                if (wIDList == null || wIDList.Count < 1)
                    return wResult;

                List<Int32> wSelectList = new List<Int32>();
                for (int i = 0; i < wIDList.Count; i++)
                {
                    wSelectList.Add(wIDList[i]);
                    if (i % 25 == 0)
                    {
                        wResult.AddRange(this.DMS_SelectDeviceParameterList(wLoginUser, wSelectList, "", "", "", -1, "", "", "", "",
                    "", -1, -1, -1, wErrorCode));

                        wSelectList.Clear();
                    }
                    if (i == wIDList.Count - 1)
                    {
                        if (wSelectList.Count > 0)
                            wResult.AddRange(this.DMS_SelectDeviceParameterList(wLoginUser, wSelectList, "", "", "", -1, "", "", "", "",
                    "", -1, -1, -1, wErrorCode));
                        break;
                    }
                }
            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        private DMSDeviceParameter DMS_CheckDeviceParameter(BMSEmployee wLoginUser, DMSDeviceParameter wDMSDeviceParameter,
             OutResult<Int32> wErrorCode)
        {
            DMSDeviceParameter wResult = new DMSDeviceParameter();
            try
            {

                if (wDMSDeviceParameter == null || StringUtils.isEmpty(wDMSDeviceParameter.Name) || StringUtils.isEmpty(wDMSDeviceParameter.VariableName)
                        || wDMSDeviceParameter.DeviceID <= 0 || wDMSDeviceParameter.DataType <= 0 || wDMSDeviceParameter.DataClass <= 0)
                {
                    return wResult;
                }

                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;

                String wSQL = StringUtils.Format(
                        "SELECT t1.* FROM {0}.dms_device_parameter t1 WHERE t1.ID != @ID " +
                        " AND (( t1.DeviceID=@DeviceID and (t1.Name=@Name or t1.VariableName=@VariableName ) ) or t1.Code =@Code)  ;",
                        wInstance);
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                wParamMap.Add("DeviceID", wDMSDeviceParameter.DeviceID);
                wParamMap.Add("Name", wDMSDeviceParameter.Name);
                wParamMap.Add("VariableName", wDMSDeviceParameter.VariableName);
                wParamMap.Add("ID", wDMSDeviceParameter.ID);
                wParamMap.Add("Code", wDMSDeviceParameter.Code);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);
                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {

                    wResult.ID = StringUtils.parseInt(wReader["ID"]);
                    wResult.Code = StringUtils.parseString(wReader["Code"]);
                    wResult.Name = StringUtils.parseString(wReader["Name"]);
                    wResult.DeviceID = StringUtils.parseInt(wReader["ModelID"]);
                    wResult.VariableName = StringUtils.parseString(wReader["VariableName"]);
                    wResult.ParameterDesc = StringUtils.parseString(wReader["ParameterDesc"]);

                    wResult.Active = StringUtils.parseInt(wReader["Active"]);
                }

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public void DMS_UpdateDeviceParameter(BMSEmployee wLoginUser, DMSDeviceParameter wDeviceParameter,
                OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            try
            {
                if (wDeviceParameter == null || StringUtils.isEmpty(wDeviceParameter.Name) || StringUtils.isEmpty(wDeviceParameter.VariableName)
                      || wDeviceParameter.DeviceID <= 0 || wDeviceParameter.DataType <= 0 || wDeviceParameter.DataClass <= 0)
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return;
                }
                if (wDeviceParameter.ID > 0 && StringUtils.isEmpty(wDeviceParameter.Code))
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return;
                }

                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.DMS.getDBName();

                DMSDeviceParameter wDMSDeviceParameterDB = this.DMS_CheckDeviceParameter(wLoginUser, wDeviceParameter, wErrorCode);
                if (wDMSDeviceParameterDB.ID > 0)
                {
                    wErrorCode.Result = MESException.Duplication.Value;
                    if (wDeviceParameter.ID <= 0)
                    {
                        wDeviceParameter.ID = wDMSDeviceParameterDB.ID;
                    }
                    return;
                }
                //生成唯一编码
                if (StringUtils.isEmpty(wDeviceParameter.Code))
                {
                    int wMaxID = this.GetMaxPrimaryKey(StringUtils.Format("{0}.dms_device_parameter", wInstance), "ID");
                    wDeviceParameter.Code = StringUtils.Format("DP-{0}", String.Format("{0:D8}", wMaxID + 1));
                }

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("Code", wDeviceParameter.Code);
                wParamMap.Add("Name", wDeviceParameter.Name);
                wParamMap.Add("VariableName", wDeviceParameter.VariableName);
                wParamMap.Add("DeviceID", wDeviceParameter.DeviceID);
                wParamMap.Add("Protocol", wDeviceParameter.Protocol);
                wParamMap.Add("OPCClass", wDeviceParameter.OPCClass);
                wParamMap.Add("DataType", wDeviceParameter.DataType);
                wParamMap.Add("DataClass", wDeviceParameter.DataClass);
                wParamMap.Add("DataLength", wDeviceParameter.DataLength);
                wParamMap.Add("KeyChar", wDeviceParameter.KeyChar);
                wParamMap.Add("AuxiliaryChar", wDeviceParameter.AuxiliaryChar);
                wParamMap.Add("ParameterDesc", wDeviceParameter.ParameterDesc);
                wParamMap.Add("EditorID", wLoginUser.ID);
                wParamMap.Add("EditTime", DateTime.Now);
                wParamMap.Add("Active", wDeviceParameter.Active);
                wParamMap.Add("AnalysisOrder", wDeviceParameter.AnalysisOrder);

                if (wDeviceParameter.ID <= 0)
                {
                    wParamMap.Add("CreatorID", wLoginUser.ID);
                    wParamMap.Add("CreateTime", DateTime.Now);
                    wDeviceParameter.ID = this.Insert(StringUtils.Format("{0}.dms_device_parameter", wInstance), wParamMap);

                }
                else
                {
                    wParamMap.Add("ID", wDeviceParameter.ID);
                    this.Update(StringUtils.Format("{0}.dms_device_parameter", wInstance), "ID", wParamMap);
                }

            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }



        public void DMS_DeleteDeviceParameter(BMSEmployee wLoginUser, DMSDeviceParameter wDeviceParameter,
                OutResult<Int32> wErrorCode)
        {
            try
            {

                if (wDeviceParameter == null || StringUtils.isEmpty(wDeviceParameter.Name) || StringUtils.isEmpty(wDeviceParameter.VariableName)
                     || wDeviceParameter.DeviceID <= 0 || wDeviceParameter.DataType <= 0 || wDeviceParameter.DataClass <= 0)
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return;
                }

                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return;


                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("ID", wDeviceParameter.ID);
                wParamMap.Add("Active", 0);

                this.Delete(StringUtils.Format("{0}.dms_device_parameter", wInstance), wParamMap);


            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }


        public void DMS_ActiveDeviceParameter(BMSEmployee wLoginUser, List<Int32> wIDList, int wActive,
                OutResult<Int32> wErrorCode)
        {
            try
            {
                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return;

                if (wIDList == null || wIDList.Count <= 0)
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return;
                }
                wIDList.RemoveAll(p => p <= 0);
                if (wIDList.Count <= 0)
                    return;

                if (wActive != 1)
                    wActive = 2;
                String wSql = StringUtils.Format("UPDATE {0}.dms_device_parameter SET Active ={1} WHERE ID IN({2}) ;",
                        wInstance, wActive, StringUtils.Join(",", wIDList));


                this.mDBPool.update(wSql, null);
            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }


    }
}
