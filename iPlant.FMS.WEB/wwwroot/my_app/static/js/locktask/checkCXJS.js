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
        AllList,
        AllWorkShop,
        AllLine,
        AllPart,
		LETTER;
    selected = [];
    selected1 = [];
    current = "Status_Sent";
    USERSTATUS = ["默认", "已呼叫", "已到场", "待确认", "已确认"];
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
                '</div>'].join(""),
        TABLE: [
         '<tr>',
              '<td style="width:40%;">{{name}}</td>',
              '<td style="width:44%;">{{Time}}</td>',
              '<td style="width:16%;">{{userStatus}}</td>',
         '</tr>',
        ].join(""),
    };

    model = $com.Model.create({
        name: '叫停',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();
        },
        events: function () {
            $("#back").click(function () {
                window.location = "mylistJS.html";
            });
            //选择锁定工步
            $("body").delegate("#w-option-icon", "click", function (e) {
                var list = [];
               
                for (var i = 0; i < AllPart.length; i++) {
                    if (AllPart[i].Status==1)
                        list.push({ ID: AllPart[i].PartPointID, name: AllPart[i].PartPointName, GroupID: AllPart[i].RouteID, GroupName: "解锁工步列表" });
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
            //重新解锁
            $("body").delegate("#confirm", "click", function (e) {
                if (selected1.length <= 0) {
                    alert("请选择工步列表");
                    return false;
                }
                confirm("是否发起解锁？", function (bool) {
                    if (bool == true) {
                        var list = [];
                        DATA.info.UStatus = 1;
                        DATA.info.UnLockOption = $("#desc1").val();
                        if (DATA.info.UnLockOption == "") {
                            alert("请填写解锁原因！");
                            return false;
                        }
                        for (var i = 0; i < AllPart.length; i++) {
                            for (var j = 0; j < selected1.length; j++) {
                                if (AllPart[i].PartPointID == selected1[j]) {
                                    list.push(AllPart[i].ID);
                                }
                            }
                        }
                        for (var i = 0; i < DATA.user.length; i++) {
                            DATA.user[i].ID = 0;
                            DATA.user[i].Status = 1;
                        }
                        DATA.info.PartPointIDList = list;
                        model.com.saveUnTask({
                            data: DATA.info, user: DATA.user
                        }, function (data) {
                            if (data.list.length > 0) {
                                alert("提交成功");
                                window.location = "mylistJS.html";
                            } else {
                                alert("提交失败");
                                return false;
                            }
                        });
                    } else {
                        return false;
                    }
                });
            });
        },

        run: function () {

            if (window._eventID == 0) {
                window._eventID = 0;
            }
       
            model.com.getUnTaskinfo({
                ID: model.query.id
            }, function (data) {
                DATA = data;
                model.com.getTaskinfo({
                    ID: DATA.info.LockID
                }, function (data) {
                    AllPart = data.list;
                var str = "";
                for (var i = 0; i < DATA.user.length; i++) {
                   
                    DATA.user[i].name = DATA.user[i].UserName + "(" + DATA.user[i].PositionName + ")";
                    DATA.user[i].userStatus = USERSTATUS[DATA.user[i].Status];
                    if (DATA.user[i].Status != 4) {
                        DATA.user[i].Time = "未确认";
                    } else {
                        DATA.user[i].Time = DATA.user[i].ConfirmTime;
                    }
                   
                }
                for (var i = 0; i < DATA.list.length; i++) {
                    selected1.push(DATA.list[i].PartPointID);
                    str += DATA.list[i].PartPointName + ";  ";
                }
                $("#desc").val(DATA.info.LockReason);
                $("#desc1").val(DATA.info.UnLockOption);
                $("#w-option-content").text(str);
                $("#table2").html($com.util.template(DATA.user, HTML.TABLE));
                $("#table1").html($com.util.template(DATA.info, HTML.LIST));
            });
            });
        },
        com: {
            //根据用户查锁定任务
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
            //根据用户查解锁任务
            getUnTaskinfo: function (data, fn, context) {
                var d = {
                    $URI: "/CSTHalt/UnLockInfo",
                    $TYPE: "get"
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