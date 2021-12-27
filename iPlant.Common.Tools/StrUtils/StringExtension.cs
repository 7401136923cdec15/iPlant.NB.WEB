using System;

namespace iPlant.Common.Tools
{
    public static class StringExtension {


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

  
        public static int ParseToInt(this object wObject)
        {
            return StringUtils.parseInt(wObject);
        }

        public static bool IsGuidNullOrEmpty(this Guid value)
        {
            if (value == null || value.ToString() == "")
                return true;
            if (value == Guid.Empty)
                return true;
            return false;

        }
    }
}