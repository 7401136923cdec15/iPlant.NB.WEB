﻿require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($yang, $com) {

    var model,
		HTML,
		STATUS,
		COLOUR,
		RESULT,
        wDatalist,
		RESULTCOLOUR;


    STATUS = ["未知", "保存", "下达", "开工", "完工", "暂停", "终止"];

    COLOUR = ["text-grey", "text-blue", "text-green", "text-yellow", "text-green", "text-grey", "text-grey"];


    RESULT = ["合格", "合格", "不合格"];


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
        LISTD: ['<div class="ms-group clearfix" data-id="{{ID}}" data-check="{{Status}}" data-iptStep="{{TaskType}}" data-iptSta="{{ModuleVersionID}}"}}" >',
			'<div class="ms-col ms-col-f">',
			'<div class="ms-limit"> ',
			'<div class="ms-title">',
			'<span class="ms-field femi-rt"> ',
			//'<span class="ms-text ms-margin">{{PartName}}</span>',
			'<span class="ms-text">{{LineName}}</span>',
			'</span> <span>{{PartPointName}}</span>',
			'</div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field"><span class="ms-label">订单号:</span>',
			'<span class="ms-text">{{OrderNo}}</span></span>',
			'</span>',
			'</div>',
            //'<div class="ms-sub-title">',
			//'<span class="ms-field">',
			//'<span class="ms-label">提交:</span> <span class="ms-text">{{SubmitTime}}</span>',
            // '<span class="ms-field"><span class="ms-label">人员:</span>',
			//'<span class="ms-text">{{OperatorName}}</span> </span>',
			//'</span>',
			//'</div>',
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
				'<span class="ms-status {{Color}}">{{StatusText}}</span>',
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

                var text = STATUS[Status];
              
                window.location = "detailgx.html?id=" + id+"&text="+text;
             
            });
        
        },

        run: function () {
            var _person_judge = 0;
            var _event_id = 2014;

            if (window.JSImpl) {
                // _shift_id = window._shift_id;
                _person_judge = window._person_judge;
                _event_id = window._eventID;
            }
            model.com.getSFCTaskHandle({
                EventID: _event_id,
                person_judge: _person_judge
            }, function (data) {
                wDatalist=data.list;
                model.com.render(model.com.filter(data.list));
            });
        },

        com: {

            getSFCTaskHandle: function (data, fn, context) {
                var d = {
                    $URI: "/TaskHandle/All",
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

                    //item.ActiveTimeText = $com.util.format("yyyy-MM-dd hh:mm", item.ActiveTime);
                    //item.SubmitTimeText = $com.util.format("yyyy-MM-dd hh:mm", item.SubmitTime);

                    item.StatusText = STATUS[item.Status];
                    item.Color = COLOUR[item.Status];

                    //if (item.Result == true) {
                    //    item.Result = 1;
                    //} else {
                    //    item.Result = 2;
                    //};

                    //item.ResultColor = RESULTCOLOUR[item.Result];
                    //item.ResultText = RESULT[item.Result];

                    _data.list2.push(item);
                    //if (this.Status == 2) {
                    //    _data.list2.push(item);
                    //} else {
                    //    _data.list1.push(item);
                    //}
                });
                return _data;
            },

            render: function (data) {
                model._data = data;
                model._showData = data.list1;
                model._LIST = HTML.LIST;
                $(".m-table").html($com.util.template(data.list2, HTML.LISTD));
            }
        }
    });

    model.init();

});
//# sourceMappingURL=maps/list-935a949efd.js.map