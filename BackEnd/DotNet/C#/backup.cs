using CMB.UserHeatmap.Entities;
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Http;
using System.Web.Script.Serialization;

namespace CMB.UserHeatmap.Web.Controllers
{
    public class thirdHeatmapController : ApiController
    {
        // GET api/<controller>
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        /// <summary>
        /// 根据网点及类型获取热力图坐标点
        /// </summary>
        /// <param name="siteId">网点id</param>
        /// <param name="pointType">坐标类型（123 参看PointType枚举类）</param>
        /// <param name="distance">坐标类型（123 参看PointType枚举类）</param>
        /// <returns></returns>
        public OperationResult GetPointsBySite(int siteId, int pointType, int distance)
        {
            var result = new OperationResult();

            try
            {
                using (var db = new HeatMapEntities())
                {
                    var data = db.Pro_GetBankUserCount(siteId, pointType, distance).ToList().Select(x => new HeatmapPoint
                    {
                        lng = x.Longitude,
                        lat = x.Latitude,
                        userCount = x.UserCount
                    });

                    result.ReturnData = data;
                    result.ReturnCode = 1;
                }
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.ReturnCode = 0;
                Logger.Log.Error(ex.StackTrace);
            }

            return result;
        }
        /// <summary>
        /// 获取网点相关数据
        /// </summary>
        /// <param name="isGetPointsBySite"></param>
        /// <param name="userID"></param>
        /// <param name="param"></param>
        /// <returns></returns>
        public OperationResult PostPointsBySite(Boolean isGetPointsBySite, string userID, siteParams param)
        {
            var result = new OperationResult();
            List<HeatmapPoint> CMBData = new List<HeatmapPoint>();
            List<_3rdPartyPoints> _3rdPartyData = new List<_3rdPartyPoints>();
            var ip = HostIP.GetHostAddress();
            int aum11 = 0, aum12 = 0, aum13 = 0, aum14 = 0, aum15 = 0, aum16 = 0, ump21 = 0, ump22 = 0, ump23 = 0, tCount =0;
            var AumStatisticList = new List<Pro_GetAnywhereAUMStatisticsData_Result>();
            var UmpStatisticList = new List<Pro_GetAnywhereUMPStatisticsData_Result>();
            
            CommomMethods.visitLog(2, param.bankID, userID);
            try
            {
                using (var db = new HeatMapEntities())
                {
                     CMBData = db.Pro_GetBankData(param.bankID, param.type, param.isAum, param.AUMLevel, param.UMPLlevel, param.isNoDF, param.isCheck, param.distance).Select(x => new HeatmapPoint
                     {
                        lng = x.Longitude,
                        lat = x.Latitude,
                        userCount = x.UserCount,
                        aumCount = x.AUMMoney,
                        deposit = x.DepositMoney,
                        Distance=x.Distance,
                        AUM_level=x.AUM_level,
                        UMP_level = x.UMP_level
                     }).ToList();
                   
                    var statisticData= db.Pro_GetBankStatistics(param.bankID, param.isAum, param.AUMLevel, param.UMPLlevel, param.isNoDF).ToList();
                    if (param.type == 1 || param.type == 2)
                    {
                        tCount = (int)db.Pro_GetTwoBranchUserCount(param.bankID).FirstOrDefault().UserCount;
                        foreach (var point in statisticData)
                        {
                            //AUM统计
                            switch (point.AUM_level)
                            {
                                case 11: aum11 += (int)point.UserCount; break;
                                case 12: aum12 += (int)point.UserCount; break;
                                case 13: aum13 += (int)point.UserCount; break;
                                case 14: aum14 += (int)point.UserCount; break;
                                case 15: aum15 += (int)point.UserCount; break;
                                case 16: aum16 += (int)point.UserCount; break;
                                default: break;
                            }
                            //UMP统计
                            switch (point.UMP_level)
                            {
                                case 21: ump21 += (int)point.UserCount; break;
                                case 22: ump22 += (int)point.UserCount; break;
                                case 23: ump23 += (int)point.UserCount; break;
                                default: break;
                            }
                        }
                    }
                    else if (param.type == 3 || param.type == 4)
                    {
                        tCount = (int)CMBData.Sum(x=>x.userCount);
                        foreach (var point in CMBData)
                        {
                            //AUM统计
                            switch (point.AUM_level)
                            {
                                case 11: aum11 += (int)point.userCount; break;
                                case 12: aum12 += (int)point.userCount; break;
                                case 13: aum13 += (int)point.userCount; break;
                                case 14: aum14 += (int)point.userCount; break;
                                case 15: aum15 += (int)point.userCount; break;
                                case 16: aum16 += (int)point.userCount; break;
                                default: break;
                            }
                            //UMP统计
                            switch (point.UMP_level)
                            {
                                case 21: ump21 += (int)point.userCount; break;
                                case 22: ump22 += (int)point.userCount; break;
                                case 23: ump23 += (int)point.userCount; break;
                                default: break;
                            }
                        }
                    }
                    AumStatisticList.Add(new Pro_GetAnywhereAUMStatisticsData_Result { AUM_level = 11, AUM_Name = "零资产", UserCount = aum11, Total = tCount, Percent = aum11 * 100 / (decimal)tCount });
                    AumStatisticList.Add(new Pro_GetAnywhereAUMStatisticsData_Result { AUM_level = 12, AUM_Name = "非零不达标基客", UserCount = aum12, Total = tCount, Percent = aum12 * 100 / (decimal)tCount });
                    AumStatisticList.Add(new Pro_GetAnywhereAUMStatisticsData_Result { AUM_level = 13, AUM_Name = "达标基客", UserCount = aum13, Total = tCount, Percent = aum13 * 100 / (decimal)tCount });
                    AumStatisticList.Add(new Pro_GetAnywhereAUMStatisticsData_Result { AUM_level = 14, AUM_Name = "金卡", UserCount = aum14, Total = tCount, Percent = aum14 * 100 / (decimal)tCount });
                    AumStatisticList.Add(new Pro_GetAnywhereAUMStatisticsData_Result { AUM_level = 15, AUM_Name = "金葵花", UserCount = aum15, Total = tCount, Percent = aum15 * 100 / (decimal)tCount });
                    AumStatisticList.Add(new Pro_GetAnywhereAUMStatisticsData_Result { AUM_level = 16, AUM_Name = "私钻", UserCount = aum16, Total = tCount, Percent = aum16 * 100 / (decimal)tCount });
                    UmpStatisticList.Add(new Pro_GetAnywhereUMPStatisticsData_Result { UMP_level = 21, UMP_Name = "潜力金卡", UserCount = ump21, Total = tCount, Percent = ump21 * 100 / (decimal)tCount });
                    UmpStatisticList.Add(new Pro_GetAnywhereUMPStatisticsData_Result { UMP_level = 22, UMP_Name = "潜力金葵花", UserCount = ump22, Total = tCount, Percent = ump22 * 100 / (decimal)tCount });
                    UmpStatisticList.Add(new Pro_GetAnywhereUMPStatisticsData_Result { UMP_level = 23, UMP_Name = "潜力私钻", UserCount = ump23, Total = tCount, Percent = ump23 * 100 / (decimal)tCount });
                    var PoiStatisticData = CommomMethods.GetSitePoiStatisticData(param.bankID);
                    if (param.type == 3 || param.type == 4)
                    {
                        _3rdPartyData = db.Pro_GetAnywhere3rdData(param.lat, param.lng, param.distance, (int)PointType.Work).Select(x => new _3rdPartyPoints
                        {
                            lng = x.Longitude,
                            lat = x.Latitude,
                            thirdParty = Convert.ToInt32(x.UserCount),
                            Distance = x.Distance
                        }).ToList();
                        var sitePonetranceList = CommomMethods.CalSiteRelPonetrance(CMBData, _3rdPartyData);
                        result.ReturnData = new
                        {
                            CMBData = CMBData,
                            _3rdPartyData = _3rdPartyData,
                            PoiStatisticData = PoiStatisticData,
                            sitePonetranceData = sitePonetranceList,
                            AumStatisticList= AumStatisticList,
                            UmpStatisticList = UmpStatisticList
                        };
                    }
                    else
                    {
                        result.ReturnData = new
                        {
                            CMBData = CMBData,
                            PoiStatisticData = PoiStatisticData,
                            AumStatisticList = AumStatisticList,
                            UmpStatisticList= UmpStatisticList
                        };
                    }
                    result.ReturnCode = 1;
                }
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.ReturnCode = 0;
                Logger.Log.Error(ex.StackTrace);
            }
            return result;
        }
        /// <summary>
        /// 获取网点级别资产统计数据
        /// </summary>
        /// <param name="isPostBankStatisticData"></param>
        /// <param name="param"></param>
        /// <returns></returns>
        public OperationResult PostBankStatisticData(Boolean isPostBankStatisticData, siteStatisticParam param)
        {
            var result = new OperationResult();
            try
            {
                using (var db = new HeatMapEntities())
                {
                    var data = param.AumStatisticList;
                    // 1.获取数据集合
                    var dataList = new List<statistic_2>();
                    ArrayList PenetranceList = new ArrayList();
                    foreach (var item in data)
                    {
                        dataList.Add(new statistic_2
                        {
                            name = item.AUM_Name,
                            count = item.UserCount.ToString(),
                            percent = Math.Round((decimal)item.Percent, 2).ToString() + "%"
                        });
                    }
                    // 2.设置单元格抬头
                    // key：实体对象属性名称，可通过反射获取值
                    // value：Excel列的名称
                    Dictionary<string, string> staCellheader = new Dictionary<string, string> {
                    { "name", "类别" },
                    { "count", "数量" },
                    { "percent", "百分比"},
                };
                    Dictionary<string, string> penetranceCellheader = new Dictionary<string, string> {
                    { "radius", "半径范围"},
                    { "cmb", "招行客户" },
                    { "_3rdParty", "其他客户" },
                };
                    Dictionary<string, string> poiCellheader = new Dictionary<string, string> {
                    { "level1", "大类" },
                    { "count_lv1", "合计" },
                    { "level3", "小类"},
                    { "count_lv2", "小计" },
                    {"Address","明细" }
                };
                    string fileName = "统计-" + DateTime.Now.ToString("yyyyMMddHHmmssfff") + ".xls"; // 文件名称
                    var url = ExcelHelper.EntityListToExcel2003(staCellheader, dataList, fileName, "资产分段-截至2017年9月30日");
                    //新增渗透率sheet页
                    if (param.dType == 3 || param.dType == 4)
                    {
                        foreach (var peneItem in param.sitePenetranceList)
                        {
                            var cmbUserCount = (int)peneItem.cmbUserCount;
                            var _3rdPartyUserCount = (int)peneItem._3rdPartyUserCount;
                            _3rdPartyUserCount = cmbUserCount >= _3rdPartyUserCount ? cmbUserCount + _3rdPartyUserCount : _3rdPartyUserCount;
                            var cmbPercent = Math.Round(((decimal)cmbUserCount * 100 / _3rdPartyUserCount), 2).ToString() + "%";
                            var _3rdPercent = Math.Round(((decimal)(_3rdPartyUserCount - cmbUserCount) * 100 / _3rdPartyUserCount), 2).ToString() + "%";
                            PenetranceList.Add(new
                            {
                                radius = $"0-{peneItem.radius}公里",
                                cmb = $"{cmbUserCount.ToString("###,###")}({cmbPercent})",
                                _3rdParty = $"{(_3rdPartyUserCount - cmbUserCount).ToString("###,###")}({_3rdPercent})"
                            });
                        }
                        ExcelHelper.EntityListToExcel2003(penetranceCellheader, PenetranceList, fileName, "渗透率");
                    }
                    //新增poi数据sheet页
                    double[] radiusArr = new double[] { 0.5, 1, 1.5, 2, 3 };
                    string[] PoiName = new string[] { "距网点0-0.5公里", "距网点0.5-1公里", "距网点1-1.5公里", "距网点1.5-2公里", "距网点2-3公里" };
                    var nameIndex = 0;
                    foreach (var radius in radiusArr)
                    {
                        var poiStatisticData = CommomMethods.GetPoiStatisticData(param.bankID, radius);
                        ExcelHelper.EntityListToExcel2003(poiCellheader, poiStatisticData, fileName, "POI类别(" + PoiName[nameIndex] + ")");
                        ExcelHelper.mergeSheet("UpFiles/template/poides.xls", "汇总", $"UpFiles/ExcelFiles/{fileName}", $"POI类别({PoiName[nameIndex]})");
                        nameIndex++;
                    }                 
                    result.ReturnData = new { url = url };
                    result.ReturnCode = 1;
                }
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.ReturnCode = 0;
                Logger.Log.Error(ex.StackTrace);
            }

            return result;
        }
        /// <summary>
        /// 城市级别获取热力图数据
        /// </summary>
        /// <param name="isGetPointsByBranchWithClientFilter"></param>
        /// <param name="userID"></param>
        /// <param name="param"></param>
        /// <returns></returns>
        public OperationResult PostPointsByBranchWithClientFilter(Boolean isGetPointsByBranchWithClientFilter, string userID, branchParams param)
        {
            var result = new OperationResult();
            CommomMethods.visitLog(2, param.bankID, userID);
            try
            {
                using (var db = new HeatMapEntities())
                {
                    var data = db.Pro_GetTwoBankData(param.bankID, param.level, param.type, param.isAum, param.AUMLevel, param.UMPLlevel, param.isNoDF, param.isCheck, param.longitude, param.latitude, param.distance * 2).ToList().Select(x => new HeatmapPoint
                    {
                        lng = x.Longitude,
                        lat = x.Latitude,
                        userCount = x.UserCount,
                        aumCount = x.AUMMoney,
                        deposit = x.DepositMoney
                    });
                    var _3rdPartyData = db.Pro_Get3rdDataByCityID(0, param.level, param.type, param.longitude, param.latitude, param.distance * 2).ToList().Select(x => new
                    {
                        lng = x.Longitude,
                        lat = x.Latitude,
                        thirdParty = x.UserCount,
                    });
                    result.ReturnData = new
                    {
                        CMBData = data,
                        _3rdPartyData = _3rdPartyData
                    };
                    result.ReturnCode = 1;
                }
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.ReturnCode = 0;
                Logger.Log.Error(ex.StackTrace);
            }
            return result;
        }
        /// <summary>
        /// 获取城市资产统计数据
        /// </summary>
        /// <param name="isGetBankStatisticData"></param>
        /// <param name="bankID"></param>
        /// <returns></returns>
        public OperationResult PostBankStatisticData(Boolean isGetBankStatisticData, branchParams param)
        {
            var result = new OperationResult();
            int aum11 = 0, aum12 = 0, aum13 = 0, aum14 = 0, aum15 = 0, aum16 = 0, ump21 = 0, ump22 = 0, ump23 = 0, tCount = 0;
            List<Pro_GetAnywhereUMPStatisticsData_Result> UmpStatisticList = new List<Pro_GetAnywhereUMPStatisticsData_Result>();
            List<Pro_GetAnywhereAUMStatisticsData_Result> AumStatisticList = new List<Pro_GetAnywhereAUMStatisticsData_Result>();
            try
            {
                using (var db = new HeatMapEntities())
                {
                    var data = db.Pro_GetBankStatistics(param.bankID,param.isAum,param.AUMLevel,param.UMPLlevel,param.isNoDF).ToList();
                    // 1.获取数据集合
                    var dataList = new List<statistic_2>();
                    tCount = (int)db.Pro_GetTwoBranchUserCount(param.bankID).FirstOrDefault().UserCount;                
                    foreach (var point in data)
                    {
                        //AUM统计
                        switch (point.AUM_level)
                        {
                            case 11: aum11 += (int)point.UserCount; break;
                            case 12: aum12 += (int)point.UserCount; break;
                            case 13: aum13 += (int)point.UserCount; break;
                            case 14: aum14 += (int)point.UserCount; break;
                            case 15: aum15 += (int)point.UserCount; break;
                            case 16: aum16 += (int)point.UserCount; break;
                            default: break;
                        }
                        //UMP统计
                        switch (point.UMP_level)
                        {
                            case 21: ump21 += (int)point.UserCount; break;           
                            case 22: ump22 += (int)point.UserCount; break;
                            case 23: ump23 += (int)point.UserCount; break;
                            default: break;
                        }                       
                    }
                    AumStatisticList.Add(new Pro_GetAnywhereAUMStatisticsData_Result { AUM_level = 11, AUM_Name = "零资产", UserCount = aum11, Total = tCount, Percent = aum11 * 100 / (decimal)tCount });
                    AumStatisticList.Add(new Pro_GetAnywhereAUMStatisticsData_Result { AUM_level = 12, AUM_Name = "非零不达标基客", UserCount = aum12, Total = tCount, Percent = aum12 * 100 / (decimal)tCount });
                    AumStatisticList.Add(new Pro_GetAnywhereAUMStatisticsData_Result { AUM_level = 13, AUM_Name = "达标基客", UserCount = aum13, Total = tCount, Percent = aum13 * 100 / (decimal)tCount });
                    AumStatisticList.Add(new Pro_GetAnywhereAUMStatisticsData_Result { AUM_level = 14, AUM_Name = "金卡", UserCount = aum14, Total = tCount, Percent = aum14 * 100 / (decimal)tCount });
                    AumStatisticList.Add(new Pro_GetAnywhereAUMStatisticsData_Result { AUM_level = 15, AUM_Name = "金葵花", UserCount = aum15, Total = tCount, Percent = aum15 * 100 / (decimal)tCount });
                    AumStatisticList.Add(new Pro_GetAnywhereAUMStatisticsData_Result { AUM_level = 16, AUM_Name = "私钻", UserCount = aum16, Total = tCount, Percent = aum16 * 100 / (decimal)tCount });
                    UmpStatisticList.Add(new Pro_GetAnywhereUMPStatisticsData_Result { UMP_level = 21, UMP_Name = "潜力金卡", UserCount = ump21, Total = tCount, Percent = ump21 * 100 / (decimal)tCount });
                    UmpStatisticList.Add(new Pro_GetAnywhereUMPStatisticsData_Result { UMP_level = 22, UMP_Name = "潜力金葵花", UserCount = ump22, Total = tCount, Percent = ump22 * 100 / (decimal)tCount });
                    UmpStatisticList.Add(new Pro_GetAnywhereUMPStatisticsData_Result { UMP_level = 23, UMP_Name = "潜力私钻", UserCount = ump23, Total = tCount, Percent = ump23 * 100 / (decimal)tCount });
                    // 2.设置单元格抬头
                    // key：实体对象属性名称，可通过反射获取值
                    // value：Excel列的名称
                    Dictionary<string, string> cellheader = new Dictionary<string, string> {
                    { "name", "类型" },
                    { "count", "数量" },
                    { "percent", "百分比"},
                };
                    foreach (var item in AumStatisticList)
                    {
                        dataList.Add(new statistic_2
                        {
                            name = item.AUM_Name,
                            count = item.UserCount.ToString(),
                            percent = Math.Round((decimal)item.Percent, 2).ToString() + "%"
                        });
                    }
                    var url = ExcelHelper.EntityListToExcel2003(cellheader, dataList, "统计");
                    result.ReturnData = new { AumStatisticList = AumStatisticList, UmpStatisticList= UmpStatisticList, url = url };
                    result.ReturnCode = 1;
                }
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.ReturnCode = 0;
                Logger.Log.Error(ex);
            }

            return result;
        }
        public OperationResult GetPointsByCircleCenter(decimal radius, decimal lat, decimal lng, string userID)
        {
            var result = new OperationResult();
            CommomMethods.visitLog(3, 0, userID);
            try
            {
                using (var db = new HeatMapEntities())
                {
                    int aum11 = 0, aum12 = 0, aum13 = 0, aum14 = 0, aum15 = 0, aum16 = 0, ump21 = 0, ump22 = 0, ump23 = 0, tCount = 0;
                    var cmbDataList = new List<HeatmapPoint>();
                    var AumStatisticList = new List<Pro_GetAnywhereAUMStatisticsData_Result>();
                    var UmpStatisticList = new List<Pro_GetAnywhereUMPStatisticsData_Result>();
                    var data = db.Pro_GetAnywhereData(lat, lng, radius).ToList();
                    tCount = data.Count();
                    foreach (var point in data)
                    {
                        //描点数据
                        cmbDataList.Add(new HeatmapPoint
                        {
                            lat = point.Latitude,
                            lng = point.Longitude,
                            userCount = point.UserCount,
                            aumCount = point.AUMMoney,
                            deposit = point.DepositMoney
                        });
                        //AUM统计
                        switch (point.AUM_level)
                        {
                            case 11: aum11 += (int)point.UserCount; break;
                            case 12: aum12 += (int)point.UserCount; break;
                            case 13: aum13 += (int)point.UserCount; break;
                            case 14: aum14 += (int)point.UserCount; break;
                            case 15: aum15 += (int)point.UserCount; break;
                            case 16: aum16 += (int)point.UserCount; break;
                            default: break;
                        }
                        //ump统计
                        if (point.AUM_level <= 13)
                        {
                            switch (point.UMP_level)
                            {
                                case 21: ump21 += (int)point.UserCount; break;
                                case 22: ump22 += (int)point.UserCount; break;
                                case 23: ump23 += (int)point.UserCount; break;
                                default: break;
                            }
                        }
                    }
                    AumStatisticList.Add(new Pro_GetAnywhereAUMStatisticsData_Result { AUM_level = 11, AUM_Name = "零资产", UserCount = aum11, Total = tCount, Percent = aum11 * 100 / (decimal)tCount });
                    AumStatisticList.Add(new Pro_GetAnywhereAUMStatisticsData_Result { AUM_level = 12, AUM_Name = "非零不达标基客", UserCount = aum12, Total = tCount, Percent = aum12 * 100 / (decimal)tCount });
                    AumStatisticList.Add(new Pro_GetAnywhereAUMStatisticsData_Result { AUM_level = 13, AUM_Name = "达标基客", UserCount = aum13, Total = tCount, Percent = aum13 * 100 / (decimal)tCount });
                    AumStatisticList.Add(new Pro_GetAnywhereAUMStatisticsData_Result { AUM_level = 14, AUM_Name = "金卡", UserCount = aum14, Total = tCount, Percent = aum14 * 100 / (decimal)tCount });
                    AumStatisticList.Add(new Pro_GetAnywhereAUMStatisticsData_Result { AUM_level = 15, AUM_Name = "金葵花", UserCount = aum15, Total = tCount, Percent = aum15 * 100 / (decimal)tCount });
                    AumStatisticList.Add(new Pro_GetAnywhereAUMStatisticsData_Result { AUM_level = 16, AUM_Name = "私钻", UserCount = aum16, Total = tCount, Percent = aum16 * 100 / (decimal)tCount });
                    UmpStatisticList.Add(new Pro_GetAnywhereUMPStatisticsData_Result { UMP_level = 21, UMP_Name = "潜力金卡", UserCount = ump21, Total = tCount, Percent = ump21 * 100 / (decimal)tCount });
                    UmpStatisticList.Add(new Pro_GetAnywhereUMPStatisticsData_Result { UMP_level = 22, UMP_Name = "潜力金葵花", UserCount = ump22, Total = tCount, Percent = ump22 * 100 / (decimal)tCount });
                    UmpStatisticList.Add(new Pro_GetAnywhereUMPStatisticsData_Result { UMP_level = 23, UMP_Name = "潜力私钻", UserCount = ump23, Total = tCount, Percent = ump23 * 100 / (decimal)tCount });
                    //导出统计数据到excel
                    //excel头部
                    Dictionary<string, string> cellheader = new Dictionary<string, string> {
                    { "name", "类别" },
                    { "count", "数量" },
                    { "percent", "百分比"},
                };
                    var statisticDataList = new List<statistic_2>();
                    foreach (var item in AumStatisticList)
                    {
                        statisticDataList.Add(new statistic_2
                        {
                            name = item.AUM_Name,
                            count = item.UserCount.ToString(),
                            percent = Math.Round((decimal)item.Percent, 2).ToString() + "%",
                        });
                    }
                    foreach (var item in UmpStatisticList)
                    {
                        statisticDataList.Add(new statistic_2
                        {
                            name = item.UMP_Name,
                            count = item.UserCount.ToString(),
                            percent = Math.Round((decimal)item.Percent, 2).ToString() + "%",
                        });
                    }
                    var _3rdPartyData = db.Pro_GetAnywhere3rdData(lat, lng, radius, (int)PointType.Work).Select(x => new {
                        lng = x.Longitude,
                        lat = x.Latitude,
                        thirdParty = Convert.ToInt32(x.UserCount),
                        CMBAPPCount = x.CMBAPPCount
                    }).ToList();

                    //计算招行客户数量和第三方客户数量
                    var cmbUserCount = cmbDataList.Sum(x => x.userCount);
                    var _3rdPartyUserCount = _3rdPartyData.Sum(x => x.thirdParty);
                    if (cmbUserCount >= _3rdPartyUserCount) {
                        _3rdPartyUserCount =(int)cmbUserCount;
                    }
                    statisticDataList.Add(new statistic_2
                    {
                        name = "招行客户",
                        count = cmbUserCount.ToString(),
                        percent = Math.Round(((decimal)cmbUserCount*100/_3rdPartyUserCount), 2).ToString() + "%",
                    });
                    statisticDataList.Add(new statistic_2
                    {
                        name = "其它用户",
                        count = (_3rdPartyUserCount - cmbUserCount).ToString(),
                        percent = Math.Round(((decimal)(_3rdPartyUserCount - cmbUserCount)*100 / _3rdPartyUserCount), 2).ToString() + "%",
                    });
                    var url = ExcelHelper.EntityListToExcel2003(cellheader, statisticDataList, "统计");
                    result.ReturnData = new { CMBData = cmbDataList, _3rdPartyData = _3rdPartyData, AUMData = AumStatisticList, UMPData = UmpStatisticList, url = url };
                    result.ReturnCode = 1;
                }
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.ReturnCode = 0;
                Logger.Log.Error(ex.StackTrace);
            }

            return result;
        }    
        
