require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($yang, $com) {


    var model,
		HTML,
		BGModeText,
		ShiftText,
        STATUS,
		ShiftCOLOUR;

    STATUS = ["默认", "激活", "已检", "关闭超时", "主动关闭"];

    COLOUR = ["text-grey", "text-blue", "text-green", "text-red", "text-red"];
    HTML = {
        LIST: ['<div class="ms-group clearfix" data-id="{{ID}}" data-mode="{{bGMode}}" data-shift="{{PartID}}" data-status="{{Status}}">',
			'<div class="ms-col ms-col-f" >',
			'<div class="ms-limit" >',
            '<div class="ms-title">',
			'<span class="ms-field femi-rt"> ',
			'<span class="ms-text">{{LineName}}</span>',
			'</span> <span>{{PartPointName}}{{Times}}</span>',
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
        name: '生产巡检',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();
        },

        events: function () {

            var FilterNo = function (array, par) {
                var _list = [];
                $.each(array, function (i, item) {
                    if (item.deviceNo && par && item.deviceNo == par)
                        _list.push(item);
                });
                return _list;
            };

            $("#Filter").click(function () {

                if ($("#Filter").hasClass("Checking")) {
                    $("#Filter").removeClass("Checking");
                    $("#Filter").html("筛选");
                    model.com.render(model._showData);
                } else {

                    if (window.JSImpl) {
                        window.QRTEST = function (str) {

                            if (str == null || str.length <= 3) {
                                alert("扫描的二维码不正确！");
                                return false;
                            }

                            var _dataList = FilterNo(model._showData, str);

                            if (!_dataList || _dataList.length < 1) {
                                alert("该设备对应任务不存在！！！");
                                return;
                            }
                            $("#Filter").addClass("Checking");
                            $("#Filter").html("全部");
                            model.com.render(_dataList);
                        };
                        window.JSImpl.readQRCode('QRTEST');
                    }
                }
            });


            $("body").delegate(".ms-group", "click", function () {
                var $this = $(this),
			     id = $this.attr("data-id"),
			     bGMode = $this.attr("data-mode"),
			     partid = Number($this.attr("data-shift")),
			     status = $this.attr("data-status");

                if (status == 1) {
                    window.location = "check.html?id=" + id + "&mode=" + bGMode + "&partid=" + partid + "&status=" + status;
                }

            });
        },

        run: function () {

            model.com.get({
                StationID: 0,
                EventID: 1014,
            }, function (data) {
                model.com.render(data.list);
            });
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

            render: function (data) {
                var wlist = [];
                for (i = 0; i < data.length; i++) {
                    if (data[i].Status == 3) {
                        data[i].StatusText = STATUS[data[i].Status];
                        data[i].Color = COLOUR[data[i].Status];
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