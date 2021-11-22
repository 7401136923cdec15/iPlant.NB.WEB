require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($yang, $com) {

    var model,
		HTML,
		STATUS,
		COLOUR,
		RESULT,
		RESULTCOLOUR;


    STATUS = ["未激活", "激活", "已检", "关闭超时", "主动关闭"];
    COLOUR = ["text-grey", "text-blue", "text-green", "text-red", "text-red"];

    RESULT = ["未检", "合格", "不合格"];


    RESULTCOLOUR = ["text-grey", "text-green", "text-red"];



    HTML = {
     
        LISTD: ['<div class="ms-group clearfix" data-id="{{ID}}" data-check="{{Status}}" data-iptType="{{TaskType}}" data-iptVersion="{{ModuleVersionID}}" data-no="{{StationID}}">',
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
            '<span class="ms-field"><span class="ms-label">工位名:</span>',
			'<span class="ms-text">{{StationName}}</span></span>',
             '<span class="ms-field"><span class="ms-label">班次:</span>',
			'<span class="ms-text">{{ShiftID}}</span></span>',
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
        name: '计量巡检',

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
					No =Number($this.attr("data-no")),
					Status = Number($this.attr("data-check"));

                if (Status == 2) {
                    window.location = "detail.html?id=" + id;
                } else if (Status == 1) {
                    if (!window.JSImpl || !No) {
                        window.location = "check.html?id=" + id + "&no=" + No;
                    } else {
                        window.QRTEST = function (str) {

                            if (!str || str.length < 1)
                                return;
                            model.com.getScan({ QRCode: str }, function (res) {
                                if (!res.info || !res.info.QRType || !res.info.ID) {

                                    alert("二维码识别失败，请检查是否扫描错误！");
                                } else {
                                    if (res.info.ID == No) {

                                        window.location = "check.html?id=" + id + "&no=" + No;
                                    } else {
                                        alert("此工位与任务不符，请核对！");
                                    }
                                }
                            });

                        };
                        window.JSImpl.readQRCode('QRTEST',"请扫工位码！");
                    }

                } else {
                    alert(STATUS[Status] + "任务不能操作！");
                }
            });
        
        },

        run: function () {
          
            model.com.getSFCTaskIPT({
                EventID: window._eventID ? window._eventID : 2012,
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

                    if (item.Status == 2) {
                        _data.list2.push(item);
                    } 
                });
                return _data;
            },

            render: function (data) {
                model._data = data;
                model._showData = model._data.list2;
                model._LIST = HTML.LISTD;
                $(".m-table").html($com.util.template(model._data.list2, HTML.LISTD));
            }
        }
    });

    model.init();

});
//# sourceMappingURL=maps/list-935a949efd.js.map