require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($yang, $com) {

    //需要引用bootstrap的就添加一个url:'./static/utils/js/base/bootstrap' 参数 BS  然后先执行BS();
    //需要用动态表单的添加 './static/utils/js/base/entry' 参数	 iForm 


    var model,
		HTML,
		STATUS,
		COLOUR,
		CHECKLIST,
		TypeSource_SEARCH,
		KEYWORD_SEARCH_LIST,
		KEYWORD_SEARCH,
		in_defult,
		WORKSHOPLIST,
        AllDeviceLedger,
        AllUser,
        AllWorkShop,
        AllLine,
		TASKTYPELIST,
        AllType,
        AllStatus,
        ActiveTask,
        DataAll;

    HTML = {
        LIST: [
            '<div class="ms-group clearfix" data-id="{{ID}}" data-check="{{StatusName}}">',
			'<div class="ms-col ms-col-f">',
			'<div class="ms-limit">',
			'<div class="ms-title">',
			'<span class="ms-field femi-rt"> ',
			'<span class="ms-text ms-margin">{{WorkShopName}}</span>',
            
			'<span class="ms-text ms-margin">{{LineName}}</span>',
			'</span> <span>{{DeviceName}}</span>',
			'</div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field">',
			'<span class="ms-label">编码:</span>',
			'<span class="ms-text">{{DeviceNo}}</span>',
			'</span> ',
			'<span class="ms-field">',
            '<span class="ms-margin">{{TypeText}}</span>',
			'</span>',
			'</div>',
            '<div class="ms-sub-title">',
            '<span class="ms-field">',
            '<span class="ms-label">激活:</span>',
			'<span class="ms-text">{{ActiveTime}}</span>',
            '</span>',
            '</div>',
			'</div>',
			'</div>',
			'<div class="ms-col ms-col-l">',
			'<span class="ms-status {{Color}}">{{StatusName}}</span>',
			'</div>',
			'</div>'].join("")
    };

    model = $com.Model.create({
        name: '点检任务',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();
        },
        events: function () {

            $("body").delegate(".ms-group", "click", function () {
                    var $this = $(this),
                        id = $this.attr("data-id"),
                        device = $this.attr("data-no"),
                        check = $this.attr("data-check"),
                        shiftID = Number($this.attr("data-shift"));
                    var info={};
                        for (var i = 0; i < DataAll.length; i++) {
                            if (DataAll[i].ID == id)
                                info = DataAll[i];
                        }
                        window.QRTEST = function (str) {
                            if (!str || str.length <= 0)
                                return false;
                            model.com.getScan({
                                QRCode: str
                            }, function (data) {
                                if(data.info.QRType==8&&window.JSImpl.GetCustomMap("DeviceID")==info.DeviceID){
                                    window.location = "item.html?id=" + id + "&status=" + check;
                                }
                                if (data.info.QRType == 8) {
                                    window.JSImpl.SetCustomMap("DeviceID", data.info.ID);
                                    model.com.getStation({
                                        ID: data.info.ID, ApplyID: 0, AssetID: 0, DeviceNo: "",
                                    }, function (data) {
                                        window.JSImpl.SetCustomMap("WorkShopID", data.info.WorkShopID);
                                        window.JSImpl.SetCustomMap("LineID", data.info.LineID);
                                    });
                                }
                                else {
                                    alert("此设备与任务不匹配！！")
                                }
                                   
                                });
                        }
                        if (window.JSImpl)
                            window.JSImpl.readQRCode('QRTEST', "请扫设备编码！");
                        else
                            return false;
            });
         
            $("body").delegate("#screen", "click", function () {
                $(".femi-search-fuzzy").show();
            });
            $("body").delegate(".femi-search-fuzzy .femi-search-border input.femi-search-content", "input", function () {
                //模糊查询
                var $this = $(this),
                    value = $this.val();
                if (!value || value.length < 1) {
                    $(".ms-group").show();
                } else {
                    $(".ms-group").each(function (i, item) {
                        if ($(item).text().indexOf(value) > 0)
                            $(item).show();
                        else
                            $(item).hide();
                    });
                }
            });
            $("body").delegate("#check", "click", function () {
                
                var wStationID = window.JSImpl.GetCustomMap("DeviceID");
                if (wStationID && wStationID != 0) {
                    model.com.getStation({
                        ID:wStationID,ApplyID:0,AssetID:0,DeviceNo:"",
                    }, function (data) {
                        confirm("检测到 :'" + data.info.Name + "' 确定对此设备进行点检？", function (bool) {
                            if (bool == true) {
                                window.location = "item.html?QRstring=" + data.info.DeviceNo;
                            } else {
                                confirm("是否重新扫码？", function (bool1) {
                                    if (bool1 == true) {
                                        window.QRTEST = function (str) {
                                            if (!str || str.length <= 0)
                                                return false;
                                            model.com.getScan({
                                                QRCode: str
                                            }, function (data) {
                                                if (data.info.QRType == 8) {
                                                    window.JSImpl.SetCustomMap("DeviceID", data.info.ID);
                                                    model.com.getStation({
                                                        ID: data.info.ID, ApplyID: 0, AssetID: 0, DeviceNo: "",
                                                    }, function (data) {
                                                        window.JSImpl.SetCustomMap("WorkShopID", data.info.WorkShopID);
                                                        window.JSImpl.SetCustomMap("LineID", data.info.LineID);
                                                        window.location = "item.html?QRstring=" + str;
                                                    });
                                                }
                                            });
                                        }
                                        //如果存在调用函数
                                        if (window.JSImpl)
                                            window.JSImpl.readQRCode('QRTEST', "请扫设备编码！");
                                        else
                                            return false;
                                    } else {
                                        return false;
                                    }
                                });
                                }
                        });
                    });
                } else {
                    window.QRTEST = function (str) {
                        if (!str || str.length <= 0)
                            return false;
                        model.com.getScan({
                            QRCode: str
                        }, function (data) {
                            if (data.info.QRType == 8) {
                                window.JSImpl.SetCustomMap("DeviceID", data.info.ID);
                                window.location = "item.html?QRstring=" + str;
                            }
                        });
                    }
                    //如果存在调用函数
                    if (window.JSImpl)
                        window.JSImpl.readQRCode('QRTEST', "请扫设备编码！");
                    else
                        return false;
                }
            });
        },
        run: function () {
            //alert(window._eventID);
            if (window._eventID == 0) {
                window._eventID = 4001;
            }
           
            model.com.refresh();
        },
        com: {
            getTask: function (data, fn, context) {
                var d = {
                    $URI: "/SFCTaskSpot/Info",
                    $TYPE: "get"
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
            //设备
            getStation: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceLedger/Info",
                    $TYPE: "get"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //所有任务列表
            get: function (data, fn, context) {
                var d = {
                    $URI: "/SFCTaskSpot/All",
                    $TYPE: "get"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }
                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //单条任务列表
            getInfo: function (data, fn, context) {
                var d = {
                    $URI: "/SFCTaskSpot/Info",
                    $TYPE: "get"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //未检
            refresh: function () {
                model.com.get({
                    EventID: window._eventID
                }, function (data) {
                    var list = [];
                    for (var i = 0; i < data.list.length; i++) {
                        if (data.list[i].Status != 5) {
                            list.push(data.list[i]);
                        }
                    }
                    DataAll = list;
                    for (var i = 0; i < list.length; i++) {
                        if (list[i].Status == 5) {
                            list[i].StatusName = "已检";
                            list[i].Color = "text-green";
                        } else {
                            list[i].StatusName = "未检";
                            list[i].Color = "text-yellow";
                        }
                    }
                    $(".m-table").html($com.util.template(list, HTML.LIST));
                });
            },
            //已检
            refresh1: function () {
                model.com.get({
                    EventID: window._eventID
                }, function (data) {
                    var list = [];
                    for (var i = 0; i < data.list.length; i++) {
                        if (data.list[i].Status == 5) {
                            list.push(data.list[i]);
                        }
                    }
                    DataAll = list;
                    for (var i = 0; i < list.length; i++) {
                        if (list[i].Result == true) {
                            list[i].StatusName = "合格";
                            list[i].Color = "text-green";
                        } else {
                            list[i].StatusName = "不合格";
                            list[i].Color = "text-red";
                        }
                    }
                    $(".m-table").html($com.util.template(list, HTML.LIST));
                });
            },
            filter: function (data) {
                var _data = {
                    list1: [],
                    list2: []
                };
                $.each(data, function (i, item) {
                    if (item.TaskType < 1 || item.TaskType > 4)
                        return true;

                    item.WorkShopName = WORKSHOPLIST[item.WorkShopID].name;
                    item.LineName = WORKSHOPLIST[item.WorkShopID].line[item.LineID];
                    item.TaskTypeText = TASKTYPELIST[item.TaskType];
                    item.ActiveTimeText = $com.util.format("yyyy-MM-dd hh:mm", item.ActiveTime);
                    item.ResultText = STATUS[item.Result];
                    item.Color = COLOUR[item.Result];
                    item.Check = CHECKLIST[item.Result];

                    if (item.Result > 0) {
                        _data.list2.push(item);
                    } else {
                        _data.list1.push(item);
                    }
                });
                return _data;
            },
            render: function (data) {
                model._data = data;
                model._showData = model._data.list1;
                $(".m-table").html($com.util.template(model._showData, HTML.LIST));
            }
        }
    });
    model.init();
});

//# sourceMappingURL=maps/list-e9563bc81f.js.map