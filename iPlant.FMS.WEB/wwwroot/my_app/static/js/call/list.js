require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($yang, $com) {

    var model, HTML, STATUS, COLOUR;


    HTML = {
        LIST: ['<div class="m-l-group clearfix">',
			'<div class="m-l-col">',
			'<a href="detail.html?id={{ID}}&sid={{DispatchID}}&tag_value={{tag_value}}&StationNo={{StationNo}}">',
			'<div class="m-l-title">【{{LevelName}}】 {{ExceptionTypeName}}：{{Comment}}</div>',
			'<div class="m-l-col clearfix">',
			'<div class="m-l-subtitle clearfix">',
			'<span class="m-item m-l-item-first">',
			'<span>{{StationTypeName}}：</span>',
			'<span>{{StationNo}}</span>',
			'</span>',
			'<span class="m-item m-l-item-last">',
			'<span>&nbsp;</span>',
			'<span>{{EditTime}}&nbsp;{{Operator}}</span>',
			'</span>',
			'</div>',
			'<div class="m-l-state">',
			'<span class="{{cls}}" data-time="{{ExpireTime}}">{{StatusName}}</span>',
			'</div>',
			'</div>',
			'</a>',
			'</div>',
			'</div>'].join(""),
    };

    STATUS = ["默认", "待处理", "收到待处理", "到场待处理", "待确认", "已转发", "已确认", "驳回待处理", "已上报", "已撤销"];
    COLOUR = ["text-red", "text-red", "text-red", "text-red", "text-yellow", "text-grey", "text-green", "text-red", "text-red", "text-grey"]




    var timeout = false;

    model = $com.Model.create({
        name: 'iPlantApp_呼叫',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();
        },

        events: function () {

            // 弹出层隐藏
            $(".multi-box").click(function (e) {
                var tar = $(e.target);

                if (tar.hasClass("multi-select")) {
                    tar.parent().hide();
                }
            });

            $("body").delegate(".femi-search-fuzzy .femi-search-border input.femi-search-content", "input", function () {
                //模糊查询
                var $this = $(this),
                    value = $this.val();
                if (!value || value.length < 1) {
                    $(".m-list .m-list-pos .m-l-group").show();
                } else {
                    $(".m-list .m-list-pos .m-l-group").each(function (i, item) {
                        if ($(item).text().indexOf(value) > 0)
                            $(item).show();
                        else
                            $(item).hide();
                    });
                }
            });
            $("body").delegate("#qr-scan-create", "click", function () {

                var $this = $(this),
                    value = $this.val();

                window.QRTEST = function (str) {

                    if (!str || str.length < 1)
                        return;

                    model.com.scan({ QRCode: str }, function (res) {
                        if (!res.info || !res.info.QRType || !res.info.ID) {

                            alert("二维码识别失败，请检查是否扫描错误！");

                        } else {
                            res.info.QRCode = str;
                            window.location = "create.html?" + $com.uri.setUrlQuery(res.info);

                        }
                    });

                };
                if (window.JSImpl)
                    window.JSImpl.readQRCode('QRTEST',"扫描异常发生地点编码");
                else
                    window.QRTEST("ST-10101001");

            });

        },

        timeout: function () {
            setTimeout(function () {
                var $span = $(".timeout"),
					now = new Date().getTime(),
					again = false;

                $span.each(function () {
                    var $this = $(this),
						time = new Date($this.attr("data-time")).getTime(),
						remain = time - now;

                    if (remain <= 0) {
                        $this.removeClass("timeout").text("已超时");
                    } else {
                        again = true;
                        remain = new Date(2000, 1, 1).getTime() + remain;
                        $this.text($com.util.format("hh:mm:ss", remain));
                    }
                });

                if (again) {
                    model.timeout();
                }
            }, 1000);
        },

        run: function () {

            var _tag_value = Number($(".m-title .m-switch").attr("data-tag-value"));
            model.com.getLevel({}, function (level) {
                model._level = {};
                $.each(level.list, function (i, item) {
                    model._level[item.ID] = item.Name;
                });
                model.com.getUser({}, function (userRes) {
                    model._User = {};
                    $.each(userRes.list, function (i, item) {
                        model._User[item.ID] = item.Name;
                    });

                    model.com.get({
                        TagValue: _tag_value,
                        person_judge: window._person_judge,
                        EventID: window._eventID
                    }, function (data) {
                        model.com.render(model.com.filter(data.list));

                        if (timeout) {
                            // 倒计时
                            model.timeout();
                        }
                    });
                });
            });

        },

        com: {
            get: function (data, fn, context) {
                var d = {
                    $URI: "/EXCCallTask/EmployeeAll",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            scan: function (data, fn, context) {
                var d = {
                    $URI: "/TaskHandle/ScanQRCode",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取二维码信息失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },


            getUser: function (data, fn, context) {
                var d = {
                    $URI: "/User/All",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取人员失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getLevel: function (data, fn, context) {
                var d = {
                    $URI: "/EXCExceptionType/LevelAll",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取响应等级失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            filter: function (data) {
                var _data = [];
                var _isTimeOut = false;
                $.each(data, function (i, item) {
                    _isTimeOut = new Date(item.ExpireTime) > new Date("2010/1/1") && new Date(item.ExpireTime) > new Date(item.EditTime);
                    if (_isTimeOut) {
                        timeout = true;
                    }

                    _data.push({
                        ExceptionTypeName: item.ExceptionTypeName ,
                        Comment: item.Comment,
                        StationNo: item.StationNo,
                        EditTime: $com.util.format("yyyy-MM-dd hh:mm", item.EditTime),
                        StatusName: _isTimeOut ? "--:--" : STATUS[item.Status],
                        LevelName: model._level[item.RespondLevel],
                        Operator: model._User[item.OperatorID],
                        ID: item.ID,
                        DispatchID: item.DispatchID,
                        StationTypeName:item.StationTypeName,
                        tag_value: Number($(".m-title .m-switch").attr("data-tag-value")),
                        cls: COLOUR[item.Status] + (_isTimeOut ? " timeout" : ""),
                        ExpireTime: item.ExpireTime
                    });
                });

                return _data;
            },

            render: function (data) {
                $(".m-list .m-list-pos").html($com.util.template(data, HTML.LIST));
            }
        }
    });

    model.init();
});
