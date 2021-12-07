﻿require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($yang, $com) {

    var model,
		HTML,
		STATUS,
		COLOUR,
		RESULT,
        wDatalist,
		RESULTCOLOUR;


    STATUS = ["未激活", "激活", "已检", "关闭超时", "主动关闭"];
    COLOUR = ["text-grey", "text-blue", "text-green", "text-red", "text-red"];

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
			'</span> <span>{{PartPointName}}</span>',
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
			'<span class="ms-field"><span class="ms-label">工序:</span>',
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
        name: '生产自检',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();
        },

        events: function () {
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
        
        },

        run: function () {

            model.com.getSFCTaskIPT({
                EventID: window._eventID ? window._eventID : 1003,
            }, function (data) {
                wDatalist=data.list;
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