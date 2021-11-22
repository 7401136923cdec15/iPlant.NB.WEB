require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($yang, $com) {


    var model,
		HTML,
		config,
		current,
		STATUS,
        DATA,
        selected,
        selected1,
        selected2,
		COLOUR,
        AllUser,
        AllOrder,
        AllList,
        AllPart,
		LETTER;
    AllList = [{ name: "测试一" }, { name: "测试二" }, { name: "测试三" }];
    SourceTypeName = ["默认", "外购件", "内部", "顾客反馈"];
    GetType = ["默认", "返工", "返修"];
    HTML = {
        LIST: ['<div class="ms-group clearfix">',
                    '<div class="ms-col ms-col-f" style="width: 100%;" >',
                        '<div class=" ms-limit">',
                            '<div class="ms-title">',
                                '<span class="ms-text">{{OrderNo}}</span>',
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
                    '<div class="ms-sub-title">',
                       '<span class="ms-field">',
                           '<span class="ms-label">质量班组长:</span>',
                           '<span class="ms-text">{{DepartmentLeaderName}}</span>',
                       '</span>',
                         '<span class="ms-field">',
                           '<span class="ms-text">{{DepartmentTime}}</span>',
                       '</span>',
                   '</div>',
                        '</div>',
                    '</div>',
                '</div>'].join(""),

        IPT: ['<tr>',
                            '<td style="width:84%;">{{name}}</td>',
                            '<td style="width:16%;">',
                            '<i class="icon icon-remove" data-value="{{name}}"></i>',
                            '</td>',
                        '</tr>', ].join(""),

    };
    model = $com.Model.create({
        name: '叫停',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();
        },
        events: function () {
            $("#back").click(function () {
                window.location = "list.html";
            });
            $("body").delegate("#confirm", "click", function (e) {
                DATA.info.Status = 10;
                model.com.saveTask({
                    data: DATA.info
                }, function (data) {
                    alert("提交成功");
                    window.location = "list.html";
                });
            });
         
        },
        run: function () {
            if (window._eventID == 0) {
                window._eventID = 3008;
            }
            if (model.query.status == "计划已排班") {
                $("#confirm").show();
            }
            model.com.getOrder({
                LineID: 0, Status: -1
            }, function (data) {
                AllOrder = data.list;
                model.com.getRoute({
                    FactoryID: 0, BusinessUnitID: 0, ProductTypeID: 0, OAGetType: 0
                }, function (data) {
                    AllPart = data.list;
                    model.com.getInfo({
                        ID: model.query.id
                    }, function (data) {
                        DATA = data;
                        var str = "";
                        var str1 = "";
                        for (var i = 0; i < data.info.ModuleNoList.length; i++) {
                            str += data.info.ModuleNoList[i] + ";  ";
                        }
                        for (var i = 0; i < data.info.PartPointList.length; i++) {
                            for (var j = 0; j < AllPart.length; j++) {
                                if (AllPart[j].ID == data.info.PartPointList[i])
                                    str1 = AllPart[i].Name;
                            }
                        }
                        for (var i = 0; i < AllOrder.length; i++) {
                            if (DATA.info.BindingProductOrderID == AllOrder[i].ID) {
                                $("#w-option-content3").text(AllOrder[i].OrderNo);
                            }
                        }
                        $("#w-option-content1").text(str1);
                        $("#w-option-content2").text(str);
                        $("#desc2").val(data.info.WorkRequirement);
                        $("#desc").val(data.info.DefectDescribe);
                        data.info.SourceTypeName = SourceTypeName[data.info.SourceType];
                        data.info.HandleTypeName = GetType[data.info.HandleType];
                        $("#table1").html($com.util.template(data.info, HTML.LIST));
                        model.com.isShow(data.info);
                    });
                });
            });
        },
        com: {
            //获取APS订单计划
            getOrder: function (data, fn, context) {
                var d = {
                    $URI: "/APSTaskLine/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            //获取工艺路线
            getRoute: function (data, fn, context) {
                var d = {
                    $URI: "/FPCRoute/All",
                    $TYPE: "get"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }
                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //获取单条任务
            getInfo: function (data, fn, context) {
                var d = {
                    $URI: "/CSTRework/TaskInfo",
                    $TYPE: "get"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }
                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //创建锁定任务
            creatTask: function (data, fn, context) {
                var d = {
                    $URI: "/CSTRework/CreateTask",
                    $TYPE: "get"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }
                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //保存锁定任务
            saveTask: function (data, fn, context) {
                var d = {
                    $URI: "/CSTRework/SaveTask",
                    $TYPE: "post"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }
                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            isShow: function (data) {
                if (data.Status == 3) {
                    $("#reseaon").show();
                    $("#desc1").attr("readonly", "readonly");
                    $("#desc1").val(data.DepartmentCause);
                }
            }
        }
    });

    model.init();

});
