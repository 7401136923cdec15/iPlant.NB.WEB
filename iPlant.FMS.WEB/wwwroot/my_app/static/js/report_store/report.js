require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($yang, $com) {


    var model,
		HTML,
		config,
		current,
		STATUS,
		COLOUR,
		LETTER;

    current = "Status_Sent";


    STATUS = ["创建", "已提交", "待入库", "待收库", "已收库", "已入库", "已驳回", "待验收", "验收中"];
    COLOUR = ["text-yellow", "text-blue", "text-blue", "text-grey", "text-grey", "text-grey", "text-red", "text-yellow", "text-blue"];

    HTML = {
        LIST: ['<div class="ms-group clearfix" data-id="{{id}}" data-status="{{state}}">',
			'<div class="ms-col ms-col-f"><div class="ms-limit">',
			'<div class="ms-title"><span class="ms-field femi-rt">',

			'<span class="ms-text ms-margin">{{lineName}}</span>',
			'</span><span>{{name}}</span></div>',

			'<div class="ms-sub-title">',
			'<span class="ms-field">',
			'<span class="ms-label">总数:</span><span class="ms-text">{{c1}}</span>',
			'</span>',

			'<span class="ms-field">',
			'<span class="ms-label">收库时间</span><span class="ms-text">{{c3}}</span>',
			'</span>',
			'</div>',
			'</div></div>',
			'<div class="ms-col ms-col-l">',
			'<span class="ms-status {{color}}">{{status}}</span>',
			'</div>',
			'</div>'].join("")
    };

    model = $com.Model.create({
        name: '入库列表',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();
        },

        events: function () {
            $("body").delegate(".ms-group", "click", function (e) {
                var $this = $(this),
					id = $this.attr("data-id"),
					status = Number($this.attr("data-state"));
                switch (status) {
                    case 0:
                        alert("未检验的入库单不能操作！");
                        break;
                    case 6:
                        alert("驳回入库单不能操作！");
                        break;

                    case 7:
                        alert("待验收的入库单不能操作！");
                        break;
                    case 8:
                        alert("验收中的入库单单不能操作！");
                        break;
                    default:
                        window.location = "info.html?id=" + id;
                        break;
                }
              
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

        },

        run: function () {
            //var _shift_id = 0;
            var _person_judge = 0;
            if (window.JSImpl) {
                //_shift_id = window._shift_id;
                _person_judge = window._person_judge;
            }
            this.com.get({
                EventID: 5004,
                person_judge: _person_judge,
            }, function (data) {
                var DoneList = [];
                for (var i = 0; i < data.list.length; i++) {
                    if (data.list[i].Status==5) {
                        DoneList.push(data.list[i]);
                    }
                }
                model.com.render(model.com.filter(DoneList));
            });
        },

        com: {
            get: function (data, fn, context) {
                var d = {
                    $URI: "/ReportStore/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            filter: function (data) {
                var _data = [];
                $(data).each(function () {

                    if (this.Status >= 0 && this.Status < 7) {
                        if (this.PartName) {
                            _data.push({
                                lineName: this.LineName,
                                name: this.PartName + " " + this.MaterialNo,
                                c1: this.FQTYTotal,
                                c3: $com.util.format("yyyy-MM-dd hh:mm:ss", this.SubmitTime),
                                id: this.ID,
                                state: this.Status,
                                status: STATUS[this.Status],
                                color: COLOUR[this.Status]
                            });
                        } else {
                            _data.push({
                                lineName: this.LineName,
                                name: this.MaterialNo,
                                c1: this.FQTYTotal,
                                c3: $com.util.format("yyyy-MM-dd hh:mm:ss", this.SubmitTime),
                                id: this.ID,
                                state: this.Status,
                                status: STATUS[this.Status],
                                color: COLOUR[this.Status]
                            });

                        }

                    }

                });


                return _data;
            },

            render: function (data) {
                $(".m-table").html($com.util.template(data, HTML.LIST));
            }
        }
    });

    model.init();

});
//# sourceMappingURL=maps/report-139bd9cd7f.js.map