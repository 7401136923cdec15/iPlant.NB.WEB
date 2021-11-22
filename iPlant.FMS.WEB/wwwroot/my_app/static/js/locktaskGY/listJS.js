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
        TValue,
        AllStatus,
        ActiveTask,
        DataAll;
   
    TASKTYPELIST = ["默认", "工序锁定", "工序锁定"],
    STATUS = ["已撤回", "已提交", "已评审", "待确认", "已解锁"],
    COLOUR = ["text-yellow", "text-yellow", "text-yellow", "text-yellow", "text-green",],
    HTML = {
        LIST1: [
           '<div class="ms-group clearfix" data-id="{{UID}}" data-check="{{UnLockUser}}" data-status="{{StatusName}}" data-calluser="{{CallUserID}}">',
           '<div class="ms-col ms-col-f">',
              ' <div class="ms-limit">',
                  ' <div class="ms-title">',
                      ' <span class="ms-field femi-rt">',
                       '</span> <span>{{OrderNo}}</span>',
                   '</div>',
                      '<div class="ms-sub-title">',
                        '<span class="ms-field">',
                            '<span class="ms-label">产品型号:</span>',
                            '<span class="ms-text">{{ProductNo}}</span>',
                        '</span>',
                    '</div>',
                   '<div class="ms-sub-title">',
                       '<span class="ms-field">',
                           '<span class="ms-label">解锁进度:</span>',
                           '<span class="ms-text">{{UnLockUser}}</span>',
                            '<span class="ms-text">  </span>',
                           '<span class="ms-label">解锁用户数量:</span>',
                           '<span class="ms-text">{{LockUser}}</span>',
                       '</span>',
                       '<span class="ms-field">',
                           '<span class="ms-label">人员:</span>',
                           '<span class="ms-text">{{UOperatorName}}</span>',
                       '</span> ',
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
                        status = $this.attr("data-status"),
                        check = $this.attr("data-check"),
                        calluserID = $this.attr("data-calluser");
                    if (TValue == 1) {
                        window.location = "checkJSQR.html?id=" + id + "&calluserID=" + calluserID;
                    }
                    else if (TValue == 2) {
                        if (status == "已撤回") {
                            window.location = "checkCXJS.html?id=" + id;
                        } else {
                            window.location = "uncheck.html?id=" + id + "&check=" + check;
                        }
                    }
            });
            $("body").delegate("#check", "click", function () {
                window.location = "mylistJS.html";
            });
        },

        run: function () {
            //model.com.getUnLock({
            //    EventID: window._eventID, person_judge: window._person_judge, TagValue: 2,
            //}, function (data) {
            //    if (data.list.length > 0) {
            //        TValue = 2;
            //        var list = data.list;
            //        for (var i = 0; i < list.length; i++) {
            //            data.list[i].StatusName = STATUS[data.list[i].UStatus];
            //            data.list[i].Color = COLOUR[data.list[i].UStatus];
            //        }
            //        $(".m-table").html($com.util.template(data.list, HTML.LIST1));
            //    } else {
            if (window._eventID == 0) {
                window._eventID = 3003;
            }
                    model.com.getUnLock({
                        EventID: window._eventID, person_judge: window._person_judge, TagValue: 1,
                    }, function (data) {
                        TValue = 1;
                        var list = data.list;
                        for (var i = 0; i < list.length; i++) {
                            data.list[i].StatusName = STATUS[data.list[i].UStatus];
                            data.list[i].Color = COLOUR[data.list[i].UStatus];
                        }
                        $(".m-table").html($com.util.template(data.list, HTML.LIST1));
                     
                    });
            //    }
            //});
        },

        com: {
            //用户
            getUnLock: function (data, fn, context) {
                var d = {
                    $URI: "/CSTHalt/EmployeeUnLockAll",
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
        
        }
    });
    model.init();
});

//# sourceMappingURL=maps/list-e9563bc81f.js.map