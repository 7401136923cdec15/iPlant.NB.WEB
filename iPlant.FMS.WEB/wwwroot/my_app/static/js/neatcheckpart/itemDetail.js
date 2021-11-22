require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($yang, $com) {


    var model,
		HTML,
		STATUS,
        AllUser,
		COLOUR;

    STATUS = ["未检", "合格", "不合格"];

    COLOUR = ["text-yellow", "text-blue", "text-red"];

    HTML = {
        LIST: ['<tr data-id="{{ID}}" data-status="{{ResultName}}">',
			'<td>{{Name}}</td>',
			'<td>{{Comment}}</td>',
			'<td class="{{Color}}">{{ResultName}}</td>',
			'<td>',
			'<svg width="11px" height="17px" viewBox="0 0 11 17" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">',
			'<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">',
			'<g transform="translate(-1675.000000, -680.000000)" fill="#C8C8C8">',
			'<g transform="translate(1668.000000, 680.000000)">',
			'<path d="M12.3333333,5.66666667 L3,5.66666667 L3,3 L13.6666667,3 L15,3 L15,15 L12.3333333,15 L12.3333333,5.66666667 Z" transform="translate(9.000000, 9.000000) scale(-1, 1) rotate(-135.000000) translate(-9.000000, -9.000000) "></path>',
			'</g></g></g></svg>',
			'</td>',
			'</tr>'].join("")
    };

    model = $com.Model.create({
        name: 'iPlantApp',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();
        },

        events: function () {
            $("body").delegate("table tr", "click", function () {
                var $this = $(this),
					id = $this.attr("data-id"),
					status = $this.attr("data-status");
                    window.location = "detail.html?id=" + model.query.id + "&sid=" + id;
            });

            $("#Repair").click(function () {
                window.QRTEST = function (val) {
                    if (val == model.DeviceNo) {
                        window.location = "item.html?id=" + model.query.id;
                    } else {
                        alert("任务与设备不符请核对设备");
                    }
                };

                window.JSImpl.readQRCode('QRTEST');

            });
        },

        run: function () {
            $(".tip-content").text("已检");
            model.com.getTask({
                EventID: window._eventID, ID: model.query.id
            }, function (data) {
                var list = data.list;
                var result = data.result;
                for (var i = 0; i < list.length; i++) {
                    for (var j = 0; j < result.length; j++) {
                        if (result[j].ItemID == list[i].ID) {
                            if (result[j].Result == true) {
                                list[i].ResultName = "合格";
                            } else {
                                list[i].ResultName = "不合格";
                            }
                        }
                    }
                }
                $(".m-table tbody").html($com.util.template(list, HTML.LIST));
            });
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
            get: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceItemResult/All",
                    $TYPE: "get"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }
                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getItem: function (data, fn, context) {
                var d = {
                    $URI: "/DevicePointCheckItem/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //comTask : {
            getTask: function (data, fn, context) {
                var d = {
                    $URI: "/DevicePointCheckTask/Info",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            filter: function (data) {
                var _data = [],
					status;

                model.DeviceNo = data.DeviceNo;

                status = STATUS[data.Result];

                $.each(data.itemList.dMSIPTItem, function (i, item) {
                    var _status = model.com.getStatus(item.ID, item.ItemResult);
                    item.ItemResultText = _status.tip;
                    item.Color = _status.color;
                });
                _data = data.itemList.dMSIPTItem;
                return {
                    data: _data,
                    status: status
                };
            },

            render: function (data) {
                $(".m-table tbody").html($com.util.template(data.data, HTML.LIST));
                $(".tip-content").html(data.status);
            },

            getStatus: function (id, result) {
                var text,
					color,
					num;
                if (id < 0) {
                    text = "存储错误";
                    color = "text-red";
                    num = -2;
                } else if (id > 0) {
                    if (result == 1) {
                        text = "合格";
                        color = "text-blue";
                        num = id; //合格不能看详情      num = id;
                    } else {
                        text = "不合格";
                        color = "text-red";
                        num = id;
                    }
                } else {
                    text = "合格";
                    color = "text-yellow";
                    num = 0;
                }
                return {
                    tip: text,
                    color: color,
                    status: num
                };
            }
        }
    });

    model.init();

});
//# sourceMappingURL=maps/item-d31ded63c7.js.map