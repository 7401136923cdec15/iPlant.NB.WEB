using System.Data.Common;

using System;
using System.Collections.Generic;
using Microsoft.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks; 
using log4net;
using MySqlConnector;

namespace iPlant.Data.EF
{
    public class StringSQLTool
    {
        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(StringSQLTool));

        #region 单实例
        private StringSQLTool()
        {

        }

        private static StringSQLTool _Instance;
        public static StringSQLTool Instance
        {
            get
            {
                if (_Instance == null)
                    _Instance = new StringSQLTool();
                return _Instance;
            }
        }
        #endregion

        public void ExecuteSqlTransaction(List<string> wSQLStringList, DBPool wDBPool)
        {
            switch (wDBPool.SqlType)
            {
                case DBEnumType.Default:
                    break;
                case DBEnumType.MySQL:
                    ExecuteSqlTransaction_MySql(wSQLStringList, wDBPool);
                    break;
                case DBEnumType.SQLServer:

                    List<String> wStringTempList = new List<string>();
                    wSQLStringList.ForEach(p => wStringTempList.Add(DMLTool.ChangeToSqlServer(p)));

                    ExecuteSqlTransaction_Sql(wStringTempList, wDBPool);

                    break;
                case DBEnumType.Oracle:
                    break;
                default:
                    break;
            }
        }


        public void ExecuteSqlTransaction(string wSQLString, DBPool wDBPool)
        {
            if (String.IsNullOrWhiteSpace(wSQLString))
                return;

            wDBPool.update(wSQLString, null);
        }





        #region Mysql
        private void ExecuteSqlTransaction_MySql(List<string> wSQLStringList, DBPool wDBPool)
        {
            if (wSQLStringList == null || wSQLStringList.Count < 1)
                return;

            wSQLStringList.RemoveAll(p => String.IsNullOrWhiteSpace(p) || p.Length <= 5);

            if (wSQLStringList == null || wSQLStringList.Count < 1)
                return;
            try
            {

                using (MySqlConnection wMySqlConnection = (MySqlConnection)wDBPool.GetConnection())
                {

                    MySqlCommand wCommand = new MySqlCommand();

                    wCommand.Connection = wMySqlConnection;


                    MySqlTransaction wTransaction = wMySqlConnection.BeginTransaction();

                    wCommand.Transaction = wTransaction;
                    try
                    {
                        for (int wIndex = 0; wIndex < wSQLStringList.Count; wIndex++)
                        {
                            wCommand.CommandText = wSQLStringList[wIndex];
                            wCommand.ExecuteNonQuery();

                            // 每满500句提交一次
                            if ((wIndex > 0 && (wIndex % 500 == 0) || wIndex == wSQLStringList.Count - 1))
                            {
                                wTransaction.Commit();
                                if (wIndex != wSQLStringList.Count - 1)
                                    wTransaction = wMySqlConnection.BeginTransaction();
                            }
                        }
                    }
                    catch (Exception)
                    {
                        wTransaction.Rollback();
                        throw;
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
        }


        #endregion


        #region SqlServer
        private void ExecuteSqlTransaction_Sql(List<string> wSQLStringList, DBPool wDBPool)
        {
            if (wSQLStringList == null || wSQLStringList.Count < 1)
                return;

            wSQLStringList.RemoveAll(p => String.IsNullOrWhiteSpace(p) || p.Length <= 5);

            if (wSQLStringList == null || wSQLStringList.Count < 1)
                return;



            try
            {
                using (SqlConnection wSqlConnection = (SqlConnection)wDBPool.GetConnection())
                {

                    SqlCommand wCommand = new SqlCommand();

                    wCommand.Connection = wSqlConnection;


                    SqlTransaction wTransaction = wSqlConnection.BeginTransaction();

                    wCommand.Transaction = wTransaction;
                    try
                    {
                        for (int wIndex = 0; wIndex < wSQLStringList.Count; wIndex++)
                        {
                            wCommand.CommandText = wSQLStringList[wIndex];
                            wCommand.ExecuteNonQuery();

                            // 每满500句提交一次
                            if ((wIndex > 0 && (wIndex % 500 == 0) || wIndex == wSQLStringList.Count - 1))
                            {
                                wTransaction.Commit();
                                if (wIndex != wSQLStringList.Count - 1)
                                    wTransaction = wSqlConnection.BeginTransaction();
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
                        wTransaction.Rollback();
                        throw ex;
                    }
                }
            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
                throw ex;
            }
        }


        #endregion

    }

}
