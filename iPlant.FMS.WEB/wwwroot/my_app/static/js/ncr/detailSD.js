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
    //{ name: "mozu1" }, { name: "mozu2" }, { name: "mozu3" },
    selected = [];
    AllList = [];
    current = "Status_Sent";
    STATUS = {
        "PointCheck_Unfinished": "未完成",
        "PointCheck_Finished": "已完成",
        "PointCheck_Unchecked": "未检",
        "PointCheck_Checked": "已检"
    };

    COLOUR = {
        "PointCheck_Unfinished": "text-red",
        "PointCheck_Finished": "",
        "PointCheck_Unchecked": "text-red",
        "PointCheck_Checked": ""
    };

    HTML = {
        LIST: ['<div class="ms-group clearfix">',
                    '<div class="ms-col ms-col-f" style="width: 100%;" >',
                        '<div class=" ms-limit">',
                            '<div class="ms-title">',
                                '<span class="ms-text">{{OrderNo}}</span>',
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
                window.location = "order.html";
            });
            $("body").delegate("#confirm", "click", function (e) {
                if (selected.length <= 0) {
                    alert("请选择通知对象!");
                    return false;
                }
                if (!selected2) {
                    alert("请选择模组或物料!");
                    return false;
                }
                confirm("确认提交吗？", function (bool) {
                    if (bool == true) {
                        //var list = [];
                        var user = [];
                        var list = [];
                        for (var i = 0; i < DATA.list.length; i++) {
                            for (var j = 0; j < selected.length; j++) {
                                if (DATA.list[i].PositionID == selected[j]) {
                                    user.push({ ID: 0, UserID: DATA.list[i].WorkerID, PositionID: DATA.list[i].PositionID, Status: 1 });
                                }
                            }
                        }
                        for (var i = 0; i < AllList.length; i++) {
                            list.push({ ID: 0, ModuleNo: AllList[i].name })
                        }
                      
                        if (user.length <= 0) {
                            alert("请选择通知对象!");
                            return false;
                        }
                        DATA.info.AssessCount = user.length;
                        DATA.info.LaunchReason = $("#desc").val();
                        if (DATA.info.LaunchReason== "") {
                            alert("请填写发起原因!");
                            return false;
                        }
                        DATA.info.Status = 1;
                        if (selected2 == 1) {
                            DATA.info.SourceType = 1;
                            if (list.length <= 0) {
                                alert("请扫描物料编码！");
                               
                                return false;
                            }
                        } else {
                            DATA.info.SourceType = 2;
                            if (list.length <= 0) {
                                alert("请扫描模组编码！");
                                return false;
                            }
                        }
                        model.com.saveTask({
                            data: DATA.info, list: list, user: user
                        }, function (data) {
                            alert("提交成功");
                            window.location = "mylist.html";
                        });
                    } else {
                        return false;
                    }
                });
            });
            $("body").delegate(".icon-add", "click", function (e) {
                window.QRTEST = function (str) {
                    if (!str || str.length <= 0)
                        return false;
                    model.com.getCode({
                        Code:str
                    }, function (data) {
                        if (selected2 == 0 && (data.info == 1 || data.info == 2)) {
                            for (var i = 0; i < AllList.length; i++) {
                                if (AllList[i].name == str) {
                                    alert("模组列表里已有模组：" + str);
                                    return false;
                                }
                            }
                            AllList.push({ name: str });
                            $("#table2").html($com.util.template(AllList, HTML.IPT));
                        }
                        else if (selected2 == 1 && data.info == 4) {
                            for (var i = 0; i < AllList.length; i++) {
                                if (AllList[i].name == str) {
                                    alert("物料列表里已有物料：" + str);
                                    return false;
                                }
                            }
                            AllList.push({ name: str });
                            $("#table2").html($com.util.template(AllList, HTML.IPT));
                        }
                        else {
                            if (selected2 == 0) {
                                alert("请扫正确的模组编码！");
                            } else {
                                alert("请扫正确的物料编码！");
                            }
                        }
                    });
                }
                if (window.JSImpl) {
                    if (selected2 == 0) {
                        window.JSImpl.readQRCode('QRTEST', "请扫模组编码！");
                    } else {
                        window.JSImpl.readQRCode('QRTEST', "请扫物料编码！");
                    }
                }
                else {
                    return false;
                }
            });
            $("body").delegate(".icon-remove", "click", function (e) {
                var value = $(this).attr("data-value");
                for (var i = 0; i < AllList.length; i++) {
                    if (value == AllList[i].name) {
                        AllList.splice(i, 1);
                    }
                }
                $("#table2").html($com.util.template(AllList, HTML.IPT));
            });
            $("body").delegate("#w-option-icon2", "click", function (e) {
                $('input:radio[name="RADIO"]').each(function () {
                    if ($(this).val() == selected2) {
                        $(this).attr("checked",true);
                    }
                });
                if ($('input:radio[name="RADIO"]').val() == selected2) {

                }
                $(".bindOne").show();
            });
            $("body").delegate("#confirm2", "click", function (e) {
                var val = $('input:radio[name="RADIO"]:checked').val();
                if (val == null) {
                    alert("请选择模组或物料再确定!");
                    return false;
                }
                else {
                    selected2 = val;
                    $(".bindOne").hide();
                    $("#list").show();
                    if (val == 0) {
                        $("#head").text("模组列表");
                        $("#w-option-content2").text("模组");
                        AllList = [];
                        $("#table2").html($com.util.template(AllList, HTML.IPT));
                    } else {
                        $("#head").text("物料列表");
                        $("#w-option-content2").text("物料");
                        AllList = [];
                        $("#table2").html($com.util.template(AllList, HTML.IPT));
                    }
                }
            });
            $("body").delegate(".close", "click", function (e) {
                $(".bindOne").hide();
            });
            
            $("body").delegate("#w-option-icon1", "click", function (e) {
                var list = [];
                model.com.creatTask({
                    TaskLineID: model.query.id,EventID: window._eventID,
                }, function (data) {
                    for (var i = 0; i < data.list.length; i++) {
                        list.push({ ID: data.list[i].PositionID, name: data.list[i].WorkerName, GroupID: data.list[i].FunctionID, GroupName: data.list[i].FunctionName });
                    }
                var DataTempLate = {
                    list: list,
                    title: "员工列表",
                    PropertyID: "ID",  //数据源ID
                    PropertyName: "name",  //数据源名称
                    PropertyGroupName: "GroupName", //分组属性名称
                    PropertyGroupID: "GroupID",  //分组属性ID
                    mode: 2,
                    allowEmpty: true,
                }
                $com.choosePage.show(DataTempLate, selected, function (p1, p2) {
                    selected = [];
                    var data = [];
                    var str = "";
                    for (var j = 1; j <= p2.length; j++) {
                        data.push(p2[j - 1]);
                        str += p2[j - 1] + " ;  ";
                    }
                    selected = p1;
                    $("#w-option-content1").text(str);
                });
                });
            });
        },

        run: function () {
            
            if (window._eventID == 0) {
                window._eventID = 2007;
            }
            model.com.creatTask({
                TaskLineID: model.query.id, EventID: window._eventID,
            }, function (data) {
                DATA = data;
                model.com.getPart({
                    ID: model.query.id, EventID: window._eventID,
                }, function (data) {
                    $("#table1").html($com.util.template(data.info, HTML.LIST));
                    $("#table2").html($com.util.template(AllList, HTML.IPT));
                });
            });
        },
        com: {
            //根据编码获取类型
            getCode: function (data, fn, context) {
                var d = {
                    $URI: "/CRDCodeEntry/Type",
                    $TYPE: "get"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }
                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //工序段
            getPart: function (data, fn, context) {
                var d = {
                    $URI: "/TaskHandle/LineInfo",
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
                    $URI: "/NCRTask/Create",
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
                        $URI: "/NCRTask/Save",
                        $TYPE: "post"
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
            //工步
            getPartPoint: function (data, fn, context) {
                var d = {
                    $URI: "/FPCPartPoint/All",
                    $TYPE: "get"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }
                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            render: function (data) {
              
                $(".m-detail-list").html($com.util.template(data.data, HTML.LIST));
                $(".upload-list").html($com.util.template(data.imgList, HTML.IMG));
            }
        }
    });

    model.init();

});
//# sourceMappingURL=maps/detail-13ca772d08.js.map