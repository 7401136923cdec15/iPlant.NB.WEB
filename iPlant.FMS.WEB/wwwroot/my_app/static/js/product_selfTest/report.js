require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($yang, $com) {


    var model,
		HTML,
		BGModeText,
		ShiftText,
        STATUS,
        WewID,
        WcpID,
		ShiftCOLOUR;

    STATUS = ["未知", "保存", "下达", "开工", "完工","暂停","终止"];

    COLOUR = ["text-grey", "text-blue", "text-green", "text-yellow", "text-green", "text-grey", "text-grey"];
    HTML = {
        LIST: ['<div class="ms-group clearfix" data-id="{{ID}}" data-text="{{StatusText}}" data-string="{{MaterialCheck}}">',
			'<div class="ms-col ms-col-f" >',
			'<div class="ms-limit" >',
            '<div class="ms-title">',
			'<span class="ms-field femi-rt"> ',
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
			//'<span class="ms-label">激活:</span> <span class="ms-text">{{ActiveTime}}</span>',
            // '<span class="ms-field"><span class="ms-label">人员:</span>',
			//'<span class="ms-text">{{OperatorName}}</span> </span>',
			//'</span>',
			//'</div>',
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
                 text = $this.attr("data-text"),
                 string = $this.attr("data-string");
                window.location = "detailgx.html?id=" + id + "&text=" + text + "&Tstring=" + string;

            });
        },

        run: function () {

            model.com.get({
                StationID: 0,
                EventID: 1003,
            }, function (data) {
                model.com.render(data.list);
            });
            //model.com.getSFC({TaskStepID:1,StationID:1,PartNo:""}, function (res) {
            //    model.com.render(res.info);
            //})

            //model.com.getSFC({  PartType:3 , PartNo: "" }, function (data) {
            //    model.com.render(data.info);
            //})
        },

        com: {
            get: function (data, fn, context) {
                var d = {
                    $URI: "/TaskHandle/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getSFC: function (data, fn, context) {
                var d = {
                    $URI: "/SFCTaskIPT/ScanPartNo",
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
            render: function (data) {
                var wlist = [];
                for (i = 0; i < data.length; i++) {
                        switch (data[i].Status) {
                            case 0:
                                data[i].StatusText = "未知";
                                data[i].Color = "text-grey";
                                break;
                            case 1:
                                data[i].StatusText = "保存";
                                data[i].Color = "text-blue";
                                break;
                            case 2:
                                data[i].StatusText = "下达";
                                data[i].Color = "text-green";
                                break;
                            case 3:
                                data[i].StatusText = "开工";
                                data[i].Color = "text-yellow";
                                break;
                            case 4:
                                data[i].StatusText = "完工";
                                data[i].Color = "text-green";
                                break;
                            case 5:
                                data[i].StatusText = "暂停";
                                data[i].Color = "text-grey";
                                break;
                            case 6:
                                data[i].StatusText = "终止";
                                data[i].Color = "text-grey";
                                break;
                            default:
                                break;
                        }
                    wlist.push(data[i]);
                };
                $(".m-table").html($com.util.template(wlist, HTML.LIST));
            }
        }
    });

    model.init();

});
//# sourceMappingURL=maps/list-847d2ef23f.js.map