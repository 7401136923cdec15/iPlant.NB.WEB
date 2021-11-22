using System;
using System.Collections.Generic;
using System.Reflection;
using NPOI.HSSF.Util;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;

namespace iPlant.Common.Tools
{
    class Helper
    {
        public string ExchangeDataToExcel(object wValue)
        {
            string wValueString = "";
            if (wValue == null)
                return wValueString;


            if (wValue is Array)
            {
                return string.Join(";", wValue);
            }
            if (wValue.GetType().Name.Contains("Dictionary"))
            {
                return JsonTool.ObjectToJson(wValue);
            }



            switch (wValue.GetType().Name)
            {
                case "Single":
                    wValueString = ((float)wValue).ToString("F2");
                    break;
                case "Double":
                    wValueString = ((double)wValue).ToString("F2");
                    break;
                case "DateTime":
                    wValueString = ((DateTime)wValue).ToString("yyyy-MM-dd hh:mm:ss");
                    break;
                default:
                    wValueString = wValue.ToString();
                    break;
            }
            return wValueString;
        }
        public Object ExchangeDataToData<T>(PropertyInfo wPropertyInfo, string wValue)
        {
            Object wObjectValue = new object();
            //List<PropertyInfo> wPropertyInfolist = new List<PropertyInfo>(typeof(T).GetProperties());

            //PropertyInfo wPropertyInfo = wPropertyInfolist.Find(p => p.Name == wFieldName);
            if (wPropertyInfo == null)
                return wValue;
            string wType = wPropertyInfo.PropertyType.Name;
            switch (wType)
            {
                case "Int32":
                    wObjectValue = Int32.Parse(wValue);
                    break;
                case "Boolean":
                    wObjectValue = Boolean.Parse(wValue);
                    break;
                case "Single":
                    wObjectValue = Single.Parse(wValue);
                    break;
                case "Double":
                    wObjectValue = Double.Parse(wValue);
                    break;
                case "DateTime":
                    wObjectValue = Convert.ToDateTime(wValue);
                    break;
                case "Byte":
                    wObjectValue = Byte.Parse(wValue);
                    break;
                default:
                    wObjectValue = wValue;
                    break;
            }

            return wObjectValue;
        }
        
        private Dictionary<ExcelStyle, ICellStyle> wICellStyleDictionary = new Dictionary<ExcelStyle, ICellStyle>();
        public ICellStyle Getcellstyle(IWorkbook wIWorkbook, ExcelStyle wExcelStyle)
        {
             
            if (wICellStyleDictionary == null)
                wICellStyleDictionary = new Dictionary<ExcelStyle, ICellStyle>();
            if (wICellStyleDictionary.ContainsKey(wExcelStyle))
                return wICellStyleDictionary[wExcelStyle];

            ICellStyle wICellStyle = wIWorkbook.CreateCellStyle();
            wICellStyle.Alignment = NPOI.SS.UserModel.HorizontalAlignment.Center;
            wICellStyle.VerticalAlignment = NPOI.SS.UserModel.VerticalAlignment.Center;

            wICellStyle.WrapText = true;
            IFont wIFont = wIWorkbook.CreateFont();
            #region 样式区别
            switch (wExcelStyle)
            {
                case ExcelStyle.Head:
                    wIFont.FontName = "宋体";  //字体
                    wIFont.Color = HSSFColor.Black.Index;
                    wIFont.IsItalic = true;
                    wIFont.IsBold = true;
                    wIFont.FontHeight = 16;
                    wIFont.FontHeightInPoints = 16;



                    wICellStyle.LeftBorderColor = HSSFColor.Grey80Percent.Index;
                    wICellStyle.RightBorderColor = HSSFColor.Grey80Percent.Index;//边框颜色
                    wICellStyle.BottomBorderColor = HSSFColor.Grey80Percent.Index;
                    wICellStyle.TopBorderColor = HSSFColor.Grey80Percent.Index;//边框颜色

                    wICellStyle.BorderBottom = NPOI.SS.UserModel.BorderStyle.Thick;
                    wICellStyle.BorderLeft = NPOI.SS.UserModel.BorderStyle.Thick;
                    wICellStyle.BorderRight = NPOI.SS.UserModel.BorderStyle.Thick;
                    wICellStyle.BorderTop = NPOI.SS.UserModel.BorderStyle.Thick;//边框

                    // wICellStyle.FillBackgroundColor = HSSFColor.Black.Index;//背景色
                    wICellStyle.FillForegroundColor = HSSFColor.Black.Index;//前景色
                    break;
                case ExcelStyle.Column:
                    wIFont.FontName = "宋体";  //字体
                    wIFont.Color = HSSFColor.Black.Index;
                    //    wIFont.IsItalic = true;//下划线  
                    wIFont.IsBold = true;
                    wIFont.FontHeight = 14;
                    wIFont.FontHeightInPoints = 14;

                    wICellStyle.BorderBottom = NPOI.SS.UserModel.BorderStyle.Thin;
                    wICellStyle.BorderLeft = NPOI.SS.UserModel.BorderStyle.Thin;
                    wICellStyle.BorderRight = NPOI.SS.UserModel.BorderStyle.Thin;

                    wICellStyle.LeftBorderColor = HSSFColor.Grey80Percent.Index;
                    wICellStyle.RightBorderColor = HSSFColor.Grey80Percent.Index;//边框颜色
                    wICellStyle.BottomBorderColor = HSSFColor.Grey80Percent.Index;


                    // wICellStyle.FillBackgroundColor = HSSFColor.Black.Index;//背景色
                    wICellStyle.FillForegroundColor = HSSFColor.Black.Index;//前景色
                    break;
                case ExcelStyle.Data:
                    wIFont.FontName = "宋体";  //字体
                    wIFont.Color = HSSFColor.Black.Index;
                    //   wIFont.IsItalic = true;//下划线  
                    wIFont.IsBold = false;
                    wIFont.FontHeight = 12;
                    wIFont.FontHeightInPoints = 12;

                    wICellStyle.BorderBottom = NPOI.SS.UserModel.BorderStyle.Thin;
                    wICellStyle.BorderLeft = NPOI.SS.UserModel.BorderStyle.Thin;
                    wICellStyle.BorderRight = NPOI.SS.UserModel.BorderStyle.Thin;

                    wICellStyle.LeftBorderColor = HSSFColor.Grey80Percent.Index;
                    wICellStyle.RightBorderColor = HSSFColor.Grey80Percent.Index;//边框颜色
                    wICellStyle.BottomBorderColor = HSSFColor.Grey80Percent.Index;

                    // wICellStyle.FillBackgroundColor = HSSFColor.Black.Index;//背景色
                    wICellStyle.FillForegroundColor = HSSFColor.Black.Index;//前景色
                    break;
                default:
                    break;
            }
            #endregion
            wICellStyle.SetFont(wIFont);
            wICellStyleDictionary.Add(wExcelStyle, wICellStyle);

            return wICellStyle;
        }
    }
}