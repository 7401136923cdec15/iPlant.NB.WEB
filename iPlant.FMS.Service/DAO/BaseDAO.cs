using iPlant.Common.Tools;
using iPlant.Data.EF;
using iPlant.Data.EF.Repository;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace iPlant.SCADA.Service
{
    public class BaseDAO : RepositoryFactory
    {
        private static readonly log4net.ILog logger = log4net.LogManager.GetLogger(typeof(BaseDAO));

        protected LockHelper mLockHelper = new LockHelper();
        public BaseDAO() : base(DefaultDbType)
        {

        }

        public BaseDAO(DBEnumType wSQLTypes) : base(wSQLTypes)
        {

        }

        public static String defaultPassword = "123456";

        public const String appSecret = "c5e330214fb33e2d80f14e3fc45ed214";

        public static BMSEmployee SysAdmin = new BMSEmployee()
        {
            ID = -100,
            Grad = (int)BMSGrads.System,
            Name = "SHRIS",
            LoginName = DesUtil.encrypt("SHRISMCIS", appSecret),
            Password = DesUtil.encrypt("shrismcis", appSecret)
        };




        static BaseDAO()
        {

            String wDefaultString = StringUtils.parseString(GlobalConstant.GlobalConfiguration.GetValue("User.Default.Password"));
            if (StringUtils.isNotEmpty(wDefaultString) && wDefaultString.Length >= 8)
            {
                wDefaultString = DesUtil.decrypt(wDefaultString, appSecret);
                if (StringUtils.isNotEmpty(wDefaultString) && wDefaultString.Length >= 6)
                {
                    defaultPassword = wDefaultString;
                }
            }

            wDefaultString = StringUtils.parseString(GlobalConstant.GlobalConfiguration.GetValue("User.Admin.Name"));
            if (StringUtils.isNotEmpty(wDefaultString) && wDefaultString.Length >= 8)
            {
                wDefaultString = DesUtil.decrypt(wDefaultString, appSecret);
                if (StringUtils.isNotEmpty(wDefaultString) && wDefaultString.Length >= 6)
                {
                    wDefaultString = DesUtil.encrypt(wDefaultString, appSecret);
                    SysAdmin.LoginName = wDefaultString;
                }
            }
            wDefaultString = StringUtils.parseString(GlobalConstant.GlobalConfiguration.GetValue("User.Admin.Password"));
            if (StringUtils.isNotEmpty(wDefaultString) && wDefaultString.Length >= 8)
            {
                wDefaultString = DesUtil.decrypt(wDefaultString, appSecret);
                if (StringUtils.isNotEmpty(wDefaultString) && wDefaultString.Length >= 6)
                {
                    wDefaultString = DesUtil.encrypt(wDefaultString, appSecret);
                    SysAdmin.Password = wDefaultString;
                }
            }

        }

        public Boolean Execute(List<String> wSqlList)
        {
            Boolean wResult = false;
            if (wSqlList == null || wSqlList.Count <= 0)
                return wResult;

            wSqlList.RemoveAll(p => StringUtils.isEmpty(p));

            if (wSqlList.Count <= 0)
                return wResult;

            StringSQLTool.Instance.ExecuteSqlTransaction(wSqlList, mDBPool);

            return true;
        }



        protected String DefaultDateBaseName
        {
            get
            {
                return MESDBSource.Default.getDBName();
            }
        }


        protected Object GetMapObject(Dictionary<String, Object> wMap, String wKey)
        {
            Object wResult = null;
            try
            {
                if (wMap == null || wMap.Count < 1 || StringUtils.isEmpty(wKey))
                    return wResult;

                if (wMap.ContainsKey(wKey))
                    wResult = wMap[wKey];

            }
            catch (Exception e)
            {

                logger.Error("GetMapObject", e);
            }
            return wResult;
        }

        
        /*
         * protected String GetDataBaseName(MESDBSource wDataBaseFiled) { return
         * wDataBaseFiled.getDBName(); }
         */


        protected String MysqlChangeToSqlServer(String wMySqlString)
        {
            String wResult = DMLTool.ChangeToSqlServer(wMySqlString, out bool wSuccess);
            if (wSuccess)
            {
                wMySqlString = wResult;
            }
            return wMySqlString;
        }

        protected String DMLChange(String wMySqlString, DBEnumType wSQLTypeFiled)
        {
            switch (wSQLTypeFiled)
            {
                case DBEnumType.MySQL:
                    wMySqlString = wMySqlString.Replace("\\\\", "\\\\\\\\");
                    break;
                case DBEnumType.SQLServer:
                    wMySqlString = this.MysqlChangeToSqlServer(wMySqlString);
                    break;
                case DBEnumType.Oracle:

                    break;
                case DBEnumType.Access:

                    break;
                default:
                    break;
            }
            return wMySqlString;
        }

        protected String DMLChange(String wMySqlString)
        {
            switch (SQLType)
            {
                case DBEnumType.MySQL:
                    wMySqlString = wMySqlString.Replace("\\\\", "\\\\\\\\");
                    break;
                case DBEnumType.SQLServer:
                    wMySqlString = this.MysqlChangeToSqlServer(wMySqlString);
                    break;
                case DBEnumType.Oracle:

                    break;
                case DBEnumType.Access:

                    break;
                default:
                    break;
            }
            return wMySqlString;
        }

        /**
         * SelectAll数据量查询数据
         * 
         * @param wSQL      查询sql语句 用:冒号定义参数
         * @param wParamMap sql参数集
         * @param clazz     返回数据类型 注意sql返回的数据需与实体类型相匹配
         * @return
         */
        protected List<T> QueryForList<T>(String wSQL, Dictionary<String, Object> wParamMap)
        {

            List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQL, wParamMap);

            return JsonTool.JsonToObject<List<T>>(JsonTool.ObjectToJson(wQueryResultList));

        }

        /**
         * Select数据量查询数据
         * 
         * @param wSQL      查询sql语句 用:/@冒号定义参数
         * @param wParamMap sql参数集
         * @param clazz     返回数据类型 注意sql返回的数据需与实体类型相匹配 不准用简单类型
         * @return
         */
        protected T QueryForObject<T>(String wSQL, Dictionary<String, Object> wParamMap)
        {

            Dictionary<String, Object> wQueryResult = mDBPool.queryForMap(wSQL, wParamMap);

            return JsonTool.JsonToObject<T>(JsonTool.ObjectToJson(wQueryResult));

        }

        public void ExecuteSqlTransaction(List<String> wSqlList)
        {


            StringSQLTool.Instance.ExecuteSqlTransaction(wSqlList, this.mDBPool);

        }

        public void ExecuteSqlTransaction(String wSqlString)
        {

            String wSQL = this.DMLChange(wSqlString, SQLType);
            StringSQLTool.Instance.ExecuteSqlTransaction(wSQL, this.mDBPool);

        }

        public int GetMaxPrimaryKey(String wTableName, String wKey)
        {
            int wResult = 0;
            if (StringUtils.isEmpty(wTableName) || StringUtils.isEmpty(wKey))
                return wResult;

            String wSQL = StringUtils.Format("Select Max({0}) as ID from {1} ;", wKey, wTableName);
            List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQL, new Dictionary<string, object>());

            foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
            {
                wResult = StringUtils.parseInt(wSqlDataReader["ID"]);
            }
            return wResult;
        }

        public int Insert(String wTableName, Dictionary<String, Object> wData)
        {

            if (StringUtils.isEmpty(wTableName) || wData == null || wData.Count <= 0)
                return 0;

            List<String> wCloumns = new List<String>();

            List<String> wPData = new List<String>();

            foreach (String wCloumn in wData.Keys)
            {
                wCloumns.Add(wCloumn);
                wPData.Add("@" + wCloumn);
            }

            String wSQL = StringUtils.Format("insert into {0} ({1}) values ({2});", wTableName,
                    StringUtils.Join(",", wCloumns), StringUtils.Join(",", wPData));

            return (int)mDBPool.insert(wSQL, wData);

        }

        public void InsertDB(String wTableName, Dictionary<String, Object> wData)
        {

            if (StringUtils.isEmpty(wTableName) || wData == null || wData.Count <= 0)
                return;

            List<String> wCloumns = new List<String>();

            List<String> wPData = new List<String>();

            foreach (String wCloumn in wData.Keys)
            {
                wCloumns.Add(wCloumn);
                wPData.Add("@" + wCloumn);
            }

            String wSQL = StringUtils.Format("insert into {0} ({1}) values ({2});", wTableName,
                    StringUtils.Join(",", wCloumns), StringUtils.Join(",", wPData));

            mDBPool.insertDB(wSQL, wData);

        }

        public void Update(String wTableName, String wPrimaryKey, Dictionary<String, Object> wData)
        {

            if (StringUtils.isEmpty(wTableName) || StringUtils.isEmpty(wPrimaryKey) || wData == null || wData.Count <= 1
                    || !wData.ContainsKey(wPrimaryKey))
                return;

            List<String> wCloumns = new List<String>();

            foreach (String wCloumn in wData.Keys)
            {
                if (wPrimaryKey.Equals(wCloumn))
                    continue;
                wCloumns.Add(wCloumn + " = @" + wCloumn);
            }
            String wCondition = wPrimaryKey + " = @" + wPrimaryKey;

            String wSQL = StringUtils.Format("Update {0} set {1} where {2} ;", wTableName, StringUtils.Join(",", wCloumns),
                    wCondition);

            mDBPool.update(wSQL, wData);

        }

        public void Delete(String wTableName, Dictionary<String, Object> wData)
        {

            if (StringUtils.isEmpty(wTableName) || wData == null || wData.Count <= 0)
                return;

            List<String> wCloumns = new List<String>();

            foreach (String wCloumn in wData.Keys)
            {

                wCloumns.Add(wCloumn + " = @" + wCloumn);
            }

            String wSQL = StringUtils.Format("Delete from {0} where {1} ;", wTableName,
                    StringUtils.Join(" and ", wCloumns));

            mDBPool.update(wSQL, wData);

        }

        public String CreateNewName(String wOldName, List<String> wSourceList)
        {
            if (StringUtils.isEmpty(wOldName))
                wOldName = "NewName";

            if (wSourceList == null)
                wSourceList = new List<String>();
            foreach (String wString in wSourceList)
            {

                if (wOldName.Equals(wString, StringComparison.CurrentCultureIgnoreCase))
                {
                    if (wOldName.Length < 4)
                    {
                        wOldName += "-01";
                    }
                    else
                    {
                        string wSuff = wOldName.Substring(wOldName.LastIndexOf('-') + 1);
                        if (StringUtils.isNumeric(wSuff))
                        {
                            int wNum = StringUtils.parseInt(wSuff);
                            wOldName = wOldName.Substring(0, wOldName.LastIndexOf('-') + 1) + String.Format("{0:D2}", wNum + 1);
                        }
                        else
                        {
                            wOldName += "-01";
                        }
                    }
                    wOldName = this.CreateNewName(wOldName, wSourceList);
                    break;
                }
            }

            return wOldName;
        }


        public String GetNewCode(String wDefaultCode, String wPrevStr, String wTableName)
        {
            String wResult = wDefaultCode;


            if (StringUtils.isNotEmpty(wDefaultCode))
            {

                String[] split = StringUtils.split(wDefaultCode, "-");
                if (split.Length == 4 && DateTime.Now.ToString("MM-yyyy")
                        .Equals(StringUtils.Format("{0}-{1}", split[1], split[2])))
                {
                    return wDefaultCode;
                }

            }


            String wSQLText = StringUtils.Format(
                    "Select count(t.ID) as ItemCount from {0} t"
                            + " where t.CreateTime  between @StartTime and @EndTime   ;", wTableName);

            Dictionary<String, Object> wParms = new Dictionary<String, Object>();

            DateTime wStartTime = DateTime.Now.AddDays(1 - DateTime.Now.Day).Date;

            DateTime wEndTime = DateTime.Now.AddDays(1 - DateTime.Now.Day).Date.AddMonths(1).AddSeconds(-1);

            wParms.Add("StartTime", wStartTime);
            wParms.Add("EndTime", wEndTime);
            wSQLText = this.DMLChange(wSQLText);

            List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);

            foreach (Dictionary<String, Object> wReader in wQueryResultList)
            {

                wResult = StringUtils.Format("{0}-{1}-{2}", wPrevStr, wStartTime.ToString("MM-yyyy"),
                        String.Format("{0:D4}", StringUtils.parseInt(wReader["ItemCount"]) + 1));
            }

            return wResult;
        }


        public int GetPageCount(String wCondition, int wPageSize, Dictionary<String, Object> wParamMap)
        {
            String wSQLTextSize = "Select count(0) as ItemCount " + wCondition + ";";
            wSQLTextSize = this.DMLChange(wSQLTextSize);
            Dictionary<String, Object> wQueryResultDic = mDBPool.queryForMap(wSQLTextSize, wParamMap);
            int wSize = 0;
            if (wQueryResultDic != null && wQueryResultDic.ContainsKey("ItemCount"))
            {
                wSize = StringUtils.parseInt(wQueryResultDic["ItemCount"]);
            }
            if (wSize > 0)
                return wSize / wPageSize + (wSize % wPageSize > 0 ? 1 : 0);

            return 0;
        }

        public int GetDataCount(String wCondition, Dictionary<String, Object> wParamMap)
        {
            String wSQLTextSize = "Select count(0) as ItemCount " + wCondition + ";";
            wSQLTextSize = this.DMLChange(wSQLTextSize);
            Dictionary<String, Object> wQueryResultDic = mDBPool.queryForMap(wSQLTextSize, wParamMap);
            int wSize = 0;
            if (wQueryResultDic != null && wQueryResultDic.ContainsKey("ItemCount"))
            {
                wSize = StringUtils.parseInt(wQueryResultDic["ItemCount"]);
            }
            return wSize;
        }
    }
}
