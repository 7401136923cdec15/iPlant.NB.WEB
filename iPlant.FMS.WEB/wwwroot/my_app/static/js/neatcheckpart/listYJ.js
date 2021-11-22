require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($yang, $com) {

    //需要引用bootstrap的就添加一个url:'./static/utils/js/base/bootstrap' 参数 BS  然后先执行BS();
    //需要用动态表单的添加 './static/utils/js/base/entry' 参数	 iForm 


    var model,
		HTML,
		STATUS,
		COLOUR,
		CHECKLIST,
		TypeSource_SEARCH,
		KEYWORD_SEARCH_LIST,
		KEYWORD_SEARCH,
		in_defult,
		WORKSHOPLIST,
        AllDeviceLedger,
        AllUser,
        AllWorkShop,
        AllLine,
		TASKTYPELIST,
        AllType,
        AllStatus,
        ActiveTask,
        DataAll;
    STATUS = ["未知", "保存", "下达", "开工", "完工", "暂停", "终止"];

    COLOUR = ["text-red", "text-yellow", "text-yellow", "text-yellow", "text-yellow", "text-yellow", "text-yellow"];
    HTML = {
        LIST: [
            '<div class="ms-group clearfix" data-id="{{ID}}" data-check="{{MaterialCheckID}}">',
            '<div class="ms-col ms-col-f">',
                '<div class="ms-limit">',
                    '<div class="ms-title">',
                        '<span class="ms-field femi-rt">',
                            '<span class="ms-text ms-margin"></span>',
                            '<span class="ms-text ms-margin">{{LineName}}</span>',
                        '</span> <span>{{PartName}}</span>',
                    '</div>',
                    '<div class="ms-sub-title">',
                        '<span class="ms-field">',
                            '<span class="ms-label">订单号:</span>',
                            '<span class="ms-text">{{OrderNo}}</span>',
                       ' </span>',
                    '</div>',
                    '<div class="ms-sub-title">',
                        '<span class="ms-field">',
                            '<span class="ms-label">产品型号:</span>',
                            '<span class="ms-text">{{ProductNo}}</span>',
                        '</span>',
                    '</div>',
                       '<div class="ms-sub-title">',
                        '<span class="ms-field">',
                              '<span class="ms-label">物料名称:</span>',
                            '<span class="ms-text">{{MaterialName}}</span>',
                        '</span>',
                    '</div>',
                '</div>',
            '</div>',
            '<div class="ms-col ms-col-l">',
                '<span class="ms-status {{Color}}">{{StatusName}}</span>',
            '</div>',
        '</div>' ].join("")
    };
    model = $com.Model.create({
        name: '工序齐套检查',
        type: $com.Model.MAIN,

        configure: function () {
            this.run();
        },
        events: function () {
       
            $("body").delegate(".ms-group", "click", function () {
                var $this = $(this),
					id = $this.attr("data-id"),
					device = $this.attr("data-no"),
					check = $this.attr("data-check"),
                    shiftID = Number($this.attr("data-shift"));
                  
                window.location = "partcheck.html?id=" + id + "&sid=" + check;
            });
            $("body").delegate("#check", "click", function () {
                window.location = "list.html";
            });
            $("body").delegate(".femi-search-fuzzy-toggle", "click", function () {
                $(".femi-search-fuzzy").show();
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
            var list = [];
            model.com.get({
                StationID: 0, EventID: 1007, person_judge: window._person_judge
            }, function (data) {
                for (var i = 0; i < data.list.length; i++) {
                    if (data.list[i].MaterialCheckID && data.list[i].MaterialCheckID > 0) {
                        list.push(data.list[i]);
                    }
                }
                for (var i = 0; i < list.length; i++) {
                    if (list[i].MaterialCheck == true) {
                        list[i].StatusName = "合格";
                        list[i].Color = "text-green";
                    } else {
                        list[i].StatusName = "不合格";
                        list[i].Color = "text-red";
                    }
                }
                $(".m-table").html($com.util.template(list, HTML.LIST));
            });
        },

        com: {
          
            //用户
            getUser: function (data, fn, context) {
                var d = {
                    $URI: "/User/All",
                    $TYPE: "get"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }
                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //所有任务列表
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
            //单条任务列表
            getInfo: function (data, fn, context) {
               var d = {
                    $URI: "/SFCMaterialCheck/TaskPartInfo",
                    $TYPE: "get"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }
                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //未检
            refresh: function () {
                model.com.get({
                    EventID: 4001
                }, function (data) {
                    var list = data.list;
                    for (var i = 0; i < list.length; i++) {
                        if (list[i].Status == 5) {
                            list[i].StatusName = "已检";
                            list[i].Color = "text-green";
                        } else {
                            list[i].StatusName = "未检";
                            list[i].Color = "text-yellow";
                        }
                    }
                    $(".m-table").html($com.util.template(list, HTML.LIST));
                });
            },
            //已检
            refresh1: function () {
                model.com.get({
                    EventID: 4001
                }, function (data) {
                    var list = [];
                    for (var i = 0; i < data.list.length; i++) {
                        if (Status == 5) {
                            list.push(data.list[i]);
                        }
                    }
                    for (var i = 0; i < list.length; i++) {
                        if (list[i].Status == 5) {
                            list[i].StatusName = "已检";
                            list[i].Color = "text-green";
                        } else {
                            list[i].StatusName = "未检";
                            list[i].Color = "text-yellow";
                        }
                    }
                    $(".m-table").html($com.util.template(list, HTML.LIST));
                });
            },
            filter: function (data) {
                var _data = {
                    list1: [],
                    list2: []
                };
                $.each(data, function (i, item) {
                    if (item.TaskType < 1 || item.TaskType > 4)
                        return true;

                    item.WorkShopName = WORKSHOPLIST[item.WorkShopID].name;
                    item.LineName = WORKSHOPLIST[item.WorkShopID].line[item.LineID];
                    item.TaskTypeText = TASKTYPELIST[item.TaskType];
                    item.ActiveTimeText = $com.util.format("yyyy-MM-dd hh:mm", item.ActiveTime);
                    item.ResultText = STATUS[item.Result];
                    item.Color = COLOUR[item.Result];
                    item.Check = CHECKLIST[item.Result];
                    if (item.Result > 0) {
                        _data.list2.push(item);
                    } else {
                        _data.list1.push(item);
                    }
                });
                return _data;
            },
            render: function (data) {
                model._data = data;
                model._showData = model._data.list1;
                $(".m-table").html($com.util.template(model._showData, HTML.LIST));
            }
        }
    });
    model.init();
});

//# sourceMappingURL=maps/list-e9563bc81f.js.map