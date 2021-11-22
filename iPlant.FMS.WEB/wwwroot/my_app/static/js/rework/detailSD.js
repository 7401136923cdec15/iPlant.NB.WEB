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
    //{ name: "测试一" }, { name: "测试二" }, { name: "测试三" },
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
                confirm("确认提交吗？", function (bool) {
                    if (bool == true) {
                        var list = [];
                        for (var i = 0; i < AllList.length; i++) {
                            list.push(AllList[i].name);
                        }
                        if (list.length <= 0) {
                            alert("请扫描模组编码！");
                            return false;
                        }
                        if (!selected1 || selected1 == "") {
                            alert("请勾选单据类型！");
                            return false;
                        }
                        if (!selected2 || selected2 == "") {
                            alert("请勾选处置类型！");
                            return false;
                        }
                        if ($("#desc").val()=="") {
                            alert("请填写返工原因");
                            return false;
                        }
                        DATA.info.ModuleNoList = list;
                        DATA.info.SourceType = selected1;
                        DATA.info.HandleType = selected2;
                        DATA.info.DefectDescribe = $("#desc").val();
                        DATA.info.Status = 1;
                      
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
            });
            $("body").delegate(".icon-add", "click", function (e) {
                window.QRTEST = function (str) {
                    if (!str || str.length <= 0)
                        return false;
                    model.com.getCode({
                        Code: str
                    }, function (data) {
                        if (data.info == 1 || data.info == 2) {
                            for (var i = 0; i < AllList.length; i++) {
                                if (AllList[i].name == str) {
                                    alert("模组列表里已有模组：" + str);
                                    return false;
                                }
                            }
                            AllList.push({ name: str });
                            $("#table2").html($com.util.template(AllList, HTML.IPT));
                        } else {
                            alert("请扫正确的模组编码！");
                        }
                    });
                }
                if (window.JSImpl) {
                     window.JSImpl.readQRCode('QRTEST', "请扫模组编码！");
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
                $("#bindOne").show();
            });
            $("body").delegate("#confirm1", "click", function (e) {
                var val = $('input:radio[name="RADIO"]:checked').val();
                if (val == null) {
                    alert("请选择处置类型!");
                    return false;
                }
                else {
                    selected2 = val;
                    $("#bindOne").hide();
                    if (val == 0) {
                        $("#w-option-content2").text("返工");
                    } else {
                        $("#w-option-content2").text("返修");
                    }
                }
            });
            $("body").delegate("#close1", "click", function (e) {
                $("#bindOne").hide();
            });
            $("body").delegate("#w-option-icon1", "click", function (e) {
                $('input:radio[name="RADIO1"]').each(function () {
                    if ($(this).val() == selected1) {
                        $(this).attr("checked", true);
                    }
                });
                $("#bindOne1").show();
            });
            $("body").delegate("#confirm2", "click", function (e) {
                var val = $('input:radio[name="RADIO1"]:checked').val();
                if (val == null) {
                    alert("请选择单据类型!");
                    return false;
                }
                else {
                    selected1 = val;
                    $("#bindOne1").hide();
                    if (val == 1) {
                        $("#w-option-content1").text("外购部");
                    }
                    if (val == 2) {
                        $("#w-option-content1").text("内部");
                    }
                    if (val == 3) {
                        $("#w-option-content1").text("顾客反馈");
                    }
                }
            });
            $("body").delegate("#close2", "click", function (e) {
                $("#bindOne1").hide();
            });
        },
        run: function () {
            if (window._eventID == 0) {
                window._eventID = 2011;
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