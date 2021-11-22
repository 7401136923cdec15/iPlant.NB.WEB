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
        AllWorkShop,
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
                     '<div class="ms-sub-title" id="qtLeader" style="display:none">',
                       '<span class="ms-field">',
                           '<span class="ms-label">质量班组长确认:</span>',
                           '<span class="ms-text">{{DepartmentLeaderName}}</span>',
                       '</span>',
                         '<span class="ms-field">',
                           '<span class="ms-text">{{DepartmentTime}}</span>',
                       '</span>',
                        '<div class="ms-sub-title" id="gyOperator" style="display:none">',
                       '<span class="ms-field">',
                           '<span class="ms-label">工艺发起人:</span>',
                           '<span class="ms-text">{{CraftName}}</span>',
                       '</span>',
                         '<span class="ms-field">',
                           '<span class="ms-text">{{CraftTime}}</span>',
                       '</span>',
                   '</div>',
                      '<div class="ms-sub-title" id="gyLeader" style="display:none">',
                       '<span class="ms-field">',
                           '<span class="ms-label">工艺班组长确认:</span>',
                           '<span class="ms-text">{{CraftLeaderName}}</span>',
                       '</span>',
                         '<span class="ms-field">',
                           '<span class="ms-text">{{CraftLeaderTime}}</span>',
                       '</span>',
                   '</div>',
                     '<div class="ms-sub-title" id="scLeader" style="display:none">',
                       '<span class="ms-field">',
                           '<span class="ms-label">生产班组长确认:</span>',
                           '<span class="ms-text">{{ProductLeaderName}}</span>',
                       '</span>',
                         '<span class="ms-field">',
                           '<span class="ms-text">{{ProductLeaderTime}}</span>',
                       '</span>',
                   '</div>',
                      '<div class="ms-sub-title" id="scPlan" style="display:none">',
                       '<span class="ms-field">',
                           '<span class="ms-label">生产计划员已排班:</span>',
                           '<span class="ms-text">{{PlanName}}</span>',
                       '</span>',
                         '<span class="ms-field">',
                           '<span class="ms-text">{{PlanTime}}</span>',
                       '</span>',
                   '</div>',
                     '<div class="ms-sub-title" id="scOperation" style="display:none">',
                       '<span class="ms-field">',
                           '<span class="ms-label">操作员已确认完工:</span>',
                           '<span class="ms-text">{{ProductorName}}</span>',
                       '</span>',
                         '<span class="ms-field">',
                           '<span class="ms-text">{{ProductorTime}}</span>',
                       '</span>',
                   '</div>',
                        '</div>',
                    '</div>',
                '</div>'].join(""),
         
        IPT: [  '<tr>',
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
                window.location = "mylist.html";
            });
            $("body").delegate("#confirm", "click", function (e) {
                if ($("#confirm").text() == "验收") {
                    confirm("确认提交吗？", function (bool) {
                        if (bool == true) {
                            DATA.info.Status = 11;
                            model.com.saveTask({
                                data: DATA.info
                            }, function (data) {
                                alert("提交成功");
                                window.location = "mylist.html";
                            });
                        } else {
                            return false;
                        }
                    });
                } else {
                    window.location = "checkCXFQ.html?id=" + model.query.id;
                }
            });
            $("body").delegate("#confirm1", "click", function (e) {
                if ($("#reseaon1").is(":visible") == false) {
                    $("#reseaon1").show();
                    alert("请填写驳回原因，再点击驳回！");
                } else {
                    confirm("确认提交吗？", function (bool) {
                        if (bool == true) {
                            DATA.info.AcceptanceCause = $("#desc3").val();
                            DATA.info.Status = 12;
                            model.com.saveTask({
                                data: DATA.info
                            }, function (data) {
                                alert("提交成功");
                                window.location = "mylist.html";
                            });
                        }
                    });
                }
            });
        },
        run: function () {
            if (window._eventID == 0) {
                window._eventID = 2011;
            }
            if (model.query.status == "质量已驳回") {
                $("#confirm").show();
                $("#confirm").css("width","100%");
            }
            if (model.query.status == "已完工确认") {
                $("#confirm").show();
                $("#confirm1").show();
                $("#confirm").text("验收");
                $("#confirm1").text("驳回验收");
            }
            model.com.getInfo({
                ID: model.query.id
            }, function (data) {
                DATA = data;
                var str = "";
                for (var i = 0; i < data.info.ModuleNoList.length; i++) {
                    str += data.info.ModuleNoList[i] + ";  ";
                }
                $("#w-option-content2").text(str);
                $("#desc").val(data.info.DefectDescribe);
                data.info.SourceTypeName = SourceTypeName[data.info.SourceType];
                data.info.HandleTypeName = GetType[data.info.HandleType];
                $("#table1").html($com.util.template(data.info, HTML.LIST));
                model.com.isShow(data.info);
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
                    if (data.Status==3) {
                        $("#reseaon").show();
                        $("#desc1").attr("readonly", "readonly");
                        $("#desc1").val(data.DepartmentCause);
                    }
                    if (data.DepartmentLeaderID && data.DepartmentLeaderID) {
                        $("#qtLeader").show();
                    }
                    if (data.CraftID && data.CraftID) {
                        $("#gyOperator").show();
                        $("#Requirement").show();
                        $("#route").show();
                        $("#desc2").val(data.WorkRequirement);
                        model.com.getRoute({
                            FactoryID: 0, BusinessUnitID: 0, ProductTypeID: 0, OAGetType: 0
                        }, function (data1) {
                            for (var i = 0; i < data1.list.length; i++) {
                                if(data1.list[i].ID==data.PartPointList[0])
                                    $("#w-option-content1").text(data1.list[i].Name);
                            }
                        });
                    }
                    if (data.CraftLeaderID && data.CraftLeaderID) {
                        $("#gyLeader").show();
                    }
                    if (data.ProductLeaderID && data.ProductLeaderID) {
                        $("#scLeader").show();
                    }
                    if (data.PlanID && data.PlanID) {
                        $("#scPlan").show();

                    }
                    if (data.ProductorID && data.ProductorID) {
                        $("#scOperation").show();
                    }
                    if (data.BindingProductOrderID && data.BindingProductOrderID) {
                        $("#scPlan").show();
                        $("#order").show();
                        $("#w-option-content3").text(data.BindingProductOrderNo);
                           
                    }
                }
        }
    });

    model.init();

});
//# sourceMappingURL=maps/detail-13ca772d08.js.map