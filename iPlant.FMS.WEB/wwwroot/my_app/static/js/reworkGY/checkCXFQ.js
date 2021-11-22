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
    selected = [];
    //{ name: "测试一" }, { name: "测试二" }, { name: "测试三" }
    AllList = [];
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
                confirm("确认提交吗？", function (bool) {
                    if (bool == true) {
                        DATA.info.Status = 4;
                        DATA.info.PartPointList = selected;
                        DATA.info.WorkRequirement = $("#desc2").val();
                        if (DATA.info.WorkRequirement == "") {
                            alert("请输入返工作业要求！");
                            return false;
                        }
                        if (selected.length <= 0) {
                            alert("请选择工艺路线列表！");
                            return false;
                        }
                        model.com.saveTask({
                            data: DATA.info
                        }, function (data) {
                            alert("提交成功");
                            window.location = "mylist.html";
                        });
                    }
                });
            });
            $("body").delegate("#w-option-icon1", "click", function (e) {
                var list = [];

                for (var i = 0; i < AllPart.length; i++) {
                    list.push({ ID: AllPart[i].ID, name: AllPart[i].Name, GroupID: AllPart[i].BusinessUnitID, GroupName: AllPart[i].BusinessUnit });
                }
                var DataTempLate = {
                    list: list,
                    title: "工艺路线列表",
                    PropertyID: "ID",  //数据源ID
                    PropertyName: "name",  //数据源名称
                    PropertyGroupName: "GroupName", //分组属性名称
                    PropertyGroupID: "GroupID",  //分组属性ID
                    mode: 1,
                    allowEmpty: false,
                }
                $com.choosePage.show(DataTempLate, selected, function (p1, p2) {
                    selected = [];
                    var str = "";
                    for (var j = 1; j <= p2.length; j++) {
                        str += p2[j - 1];
                    }
                    selected = p1;
                    $("#w-option-content1").text(str);
                });
            });
        },
        run: function () {
            if (window._eventID == 0) {
                window._eventID = 3008;
            }
         
            model.com.getRoute({
                FactoryID: 0, BusinessUnitID: 0, ProductTypeID: 0, OAGetType: 0
            }, function (data) {
                AllPart = data.list;
                model.com.getInfo({
                    ID: model.query.id
                }, function (data) {
                    DATA = data;
                    var str = "";
                    for (var i = 0; i < data.info.ModuleNoList.length; i++) {
                        str += data.info.ModuleNoList[i] + ";  ";
                    }
                    for (var i = 0; i < AllPart.length; i++) {
                        if (AllPart[i].ID == data.info.PartPointList[0]) {
                            selected.push(AllPart[i].ID);
                            $("#w-option-content1").text(AllPart[i].Name);
                        }
                        }
                    $("#w-option-content2").text(str);
                    $("#desc").val(data.info.DefectDescribe);
                    $("#desc2").val(data.info.WorkRequirement);
                    data.info.SourceTypeName = SourceTypeName[data.info.SourceType];
                    data.info.HandleTypeName = GetType[data.info.HandleType];
                    $("#table1").html($com.util.template(data.info, HTML.LIST));
                    model.com.isShow(data.info);
                });
            });
        },
        com: {
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
//# sourceMappingURL=maps/detail-13ca772d08.js.map