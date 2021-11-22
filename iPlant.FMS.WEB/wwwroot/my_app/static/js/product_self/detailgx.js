require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/entry'], function ($yang, $com, iForm) {

    var model,
		HTML,
		formModel,
        KEYWORD,
		KEYWORD_LIST,
        Wlist,
        WID,
        EwID,
        wSanc,
        wStationID,


    HTML = {
        LIST: ['<li>',
             '<label class="m-detail-title">{{name}}</label>',
             '<div class="m-detail-content">{{value}}</div>',
             '</li>'].join(""),
    };

    KEYWORD_LIST = [
        "LineName|产线",
        "ShiftID|班次",
		"PartName|工序名",
		"PartPointName|工步名",
		"OrderNo|订单号",
		"MaterialNo|物料号",
		"MaterialName|物料名称",
		"ProductNo|产品规格",
        "FQTYParts|实时产量",
        "FQTYDone|报工产量",
		"StartTime|开始时刻|DateTime",
		"EndTime|结束时刻|DateTime",
		"ShiftDate|计划时刻|DateTime",
    ];
    KEYWORD = {};

    model = $com.Model.create({
        name: '生产自检',

        type: $com.Model.MAIN,

        data: {},

        configure: function () {
            this.run();
            KEYWORD_LIST.forEach(function (item, i) {
                var detail = item.split("|");
                KEYWORD[detail[0]] = {
                    index: i,
                    name: detail[1]
                };
            });
        },

        events: function () {

            $("body").delegate("#checkll", "click", function () {
                window.QRTEST = function (partno) {
                    if (!partno || partno.length <= 0)
                        return false;
                    var wStationIDTwo = window.JSImpl.GetCustomMap("StationID");
                    model.com.getBatch({ StationID: wStationIDTwo, PartNo: partno }, function () {

                    })
                }
                if (window.JSImpl)
                    window.JSImpl.readQRCode('QRTEST', "请扫来料批次码！");
                else
                    window.QRTEST("ST-10101001");
            })



            if (window.JSImpl) {
                //检查工位ID是否可以使用此任务
                function CheckStation(wStationID) {

                    model.com.getCheck({ TaskStepID: model.query.id, StationID: wStationID }, function (res) {
                        if (!res.info) {
                            confirm("工位与任务不符合，是否重新扫码？", function (bool) {
                                if (bool) {
                                    if (window.JSImpl)
                                        window.JSImpl.readQRCode('QRTESTStation', "请扫工位码！");
                                    else
                                        window.QRTESTStation("ST-10101001");
                                }
                            });
                            return false;
                        }
                        //获取工件编码
                        if (window.JSImpl)
                            window.JSImpl.readQRCode('QRTESTPartNo', "请扫工件码！");
                        else
                            window.QRTESTPartNo("J190723D0786");

                    });
                }

                $("body").delegate("#confirm", "click", function () {

                    //获取工位ID 
                    var wStationID = (window.JSImpl) ? window.JSImpl.GetCustomMap("StationID") : 0;
                    //alert(wStationID);
                    window.QRTESTStation = function (str) {
                        alert(str);
                        if (!str || str.length <= 0)
                            return false;
                        model.com.getScan({ QRCode: str }, function (res) {
                            if (res.info.QRType == 5 && res.info.ID && res.info.ID > 0) {

                                wStationID = res.info.ID;
                                if (window.JSImpl)
                                    window.JSImpl.SetCustomMap("StationID", wStationID);

                                //检查工位ID是否可以使用此任务
                                CheckStation(wStationID);


                            } else {

                                alert("二维码识别失败，请检查是否扫描错误！");

                            }
                        });
                    }

                    window.QRTESTPartNo = function (partNo) {
                        if (!partNo || partNo.length <= 0)
                            return false
                        //检查工件编码是否可以自检 
                        model.com.getPart({ Station: wStationID, PartNo: partNo, TaskStepID: model.query.id }, function (res) {
                            //自检成功会返回一个int 如果自检失败则会提示
                            //使用此工位与产品编号的任务是否可以自检  这里将返回一个ModuleBindPackge
                            //跳转填写自检页面
                            //if (res.info.ID == 0)
                            //    alert("请正确扫描工件码！")
                            //    return false;

                            //var packages = res.info.PackgeNo ? res.info.PackgeNo : "160V2019060759";
                            //var partNos = res.info.PartNo ? res.info.PackgeNo : "J190723D0786";

                            var packages = res.info.PackgeNo;
                            var partNos = res.info.PartNo;
                            window.location = "check.html?id=" + model.query.id + "&sID=" + wStationID + "&sanC=" + wSanc + "&part=" + partNos + "&pack=" + packages;

                        });
                    }

                    if (!wStationID) {

                        if (window.JSImpl)
                            window.JSImpl.readQRCode('QRTESTStation', "请扫工位码！");
                        else
                            window.QRTESTStation("ST-10101001");

                    } else {
                        //检查工位ID是否可以使用此任务
                        CheckStation(wStationID);

                    }
                });


            } else {
                $("body").delegate("#confirm", "click", function () {

                    window.location = "check.html?id=" + WID + "&sanC=" + wSanc + "&part=" + "J190723D0786" + "&pack=" + "160V2019060759";
                });
            }
        },

        run: function () {
            //alert(wStationID);
            //var wStationID = window.JSImpl.GetCustomMap(StationID);

            //工序任务ID
            WID = Number(model.query.id);
            var wText = model.query.text;
            $(".tip-content").html(wText);
            model.com.get({
                ID: model.query.id,
                EventID: window._eventID ? window._eventID : 1003,
                CheckID:0,
            }, function (data) {
                Wlist = data.info;
                model.com.render(Wlist);
                //首先判断是否有data.list
                if (!data.list || data.list.length <= 0) {
                    wSanc = false;
                } else {
                    //如果有，拿ItemID==1的数据
                    var wData = [];
                    for (var i = 0; i < data.list.length; i++) {
                        if (data.list[i].ItemID == 1) {
                            wData.push(data.list[i]);
                        }
                    }
                    //将拿到数据中ItemValue强转成boolean
                    wSanc = $com.util.boolean(wData[0].ItemValue);
                }                
            });

            //model.com.getPart({
            //    Station: 1, PartNo: "J190723D0785", TaskStepID: 41
            //}, function (res) {
            //    var package = res.info.PackgeNo;
            //})

        },

        com: {
            get: function (data, fn, context) {
                var d = {
                    $URI: "/TaskHandle/Info",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //扫描
            getScan: function (data, fn, context) {
                var d = {
                    $URI: "/TaskHandle/ScanQRCode",
                    $TYPE: "get"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }
                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //检查工序任务是否能自检
            getPart: function (data, fn, context) {
                var d = {
                    $URI: "/SFCTaskIPT/ScanPartNo",
                    $TYPE: "get"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }
                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //检查此工位是否在此工序任务范围
            getCheck: function (data, fn, context) {
                var d = {
                    $URI: "/SFCTaskIPT/CheckStation",
                    $TYPE: "get"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }
                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //来料扫码
            getBatch: function (data, fn, context) {
                var d = {
                    $URI: "/SFCTaskIPT/ScanBatchNo",
                    $TYPE: "get"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }
                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            render: function (Wlist) {
                var _data = [];
                for (var p in Wlist) {
                    var o = KEYWORD[p];
                    if (o) {
                        _data[Number(o.index)] = {
                            name: o.name,
                            value: Wlist[p] === "" ? "&nbsp;" : Wlist[p]
                        };
                    }
                }

                $(".m-detail-list").html($com.util.template(_data, HTML.LIST));

            },
        }
    });

    model.init();

}); //# sourceMappingURL=maps/detail-0d4b39aba7.js.map