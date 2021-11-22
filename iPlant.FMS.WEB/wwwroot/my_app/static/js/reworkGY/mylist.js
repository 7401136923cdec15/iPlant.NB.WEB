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
   
    STATUS = ["已保存", "已提交", "质量已确认", "质量已驳回", "工艺已选择", "工艺已确认", "工艺已驳回", "生产已确认", "生产已驳回", "计划已排班", "已完工确认", "质量已验收", "已验收驳回", ],
    COLOUR = ["text-yellow", "text-yellow", "text-yellow", "text-red", "text-yellow", "text-yellow", "text-red", "text-text-yellow", "text-red", "text-yellow", "text-yellow", "text-green", "text-red", ],
    SourceTypeName = ["默认", "外购件", "内部", "顾客反馈"];
    GetType = ["默认", "返工", "返修"];
    HTML = {
        LIST1: [
           '<div class="ms-group clearfix" data-id="{{ID}}" data-check="{{UnLockUser}}" data-status="{{StatusName}}" data-calluser="{{CallUserID}}">',
           '<div class="ms-col ms-col-f">',
              ' <div class="ms-limit">',
                  ' <div class="ms-title">',
                      ' <span class="ms-field femi-rt">',
                       '</span> <span>{{ProductNo}}</span>',
                   '</div>',
                      '<div class="ms-sub-title">',
                        '<span class="ms-field">',
                            '<span class="ms-label">订单号:</span>',
                            '<span class="ms-text">{{OrderNo}}</span>',
                        '</span>',
                         '<span class="ms-field">',
                            '<span class="ms-label">处置:</span>',
                            '<span class="ms-text">{{HandleTypeName}}</span>',
                        '</span>',
                    '</div>',
                     '<div class="ms-sub-title">',
                        '<span class="ms-field">',
                            '<span class="ms-label">编码:</span>',
                            '<span class="ms-text">{{ReworkTaskNo}}</span>',
                        '</span>',
                          '<span class="ms-field">',
                            '<span class="ms-label">来源:</span>',
                            '<span class="ms-text">{{SourceTypeName}}</span>',
                        '</span>',
                    '</div>',
                   '<div class="ms-sub-title">',
                       '<span class="ms-field">',
                           '<span class="ms-label">发起人:</span>',
                           '<span class="ms-text">{{SenderName}}</span>',
                       '</span>',
                         '<span class="ms-field">',
                           '<span class="ms-text">{{SenderTime}}</span>',
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
                  
                    window.location = "check.html?id=" + id + "&status=" + status;
            });
            $("body").delegate("#check", "click", function () {
                window.location = "order.html";
            });
        },

        run: function () {
            if (window._eventID == 0) {
                window._eventID = 3008;
            }
                model.com.getRework({
                        EventID: window._eventID, person_judge: window._person_judge, TagValue: 1,
                    }, function (data) {
                        for (var i = 0; i < data.list.length; i++) {
                            data.list[i].StatusName = STATUS[data.list[i].Status];
                            data.list[i].Color = COLOUR[data.list[i].Status];
                            data.list[i].SourceTypeName = SourceTypeName[data.list[i].SourceType];
                            data.list[i].HandleTypeName = GetType[data.list[i].HandleType];
                        }
                        $(".m-table").html($com.util.template(data.list, HTML.LIST1));
                     
                    });
        },

        com: {
            //用户
            getRework: function (data, fn, context) {
                var d = {
                    $URI: "/CSTRework/EmployeeAll",
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