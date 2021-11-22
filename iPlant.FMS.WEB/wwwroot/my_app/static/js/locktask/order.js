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
      
    //    BOMMaterialList: (12) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
    //    BOMNo: "B103-48V"
    //EndTime: "2019-07-01 00:00:00"
    //ExtensionData: {}
    //FQTYDone: 0
    //FQTYParts: 0
    //FQTYShift: 80
    //ID: 1
    //LineID: 1
    //LineName: null
    //MaterialCheck: false
    //MaterialCheckID: 0
    //MaterialCheckList: []
    //MaterialList: []
    //MaterialName: "48V标准模组"
    //MaterialNo: "B0.01.000002"
    //OrderID: 2
    //OrderNo: "CRRC-JHD-20190202"
    //PlanerID: 1
    //PlanerName: null
    //ProductID: 0
    //ProductNo: "MCE0005C8-0160R0TBZ"
    //ShiftID: 20190727
    //StartTime: "2019-07-01 00:00:00"
    //Status: 2
    //TaskPartList: []
    //TaskText: ""
    LIST: [
        '<div class="ms-group clearfix" data-id="{{ID}}" data-check="{{StatusName}}">',
        '<div class="ms-col ms-col-f">',
            '<div class="ms-limit">',
                '<div class="ms-title">',
                    '<span class="ms-field femi-rt">',
                        '<span class="ms-text ms-margin"></span>',
                        '<span class="ms-text ms-margin">{{LineName}}</span>',
                    '</span> <span>{{OrderNo}}</span>',
                '</div>',
                   '<div class="ms-sub-title">',
                    '<span class="ms-field">',
                          '<span class="ms-label">物料名称:</span>',
                        '<span class="ms-text">{{MaterialName}}</span>',
                    '</span>',
                '</div>',
                  '<div class="ms-sub-title">',
                    '<span class="ms-field">',
                        '<span class="ms-label">物料型号:</span>',
                        '<span class="ms-text">{{MaterialNo}}</span>',
                   ' </span>',
                '</div>',
                   '<div class="ms-sub-title">',
                    '<span class="ms-field">',
                        '<span class="ms-label">产品型号:</span>',
                        '<span class="ms-text">{{ProductNo}}</span>',
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
        name: '点检任务',
        type: $com.Model.MAIN,

        configure: function () {
            this.run();
        },
        events: function () {
            $("body").delegate("#back", "click", function () {
                window.location = "mylist.html";
            });
            $("body").delegate("#screen", "click", function () {
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
            $("body").delegate(".ms-group", "click", function () {
                    var $this = $(this),
                        id = $this.attr("data-id"),
                        device = $this.attr("data-no"),
                        check = $this.attr("data-check"),
                        shiftID = Number($this.attr("data-shift"));
                  
                        window.location = "detailSD.html?id=" + id;
                 
            });
        },

        run: function () {
            if (window._eventID == 0) {
                window._eventID = 2007;
            }
            model.com.getPart({
                EventID: window._eventID, person_judge: window._person_judge
            }, function (data) {
                for (var i = 0; i < data.list.length; i++) {
                    data.list[i].StatusName = STATUS[data.list[i].Status];
                    data.list[i].Color = COLOUR[data.list[i].Status];
                }
                $(".m-table").html($com.util.template(data.list, HTML.LIST));
            });
        },

        com: {
            //工序段
            getPart: function (data, fn, context) {
                var d = {
                    $URI: "/TaskHandle/LineAll",
                    $TYPE: "get"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }
                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //结构
            getCLineUnit: function (data, fn, context) {
                var d = {
                    $URI: "/FMCLineUnit/Tree",
                    $TYPE: "get"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }
                $com.app.ajax($.extend(d, data), fn, err, context);
            },
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
            //车间
            getWorkShop: function (data, fn, context) {
                var d = {
                    $URI: "/FMCWorkShop/All",
                    $TYPE: "get"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //产线
            getLine: function (data, fn, context) {
                var d = {
                    $URI: "/FMCLine/All",
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
                    $URI: "/SFCTaskSpot/Info",
                    $TYPE: "get"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //未检
            refresh: function () {
                var list = parent.ProductLockTask;
                for (var i = 0; i < list.length; i++) {
                    list[i].StatusName = STATUS[list[i].Status];
                    list[i].Color = COLOUR[list[i].Status];
                    list[i].LockTypeText = TASKTYPELIST[list[i].LockType];
                    for (var j = 0; j < AllUser.length; j++) {
                        if (list[i].OperatorID == AllUser[j].ID) {
                            list[i].Operator = AllUser[j].Name;
                        }
                    }
                    for (var j = 0; j < AllWorkShop.length; j++) {
                        if (list[i].WorkShopID == AllWorkShop[j].ID) {
                            list[i].WorkShop = AllWorkShop[j].Name;
                        }
                    }
                    for (var j = 0; j < AllLine.length; j++) {
                        if (list[i].LineID == AllLine[j].ID) {
                            list[i].Line = AllLine[j].Name;
                        }
                    }

                }
                $(".m-table").html($com.util.template(list, HTML.LIST));
            },
            //已检
            refresh1: function () {
                // var list
                //$(".m-table").html($com.util.template(list, HTML.LIST));

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