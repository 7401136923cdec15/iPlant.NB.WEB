require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($yang, $com) {


    var model,
		HTML,
		KEYWORD,
		KEYWORD_LIST,
		STOCKSTATUS,
		COLOUR,
		STATUS,
		KEYWORD2,
		KEYWORD_LIST2;


    STOCKSTATUS = ["合格", "不合格"];
    STOCKSTATUS[10006] = "报废";
    STOCKSTATUS[225492] = "回用";
    STOCKSTATUS[225493] = "工序废";
    STOCKSTATUS[225494] = "降级";
    STOCKSTATUS[226962] = "合格";

    STATUS = ["创建", "已提交", "待入库", "待收库", "已收库", "已入库", "驳回", "待验收", "验收中"];
    COLOUR = ["text-yellow", "text-blue", "text-blue", "text-grey", "text-grey", "text-grey", "text-red", "text-yellow", "text-blue"];
    HTML = {
        LIST: ['<li>',
			'<label class="m-detail-title">{{name}}</label>',
			'<div class="m-detail-content">{{value}}</div>',
			'</li>'].join(""),
        LIST1: ['<li>',
			'<label class="m-detail-title">{{name}}</label>',
			'<div class="m-detail-content text-blue">{{value}}</div>',
			'</li>'].join(""),
        LIST2: ['<div class="ms-group clearfix" data-id="{{id}}" data-status="{{state}}">',
			'<div class="ms-col ms-col-f"><div class="ms-limit">',
			'<div class="ms-title">{{name}}</div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field">',
			'<span class="ms-label">仓位号:</span><span class="ms-text">{{c1}}</span>',
			'</span>',
			'<span class="ms-field">',
			'<span class="ms-label">物料状态:</span><span class="ms-text">{{c2}}</span>',
			'</span>',
			'<span class="ms-field">',
			'<span class="ms-label">数量:</span><span class="ms-text">{{c3}}</span>',
			'</span>',
			'</div>',
			'</div></div>',
			'<div class="ms-col ms-col-l">',
			'<span class="ms-status {{color}}">{{status}}</span>',
			'</div>',
			'</div>'].join("")
    };

    KEYWORD_LIST = [
		"FQTYTotal|入库总数",
		"MaterialNo|物料号",
		//"FeedBoxFQTY|料盒容量",
		//"FeedBoxs|仓位容量", 
    ];

    KEYWORD_LIST2 = [
		//"WorkShopName|车间",
		"LineName|产线",
		"OrderNo|订单号",
		//"PartName|工序段",
		"ProductNo|产品规格",
		"OperatorName|操作员",
		"BGTimeText|报工时间",
		//"InspectorName|检验员",
		//"InspectTimeText|检验时间",
		"ReceivingClerkName|入库员",
		"InStockTimeText|入库时间",
    ];
    KEYWORD = {};
    KEYWORD2 = {};

    model = $com.Model.create({
        name: 'iPlantApp',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

            KEYWORD_LIST.forEach(function (item, i) {
                var detail = item.split("|");
                KEYWORD[detail[0]] = {
                    index: i,
                    name: detail[1]
                };
            });
            KEYWORD_LIST2.forEach(function (item, i) {
                var detail = item.split("|");
                KEYWORD2[detail[0]] = {
                    index: i,
                    name: detail[1]
                };
            });
        },

        events: function () {
            $("body").delegate("#back", "click", function () {
                window.location = "report.html"
            });                               
            $(".zace-confirm").click(function () {

                //switch (model._data.Status) {
                //    case 4:
                        confirm("是否删除？", function (bool) {
                            var id=Number(model.query.id);
                            if (bool) {
                                model.com.removeAll({
                                    ReportID: model._data.EntryPartID,
                                    ReportType: model._data.InStockType,
                                    ID: id

                                }, function (res) {

                                    alert("删除成功！");

                                    window.location = "report.html"
                                })


                            } else {
                                return false;
                            }
                        })
                       // break;

                //}
            });
        },

        run: function () {

            this.com.get({
                ReportID: 0,
                ID: model.query.id
            }, function (data) {
                if (data.info.ItemList && data.info.ItemList.length > 0) {
                    data.info.FQTYTotal = data.info.ItemList[0].FQTY;
                } else {
                    data.info.FQTYTotal = 0;
                }
                model._data = data.info;
                if (data.info2) {
                    $(".m-detail-list").html($com.util.template(model.com.filterDetail(data.info2), HTML.LIST));
                }
                ModelItemAll = data.info;
                model.com.render(model.com.filter(data.info));

            });

           

        },

        com: {
            removeAll: function (data, fn, context) {
                var d = {
                    $URI: "/ReportStore/Remove",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            get: function (data, fn, context) {
                var d = {
                    $URI: "/ReportStore/Info",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            postStock: function (data, fn, context) {
                var d = {
                    $URI: "/ReportStore/Submit",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            postStockItem: function (data, fn, context) {
                var d = {
                    $URI: "/ReportStore/SubmitItem",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            add: function (data, fn, context) {

                var d = {
                    $URI: "/ReportStore/Submit",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            filter: function (item) {
                var _data = [],
					_list = [],
					_list2 = [],
					_status = "";

                for (var p in item) {
                    var o = KEYWORD[p];
                    if (o) {
                        _data[Number(o.index)] = {
                            name: o.name,
                            value: item[p] === "" ? "&nbsp;" : item[p]
                        };
                    }
                }
                _status = item.Status;


                //$.each(item.ItemList, function () {
                //if(this.Status==0)
                //	return true;
                if (item.ItemEntryList.length > 0) {
                    $.each(item.ItemEntryList, function () {

                        _list2.push({
                            //name : "料盒号：" + this.FlotText,
                            name: this.MaterialNo,
                            c1: this.StockName,
                            c2: STOCKSTATUS[this.StockStatus],
                            c3: this.FQTY,
                            id: this.ID,
                            state: this.Status,
                            status: STATUS[this.Status],
                            color: COLOUR[this.Status]
                        });
                    });
                } else {
                    if (item.ItemList.length > 0) {
                        _list2.push({
                            //name : "料盒号：" + this.FlotText,
                            name: item.ItemList[0].MaterialNo,
                            c1: item.ItemList[0].StockName,
                            c2: STOCKSTATUS[item.ItemList[0].StockStatus],
                            c3: item.ItemList[0].FQTY,
                            id: item.ItemList[0].ID,
                            state: item.ItemList[0].Status,
                            status: STATUS[item.ItemList[0].Status],
                            color: COLOUR[item.ItemList[0].Status]
                        });
                    }

                }
                //});
                return {
                    data: _data,
                    status: _status,
                    list: _list2
                };
            },
            filterDetail: function (item) {
                var _data = [];
                item.BGTimeText = $com.util.format("yyyy-MM-dd hh:mm:ss", item.SubmitTime);

                item.InspectTimeText = $com.util.format("yyyy-MM-dd hh:mm:ss", item.InspectTime);

                item.InStockTimeText = $com.util.format("yyyy-MM-dd hh:mm:ss", item.InStockTime);

                for (var p in item) {
                    var o = KEYWORD2[p];
                    if (o) {
                        _data[Number(o.index)] = {
                            name: o.name,
                            value: item[p] === "" ? "&nbsp;" : item[p]
                        };
                    }
                }

                return _data;
            },
            render: function (data) {
                $(".m-detail-list").append($com.util.template(data.data, HTML.LIST));
                $(".m-tips .tip-content").html(STATUS[data.status]);
                $(".m-table").html($com.util.template(data.list, HTML.LIST2));
                switch (data.status) {
                //    //SubControl
                //    $("#DetailControl").show();
                //$("#ConfirmControl").show();
                //$("#SubControl").show();
                    case 0:                       
                        $("#ConfirmControl").show();
                        break;
                    case 6:                      
                        $("#ConfirmControl").show();
                        break;
                    default:
                        $("#ConfirmControl").hide();
                        break;
                }
            }
        }
    });

    model.init();

});
//# sourceMappingURL=maps/info-7d2a599416.js.map