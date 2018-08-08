using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using System.Web;
using System.Security.Cryptography;
using NPOI.SS.Util;

namespace CMB.UserHeatmap.Web
{
    public class general
    {
        #region Excel导入
        /// <summary>
        /// 从Excel取数据并记录到List集合里
        /// </summary>
        /// <param name="cellHeard">单元头的值和名称：{ { "UserName", "姓名" }, { "Age", "年龄" } };</param>
        /// <param name="filePath">保存文件绝对路径</param>
        /// <param name="errorMsg">错误信息</param>
        /// <returns>转换后的List对象集合</returns>
        public static List<T> ExcelToEntityList<T>(Dictionary<string, string> cellHeard, string filePath, out StringBuilder errorMsg) where T : new()
        {
            List<T> enlist = new List<T>();
            errorMsg = new StringBuilder();
            try
            {
                if (Regex.IsMatch(filePath, ".xls$")) // 2003
                {
                    enlist = Excel2003ToEntityList<T>(cellHeard, filePath, out errorMsg);
                }
                else if (Regex.IsMatch(filePath, ".xlsx$")) // 2007
                {
                    //return FailureResultMsg("请选择Excel文件"); // 未设计
                }
                return enlist;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// 从Excel2003取数据并记录到List集合里
        /// </summary>
        /// <param name="cellHeard">单元头的Key和Value：{ { "UserName", "姓名" }, { "Age", "年龄" } };</param>
        /// <param name="filePath">保存文件绝对路径</param>
        /// <param name="errorMsg">错误信息</param>
        /// <returns>转换好的List对象集合</returns>
        private static List<T> Excel2003ToEntityList<T>(Dictionary<string, string> cellHeard, string filePath, out StringBuilder errorMsg) where T : new()
        {
            errorMsg = new StringBuilder(); // 错误信息,Excel转换到实体对象时，会有格式的错误信息
            List<T> enlist = new List<T>(); // 转换后的集合
            List<string> keys = cellHeard.Keys.ToList(); // 要赋值的实体对象属性名称
            try
            {
                using (FileStream fs = File.OpenRead(filePath))
                {
                    HSSFWorkbook workbook = new HSSFWorkbook(fs);
                    HSSFSheet sheet = (HSSFSheet)workbook.GetSheetAt(0); // 获取此文件第一个Sheet页
                    for (int i = 1; i <= sheet.LastRowNum; i++) // 从1开始，第0行为单元头
                    {
                        // 1.判断当前行是否空行，若空行就不在进行读取下一行操作，结束Excel读取操作
                        if (sheet.GetRow(i) == null)
                        {
                            break;
                        }

                        T en = new T();
                        string errStr = ""; // 当前行转换时，是否有错误信息，格式为：第1行数据转换异常：XXX列；
                        for (int j = 0; j < keys.Count; j++)
                        {
                            // 2.若属性头的名称包含'.',就表示是子类里的属性，那么就要遍历子类，eg：UserEn.TrueName
                            if (keys[j].IndexOf(".") >= 0)
                            {
                                // 2.1解析子类属性
                                string[] properotyArray = keys[j].Split(new string[] { "." }, StringSplitOptions.RemoveEmptyEntries);
                                string subClassName = properotyArray[0]; // '.'前面的为子类的名称
                                string subClassProperotyName = properotyArray[1]; // '.'后面的为子类的属性名称
                                System.Reflection.PropertyInfo subClassInfo = en.GetType().GetProperty(subClassName); // 获取子类的类型
                                if (subClassInfo != null)
                                {
                                    // 2.1.1 获取子类的实例
                                    var subClassEn = en.GetType().GetProperty(subClassName).GetValue(en, null);
                                    // 2.1.2 根据属性名称获取子类里的属性信息
                                    System.Reflection.PropertyInfo properotyInfo = subClassInfo.PropertyType.GetProperty(subClassProperotyName);
                                    if (properotyInfo != null)
                                    {
                                        try
                                        {
                                            // Excel单元格的值转换为对象属性的值，若类型不对，记录出错信息
                                            properotyInfo.SetValue(subClassEn, GetExcelCellToProperty(properotyInfo.PropertyType, sheet.GetRow(i).GetCell(j)), null);
                                        }
                                        catch (Exception e)
                                        {
                                            if (errStr.Length == 0)
                                            {
                                                errStr = "第" + i + "行数据转换异常：";
                                            }
                                            errStr += cellHeard[keys[j]] + "列；";
                                        }

                                    }
                                }
                            }
                            else
                            {
                                // 3.给指定的属性赋值
                                System.Reflection.PropertyInfo properotyInfo = en.GetType().GetProperty(keys[j]);
                                if (properotyInfo != null)
                                {
                                    try
                                    {
                                        // Excel单元格的值转换为对象属性的值，若类型不对，记录出错信息
                                        properotyInfo.SetValue(en, GetExcelCellToProperty(properotyInfo.PropertyType, sheet.GetRow(i).GetCell(j)), null);
                                    }
                                    catch (Exception e)
                                    {
                                        if (errStr.Length == 0)
                                        {
                                            errStr = "第" + i + "行数据转换异常：";
                                        }
                                        errStr += cellHeard[keys[j]] + "列；";
                                    }
                                }
                            }
                        }
                        // 若有错误信息，就添加到错误信息里
                        if (errStr.Length > 0)
                        {
                            errorMsg.AppendLine(errStr);
                        }
                        enlist.Add(en);
                    }
                }
                return enlist;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        #endregion Excel导入

        #region Excel导出

        /// <summary>
        /// 实体类集合导出到EXCLE2003
        /// </summary>
        /// <param name="cellHeard">单元头的Key和Value：{ { "UserName", "姓名" }, { "Age", "年龄" } };</param>
        /// <param name="enList">数据源</param>
        /// <param name="sheetName">工作表名称</param>
        /// <returns>文件的下载地址</returns>
        public static string EntityListToExcel2003(Dictionary<string, string> cellHeard, IList enList, string sheetName)
        {
            try
            {
                string fileName = sheetName + "-" + DateTime.Now.ToString("yyyyMMddHHmmssfff") + ".xls"; // 文件名称
                string urlPath = "UpFiles/ExcelFiles/" + fileName; // 文件下载的URL地址，供给前台下载
                string filePath = HttpContext.Current.Server.MapPath("\\" + urlPath); // 文件路径

                // 1.检测是否存在文件夹，若不存在就建立个文件夹
                string directoryName = Path.GetDirectoryName(filePath);
                if (!Directory.Exists(directoryName))
                {
                    Directory.CreateDirectory(directoryName);
                }

                //打开已经存在的excel
                //DirectoryInfo excelDir = new DirectoryInfo(strCurrentDir + "\\ExcelReports");
                //HSSFWorkbook hssfworkbook = new HSSFWorkbook(new FileStream(excelDir.FullName + "\\SrayExcelReport.xlt",FileMode.Open));
                // 2.解析单元格头部，设置单元头的中文名称
                HSSFWorkbook workbook = new HSSFWorkbook(); // 工作簿
                ISheet sheet = workbook.CreateSheet(sheetName); // 工作表             
                IRow row = sheet.CreateRow(0);
                List<string> keys = cellHeard.Keys.ToList();
                for (int i = 0; i < keys.Count; i++)
                {
                    row.CreateCell(i).SetCellValue(cellHeard[keys[i]]); // 列名为Key的值
                }
                sheet.CreateFreezePane(0, 1, 0, 1);
                // 3.List对象的值赋值到Excel的单元格里
                int rowIndex = 1; // 从第二行开始赋值(第一行已设置为单元头)
                foreach (var en in enList)
                {
                    IRow rowTmp = sheet.CreateRow(rowIndex);
                    for (int i = 0; i < keys.Count; i++) // 根据指定的属性名称，获取对象指定属性的值
                    {
                        string cellValue = ""; // 单元格的值
                        object properotyValue = null; // 属性的值
                        System.Reflection.PropertyInfo properotyInfo = null; // 属性的信息

                        // 3.1 若属性头的名称包含'.',就表示是子类里的属性，那么就要遍历子类，eg：UserEn.UserName
                        if (keys[i].IndexOf(".") >= 0)
                        {
                            // 3.1.1 解析子类属性(这里只解析1层子类，多层子类未处理)
                            string[] properotyArray = keys[i].Split(new string[] { "." }, StringSplitOptions.RemoveEmptyEntries);
                            string subClassName = properotyArray[0]; // '.'前面的为子类的名称
                            string subClassProperotyName = properotyArray[1]; // '.'后面的为子类的属性名称
                            System.Reflection.PropertyInfo subClassInfo = en.GetType().GetProperty(subClassName); // 获取子类的类型
                            if (subClassInfo != null)
                            {
                                // 3.1.2 获取子类的实例
                                var subClassEn = en.GetType().GetProperty(subClassName).GetValue(en, null);
                                // 3.1.3 根据属性名称获取子类里的属性类型
                                properotyInfo = subClassInfo.PropertyType.GetProperty(subClassProperotyName);
                                if (properotyInfo != null)
                                {
                                    properotyValue = properotyInfo.GetValue(subClassEn, null); // 获取子类属性的值
                                }
                            }
                        }
                        else
                        {
                            // 3.2 若不是子类的属性，直接根据属性名称获取对象对应的属性
                            properotyInfo = en.GetType().GetProperty(keys[i]);
                            if (properotyInfo != null)
                            {
                                properotyValue = properotyInfo.GetValue(en, null);
                            }
                        }

                        // 3.3 属性值经过转换赋值给单元格值
                        if (properotyValue != null)
                        {
                            cellValue = properotyValue.ToString();
                            // 3.3.1 对时间初始值赋值为空
                            if (cellValue.Trim() == "0001/1/1 0:00:00" || cellValue.Trim() == "0001/1/1 23:59:59")
                            {
                                cellValue = "";
                            }
                        }

                        // 3.4 填充到Excel的单元格里
                        rowTmp.CreateCell(i).SetCellValue(cellValue);
                    }
                    rowIndex++;
                }

                // 4.生成文件
                FileStream file = new FileStream(filePath, FileMode.Create);
                workbook.Write(file);
                file.Close();

                // 5.返回下载路径
                return urlPath;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public static string EntityListToExcel2003(Dictionary<string, string> cellHeard, IList enList, string fileName, string sheetName)
        {
            try
            {
                string urlPath = "UpFiles/ExcelFiles/" + fileName; // 文件下载的URL地址，供给前台下载
                string filePath = HttpContext.Current.Server.MapPath("\\" + urlPath); // 文件路径

                // 1.检测是否存在文件夹，若不存在就建立个文件夹
                string directoryName = Path.GetDirectoryName(filePath);
                if (!Directory.Exists(directoryName))
                {
                    Directory.CreateDirectory(directoryName);
                }

                //打开已经存在的excel
                //DirectoryInfo excelDir = new DirectoryInfo(strCurrentDir + "\\ExcelReports");
                //HSSFWorkbook hssfworkbook = new HSSFWorkbook(new FileStream(excelDir.FullName + "\\SrayExcelReport.xlt",FileMode.Open));
                // 2.解析单元格头部，设置单元头的中文名称
                HSSFWorkbook workbook = new HSSFWorkbook(); // 工作簿
                if (File.Exists(filePath))
                {
                    workbook = new HSSFWorkbook(new FileStream(filePath, FileMode.Open));
                    File.Delete(filePath);
                }
                ISheet sheet = workbook.CreateSheet(sheetName); // 工作表
                //设置固定的行
                IRow row = sheet.CreateRow(0);
                List<string> keys = cellHeard.Keys.ToList();
                for (int i = 0; i < keys.Count; i++)
                {
                    row.CreateCell(i).SetCellValue(cellHeard[keys[i]]); // 列名为Key的值
                }
                sheet.CreateFreezePane(0, 1, 0, 1);
                // 3.List对象的值赋值到Excel的单元格里
                int rowIndex = 1; // 从第二行开始赋值(第一行已设置为单元头)
                foreach (var en in enList)
                {
                    IRow rowTmp = sheet.CreateRow(rowIndex);
                    for (int i = 0; i < keys.Count; i++) // 根据指定的属性名称，获取对象指定属性的值
                    {
                        string cellValue = ""; // 单元格的值
                        object properotyValue = null; // 属性的值
                        System.Reflection.PropertyInfo properotyInfo = null; // 属性的信息

                        // 3.1 若属性头的名称包含'.',就表示是子类里的属性，那么就要遍历子类，eg：UserEn.UserName
                        if (keys[i].IndexOf(".") >= 0)
                        {
                            // 3.1.1 解析子类属性(这里只解析1层子类，多层子类未处理)
                            string[] properotyArray = keys[i].Split(new string[] { "." }, StringSplitOptions.RemoveEmptyEntries);
                            string subClassName = properotyArray[0]; // '.'前面的为子类的名称
                            string subClassProperotyName = properotyArray[1]; // '.'后面的为子类的属性名称
                            System.Reflection.PropertyInfo subClassInfo = en.GetType().GetProperty(subClassName); // 获取子类的类型
                            if (subClassInfo != null)
                            {
                                // 3.1.2 获取子类的实例
                                var subClassEn = en.GetType().GetProperty(subClassName).GetValue(en, null);
                                // 3.1.3 根据属性名称获取子类里的属性类型
                                properotyInfo = subClassInfo.PropertyType.GetProperty(subClassProperotyName);
                                if (properotyInfo != null)
                                {
                                    properotyValue = properotyInfo.GetValue(subClassEn, null); // 获取子类属性的值
                                }
                            }
                        }
                        else
                        {
                            // 3.2 若不是子类的属性，直接根据属性名称获取对象对应的属性
                            properotyInfo = en.GetType().GetProperty(keys[i]);
                            if (properotyInfo != null)
                            {
                                properotyValue = properotyInfo.GetValue(en, null);
                            }
                        }

                        // 3.3 属性值经过转换赋值给单元格值
                        if (properotyValue != null)
                        {
                            cellValue = properotyValue.ToString();
                            // 3.3.1 对时间初始值赋值为空
                            if (cellValue.Trim() == "0001/1/1 0:00:00" || cellValue.Trim() == "0001/1/1 23:59:59")
                            {
                                cellValue = "";
                            }
                        }

                        // 3.4 填充到Excel的单元格里
                        rowTmp.CreateCell(i).SetCellValue(cellValue);
                    }
                    rowIndex++;
                }
                // 生成文件
                FileStream file = new FileStream(filePath, FileMode.Create);
                workbook.Write(file);
                file.Close();

                // 5.返回下载路径
                return urlPath;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        #endregion Excel导出
        /// <summary>
        /// 复制excelsheet页
        /// </summary>
        /// <param name="originPath"></param>
        /// <param name="originSheet"></param>
        /// <param name="targetPath"></param>
        /// <param name="targetSheet"></param>
        public static void CopySheet(string originPath, string originSheetName, string targetPath, string targetSheetName)
        {
            try
            {
                string oFilePath = HttpContext.Current.Server.MapPath("\\" + originPath); // 文件路径
                string tFilePath = HttpContext.Current.Server.MapPath("\\" + targetPath); // 文件路径
                HSSFWorkbook oWorkbook = new HSSFWorkbook(new FileStream(oFilePath, FileMode.Open));
                HSSFWorkbook tWorkbook = new HSSFWorkbook();
                if (File.Exists(tFilePath))
                {
                    tWorkbook = new HSSFWorkbook(new FileStream(tFilePath, FileMode.Open));
                    //File.Delete(tFilePath);
                }
                //ISheet targetSheet = tWorkbook.CreateSheet(targetSheetName); // 工作表
                HSSFSheet originShee = oWorkbook.GetSheet(originSheetName) as HSSFSheet;
                var row = originShee.GetRow(1);
                originShee.CopyTo(tWorkbook, targetSheetName, true, true);

                using (FileStream fileSave = new FileStream(tFilePath, FileMode.Open, FileAccess.Write))
                {
                    tWorkbook.Write(fileSave);
                    fileSave.Close();
                }
            }
            catch (Exception ex)
            {
                Logger.Log.Error(ex.StackTrace + $"\n{ex.Message}");
            }

        }
        public static void mergeSheet(string originPath, string originSheetName, string targetPath, string targetSheetName)
        {
            try
            {
                string oFilePath = HttpContext.Current.Server.MapPath("\\" + originPath); // 文件路径
                string tFilePath = HttpContext.Current.Server.MapPath("\\" + targetPath); // 文件路径
                HSSFWorkbook oWorkbook = new HSSFWorkbook(new FileStream(oFilePath, FileMode.Open));
                HSSFWorkbook tWorkbook = new HSSFWorkbook();
                if (File.Exists(tFilePath))
                {
                    tWorkbook = new HSSFWorkbook(new FileStream(tFilePath, FileMode.Open));
                    //File.Delete(tFilePath);
                }
                HSSFSheet targetSheet = tWorkbook.GetSheet(targetSheetName) as HSSFSheet; // 工作表
                HSSFSheet originShee = oWorkbook.GetSheet(originSheetName) as HSSFSheet;
                copyRows(tWorkbook, oWorkbook, originShee, targetSheet, originShee.FirstRowNum, originShee.LastRowNum, targetSheet.LastRowNum);
                using (FileStream fileSave = new FileStream(tFilePath, FileMode.Open, FileAccess.Write))
                {
                    tWorkbook.Write(fileSave);
                    fileSave.Close();
                }
            }
            catch (Exception ex)
            {
                Logger.Log.Error(ex.StackTrace + $"\n{ex.Message}");
            }

        }
        /// <summary>
        /// 复制行
        /// </summary>
        /// <param name="destWorkBook"></param>
        /// <param name="sourceWorkBook"></param>
        /// <param name="sourceSheet"></param>
        /// <param name="targetSheet"></param>
        /// <param name="pStartRow"></param>
        /// <param name="pEndRow"></param>
        /// <param name="pPosition"></param>
        public static void copyRows(HSSFWorkbook destWorkBook, HSSFWorkbook sourceWorkBook, HSSFSheet sourceSheet, HSSFSheet targetSheet, int pStartRow, int pEndRow, int pPosition)
        {
            IRow sourceRow = null;
            IRow targetRow = null;
            ICell sourceCell = null;
            ICell targetCell = null;
            CellType cType;
            int i;
            int j;
            int targetRowFrom;
            int targetRowTo;

            if ((pStartRow == -1) || (pEndRow == -1))
            {
                return;
            }

            List<CellRangeAddress> oldRanges = new List<CellRangeAddress>();
            for (i = 0; i < sourceSheet.NumMergedRegions; i++)
            {
                oldRanges.Add(sourceSheet.GetMergedRegion(i));
            }

            // 拷贝合并的单元格。原理：复制当前合并单元格后，原位置的格式会移动到新位置，需在原位置生成旧格式  
            for (int k = 0; k < oldRanges.Count(); k++)
            {
                CellRangeAddress oldRange = oldRanges.ElementAt(k);
                CellRangeAddress newRange = new CellRangeAddress(oldRange
                        .FirstRow, oldRange.LastRow, oldRange
                        .FirstColumn, oldRange.LastColumn);

                if (oldRange.FirstRow >= pStartRow
                        && oldRange.LastRow <= pEndRow)
                {
                    targetRowFrom = oldRange.FirstRow - pStartRow + pPosition;
                    targetRowTo = oldRange.LastRow - pStartRow + pPosition;
                    oldRange.FirstRow = (targetRowFrom);
                    oldRange.LastRow = (targetRowTo);
                    targetSheet.AddMergedRegion(oldRange);
                    sourceSheet.AddMergedRegion(newRange);
                }
            }
            // 设置列宽  
            for (i = pStartRow; i <= pEndRow; i++)
            {
                sourceRow = sourceSheet.GetRow(i);
                if (sourceRow != null)
                {
                    for (j = sourceRow.LastCellNum; j > sourceRow.FirstCellNum; j--)
                    {
                        targetSheet.SetColumnWidth(j, sourceSheet.GetColumnWidth(j));
                        targetSheet.SetColumnHidden(j, false);
                    }
                    break;
                }
            }
            // 拷贝行并填充数据  
            for (; i <= pEndRow; i++)
            {
                sourceRow = sourceSheet.GetRow(i);
                if (sourceRow == null)
                {
                    continue;
                }
                targetRow = targetSheet.CreateRow(i - pStartRow + pPosition);
                targetRow.Height = (sourceRow.Height);
                for (j = sourceRow.FirstCellNum; j <= sourceRow.PhysicalNumberOfCells; j++)
                {
                    sourceCell = sourceRow.GetCell(j);
                    if (sourceCell == null)
                    {
                        continue;
                    }
                    targetCell = targetRow.CreateCell(j);

                    //样式的设置  
                    ICellStyle cStyle = destWorkBook.CreateCellStyle();
                    cStyle.CloneStyleFrom(sourceCell.CellStyle);
                    targetCell.CellStyle = (cStyle);

                    cType = sourceCell.CellType;
                    targetCell.SetCellType(cType);
                    targetCell.SetCellValue(sourceCell.StringCellValue);
                    switch (cType)
                    {
                        case CellType.Boolean:
                            targetCell.SetCellValue(sourceCell.BooleanCellValue);
                            // System.out.println("--------TYPE_BOOLEAN:" + targetCell.getBooleanCellValue());  
                            break;
                        case CellType.Error:
                            targetCell.SetCellErrorValue(sourceCell.ErrorCellValue);
                            // System.out.println("--------TYPE_ERROR:" + targetCell.getErrorCellValue());  
                            break;
                        case CellType.Formula:
                            // parseFormula这个函数的用途在后面说明  
                            targetCell.SetCellFormula(parseFormula(sourceCell.CellFormula));
                            // System.out.println("--------TYPE_FORMULA:" + targetCell.getCellFormula());  
                            break;
                        case CellType.Numeric:
                            targetCell.SetCellValue(sourceCell.NumericCellValue);
                            // System.out.println("--------TYPE_NUMERIC:" + targetCell.getNumericCellValue());  
                            break;
                        case CellType.String:
                            targetCell.SetCellValue(sourceCell.RichStringCellValue);
                            // System.out.println("--------TYPE_STRING:" + i + targetCell.getRichStringCellValue());  
                            break;
                    }
                }
            }
        }
        /** 
 * 处理公式 
 * @param pPOIFormula 
 * @return 
 */
        private static String parseFormula(String pPOIFormula)
        {
            String cstReplaceString = "ATTR(semiVolatile)"; //$NON-NLS-1$  
            StringBuilder result = null;
            int index;
            result = new StringBuilder();
            index = pPOIFormula.IndexOf(cstReplaceString);
            if (index >= 0)
            {
                result.Append(pPOIFormula.Substring(0, index));
                result.Append(pPOIFormula.Substring(index + cstReplaceString.Length));
            }
            else
            {
                result.Append(pPOIFormula);
            }
            return result.ToString();
        }

        /// <summary>
        /// 保存Excel文件
        /// <para>Excel的导入导出都会在服务器生成一个文件</para>
        /// <para>路径：UpFiles/ExcelFiles</para>
        /// </summary>
        /// <param name="file">传入的文件对象</param>
        /// <returns>如果保存成功则返回文件的位置;如果保存失败则返回空</returns>
        public static string SaveExcelFile(HttpPostedFile file)
        {
            try
            {
                var fileName = file.FileName.Insert(file.FileName.LastIndexOf('.'), "-" + DateTime.Now.ToString("yyyyMMddHHmmssfff"));
                var filePath = Path.Combine(HttpContext.Current.Server.MapPath("~/UpFiles/ExcelFiles"), fileName);
                string directoryName = Path.GetDirectoryName(filePath);
                if (!Directory.Exists(directoryName))
                {
                    Directory.CreateDirectory(directoryName);
                }
                file.SaveAs(filePath);
                return filePath;
            }
            catch
            {
                return string.Empty;
            }
        }

        /// <summary>
        /// 从Excel获取值传递到对象的属性里
        /// </summary>
        /// <param name="distanceType">目标对象类型</param>
        /// <param name="sourceCell">对象属性的值</param>
        private static Object GetExcelCellToProperty(Type distanceType, ICell sourceCell)
        {
            object rs = distanceType.IsValueType ? Activator.CreateInstance(distanceType) : null;

            // 1.判断传递的单元格是否为空
            if (sourceCell == null || string.IsNullOrEmpty(sourceCell.ToString()))
            {
                return rs;
            }

            // 2.Excel文本和数字单元格转换，在Excel里文本和数字是不能进行转换，所以这里预先存值
            object sourceValue = null;
            switch (sourceCell.CellType)
            {
                case CellType.Blank:
                    break;

                case CellType.Boolean:
                    break;

                case CellType.Error:
                    break;

                case CellType.Formula:
                    break;

                case CellType.Numeric:
                    sourceValue = sourceCell.NumericCellValue;
                    break;

                case CellType.String:
                    sourceValue = sourceCell.StringCellValue;
                    break;

                case CellType.Unknown:
                    break;

                default:
                    break;
            }

            string valueDataType = distanceType.Name;

            // 在这里进行特定类型的处理
            switch (valueDataType.ToLower()) // 以防出错，全部小写
            {
                case "string":
                    rs = sourceValue.ToString();
                    break;
                case "int":
                case "int16":
                case "int32":
                    rs = (int)Convert.ChangeType(sourceCell.NumericCellValue.ToString(), distanceType);
                    break;
                case "float":
                case "single":
                    rs = (float)Convert.ChangeType(sourceCell.NumericCellValue.ToString(), distanceType);
                    break;
                case "datetime":
                    rs = sourceCell.DateCellValue;
                    break;
                case "guid":
                    rs = (Guid)Convert.ChangeType(sourceCell.NumericCellValue.ToString(), distanceType);
                    return rs;
            }
            return rs;
        }
        public static void WipeFile(string filename, int timesToWrite)
        {
            try
            {
                if (File.Exists(filename))
                {
                    //设置文件的属性为正常，这是为了防止文件是只读  
                    File.SetAttributes(filename, FileAttributes.Normal);
                    //计算扇区数目  
                    double sectors = Math.Ceiling(new FileInfo(filename).Length / 512.0);
                    // 创建一个同样大小的虚拟缓存  
                    byte[] dummyBuffer = new byte[512];
                    // 创建一个加密随机数目生成器  
                    RNGCryptoServiceProvider rng = new RNGCryptoServiceProvider();
                    // 打开这个文件的FileStream  
                    FileStream inputStream = new FileStream(filename, FileMode.Open, FileAccess.Write, FileShare.ReadWrite);
                    for (int currentPass = 0; currentPass < timesToWrite; currentPass++)
                    {
                        // 文件流位置  
                        inputStream.Position = 0;
                        //循环所有的扇区  
                        for (int sectorsWritten = 0; sectorsWritten < sectors; sectorsWritten++)
                        {
                            //把垃圾数据填充到流中  
                            rng.GetBytes(dummyBuffer);
                            // 写入文件流中  
                            inputStream.Write(dummyBuffer, 0, dummyBuffer.Length);
                        }
                    }
                    // 清空文件  
                    inputStream.SetLength(0);
                    // 关闭文件流  
                    inputStream.Close();
                    // 清空原始日期需要  
                    DateTime dt = new DateTime(2037, 1, 1, 0, 0, 0);
                    File.SetCreationTime(filename, dt);
                    File.SetLastAccessTime(filename, dt);
                    File.SetLastWriteTime(filename, dt);
                    // 删除文件  
                    File.Delete(filename);
                }
            }
            catch (Exception ex)
            {
                Logger.Log.Error(ex.StackTrace);
            }
        }
    }
}