        public OperationResult PostPointsByPolygon(Boolean isPostPointsByPolygon, string userID, polygonBounds args)
        {
            var result = new OperationResult();
            var cmbDataList = new List<HeatmapPoint>();
            var pathList = args.path;
            CommomMethods.visitLog(3, 0, userID);

            try
            {
                using (var db = new HeatMapEntities())
                {
                    var pathXArr = new decimal[pathList.Count];
                    var pathYArr = new decimal[pathList.Count];
                    int aum11 = 0, aum12 = 0, aum13 = 0, aum14 = 0, aum15 = 0, aum16 = 0, ump21 = 0, ump22 = 0, ump23 = 0, tCount = 0;

                    var AumStatisticList = new List<Pro_GetAnywhereAUMStatisticsData_Result>();
                    var UmpStatisticList = new List<Pro_GetAnywhereUMPStatisticsData_Result>();
                    for (var i = 0; i < pathList.Count; i++)
                    {
                        pathXArr[i] = pathList[i].lat;
                        pathYArr[i] = pathList[i].lng;
                    }
                    var data = db.Pro_GetPolygonData(String.Join(",", pathXArr), String.Join(",", pathYArr)).ToList();
                    tCount = data.Count();
                    foreach (var point in data)
                    {
                        //描点数据
                        cmbDataList.Add(new HeatmapPoint
                        {
                            lat = point.Latitude,
                            lng = point.Longitude,
                            userCount = point.UserCount,
                            aumCount = point.AUMMoney,
                            deposit = point.DepositMoney
                        });
                        //AUM统计
                        switch (point.AUM_level)
                        {
                            case 11: aum11 += (int)point.UserCount; break;
                            case 12: aum12 += (int)point.UserCount; break;
                            case 13: aum13 += (int)point.UserCount; break;
                            case 14: aum14 += (int)point.UserCount; break;
                            case 15: aum15 += (int)point.UserCount; break;
                            case 16: aum16 += (int)point.UserCount; break;
                            default: break;
                        }
                        //ump统计
                        if (point.AUM_level <= 13)
                        {
                            switch (point.UMP_level)
                            {
                                case 21: ump21 += (int)point.UserCount; break;
                                case 22: ump22 += (int)point.UserCount; break;
                                case 23: ump23 += (int)point.UserCount; break;
                                default: break;
                            }
                        }
                    }
                    AumStatisticList.Add(new Pro_GetAnywhereAUMStatisticsData_Result { AUM_level = 11, AUM_Name = "零资产", UserCount = aum11, Total = tCount, Percent = aum11 * 100 / (decimal)tCount });
                    AumStatisticList.Add(new Pro_GetAnywhereAUMStatisticsData_Result { AUM_level = 12, AUM_Name = "非零不达标基客", UserCount = aum12, Total = tCount, Percent = aum12 * 100 / (decimal)tCount });
                    AumStatisticList.Add(new Pro_GetAnywhereAUMStatisticsData_Result { AUM_level = 13, AUM_Name = "达标基客", UserCount = aum13, Total = tCount, Percent = aum13 * 100 / (decimal)tCount });
                    AumStatisticList.Add(new Pro_GetAnywhereAUMStatisticsData_Result { AUM_level = 14, AUM_Name = "金卡", UserCount = aum14, Total = tCount, Percent = aum14 * 100 / (decimal)tCount });
                    AumStatisticList.Add(new Pro_GetAnywhereAUMStatisticsData_Result { AUM_level = 15, AUM_Name = "金葵花", UserCount = aum15, Total = tCount, Percent = aum15 * 100 / (decimal)tCount });
                    AumStatisticList.Add(new Pro_GetAnywhereAUMStatisticsData_Result { AUM_level = 16, AUM_Name = "私钻", UserCount = aum16, Total = tCount, Percent = aum16 * 100 / (decimal)tCount });
                    UmpStatisticList.Add(new Pro_GetAnywhereUMPStatisticsData_Result { UMP_level = 21, UMP_Name = "潜力金卡", UserCount = ump21, Total = tCount, Percent = ump21 * 100 / (decimal)tCount });
                    UmpStatisticList.Add(new Pro_GetAnywhereUMPStatisticsData_Result { UMP_level = 22, UMP_Name = "潜力金葵花", UserCount = ump22, Total = tCount, Percent = ump22 * 100 / (decimal)tCount });
                    UmpStatisticList.Add(new Pro_GetAnywhereUMPStatisticsData_Result { UMP_level = 23, UMP_Name = "潜力私钻", UserCount = ump23, Total = tCount, Percent = ump23 * 100 / (decimal)tCount });

                    //导出统计数据到excel
                    var statisticDataList = new List<statistic_2>();
                    foreach (var item in AumStatisticList)
                    {
                        statisticDataList.Add(new statistic_2
                        {
                            name = item.AUM_Name,
                            count = item.UserCount.ToString(),
                            percent = Math.Round((decimal)item.Percent, 2).ToString() + "%",
                        });
                    }
                    foreach (var item in UmpStatisticList)
                    {
                        statisticDataList.Add(new statistic_2
                        {
                            name = item.UMP_Name,
                            count = item.UserCount.ToString(),
                            percent = Math.Round((decimal)item.Percent, 2).ToString() + "%",
                        });
                    }
                    Dictionary<string, string> cellheader = new Dictionary<string, string> {
                    { "name", "类型" },
                    { "count", "数量" },
                    { "percent", "百分比"},
                };
                    //获取第三方数据
                    var _3rdPartyData = db.Pro_GetPolygon3rdData(String.Join(",", pathXArr), String.Join(",", pathYArr), (int)PointType.Work).Select(x => new {
                        lng = x.Longitude,
                        lat = x.Latitude,
                        thirdParty = Convert.ToInt32(x.UserCount),
                    }).ToList();

                    //计算招行客户数量和第三方客户数量
                    var cmbUserCount = cmbDataList.Sum(x=>x.userCount);
                    var _3rdPartyUserCount = _3rdPartyData.Sum(x => x.thirdParty);
                    if (cmbUserCount >= _3rdPartyUserCount)
                    {
                        _3rdPartyUserCount = (int)cmbUserCount;
                    }
                    statisticDataList.Add(new statistic_2
                    {
                        name = "招行客户",
                        count = cmbUserCount.ToString(),
                        percent = Math.Round(((decimal)cmbUserCount*100/_3rdPartyUserCount), 2).ToString() + "%",
                    });
                    statisticDataList.Add(new statistic_2
                    {
                        name = "其它用户",
                        count = (_3rdPartyUserCount-cmbUserCount).ToString(),
                        percent = Math.Round(((decimal)(_3rdPartyUserCount - cmbUserCount)*100 / _3rdPartyUserCount), 2).ToString() + "%",
                    });

                    var url = ExcelHelper.EntityListToExcel2003(cellheader, statisticDataList, "统计");
                    result.ReturnData = new { CMBData = cmbDataList, _3rdPartyData = _3rdPartyData, AUMData = AumStatisticList, UMPData = UmpStatisticList, url = url };
                    result.ReturnCode = 1;
                }
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.ReturnCode = 0;
                Logger.Log.Error(ex.StackTrace);
            }

            return result;
        }       
        
