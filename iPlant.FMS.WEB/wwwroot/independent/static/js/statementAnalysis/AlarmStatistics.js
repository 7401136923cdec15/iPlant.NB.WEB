require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/echarts'],
    function ($lin, $com, $echarts) {
        var mDeviceID;
        var mIndex = 0;
        var colors = ['#5470c6', '#91cc75'];
        var colors5 = ['#334b5c', '#d53a35'];
        var colors3 = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#fc8452', '#73c0de', '#3ba272', '#9a60b4',
            '#ea7ccc'];
        var colors4 = ['#1775C7FF','#2CD92FFF','#FF5000FF','#EEE307FF','#F80404FF','#00FDD5FF','#2C955EFF','#DB1C95FF']
        var mDeviceList = [];
        var pic={
            value: 1,
            name: '暂无数据'
        }
        var myCharts= {};//存储Echarts 对象
        var model = $com.Model.create({
            el: '#alarmStatistics',
            VueName: 'vm',
            name: '报警统计',
            data: {
                DeviceName: null, //设备名称
                Area: [], //区域
                AreaID: 35,
                DeviceType: [], //设备类型
                DeviceTypeID: null,
                DeviceList: [],
                timeSection: [
                    $com.util.format('yyyy-MM-dd', new Date(new Date().getTime() - 30 * 24 * 3600000)),
                    $com.util.format('yyyy-MM-dd', new Date()),
                ],
                //设备故障频次Top5
                FaultFrequency:{
                    title: {
                        text: '设备故障频次Top5',
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        orient: 'vertical',
                        type: 'scroll',
                        right: 10,
                        top: 20,
                        bottom: 20,
                    },
                    series: [
                        {
                            name: '故障频次',
                            type: 'pie',
                            radius: '50%',
                            data: [
                                /*{ value: 1048, name: 'Search Engine' },
                                { value: 735, name: 'Direct' },
                                { value: 580, name: 'Email' },
                                { value: 484, name: 'Union Ads' },
                                { value: 300, name: 'Video Ads' }*/
                            ],
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                },
                //设备故障时长Top5
                TheFailureTime:{
                    title: {
                        text: '设备故障时长Top5',
                        subtext: '单位（H）',
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        orient: 'vertical',
                        type: 'scroll',
                        right: 10,
                        top: 20,
                        bottom: 20,
                    },
                    series: [
                        {
                            name: '故障时长',
                            type: 'pie',
                            radius: '50%',
                            data: [
                                /*{ value: 1048, name: 'Search Engine' },
                                { value: 735, name: 'Direct' },
                                { value: 580, name: 'Email' },
                                { value: 484, name: 'Union Ads' },
                                { value: 300, name: 'Video Ads' }*/
                            ],
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                },
                //故障停产时长与频次
                HaltProduction: {
                    title: {
                        text: '故障停产时长与频次',
                    },
                    tooltip: {
                        trigger: 'axis',
                    },
                    legend: {
                        orient: 'vertical',
                        type: 'scroll',
                        right: 10,
                        top: 20,
                        bottom: 20,
                        data: ['停产频次', '停产时长'],
                    },
                    grid: {
                        left: '3%',
                        right: '8%',
                        bottom: '3%',
                        containLabel: true,
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: [],
                    },
                    yAxis: [{
                        type: 'value',
                        name: '停产频次',
                        min: 0,
                        position: 'left',
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: colors5[1],
                            },
                        },
                        axisLabel: {
                            formatter: '{value} 次',
                        },
                    },
                        {
                            type: 'value',
                            name: '停产时长',
                            min: 0,
                            position: 'right',
                            offset: 0,
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    color: colors5[0],
                                },
                            },
                            axisLabel: {
                                formatter: '{value} H',
                            },
                        },
                    ],
                    series: [{
                        name: '停产频次',
                        type: 'line',
                        data: [],
                    },
                        {
                            name: '停产时长',
                            type: 'line',
                            yAxisIndex: 1,
                            data: [],
                        },
                    ],
                },
                //设备报警类型top5
                FaultType: {
                    title: {
                        text: '设备报警类型top5',
                        left: 'center',
                    },
                    tooltip: {
                        trigger: 'item',
                    },
                    legend: {
                        orient: 'vertical',
                        type: 'scroll',
                        right: 10,
                        top: 20,
                        bottom: 20,
                    },
                    series: [{
                        type: 'pie',
                        radius: '50%',
                        data: [],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)',
                            },
                        },
                    }],
                },
                list: [],
            },
            type: $com.Model.MAIN, //主方法
            configure: function () {
                this.run();
            },
            events: function () {
                // window.setFunctionTrigger("MobileCarRackMachine", function (res) {
                //     mDeviceID =  res.ID;
                //     model.com.Refresh();
                // });
                // 监听页面大小变化
                window.addEventListener('resize', function(){
                    for (const key in myCharts) {
                        myCharts[key].resize();
                    }
                });
            },
            run: function () {
                //给搜索框上的下拉框赋值
                //区域
                model.com.GetArea({Active: 1}, function (res) {
                    vm.Area = res.list;
                });
                //设备名称
                model.com.GetDevice({Active: 1}, function (res) {
                    //设备
                    mDeviceList = $com.util.Clone(res.list);
                    vm.DeviceList =  mDeviceList.filter(function (item) {
                        return item.AreaID === vm.AreaID;
                    });

                    //设备类型
                    var wDevice = mDeviceList.filter(function (item){
                        return item.AreaID === vm.AreaID;
                    })
                    vm.DeviceType = vm.deWeight(wDevice,"DeviceType")
                })
                //界面刷新
                model.com.Refresh('', vm.AreaID, -1, vm.timeSection[0], vm.timeSection[1]);
            },
            com: {
                //刷新页面
                Refresh: function (DeviceName, AreaID, DeviceType, StartTime, EndTime) {
                    $com.app.loading('数据加载中...');
                    model.com.DeviceStatistics({
                        DeviceName: DeviceName,
                        AreaID: AreaID,
                        DeviceType: DeviceType,
                        StartTime: StartTime,
                        EndTime: EndTime,
                        HasAlarm:1,
                        Status:-1,
                    }, function (res) {
                        vm.list = res.list;
                        vm.Frequency = res.Frequency;
                        //故障频次统计表数据
                        model.com.FailureData(res.Alarm, );
                        //故障停产时长
                        model.com.HaltProductionFn(res.Alarm, vm.timeSection[0], vm.timeSection[1]);
                        //故障类型
                        model.com.faultType(res.Frequency);
                        $com.app.loaded();
                    });

                },
                //搜索按钮
                search: function () {
                    model.com.Refresh(vm.DeviceName, vm.AreaID, vm.DeviceTypeID, vm.timeSection[0], vm.timeSection[1]);
                },
                //重置按钮
                reset: function () {
                    vm.DeviceName = null;
                    vm.AreaID = 36;
                    vm.DeviceTypeID = null;
                    vm.timeSection.splice(0, 2,
                        $com.util.format('yyyy-MM-dd', new Date(new Date().getTime() - 30 * 24 * 3600000)),
                        $com.util.format('yyyy-MM-dd', new Date()),
                    );
                },
                // 表格展开事件
                unfold: function (index) {
                    var bottom = $($('.tr-bottom')[index]);
                    var img = $($('.icon > img')[index]);
                    bottom.height() == 35 ? bottom.css({'height': '0px'}) : bottom.css({'height': '35px'});
                    img.toggleClass('arrows-bottom');
                },
                //处理故障频次数据
                FailureData: function (arr) {
                    if (arr.length===0){
                        vm.FaultFrequency.series[0].data.splice(0,vm.FaultFrequency.series[0].data.length);
                        vm.FaultFrequency.series[0].data.push(pic);
                        vm.TheFailureTime.series[0].data.splice(0,vm.TheFailureTime.series[0].data.length);
                        vm.TheFailureTime.series[0].data.push(pic);
                        //频次
                        model.com.ECharts('FaultFrequency', vm.FaultFrequency);
                        //时长
                        model.com.ECharts('TheFailureTime', vm.TheFailureTime);
                        return
                    }
                    vm.FaultFrequency.series[0].data.splice(0,vm.FaultFrequency.series[0].data.length);
                    vm.TheFailureTime.series[0].data.splice(0,vm.FaultFrequency.series[0].data.length);
                    var breakdownList = [];//存储处理好的数据
                    //找出相同数组中相同项并且组成一个数组arr：数组，str:数组中项的key值，返回一个新数组
                    model.com.sortArr(arr, 'DeviceID').forEach(function (items) {
                        if (items.length > 1) {
                            var breakdown = {};
                            items.forEach(function (item) {
                                item.AlarmDuration = Number((item.AlarmDuration / (60 * 60 )).toFixed(2));
                            });
                            items.forEach(function (item) {
                                if (!breakdown.DeviceID) {
                                    breakdown = item;
                                } else {
                                    breakdown.AlarmDuration = Number((breakdown.AlarmDuration + item.AlarmDuration).toFixed(2));
                                    breakdown.AlarmCount = breakdown.AlarmCount + item.AlarmCount;
                                }
                            });
                            breakdownList.push(breakdown);
                        } else {
                            if (items.length > 0) {
                                items[0].AlarmDuration = Number((items[0].AlarmDuration / (60 * 60 )).toFixed(2));
                                breakdownList.push(items[0]);
                            }
                        }
                    });
                    //加上设备名称
                    breakdownList.forEach(function (item) {
                        vm.list.forEach(function (value){
                            if (item.DeviceID===value.DeviceID){
                                item.DeviceName = value.DeviceName;
                            }
                        })
                    });
                    //整理出饼状图数据
                    vm.FaultFrequency.series[0].data =  vm.topFive(breakdownList,'AlarmCount','DeviceName');
                    vm.TheFailureTime.series[0].data =  vm.topFive(breakdownList,'AlarmDuration','DeviceName');
                    //频次
                    model.com.ECharts('FaultFrequency', vm.FaultFrequency);
                    //时长
                    model.com.ECharts('TheFailureTime', vm.TheFailureTime);
                },
                //找出相同数组中相同项并且组成一个数组arr：数组，str:数组中项的key值，返回一个新数组
                sortArr: function (arr, str) {
                    var _arr = [],
                        _t = [],
                        // 临时的变量
                        _tmp;

                    // 按照特定的参数将数组排序将具有相同值得排在一起
                    arr = arr.sort(function (a, b) {
                        var s = a[str],
                            t = b[str];
                        /**/
                        return s < t ? -1 : 1;
                    });

                    if (arr.length) {
                        _tmp = arr[0][str];
                    }
                    // 将相同类别的对象添加到统一个数组
                    for (var i in arr) {
                        if (arr[i][str] === _tmp) {
                            _t.push(arr[i]);
                        } else {
                            _tmp = arr[i][str];
                            _arr.push(_t);
                            _t = [arr[i]];
                        }
                    }
                    // 将最后的内容推出新数组
                    _arr.push(_t);
                    return _arr;
                },
                //选出前五项，合并剩余项
                topFive:function (arr,name,title){
                    var list = [];
                    var seriesData = []
                    //排序
                    list = arr.sort(model.com.sortBy(name, false));
                    //整理出饼状图数据
                    list.forEach(function (item,index){
                        if (index<5){
                            seriesData.push(
                                {
                                    value:item[name],
                                    name:item[title],
                                }
                            )
                        }else {
                            if (index===5){
                                seriesData.push(
                                    {
                                        value:item[name],
                                        name:'其他',
                                    }
                                )
                            }else {
                                seriesData[5].value += item[name];
                            }

                        }

                    })
                    return seriesData;
                },
                //数组去重
                deWeight: function (arr,key) {
                    if (!Array.isArray(arr)) {
                        console.log('type error!')
                        return
                    }
                    for (var i = 0; i < arr.length - 1; i++) {
                        for (var j = i + 1; j < arr.length; j++) {
                            if (arr[i][key] == arr[j][key]) {
                                arr.splice(j, 1);
                                //因为数组长度减小1，所以直接 j++ 会漏掉一个元素，所以要 j--
                                j--;
                            }
                        }
                    }
                    return arr;
                },
                //停产时长图表
                HaltProductionFn: function (data, wStartTime, wEndTime) {
                    var startTime = $com.util.toDate(wStartTime);
                    var endTime = $com.util.toDate(wEndTime);
                    var _data = [];
                    var _DataDic = {};
                    $.each(data, function (i, item) {

                        /*var nowTime = new Date(item.AlarmTime);
                        startTime = startTime < nowTime ? startTime : nowTime;
                        endTime = endTime > nowTime ? endTime : nowTime;*/
                        item.AlarmTimeDate = $com.util.format('yyyy/MM/dd', item.AlarmTime);
                        if (!_DataDic[item.AlarmTimeDate]) {
                            _DataDic[item.AlarmTimeDate] = {
                                AlarmDuration: 0,
                                AlarmCount: 0,
                            };
                        }
                        _DataDic[item.AlarmTimeDate].AlarmDuration += item.AlarmDuration;
                        _DataDic[item.AlarmTimeDate].AlarmCount += item.AlarmCount;
                    });
                    var _x = [];
                    var _y1 = [];
                    var _y2 = [];

                    while (startTime <= endTime) {
                        var _Item = {
                            AlarmTime: $com.util.format('yyyy/MM/dd', startTime),
                            AlarmDuration: 0,
                            AlarmCount: 0,
                        };
                        if (_DataDic[_Item.AlarmTime]) {
                            _Item.AlarmDuration = _DataDic[_Item.AlarmTime].AlarmDuration;
                            _Item.AlarmCount = _DataDic[_Item.AlarmTime].AlarmCount;
                        }
                        _x.push(_Item.AlarmTime);
                        _y1.push(_Item.AlarmDuration);
                        _y2.push(_Item.AlarmCount);
                        _data.push(_Item);
                        startTime = new Date(startTime.getTime() + 3600000 * 24);
                    }
                    vm.HaltProduction.xAxis.data = _x;
                    vm.HaltProduction.series[0].data = _y2;
                    vm.HaltProduction.series[1].data = _y1;

                    model.com.ECharts('line-chart', vm.HaltProduction);
                },
                //故障类型图表
                faultType: function (Frequency) {
                    if (Frequency.length === 0) {
                        vm.FaultType.series[0].data.splice(0,vm.FaultType.series[0].data.length);
                        vm.FaultType.series[0].data.push(pic);
                        model.com.ECharts('pie-chart', vm.FaultType);
                        return;
                    }
                    vm.FaultType.series[0].data.splice(0,vm.FaultType.series[0].data.length);
                    vm.FaultType.series[0].data = vm.topFive(Frequency,'AlarmCount','AlarmName')
                    model.com.ECharts('pie-chart', vm.FaultType);
                },
                //重写状态数据
                StatusData: function (key, arr, item) {
                    if (Number(key) & 1) {
                        arr.push(item[key]);
                    } else if (Number(key) & 2) {
                        arr.push(item[key]);
                    } else if (Number(key) & 4) {
                        arr.push(item[key]);
                    } else if (Number(key) & 8) {
                        arr.push(item[key]);
                    } else if (Number(key) & 16) {
                        arr.push(item[key]);
                    } else if (Number(key) & 32) {
                        arr.push(item[key]);
                    } else if (Number(key) & 64) {
                        arr.push(item[key]);
                    } else if (Number(key) & 128) {
                        arr.push(item[key]);
                    }
                },
                //数组排序
                sortBy: function (attr, rev) {
                    //第二个参数没有传递 默认升序排列
                    if (rev == undefined) {
                        rev = 1;
                    } else {
                        rev = (rev) ? 1 : -1;
                    }

                    return function (a, b) {
                        a = a[attr];
                        b = b[attr];
                        if (a < b) {
                            return rev * -1;
                        }
                        if (a > b) {
                            return rev * 1;
                        }
                        return 0;
                    };
                },
                //调用ECharts
                ECharts: function (IDName, option) {
                    myCharts[IDName] || (myCharts[IDName] = $echarts.init(document.getElementById(IDName)))
                    // 清除已有配置项
                    myCharts[IDName].clear();
                    myCharts[IDName].setOption(option);
                    myCharts[IDName].resize();
                },
                //获取状态
                DeviceStatistics: function (data, fn, context) {
                    var d = {
                        $URI: '/DMSDeviceStatus/Statistics',
                        $TYPE: 'get',
                    };

                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //获取区域信息
                GetArea: function (data, fn, context) {
                    var d = {
                        $URI: '/BMSRegion/All',
                        $TYPE: 'get',
                    };

                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //获取设备类型信息
                GetDeviceType: function (data, fn, context) {
                    var d = {
                        $URI: '/DMSDeviceType/All',
                        $TYPE: 'get',
                    };

                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //获取设备信息
                GetDevice: function (data, fn, context) {
                    var d = {
                        $URI: '/DMSDeviceLedger/All',
                        $TYPE: 'get',
                    };

                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
            },
            watch: {
                //监听区域ID
                AreaID: function (newDeviceName, oldDeviceName) {
                    //变更设备类型选项
                    var wDevice = mDeviceList.filter(function (item){
                        return item.AreaID === vm.AreaID;
                    });
                    vm.DeviceType = vm.deWeight(wDevice,"DeviceType")
                    vm.DeviceTypeID =null;
                    vm.DeviceName =null;
                    vm.DeviceList = mDeviceList.filter(function (item) {
                        return newDeviceName === item.AreaID;
                    })
                },
                //监听设备类型ID
                DeviceTypeID: function (newDeviceName, oldDeviceName) {
                    vm.DeviceName =null;
                    if (!newDeviceName) {
                        vm.DeviceList = mDeviceList.filter(function (item) {
                            return item.AreaID === vm.AreaID;
                        })
                    } else {
                        vm.DeviceList = mDeviceList.filter(function (item) {
                            return (item.AreaID === vm.AreaID && newDeviceName === item.DeviceType);
                        })
                    }
                },
            }
        });
        model.init();


    });