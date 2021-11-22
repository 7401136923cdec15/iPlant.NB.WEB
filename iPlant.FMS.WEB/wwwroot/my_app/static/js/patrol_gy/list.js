require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($yang, $com) {

    var model,
		HTML,
		STATUS,
		COLOUR,
		RESULT,
		RESULTCOLOUR;


    STATUS = ["未激活", "激活", "已检", "关闭超时", "主动关闭"];
    COLOUR = ["text-grey", "text-blue", "text-green", "text-red", "text-red"];
    //STATUS = ["未检", "未检", "已检", "未检", "未检"];
    //COLOUR = ["text-red", "text-red", "text-green", "text-red", "text-red"];

    RESULT = ["未检", "合格", "不合格"];


    RESULTCOLOUR = ["text-grey", "text-green", "text-red"];



    HTML = {
        LIST: ['<div class="ms-group clearfix" data-id="{{ID}}" data-check="{{Status}}" data-iptType="{{TaskType}}" data-iptVersion="{{ModuleVersionID}}"}}" data-no="{{DeviceNo}}">',
			'<div class="ms-col ms-col-f">',
			'<div class="ms-limit"> ',
			'<div class="ms-title">',
			'<span class="ms-field femi-rt"> ',
			'<span class="ms-text ms-margin">{{WorkShopName}}</span>',
			'<span class="ms-text">{{LineName}}</span>',
			'</span> <span>{{PartPointName}}{{Times}}</span>',
			'</div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field"><span class="ms-label">订单号:</span>',
			'<span class="ms-text">{{OrderNo}}</span></span>',
			'</span>',
			'</div>',
            '<div class="ms-sub-title">',
			'<span class="ms-field">',
			'<span class="ms-label">激活:</span> <span class="ms-text">{{ActiveTime}}</span>',
             '<span class="ms-field"><span class="ms-label">人员:</span>',
			'<span class="ms-text">{{OperatorName}}</span> </span>',
			'</span>',
			'</div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field"><span class="ms-label">工序:</span>',
			'<span class="ms-text">{{PartName}}</span></span>',
			'<span class="ms-field"><span class="ms-label">规格:</span>',
			'<span class="ms-text">{{ProductNo}}</span> </span>',
			'</div>',
			'</div>',
			'</div>',
			'<div class="ms-col ms-col-l">',
			'<span class="ms-status {{Color}}">{{StatusText}}</span>',
			'</div>',
			'</div>'].join(""),
        LISTD: ['<div class="ms-group clearfix" data-id="{{ID}}" data-check="{{Status}}" data-iptType="{{TaskType}}" data-iptVersion="{{ModuleVersionID}}" data-no="{{DeviceNo}}">',
			'<div class="ms-col ms-col-f">',
			'<div class="ms-limit"> ',
			'<div class="ms-title">',
			'<span class="ms-field femi-rt"> ',
			'<span class="ms-text ms-margin">{{WorkShopName}}</span>',
			'<span class="ms-text">{{LineName}}</span>',
			'</span> <span>{{PartPointName}}</span>',
			'</div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field"><span class="ms-label">订单号:</span>',
			'<span class="ms-text">{{OrderNo}}</span></span>',
			'</span>',
			'</div>',
            '<div class="ms-sub-title">',
			'<span class="ms-field">',
			'<span class="ms-label">提交:</span> <span class="ms-text">{{SubmitTime}}</span>',
             '<span class="ms-field"><span class="ms-label">人员:</span>',
			'<span class="ms-text">{{OperatorName}}</span> </span>',
			'</span>',
			'</div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field">',
			'<span class="ms-text">{{PartName}}</span></span>',
			'<span class="ms-field"><span class="ms-label">规格:</span>',
			'<span class="ms-text">{{ProductNo}}</span> </span>',
			'</div>',
			'</div>',
			'</div>',
			'<div class="ms-col ms-col-l">',
			'<span class="ms-status {{ResultColor}}">{{ResultText}}</span>',
			'</div>',
			'</div>'].join(""),
    };

    model = $com.Model.create({
        name: '工艺巡检',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();
        },

        events: function () {
            $("body").delegate("#menu", "click", function () {
                if ($(".frame").is(":hidden")) {
                    $(".cloth").show();
                    $(".frame").show();
                } else {
                    $(".frame").hide();
                    $(".cloth").hide();
                }
            });
            $("body").delegate(".cloth", "click", function () {
                $(".frame").hide();
                $(".cloth").hide();
            });

            $("body").delegate("#screen", "click", function () {
                window.QRTEST = function (str) {
                    if (!str || str.length <= 0)
                        return false;
                    model.com.getScan({ QRCode: str }, function (data) {
                        //设备或工位id
                        var stationID = data.info.ID;
                        var wlist = [];
                        //在任务中筛选出此设备或工位的任务
                        for (i = 0; i < wDatalist.length; i++) {
                            if (wDatalist[i].StationID == stationID) {
                                wlist.push(wDatalist[i]);
                            }
                        }
                        $(".m-table").html($com.util.template(wlist, HTML.LIST));
                    });
                }
                if (window.JSImpl)
                    window.JSImpl.readQRCode('QRTEST');
                else
                    return false;

            });

            $("#Filter").click(function () {

                if ($("#Filter").hasClass("Checking")) {
                    $("#Filter").removeClass("Checking");
                    $("#Filter").html("筛选");
                    $(".m-table").html($com.util.template(model._showData, model._LIST));
                } else {

                    if (window.JSImpl) {
                        window.QRTEST = function (str) {

                            if (str == null || str.length <= 3) {
                                alert("扫描的二维码不正确！");
                                return false;
                            }

                            var _list = [],
								_dataList = [],
								_HtmlType;

                            _list = model._showData;
                            _HtmlType = model._LIST;
                            _dataList = FilterNo(_list, str);
                            if (!_dataList || _dataList.length < 1) {
                                alert("该设备未找到当前条件的任务");
                                return;
                            }
                            $("#Filter").addClass("Checking");
                            $("#Filter").html("全部");
                            $(".m-table").html($com.util.template(_dataList, _HtmlType));
                        };
                        window.JSImpl.readQRCode('QRTEST');
                    }

                }
            });

            function FilterNo(array, par) {
                var _list = [];
                $.each(array, function (i, item) {
                    if (item.deviceNo && par && item.deviceNo == par)
                        _list.push(item);
                });
                return _list;
            }

            $("body").delegate(".ms-group", "click", function () {
                var $this = $(this),
					id = $this.attr("data-id"),
					No = $this.attr("data-no"),
					Status = Number($this.attr("data-check"));

                if (Status == 2) {
                    window.location = "detail.html?id=" + id;
                } else if (Status == 1) {

                    if (!No || No.length <= 3 || !window.JSImpl) {
                        window.location = "check.html?id=" + id;
                    } else {
                        window.QRTEST = function (str) {
                            if (str == No) {

                                window.location = "check.html?id=" + id;
                            } else {
                                alert("此设备与任务不符，请核对！");
                            }
                        };
                        window.JSImpl.readQRCode('QRTEST');
                    }
                } else {
                    alert(STATUS[Status] + "任务不能操作！");
                }
            });
            $(".m-title .m-switch").delegate(".m-switch-btn:not(.active):not(.other)", "click", function () {
                var $this = $(this);

                var $sib = $this.siblings();

                $this.addClass("active");
                $sib.removeClass("active");


                $("#Filter").removeClass("Checking");
                $("#Filter").html("筛选");


                if ($this.next("a.m-switch-btn:not(.other)")[0]) {
                    model._showData = model._data.list1;
                    model._LIST = HTML.LIST;
                    $(".m-table").html($com.util.template(model._data.list1, HTML.LIST));
                } else {
                    model._showData = model._data.list2;
                    model._LIST = HTML.LISTD;
                    $(".m-table").html($com.util.template(model._data.list2, HTML.LISTD));
                }
            });
        },

        run: function () {
            var _shift_id = 0;
            var _person_judge = 0;
            if (window.JSImpl) {
                _shift_id = window._shift_id;
                _person_judge = window._person_judge;
            }
            if (model.query.status) {
                var $active = $(".m-title .m-switch .m-switch-btn.active:not(.other)");
                $active.removeClass("active");
                $active.next("a.m-switch-btn:not(.other)").addClass("active");
            }

            model.com.getSFCTaskIPT({
                EventID: 3001,
            }, function (data) {
                model.com.render(model.com.filter(data.list));
            });
        },

        com: {

            getSFCTaskIPT: function (data, fn, context) {
                var d = {
                    $URI: "/SFCTaskIPT/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            filter: function (data) {
                var _data = {
                    list1: [],
                    list2: []
                };
                $.each(data, function (i, item) {

                    item.ActiveTimeText = $com.util.format("yyyy-MM-dd hh:mm", item.ActiveTime);
                    item.SubmitTimeText = $com.util.format("yyyy-MM-dd hh:mm", item.SubmitTime);

                    item.StatusText = STATUS[item.Status];
                    item.Color = COLOUR[item.Status];

                    if (item.Result == true) {
                        item.Result = 1;
                    } else {
                        item.Result = 2;
                    };

                    item.ResultColor = RESULTCOLOUR[item.Result];
                    item.ResultText = RESULT[item.Result];

                    if (this.Status == 2) {
                        _data.list2.push(item);
                    } else {
                        _data.list1.push(item);
                    }
                });
                return _data;
            },

            render: function (data) {
                model._data = data;
                model._showData = data.list1;
                model._LIST = HTML.LIST;
                $(".m-table").html($com.util.template(data.list1, HTML.LIST));
            }
        }
    });

    model.init();

});
//# sourceMappingURL=maps/list-935a949efd.js.map