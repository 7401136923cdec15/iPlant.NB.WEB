require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($yang, $com) {



    var model,
        HTML,
        STATUS,
        COLOUR,
        KEYWORD_LIST,
        KEYWORD,
        FORMATTRT,
        TypeSource;

    var default_id = "";


    FORMATTRT = {};

    STATUS = ["默认", "待处理", "收到待处理", "到场待处理", "待确认", "已转发", "已确认", "驳回待处理", "已上报", "已撤销"];
    COLOUR = ["text-red", "text-red", "text-red", "text-red", "text-yellow", "text-grey", "text-green", "text-red", "text-red", "text-grey"]


    HTML = {
        //呼叫信息下面的
        SUB_LIST: ['<li class="list-li">',
                        '<div class="list-group-item" data-id="{{ActionID}}" data-task-id="{{TaskID}}" data-sid="{{DispatchID}}"  data-type="{{ActionType}}" >',
                            '<div class="list-group-item-cell item-static item-time" style="width:45%">',
                                '<span>{{Time}}</span>',
                            '</div>',
                            '<div class="list-group-item-cell item-static item-title">',
                                '<span>{{Name}}</span>',
                            '</div>',
                            '<div class="list-group-item-cell item-icon" style="width:5%">',
                                '<i class="icon icon-arrow-right"></i>',
                            '</div>',
                        '</div>',
                        '<div class="list-group-sub">{{Page}}</div>',//填表单
                    '</li>'].join(""),
        //处理信息鞋面的			
        MAIN_LIST: ['<li class="list-li">',
                        '<div class="list-group-item" data-render="1">',
                            '<div class="list-group-item-cell item-static item-title">',
                                '<span>{{Name}}</span>',
                            '</div>',
                             '<div class="list-group-item-cell item-static text-grey" style="width:26%">',
                                '<span>{{Time}}</span>',
                            '</div>',
                            '<div class="list-group-item-cell item-static" style="width:20%">',
                                '<span>{{State}}</span>',
                            '</div>',
                            '<div class="list-group-item-cell item-control" style="width:12%">',
                                '<a href="javascript:;" class="{{ClassName}}" data-action="{{Action}}" data-id="{{ID}}">操作</a>',
                            '</div>',
                            '<div class="list-group-item-cell item-icon" style="width:7%">',
                                '<i class="icon icon-arrow-right icon-arrow-expand"></i>',
                            '</div>',
                        '</div>',
                        '<ul class="list-group-sub list-group" style="display:block">{{List}}</ul>',
                    '</li>'].join(""),

        ITEM: [
             '<div class="m-c-panel" mode="n-label" >',
                '<div class="m-c-head">{{Name}}</div>',
                '<div class="m-c-body m-c-input clearfix">',
                    '<span class="content" data-value="{{Value}}">{{Text}}</span>',
                '</div>',
            '</div>',

        ].join(""),

        ImageUL: [
            '<div class="m-c-panel" mode="n-upload-multi-show">',
                '<div class="m-c-head">照片</div>',
                '<div class="m-c-body m-c-upload clearfix">',
                    '<ul class="upload-list">{Images}</ul>',
                '</div>',
            '</div>',

        ].join(""),

        Page: [
            '<div class="pageList">',
                    '{{Items}}',
                    '<div class="m-c-panel" mode="n-upload-multi-show">',
                        '<div class="m-c-head">照片</div>',
                        '<div class="m-c-body m-c-upload clearfix">',
                        '<ul class="upload-list">{{Images}}</ul>',
                        '</div>',
                '</div>',
            '</div>',
        ].join(""),


        IMG: '<li class="upload-img"><img src="/upload/{{Src}}" ></li>',

              
     
    CONTROL: [
        '<div class="control-menu-item" data-type="{{Sign}}" data-id="{{ID}}"><i class="icon {{Icon}}"></i><span>{{Name}}</span></div>',
    ].join(""),


    MENU: ['<div class="control-box">',
                '<div class="control-cell">',
                    '<div class="control-menu-box">{{Control}}</div>',
                '</div>',
            '</div>'].join("")
};


KEYWORD_LIST = [
   "StationTypeName|异常地点类型",
   "StationNo|异常地点",
   "ExceptionTypeName|异常类型",
   "RespondLevel|异常响应等级|ArrayOne",
   "OnSite|是否需要到场|Bool",
   "DisplayBoard|是否在看板上显示|Bool",
   "Forwarder|被转发人|ArrayOne",
   "Comment|内容备注",

];

KEYWORD = {};

TypeSource = {
    RespondLevel: []
};

$.each(KEYWORD_LIST, function (i, item) {
    var detail = item.split("|");
    KEYWORD[detail[0]] = {
        index: i,
        name: detail[1],
        type: detail.length > 2 ? detail[2] : undefined,
        control: detail.length > 3 ? detail[3] : undefined
    };
    if (detail.length > 2) {
        FORMATTRT[detail[0]] = $com.util.getFormatter(TypeSource, detail[0], detail[2]);
    }
});




var current = {};

model = $com.Model.create({

    name: 'iPlantApp',

    type: $com.Model.MAIN,

    data: {},

    configure: function () {
        this.run();
    },

    events: function () {

        $("#back").click(function () {
            if (window.history.length > 0) {
                window.history.back();
            }
            else {
                window.location = "list.html";
            }
        });
        $(".m-card").delegate(".list-group-item:not(.stop-expand)", "click", function (e) {
            var $this = $(this),
                $expand = $this.find(".item-icon .icon"),
                //里面是否已经有表单
                IDs = $this.attr("data-id");

            if ($expand.hasClass("icon-arrow-expand")) {
                $expand.removeClass("icon-arrow-expand");
                $this.siblings().hide();//ul元素消失
            } else {

                $expand.addClass("icon-arrow-expand");
                $this.siblings().show();//ul显示

            }
            e.stopPropagation();//阻止事件冒泡
            e.preventDefault();//preventDefault() 方法阻止元素发生默认的行为
        })
        .delegate(".item-control a:not(.text-grey)", "click", function (e) {
            var $this = $(this),
                actions = $this.attr("data-action").split("&"),
                _TypeList = [];

            current.DispatchID = $this.attr("data-id");

            _TypeList = $com.util.findAll(model._actionTypeList, function (element) {
                return $.inArray(element.ID + "", actions) >= 0;
            });


            $(".opertion-box").html($com.util.template({
                Control: $com.util.template(_TypeList, HTML.CONTROL)
            }, HTML.MENU));

            e.stopPropagation();

            e.preventDefault();
        });

        $(".opertion-box").delegate(".control-cell", "click", function (e) {
            if ($(e.target).hasClass("control-cell")) {
                $(this).parent().remove();
            }
        }).delegate(".control-menu-item", "click", function (e) {
            var type = $(this).attr("data-type"),

                typeid = $(this).attr("data-id"),

                data = {
                    id: model.query.id,
                    TypeID: typeid,
                    TypeSign: type,
                    TypeName: $(this).text(),
                    sid: current.DispatchID ? current.DispatchID : 0,
                    StationNo: model.query.StationNo,
                    StationTypeName: model._task.StationTypeName,
                    ExceptionTypeName: model._task.ExceptionTypeName,
                    Applicant: model._task.ApplicantID,
                    ConfirmID: model._task.ConfirmID,
                    OperatorID:model._task.OperatorID,
                    Call: default_id
                };

            //到场和处理需要扫码
            if (Number(typeid) == 4 || Number(typeid) == 5) {
                window.QRTEST = function (str) {

                    if (!str || str.length < 1)
                        return;

                    if (str != model.query.StationNo) {
                        alert("扫描的码不匹配！");
                        return;

                    }
                    window.location = "action.html?" + $com.uri.setUrlQuery(data);

                };
                if (window.JSImpl)
                    window.JSImpl.readQRCode('QRTEST');
                else
                    window.QRTEST("ST-10101001");

            } else {
                window.location = "action.html?" + $com.uri.setUrlQuery(data);
            }

        });
    },

    run: function () {

        $com.app.loading();

        model.com.getActionType({}, function (action) {
            model._actionTypeList = action.list;

            model._actionType = {};
             
            $.each(model._actionTypeList, function (i, item) {

                switch (item.ID) {
                    case 1:
                        item.Icon="icon-edit";
                        break;
                    case 2:
                        item.Icon="icon-remove";
                        break;
                    case 3:
                        item.Icon="icon-receive" ;
                        break;
                    case 4:
                        item.Icon="icon-arrive";
                        break;
                    case 5:
                        item.Icon="icon-handle";
                        break;
                    case 6:
                        item.Icon="icon-forward";
                        break;
                    case 7:
                        item.Icon="icon-confirm";
                        break;
                    case 8:
                        item.Icon="icon-reject";
                        break;
                    case 9:
                        item.Icon="icon-forward";
                        break;
                    default: 
                        break;
                } 
                model._actionType[item.ID] = item.Name;
               
            });

            model.com.getLevel({}, function (level) {

                TypeSource.RespondLevel.splice(0);

                $.each(level.list, function (i, item) {
                    TypeSource.RespondLevel.push({
                        name: item.Name,
                        value: item.ID
                    });
                });
                
                model.com.getEmployee({}, function (employee) {
                    model._user = employee.list;

                    model._employee = {};

                    $.each(model._user, function (i, item) {
                        model._employee[item.ID] = item.Name;
                    });

                    model.com.getTree({
                        TaskID: model.query.id,
                        DispatchID: model.query.sid,
                        TagValue: model.query.tag_value
                    }, function (data) {

                        model.com.render(data.info);

                        $com.app.loaded();
                    });

                });

            });

           

        });


    },

    com: {
        getTree: function (data, fn, context) {
            var d = {
                $URI: "/EXCCallTask/Tree",
                $TYPE: "get"
            };

            function err() {
                $com.app.tip('获取数据失败，请检查网络');
            }

            $com.app.ajax($.extend(d, data), fn, err, context);
        },

        getActionType: function (data, fn, context) {
            var d = {
                $URI: "/EXCCallAction/Type",
                $TYPE: "get"
            };

            function err() {
                $com.app.tip('获取操作类型数据失败，请检查网络');
            }

            $com.app.ajax($.extend(d, data), fn, err, context);
        },
        getLevel: function (data, fn, context) {
            var d = {
                $URI: "/EXCExceptionType/LevelAll",
                $TYPE: "get"
            };

            function err() {
                $com.app.tip('获取异常等级数据失败，请检查网络');
            }

            $com.app.ajax($.extend(d, data), fn, err, context);
        },

        getEmployee: function (data, fn, context) {
            var d = {
                $URI: "/User/All",
                $TYPE: "get"
            };

            function err() {
                $com.app.tip('获取人员信息失败，请检查网络');
            }

            $com.app.ajax($.extend(d, data), fn, err, context);
        },

        render: function (info) {
            var handle_info = [],
                call_actions = model.com.getActionStr(info.CallActions);

            model._task=info.CallTask;

            //default_id = info.DefaultActionTypeID;
            //呼叫信息
            // $("#call-info-title").html(info.GroupNameRequest);
            $("#call-info-control").attr("data-action", call_actions);
            $("#call-info-control").addClass(call_actions ? "" : "text-grey");

            $(".call-info .list-group-sub").html(model.com.renderTask(info.CallTask));
            if (info.CallCancel && info.CallCancel.ID > 0)
                $(".call-info .list-group-sub").append(model.com.renderActionList([info.CallCancel]))
            //添加上面操作下面的信息

            $(".call-info .list-group-sub li:first-child .list-group-item").click();
            //触发第一个的

            //处理信息
            //$("#handle-info-title").html(info.GroupNameDispatch);
            $(info.CallDispatchList).each(function (i, item) {
                var actions = model.com.getActionStr(item.CallActions);
                handle_info.push($com.util.template({
                    Name: model._employee[item.OperatorID],
                    Time:$com.util.format("MM-dd hh:mm", item.EditTime),
                    State: STATUS[item.Status],
                    Action: actions,
                    ClassName: !actions ? "text-grey" : "",
                    List: model.com.renderActionList(item.ActionList),
                    ID: item.ID,
                }, HTML.MAIN_LIST));
            });
            $(".handle-info .list-group").html(handle_info.join(""));
        },

        renderActionList: function (actions) {
            var _sub = [];

            $(actions).each(function (i, item) {
                _sub.push($com.util.template({
                    Name: model._actionType[item.ActionType] + " " + (model._employee[item.OperatorID] || ""),
                    Time: $com.util.format("yyyy-MM-dd hh:mm", item.CreateTime),
                    Type: item.ActionType,
                    ActionID: item.ID,
                    DispatchID: item.DispatchID,
                    TaskID: item.TaskID,
                    Page: model.com.renderPage(item, item.ActionType)
                }, HTML.SUB_LIST));
            });

            return _sub.join("");
        },

        renderTask: function (task) {
            var _html = "";

            _html = $com.util.template({

                Name: "发起" + " " + (model._employee[task.ApplicantID] || ""),
                Time: $com.util.format("yyyy-MM-dd hh:mm", task.ApplicantTime),
                Type: 1,
                ActionID: 0,
                DispatchID: 0,
                TaskID: task.ID,
                Page: model.com.renderPage(task, 1)
            }, HTML.SUB_LIST);

            return _html;
        },


        getActionStr: function (arr) {
            var res = [];
            $(arr).each(function (i, item) {
                res.push(item.ID);
            });

            return res.join("&");
        },

        renderPage: function (data, type) {
            var wResult = {
                Items: "",
                Images: ""
            };
            var _data = [];
            switch (type) {
                  
                case 1:
                         
                    for (var p in data) {
                        var o = KEYWORD[p];
                        if (o) {
                            _data.push({
                                Name: o.name,
                                Value: data[p] === "" ? "&nbsp;" : data[p],
                                Text: FORMATTRT[p] ? FORMATTRT[p](data[p]) : data[p]
                            });
                        }
                    }
                    break;
                case 6:
                    for (var p in data) {
                        var o = KEYWORD[p];
                        if (o) {
                            _data.push({
                                Name: o.name,
                                Value: data[p] === "" ? "&nbsp;" : data[p],
                                Text: FORMATTRT[p] ? FORMATTRT[p](data[p]) : data[p]
                            });
                        }
                    }
                    break;
                default:
                    for (var p in data) {
                        var o = KEYWORD[p];
                        if (o && data[p]) {
                            _data.push({
                                Name: o.name,
                                Value: data[p] === "" ? "&nbsp;" : data[p],
                                Text: FORMATTRT[p] ? FORMATTRT[p](data[p]) : data[p]
                            });
                        }
                    }
                    break;

            }
            var _Images = []
            $.each(data.ImageList, function (i, item) {
                _Images.push({ Src: item })
            });

            wResult.Items = $com.util.template(_data, HTML.ITEM);
            wResult.Images = $com.util.template(_Images, HTML.IMG);
            return $com.util.template(wResult, HTML.Page);
        }
    }
});

model.init();
});
//# sourceMappingURL=maps/detail-0d4b39aba7.js.map
