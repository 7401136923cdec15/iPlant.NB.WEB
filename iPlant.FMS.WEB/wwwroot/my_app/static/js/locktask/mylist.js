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
        TValue,
		TASKTYPELIST,
        AllType,
        AllStatus,
        ActiveTask,
        DataAll;
    TASKTYPELIST = ["默认", "工序锁定", "工序锁定"],
    STATUS = ["未提交", "已撤销", "待结案", "已结案"],
    COLOUR = [ "text-yellow", "text-yellow", "text-red", "text-green"],
    HTML = {
        LIST: [
            '<div class="ms-group clearfix" data-id="{{ID}}" data-check="{{LineID}}" data-status="{{StatusName}}">',
            '<div class="ms-col ms-col-f">',
               ' <div class="ms-limit">',
                   ' <div class="ms-title">',
                       ' <span class="ms-field femi-rt">',
                            '<span class="ms-text ms-margin">{{WorkShop}}</span>',
                           ' <span class="ms-text ms-margin">{{Line}}</span>',
                        '</span> <span>{{ProductNo}}</span>',
                    '</div>',
                      '<div class="ms-sub-title">',
                        '<span class="ms-field">',
                            '<span class="ms-label">订单号:</span>',
                            '<span class="ms-text">{{OrderNo}}</span>',
                        '</span>',
                    '</div>',
                    '<div class="ms-sub-title">',
                        '<span class="ms-field">',
                            '<span class="ms-label">锁定个数:</span>',
                            '<span class="ms-text">{{LockCount}}</span>',
                             '<span class="ms-text">   </span>',
                            '<span class="ms-label">解锁个数:</span>',
                            '<span class="ms-text">{{UnLockCount}}</span>',
                             '<span class="ms-text">   </span>',
                             '<span class="ms-text text-red">我的发起</span>',
                        '</span>',
                    '</div>',
                    '<div class="ms-sub-title">',
                        '<span class="ms-field">',
                            '<span class="ms-text">{{LockTypeText}}</span>',
                             '<span class="ms-text">  </span>',
                            '<span class="ms-label">人员:</span>',
                            '<span class="ms-text">{{OperatorName}}</span>',
                        '</span> ',
                       ' <span class="ms-field">',
                            '<span class="ms-label">锁定时刻:</span>',
                            '<span class="ms-text">{{LockTime}}</span>',
                        '</span>',
                    '</div>',
                '</div>',
            '</div>',
            '<div class="ms-col ms-col-l">',
                '<span class="ms-status {{Color}}">{{StatusName}}</span>',
            '</div>',
        '</div>', ].join(""),
        LIST1: [
           '<div class="ms-group clearfix" data-id="{{ID}}" data-check="{{StatusName}}">',
           '<div class="ms-col ms-col-f">',
              ' <div class="ms-limit">',
                  ' <div class="ms-title">',
                      ' <span class="ms-field femi-rt">',
                        
                       '</span> <span>暂无</span>',
                   '</div>',
                   '<div class="ms-sub-title">',
                       '<span class="ms-field">',
                           '<span class="ms-label">解锁进度:</span>',
                           '<span class="ms-text">{{UnLockUser}}</span>',
                           '<span class="ms-label">解锁用户数量:</span>',
                           '<span class="ms-text">{{LockUser}}</span>',
                       '</span>',
                   '</div>',
                   '<div class="ms-sub-title">',
                       '<span class="ms-field">',
                           '<span class="ms-label">人员:</span>',
                           '<span class="ms-text">{{OperatorName}}</span>',
                       '</span> ',
                      ' <span class="ms-field">',
                           '<span class="ms-label">解锁意见:</span>',
                           '<span class="ms-text">{{UnLockOption}}</span>',
                       '</span>',
                   '</div>',
               '</div>',
           '</div>',
           '<div class="ms-col ms-col-l">',
               '<span class="ms-status {{Color}}">{{StatusName}}</span>',
           '</div>',
       '</div>', ].join("")
    };

    model = $com.Model.create({
        name: '点检任务',
        type: $com.Model.MAIN,

        configure: function () {
            this.run();
        },
        events: function () {

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
            $("body").delegate(".ms-group", "click", function () {
             
                    var $this = $(this),
                        id = $this.attr("data-id"),
                        device = $this.attr("data-no"),
                        lineid = $this.attr("data-check"),
                        status = $this.attr("data-status"),
                        shiftID = Number($this.attr("data-shift"));
                    if (TValue == 1) {
                        window.location = "checkRead.html?id=" + id + "&lineID=" + lineid;
                    }
                    else if (TValue == 2) {
                        if (status == "已撤销") {
                            window.location = "checkTJ.html?id=" + id + "&lineID=" + lineid;
                        }else
                        window.location = "check.html?id=" + id+"&lineID="+lineid;
                    }
            });
            //$("body").delegate(".ms-group", "click", function () {

            //},
            //$(".ms-group").on({
            //    touchstart: function (e) {
            //        // 长按事件触发  
            //        timeOutEvent = setTimeout(function () {
            //            timeOutEvent = 0;
            //            alert('你长按了');
            //        }, 500);
            //        //去除系统自带的长按事件
            //        e.preventDefault();
            //    },
            //    touchmove: function () {
            //        clearTimeout(timeOutEvent);
            //        timeOutEvent = 0;
            //    },
            //    touchend: function () {
            //        clearTimeout(timeOutEvent);
            //        if (timeOutEvent != 0) {
            //            alert('你点击了');
            //        }
            //        return false;
            //    }
            //});
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
            $("body").delegate("#order", "click", function () {
                window.location = "order.html";
            });
            $("body").delegate("#check", "click", function () {
                window.location = "list.html";
            });
        },

        run: function () {
            if (window._eventID == 0) {
                window._eventID = 2007;
            }
             //EventID: window._eventID, person_judge: window._person_judge,TagValue:0,
            model.com.getTask({
                EventID:window._eventID, person_judge: window._person_judge,TagValue:2,
            }, function (data) {
                if (data.list.length > 0) {
                    TValue = 2;
                    for (var i = 0; i < data.list.length; i++) {
                        data.list[i].StatusName = STATUS[data.list[i].Status];
                        data.list[i].Color = COLOUR[data.list[i].Status];
                    }
                    $(".m-table").html($com.util.template(data.list, HTML.LIST));
            //    } else {
                    //model.com.getTask({
                    //    EventID: window._eventID, person_judge: window._person_judge, TagValue: 1,
                    //}, function (data) {
                    //    TValue = 1;
                    //    for (var i = 0; i < data.list.length; i++) {
                    //        data.list[i].StatusName = STATUS[data.list[i].Status];
                    //        data.list[i].Color = COLOUR[data.list[i].Status];
                    //    }
                    //    $(".m-table").html($com.util.template(data.list, HTML.LIST));
                    //});
                }
            });
          
        },

        com: {
            //根据用户查
            getTask: function (data, fn, context) {
                var d = {
                    $URI: "/CSTHalt/EmployeeLockAll",
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