        public OperationResult GetExportPoiSingleCatagoryData(Boolean isExportPoiSingleCatagoryData, int bankID, int radiusIndex,string name)
        {
            var result = new OperationResult() { ReturnCode=1 };
            string cName = HttpUtility.UrlDecode(name);
            try
            {
                var poiData = CommomMethods.GetSingleCategoryPoiStatisticData(bankID, radiusIndex, cName);
                string fileName = "统计-" + DateTime.Now.ToString("yyyyMMddHHmmssfff") + ".xls"; // 文件名称
                Dictionary<string, string> poiCellheader = new Dictionary<string, string> {
                    { "level1", "大类" },
                    { "count_lv1", "合计" },
                    { "level3", "小类"},
                    { "count_lv2", "小计" },
                    {"Address","明细" }
                };
                string[] PoiName = new string[] { "距网点0-0.5公里", "距网点0-1公里", "距网点0-1.5公里", "距网点0-2公里", "距网点0-3公里" };
                var url = ExcelHelper.EntityListToExcel2003(poiCellheader, poiData, fileName, $"POI类别({cName},{PoiName[radiusIndex]})");
                result.ReturnData = url;
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.ReturnCode = 0;
                Logger.Log.Error(ex.StackTrace);
            }
            return result;
        }
      
        /// <summary>
        /// 获取分行的客户渗透率
        /// </summary>
        /// <param name="isGetPenetranceByBranch"></param>
        /// <param name="userID"></param>
        /// <param name="param"></param>
        /// <returns></returns>
        public OperationResult PostPenetranceByBranch(Boolean isGetPenetranceByBranch, string userID, branchParams param)
        {
            var result = new OperationResult();
            CommomMethods.visitLog(2, param.bankID, userID);
            try
            {
                using (var db = new HeatMapEntities())
                {
                    var cmbUserCount = db.Pro_GetTwoBankData(param.bankID, param.level, param.type, param.isAum, param.AUMLevel, param.UMPLlevel, param.isNoDF, param.isCheck, param.longitude, param.latitude, param.distance * 2).Sum(x => x.UserCount);
                    var _3rdPartyUserCount = db.Pro_Get3rdDataByCityID(0, param.level, param.type, param.longitude, param.latitude, param.distance * 2).Sum(x => x.UserCount);
                    result.ReturnData = new
                    {
                        cmbUserCount = cmbUserCount,
                        _3rdPartyUserCount = _3rdPartyUserCount
                    };
                    result.ReturnCode = 1;
                }
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.ReturnCode = 0;
                Logger.Log.Error(ex.StackTrace);
            }
            return result;
        }
       
