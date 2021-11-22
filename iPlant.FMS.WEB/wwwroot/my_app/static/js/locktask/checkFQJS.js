require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($yang, $com) {


    var model,
		HTML,
		config,
		current,
		STATUS,
        DATA,
        DATA1,
        selected,
        selected1,
		COLOUR,
        AllUser,
        AllWorkShop,
        AllLine,
        AllPart,
		LETTER;
    selected = [];
    selected1 = [];
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
         
        IPT: ['<tr>',
                     '<td style="width:30%;">{{UserName}}</td>',
                     '<td style="width:60%;">{{PositionName}}</td>',
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
            
            //发起解锁
            $("body").delegate("#confirm", "click", function (e) {
                if (selected1.length <= 0) {
                    alert("请选择工步列表");
                    return false;
                }
                confirm("是否发起解锁？", function (bool) {
                    if (bool == true) {
                        var list = [];
                        model.com.createUnTask({
                            LockID:model.query.id
                        }, function (data) {
                            data.info.UnLockOption = $("#desc1").val();
                            if (data.info.UnLockOption == "") {
                                alert("请填写解锁原因！");
                                return false;
                            }
                            for (var i = 0; i < data.list.length; i++) {
                                for (var j = 0; j < selected1.length; j++) {
                                    if (data.list[i].PartPointID == selected1[j]) {
                                        list.push(data.list[i].ID);
                                    }
                                }
                            }
                            for (var i = 0; i < DATA.user.length; i++) {
                                DATA.user[i].ID = 0;
                                DATA.user[i].Status = 1;
                            }
                            data.info.UStatus = 1;
                            if (list && list.length < 1) {
                                alert("请选择锁定工步！");
                                return false;
                            }
                            data.info.PartPointIDList = list;
                            data.info.LockUser = DATA.user.length;
                            model.com.saveUnTask({
                                data: data.info, user: DATA.user
                            }, function (data2) {
                                alert("提交成功！");
                                window.location = "mylistJS.html";
                            });
                        });
                    } else {
                        return false;
                    }
                });
            });
            //选择锁定工步
            $("body").delegate("#w-option-icon", "click", function (e) {
                var list = [];
                for (var i = 0; i < DATA.list.length; i++) {
                    if (DATA.list[i].Status == 1) {
                        list.push({ ID: DATA.list[i].PartPointID, name: DATA.list[i].PartPointName, GroupID: DATA.list[i].RouteID, GroupName: "解锁工步列表" });
                    }
                    }
                    var DataTempLate = {
                        list: list,
                        title: "工步列表",
                        PropertyID: "ID",  //数据源ID
                        PropertyName: "name",  //数据源名称
                        PropertyGroupName: "GroupName", //分组属性名称
                        PropertyGroupID: "GroupID",  //分组属性ID
                        mode: 2,
                        allowEmpty: true,
                    }
                    $com.choosePage.show(DataTempLate, selected1, function (p1, p2) {
                        selected1 = [];
                        var str = "";
                        for (var j = 1; j <= p2.length; j++) {
                            str += p2[j - 1] + " ;  ";
                        }
                        selected1 = p1;
                        $("#w-option-content").text(str);
                    });
                
            });
            $("body").delegate("#w-option-icon1", "click", function (e) {
                var list = [];
                model.com.creatTask({
                    TaskLineID: model.query.lineID
                }, function (data) {
                    for (var i = 0; i < data.user.length; i++) {
                        list.push({ ID: data.user[i].PositionID, name: data.user[i].WorkerName, GroupID: data.user[i].FunctionID, GroupName: data.user[i].FunctionName });
                    }
                    var DataTempLate = {
                        list: list,
                        title: "选择列表",
                        PropertyID: "ID",  //数据源ID
                        PropertyName: "name",  //数据源名称
                        PropertyGroupName: "GroupName", //分组属性名称
                        PropertyGroupID: "GroupID",  //分组属性ID
                        mode: 2,
                        allowEmpty: true,
                    }
                    $com.choosePage.show(DataTempLate, selected, function (p1, p2) {
                        selected = [];
                        var str = "";
                        for (var j = 1; j <= p2.length; j++) {
                            str += p2[j - 1] + " ;  ";
                        }
                        selected = p1;
                        $("#w-option-content1").val(str);
                    });
                });
            });
        },

        run: function () {

            if (window._eventID == 0) {
                window._eventID = 0;
            }
            //model.com.creatTask({
            //    TaskLineID: model.query.lineID
            //}, function (data) {
            //    DATA=data;
            model.com.getTaskinfo({
                ID: model.query.id
            }, function (data) {
                DATA= data;
                $("#desc").val(DATA.info.LockReason);
                $("#table2").html($com.util.template(data.user, HTML.IPT));
                    //$("#w-option-content1").val(str);
                    model.com.getPart({
                        ID: model.query.lineID, EventID: window._eventID,
                    }, function (data) {
                        $("#table1").html($com.util.template(data.info, HTML.LIST));
                    });
                });
            //});
        },
        com: {
            //根据用户查
            getTaskinfo: function (data, fn, context) {
                var d = {
                    $URI: "/CSTHalt/LockInfo",
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
           
            creatTask: function (data, fn, context) {
                var d = {
                    $URI: "/CSTHalt/CreatLock",
                    $TYPE: "get"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }
                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            
             saveTask: function (data, fn, context) {
                    var d = {
                        $URI: "/CSTHalt/SaveLockTask",
                        $TYPE: "post"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
             },
             saveUnTask: function (data, fn, context) {
                 var d = {
                     $URI: "/CSTHalt/SaveUnLockTask",
                     $TYPE: "post"
                 };
                 function err() {
                     $com.app.tip('获取失败，请检查网络');
                 }
                 $com.app.ajax($.extend(d, data), fn, err, context);
             },
            //创建解锁任务
             createUnTask: function (data, fn, context) {
                 var d = {
                     $URI: "/CSTHalt/CreatUnLock",
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