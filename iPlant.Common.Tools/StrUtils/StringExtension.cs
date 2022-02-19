using System;

namespace iPlant.Common.Tools
{
    public static class StringExtension
    {


        public static String ParseToString(this object wObject)
        {
            if (wObject == null)
                return null;
            return wObject.ToString();
        }

        public static DateTime ParseToDate(this object wObject)
        {
            return StringUtils.parseDate(wObject);
        }

        public static T ParseToType<T>(this object wObject)
        {
            if (wObject == null || !(wObject is T))
                return default;
            return (T)wObject;
        }


        public static int ParseToInt(this Guid wGuid)
        {
            String wServerIDString = wGuid.ToString().Substring(26);
            if (int.TryParse(wServerIDString, out int wServerId))
            {
                return wServerId;
            }
            else
            {
                return 0;
            }

        }

        /// <summary>
        /// 将object转换为bool，若转换失败，则返回false。不抛出异常。  
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public static bool ParseToBool(this object str)
        {

            if (str is bool)
                return (bool)str;

            bool.TryParse(str.ToString(), out bool wResult);

            return wResult;

        }


        public static int ParseToInt(this object wObject)
        {
            return StringUtils.parseInt(wObject);
        }

        public static bool IsGuidNullOrEmpty(this Guid value)
        {
            if (value.ToString() == "")
                return true;
            if (value == Guid.Empty)
                return true;
            return false;

        }
    }
}