        public OperationResult PostPointsBySiteWithDimension(Boolean isGetPointsBySiteWithDimension, string userID, siteParams param)
        {
            var result = new OperationResult();
            var ip = HostIP.GetHostAddress();
            CommomMethods.visitLog(2, param.bankID, userID);
            try
            {
                using (var db = new HeatMapEntities())
                {
                    var data = db.Pro_GetUserPropertyData(param.bankID, param.type, param.AUMLevel, param.dimension).ToList().Select(x => new HeatmapPoint
                    {
                        lng = x.Longitude,
                        lat = x.Latitude,
                        userCount = Convert.ToInt32(x.UserCount)
                    });
                    result.ReturnData = data;
                    result.ReturnCode = 1;
                }
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.ReturnCode = 0;
                Logger.Log.Error(ex.StackTrace);
            }
            return result;
        }
        public OperationResult Post3rdPointsBySiteLocation(Boolean isPost3rdPointsBySiteLocation, thirdparty param)
        {
            var result = new OperationResult();
            var ip = HostIP.GetHostAddress();
            //CommomMethods.visitLog(2, param.bankID, userID);
            try
            {
                using (var db = new HeatMapEntities())
                {
                    var data = db.Pro_GetAnywhere3rdData(param.lat, param.lng, param.radius, (int)PointType.Work).ToList().Select(x => new
                    {
                        lng = x.Longitude,
                        lat = x.Latitude,
                        thirdParty = Convert.ToInt32(x.UserCount),
                        CMBAPPCount = x.CMBAPPCount
                    });
                    result.ReturnData = data;
                    result.ReturnCode = 1;
                }
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.ReturnCode = 0;
                Logger.Log.Error(ex.StackTrace);
            }
            return result;
        }
        /// <summary>
        /// 暂时弃用
        /// </summary>
        /// <param name="isPostPointsByBounds"></param>
        /// <param name="args"></param>
        /// <returns></returns>
        public OperationResult PostPointsByBounds(Boolean isPostPointsByBounds, polygonBounds args)
        {
            var result = new OperationResult();
            var dataList = new List<HeatmapPoint>();
            var isContain = false;
            var pathList = args.path;
            var ip = HostIP.GetHostAddress();

            try
            {
                using (var db = new HeatMapEntities())
                {
                    var data = db.Pro_GetAnywhereData((decimal)args.lat, (decimal)args.lng, (decimal)args.radius).ToList().Select(x => new HeatmapPoint
                    {
                        lng = x.Longitude,
                        lat = x.Latitude,
                        userCount = x.UserCount
                    });
                    foreach (var point in data)
                    {
                        isContain = CommomMethods.IsInside(new lnglat { lat = (decimal)point.lat, lng = (decimal)point.lng }, pathList);

                        if (isContain)
                        {
                            dataList.Add(point);
                        }
                    }
                    result.ReturnData = dataList;
                    result.ReturnCode = 1;
                }
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.ReturnCode = 0;
                Logger.Log.Error(ex.StackTrace);
            }
            return result;
        }
        public void GetlogBrowseHeatmap(int bankID)
        {
            using (var db = new HeatMapEntities())
            {
                //记录下载记录
                var logItem = new Logs();
                logItem.PK_ID = Guid.NewGuid();
                logItem.CreateTime = DateTime.Now;
                logItem.ClientIP = HostIP.GetHostAddress();
                logItem.TypeID = 2;//typeID:1-访问页面，2-浏览支行热力图，3-下载支行热力图
                logItem.BankID = bankID;
                logItem.UserID = null;
                db.Logs.Add(logItem);
                db.SaveChanges();
            }
        }
        public OperationResult PostPointsByBranch(Boolean isGetPointsByBranch, string userID, branchParams param)
        {
            var result = new OperationResult();
            CommomMethods.visitLog(2, param.bankID, userID);
            try
            {
                using (var db = new HeatMapEntities())
                {
                    var data = db.Pro_GetTwoBankUserCount(param.bankID, param.type, param.level, param.longitude, param.latitude, param.distance * 2).ToList().Select(x => new HeatmapPoint
                    {
                        lng = x.Longitude,
                        lat = x.Latitude,
                        userCount = x.UserCount,
                    });

                    result.ReturnData = data;
                    result.ReturnCode = 1;
                }
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.ReturnCode = 0;
                Logger.Log.Error(ex.StackTrace);
            }
            return result;
        }
        public void GetlogVisitData(Guid hostID)
        {
            using (var db = new HeatMapEntities())
            {
                //记录下载记录
                var logItem = new Logs();
                logItem.PK_ID = Guid.NewGuid();
                logItem.CreateTime = DateTime.Now;
                logItem.ClientIP = HostIP.GetHostAddress();
                logItem.HostID = hostID;
                logItem.TypeID = 1;//typeID:1-访问页面，2-浏览支行热力图，3-下载支行热力图
                logItem.UserID = null;
                db.Logs.Add(logItem);
                db.SaveChanges();
            }
        }
        [HttpGet]
        public HttpResponseMessage DownloadImg(string imgUrl, string bankID)
        {
            try
            {
                HttpResponseMessage response = new HttpResponseMessage();
                string filePath = HttpContext.Current.Server.MapPath(imgUrl);

                //以字符流的形式下载文件
                FileStream fs = new FileStream(filePath, FileMode.Open);
                byte[] bytes = new byte[(int)fs.Length];
                fs.Read(bytes, 0, bytes.Length);
                fs.Close();

                response.Content = new ByteArrayContent(bytes);
                response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");

                var fileName = DateTime.Now.ToString("yyyyMMddhhmmss") + imgUrl.Substring(imgUrl.LastIndexOf('.'));


                response.Content.Headers.ContentDisposition.FileName = fileName;
                response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
                using (var db = new HeatMapEntities())
                {
                    //记录下载记录
                    var logItem = new Logs();
                    logItem.PK_ID = Guid.NewGuid();
                    logItem.CreateTime = DateTime.Now;
                    logItem.ClientIP = HostIP.GetHostAddress();
                    logItem.TypeID = 3;//typeID:1-访问页面，2-浏览支行热力图，3-下载支行热力图
                    logItem.BankID = Convert.ToInt32(bankID);
                    logItem.UserID = null;
                    db.Logs.Add(logItem);
                    db.SaveChanges();
                }
                return response;
            }
            catch (Exception ex)
            {
                Logger.Log.Error(ex.StackTrace);
                return new HttpResponseMessage(HttpStatusCode.NoContent);
            } 
        }

        // POST api/<controller>
        public void Post([FromBody]string value)
        {
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }

    }
}