using iPlant.Common.Tools;
using iPlant.NB.WEB.Models;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.NB.WEB.Daos
{
    public class MysqlDAO
    {
        #region 单实例
        private MysqlDAO() { }
        private static MysqlDAO _Instance;

        public static MysqlDAO Instance
        {
            get
            {
                if (_Instance == null)
                    _Instance = new MysqlDAO();
                return _Instance;
            }
        }
        #endregion

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(MysqlDAO));

        private string mysqlString = "server=127.0.0.1;User Id=shris;password=Shris_123;Database=iplantmlm";

        /// <summary>
        /// 更新单体电压测试结果
        /// </summary>
        public void UpdateWithstandVoltageTest(MTSSingleResult wMTSSingleResult, bool wIsQaulity)
        {
            MySqlConnection wCon = getMySqlConn();
            try
            {
                wCon.Open();

                int wWithstandVoltageTest = 0;
                switch (wMTSSingleResult.Status)
                {
                    case "PASS":
                        wWithstandVoltageTest = 1;
                        break;
                    case "NG":
                        wWithstandVoltageTest = 2;
                        break;
                    default:
                        break;
                }

                int wQuality = wWithstandVoltageTest;
                if (!wIsQaulity)
                    wQuality = 2;

                MySqlCommand wSqlCommand = new MySqlCommand();

                wSqlCommand.Connection = wCon;
                wSqlCommand.CommandText = "update iplantmlm.sfc_modulerecord set WithstandVoltageTest=@wWithstandVoltageTest,CurrentPartID=4,IsQuality=@IsQuality where  CapacitorPackageNo=@wCapacitorPackageNo order by ID desc limit 1;";

                wSqlCommand.Parameters.Clear();
                wSqlCommand.Parameters.AddWithValue("@wCapacitorPackageNo", wMTSSingleResult.PackageNo);
                wSqlCommand.Parameters.AddWithValue("@wWithstandVoltageTest", wWithstandVoltageTest);
                wSqlCommand.Parameters.AddWithValue("@IsQuality", wQuality);

                wSqlCommand.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
                wCon.Close();
            }
            finally
            {
                wCon.Close();
            }
        }

        internal void GetLimitByID(int wTimeStandardID, out double wLowerLimit, out double wUpperLimit)
        {
            MySqlConnection wCon = getMySqlConn();
            wLowerLimit = 0;
            wUpperLimit = 0;
            try
            {
                wCon.Open();

                MySqlCommand wSqlCommand = new MySqlCommand();

                wSqlCommand.Connection = wCon;
                wSqlCommand.CommandText = "SELECT UpperLimit,LowerLimit FROM iplantmlm.ipt_standard where ID=@wID;";

                wSqlCommand.Parameters.Clear();
                wSqlCommand.Parameters.AddWithValue("@wID", wTimeStandardID);

                DbDataReader wSqlDataReader = wSqlCommand.ExecuteReader();
                while (wSqlDataReader.Read())
                {
                    wLowerLimit = StringUtils.parseDouble(wSqlDataReader["LowerLimit"].ToString());
                    wUpperLimit = StringUtils.parseDouble(wSqlDataReader["UpperLimit"].ToString());
                }
                wSqlDataReader.Close();
            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
                wCon.Close();
            }
            finally
            {
                wCon.Close();
            }
        }

        /// <summary>
        /// 更新静置时间
        /// </summary>
        internal void UpdateJZTime(int wValueID, double wHours)
        {
            MySqlConnection wCon = getMySqlConn();
            try
            {
                wCon.Open();

                MySqlCommand wSqlCommand = new MySqlCommand();

                wSqlCommand.Connection = wCon;
                wSqlCommand.CommandText = "update iplantmlm.ipt_numbervalue set Value=@wValue where ID=@wID;";

                wSqlCommand.Parameters.Clear();
                wSqlCommand.Parameters.AddWithValue("@wValue", wHours);
                wSqlCommand.Parameters.AddWithValue("@wID", wValueID);

                wSqlCommand.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
                wCon.Close();
            }
            finally
            {
                wCon.Close();
            }
        }

        internal void GetCreateTime(string wSerialNumber, int wTimeStandardID, out int wValueID, out DateTime wCreateTime)
        {
            MySqlConnection wCon = getMySqlConn();
            wValueID = 0;
            wCreateTime = DateTime.Now;
            try
            {
                wCon.Open();

                MySqlCommand wSqlCommand = new MySqlCommand();

                wSqlCommand.Connection = wCon;
                wSqlCommand.CommandText = "select ID,CreateTime FROM iplantmlm.ipt_numbervalue where SerialNumber=@wSerialNumber and    StandardID=@wStandardID;";

                wSqlCommand.Parameters.Clear();
                wSqlCommand.Parameters.AddWithValue("@wSerialNumber", wSerialNumber);
                wSqlCommand.Parameters.AddWithValue("@wStandardID", wTimeStandardID);

                DbDataReader wSqlDataReader = wSqlCommand.ExecuteReader();
                while (wSqlDataReader.Read())
                {
                    wValueID = StringUtils.parseInt(wSqlDataReader["ID"]);
                    wCreateTime = StringUtils.parseDate(wSqlDataReader["CreateTime"]);
                }
                wSqlDataReader.Close();
            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
                wCon.Close();
            }
            finally
            {
                wCon.Close();
            }
        }

        //插入数据
        public void InsertItem(MTSSingleResult wMTSSingleResult, string wSerialNumber, int wStandardID)
        {
            MySqlConnection wCon = getMySqlConn();
            try
            {
                wCon.Open();

                int wWithstandVoltageTest = 0;
                switch (wMTSSingleResult.Status)
                {
                    case "PASS":
                        wWithstandVoltageTest = 1;
                        break;
                    case "NG":
                        wWithstandVoltageTest = 2;
                        break;
                    default:
                        break;
                }

                int wShiftID = int.Parse(DateTime.Now.ToString("yyyyMMdd"));

                MySqlCommand wSqlCommand = new MySqlCommand();

                wSqlCommand.Connection = wCon;
                wSqlCommand.CommandText = "insert into iplantmlm.ipt_boolvalue(SerialNumber,StandardID,Value,CreateID,CreateTime,ShiftID,PartID) values(@wSerialNumber,@wStandardID,@wValue,1,now(),@wShiftID,4);";

                wSqlCommand.Parameters.Clear();
                wSqlCommand.Parameters.AddWithValue("@wSerialNumber", wSerialNumber);
                wSqlCommand.Parameters.AddWithValue("@wStandardID", wStandardID);
                wSqlCommand.Parameters.AddWithValue("@wValue", wWithstandVoltageTest);
                wSqlCommand.Parameters.AddWithValue("@wShiftID", wShiftID);

                wSqlCommand.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
                wCon.Close();
            }
            finally
            {
                wCon.Close();
            }
        }

        public void SaveSingleInfo(MTSSingleResult wMTSSingleResult)
        {
            MySqlConnection wCon = getMySqlConn();
            try
            {
                wCon.Open();

                MySqlCommand wSqlCommand = new MySqlCommand();

                wSqlCommand.Connection = wCon;
                wSqlCommand.CommandText = "INSERT INTO `iplantmlm`.`ipt_singleinfo`(`CapacityNo`,`Status`,`StatusTime`,`NumArray`)VALUES(@wCapacityNo,@wStatus,@wStatusTime,@wNumArray);";

                wSqlCommand.Parameters.Clear();
                wSqlCommand.Parameters.AddWithValue("@wCapacityNo", wMTSSingleResult.PackageNo);
                wSqlCommand.Parameters.AddWithValue("@wStatus", wMTSSingleResult.Status);
                wSqlCommand.Parameters.AddWithValue("@wStatusTime", wMTSSingleResult.StatusTime);
                wSqlCommand.Parameters.AddWithValue("@wNumArray", StringUtils.Join(",", wMTSSingleResult.NumArray));

                wSqlCommand.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
                wCon.Close();
            }
            finally
            {
                wCon.Close();
            }
        }

        //插入数据
        public void InsertItem(SFCModuleRecord wSFCModuleRecord, double wValue, int wStandardID)
        {
            MySqlConnection wCon = getMySqlConn();
            try
            {
                wCon.Open();

                int wShiftID = int.Parse(DateTime.Now.ToString("yyyyMMdd"));

                MySqlCommand wSqlCommand = new MySqlCommand();

                wSqlCommand.Connection = wCon;
                wSqlCommand.CommandText = "insert into iplantmlm.ipt_numbervalue(SerialNumber,StandardID,Value,CreateID,CreateTime,ShiftID,PartID) values(@wSerialNumber,@wStandardID,@wValue,1,now(),@wShiftID,6);";

                wSqlCommand.Parameters.Clear();
                wSqlCommand.Parameters.AddWithValue("@wSerialNumber", wSFCModuleRecord.SerialNumber);
                wSqlCommand.Parameters.AddWithValue("@wStandardID", wStandardID);
                wSqlCommand.Parameters.AddWithValue("@wValue", wValue);
                wSqlCommand.Parameters.AddWithValue("@wShiftID", wShiftID);

                wSqlCommand.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
                wCon.Close();
            }
            finally
            {
                wCon.Close();
            }
        }

        //删除数据
        public void DeleteItem(string wSerialNumber, int wStandardID)
        {
            MySqlConnection wCon = getMySqlConn();
            try
            {
                wCon.Open();

                MySqlCommand wSqlCommand = new MySqlCommand();

                wSqlCommand.Connection = wCon;
                wSqlCommand.CommandText = "delete from iplantmlm.ipt_boolvalue where SerialNumber=@SerialNumber and StandardID=@StandardID and ID>0;";

                wSqlCommand.Parameters.Clear();
                wSqlCommand.Parameters.AddWithValue("@SerialNumber", wSerialNumber);
                wSqlCommand.Parameters.AddWithValue("@StandardID", wStandardID);

                wSqlCommand.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
                wCon.Close();
            }
            finally
            {
                wCon.Close();
            }
        }

        //删除数据
        public void DeleteItem_Number(string wSerialNumber, int wStandardID)
        {
            MySqlConnection wCon = getMySqlConn();
            try
            {
                wCon.Open();

                MySqlCommand wSqlCommand = new MySqlCommand();

                wSqlCommand.Connection = wCon;
                wSqlCommand.CommandText = "delete from iplantmlm.ipt_numbervalue where SerialNumber=@SerialNumber and StandardID=@StandardID and ID>0;";

                wSqlCommand.Parameters.Clear();
                wSqlCommand.Parameters.AddWithValue("@SerialNumber", wSerialNumber);
                wSqlCommand.Parameters.AddWithValue("@StandardID", wStandardID);

                wSqlCommand.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
                wCon.Close();
            }
            finally
            {
                wCon.Close();
            }
        }

        public string GetSerialNumber(string wCapacitorPackageNo, out int wProductID)
        {
            string wResult = "";

            MySqlConnection wCon = getMySqlConn();
            wProductID = 0;
            try
            {
                wCon.Open();

                MySqlCommand wSqlCommand = new MySqlCommand();

                wSqlCommand.Connection = wCon;
                wSqlCommand.CommandText = "select SerialNumber,ProductID FROM iplantmlm.sfc_modulerecord where ID in (SELECT max(ID) FROM iplantmlm.sfc_modulerecord where CapacitorPackageNo=@CapacitorPackageNo);";

                wSqlCommand.Parameters.Clear();
                wSqlCommand.Parameters.AddWithValue("@CapacitorPackageNo", wCapacitorPackageNo);

                DbDataReader wSqlDataReader = wSqlCommand.ExecuteReader();
                while (wSqlDataReader.Read())
                {
                    wResult = StringUtils.parseString(wSqlDataReader["SerialNumber"]);
                    wProductID = StringUtils.parseInt(wSqlDataReader["ProductID"]);
                }
                wSqlDataReader.Close();
            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
                wCon.Close();
            }
            finally
            {
                wCon.Close();
            }
            return wResult;
        }

        public void UpdateModuleRecord(string wGear, int wID)
        {
            MySqlConnection wCon = getMySqlConn();
            try
            {
                wCon.Open();

                MySqlCommand wSqlCommand = new MySqlCommand();

                wSqlCommand.Connection = wCon;
                wSqlCommand.CommandText = "update iplantmlm.sfc_modulerecord set CurrentPartID=6,Gear=@wGear where ID=@wID;";

                wSqlCommand.Parameters.Clear();
                wSqlCommand.Parameters.AddWithValue("@wGear", wGear);
                wSqlCommand.Parameters.AddWithValue("@wID", wID);

                wSqlCommand.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
                wCon.Close();
            }
            finally
            {
                wCon.Close();
            }
        }

        /// <summary>
        /// 根据产品和容量获取档位
        /// </summary>
        public string GetGear(int wProductID, double wCapacity)
        {
            string wResult = "";

            MySqlConnection wCon = getMySqlConn();
            try
            {
                wCon.Open();

                MySqlCommand wSqlCommand = new MySqlCommand();

                wSqlCommand.Connection = wCon;
                wSqlCommand.CommandText = "SELECT Gear FROM iplantmlm.ipt_capacitygrading where ProductID=@ProductID and LowerLimit<=@wCapacity and @wCapacity <=UpLimit;";

                wSqlCommand.Parameters.Clear();
                wSqlCommand.Parameters.AddWithValue("@ProductID", wProductID);
                wSqlCommand.Parameters.AddWithValue("@wCapacity", wCapacity);

                DbDataReader wSqlDataReader = wSqlCommand.ExecuteReader();
                while (wSqlDataReader.Read())
                {
                    wResult = StringUtils.parseString(wSqlDataReader["Gear"]);
                }
                wSqlDataReader.Close();
            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
                wCon.Close();
            }
            finally
            {
                wCon.Close();
            }
            return wResult;
        }

        public List<SFCModuleRecord> GetSFCModuleRecordList()
        {
            List<SFCModuleRecord> wResult = new List<SFCModuleRecord>();
            MySqlConnection wCon = getMySqlConn();
            try
            {
                wCon.Open();

                MySqlCommand wSqlCommand = new MySqlCommand();

                wSqlCommand.Connection = wCon;
                wSqlCommand.CommandText = "Select ID,SerialNumber,CapacitorPackageNo,Capacity,InternalResistance,ProductID from iplantmlm.sfc_modulerecord where Gear='' and Active=1 and Capacity>0;";

                wSqlCommand.Parameters.Clear();

                DbDataReader wSqlDataReader = wSqlCommand.ExecuteReader();
                while (wSqlDataReader.Read())
                {
                    SFCModuleRecord wSFCModuleRecord = new SFCModuleRecord();

                    wSFCModuleRecord.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
                    wSFCModuleRecord.SerialNumber = StringUtils.parseString(wSqlDataReader["SerialNumber"]);
                    wSFCModuleRecord.CapacitorPackageNo = StringUtils.parseString(wSqlDataReader["CapacitorPackageNo"]);
                    wSFCModuleRecord.Capacity = StringUtils.parseDouble(wSqlDataReader["Capacity"].ToString());
                    wSFCModuleRecord.InternalResistance = StringUtils.parseDouble(wSqlDataReader["InternalResistance"].ToString());
                    wSFCModuleRecord.ProductID = StringUtils.parseInt(wSqlDataReader["ProductID"].ToString());

                    wResult.Add(wSFCModuleRecord);
                }
                wSqlDataReader.Close();
            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
                wCon.Close();
            }
            finally
            {
                wCon.Close();
            }
            return wResult;
        }

        /// <summary>
        /// 查询标准ID
        /// </summary>
        public int GetStandardID(int wProductID, int wItemID)
        {
            int wResult = 0;

            MySqlConnection wCon = getMySqlConn();
            try
            {
                wCon.Open();

                MySqlCommand wSqlCommand = new MySqlCommand();

                wSqlCommand.Connection = wCon;
                wSqlCommand.CommandText = "SELECT ID FROM iplantmlm.ipt_standard where ProductID=@ProductID and ItemID=@wItemID;";

                wSqlCommand.Parameters.Clear();
                wSqlCommand.Parameters.AddWithValue("@ProductID", wProductID);
                wSqlCommand.Parameters.AddWithValue("@wItemID", wItemID);

                DbDataReader wSqlDataReader = wSqlCommand.ExecuteReader();
                while (wSqlDataReader.Read())
                {
                    wResult = StringUtils.parseInt(wSqlDataReader["ID"]);
                }
                wSqlDataReader.Close();
            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
                wCon.Close();
            }
            finally
            {
                wCon.Close();
            }
            return wResult;
        }

        public int GetCurrentPartID(string wPacageNo)
        {
            int wResult = 0;

            MySqlConnection wCon = getMySqlConn();
            try
            {
                wCon.Open();

                MySqlCommand wSqlCommand = new MySqlCommand();

                wSqlCommand.Connection = wCon;
                wSqlCommand.CommandText = "SELECT CurrentPartID FROM iplantmlm.sfc_modulerecord where ID in (SELECT max(ID) FROM iplantmlm.sfc_modulerecord where CapacitorPackageNo=@CapacitorPackageNo);";

                wSqlCommand.Parameters.Clear();
                wSqlCommand.Parameters.AddWithValue("@CapacitorPackageNo", wPacageNo);

                DbDataReader wSqlDataReader = wSqlCommand.ExecuteReader();
                while (wSqlDataReader.Read())
                {
                    wResult = StringUtils.parseInt(wSqlDataReader["CurrentPartID"].ToString());
                }
                wSqlDataReader.Close();
            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
                wCon.Close();
            }
            finally
            {
                wCon.Close();
            }
            return wResult;
        }

        //建立mysql数据库链接
        public MySqlConnection getMySqlConn()
        {
            string constr = mysqlString;
            MySqlConnection mycon = new MySqlConnection(constr);
            return mycon;
        }
    }
}

