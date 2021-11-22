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
    POINTSTATUS = ["无", "锁定", "解锁"];
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
        IPT1: ['<tr>',
                        '<td style="width:35%;">{{PartPointName}}</td>',
                        '<td style="width:45%;">{{Time}}</td>',
                        '<td style="width:20%;">{{StatusName}}</td>',
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
                window.location = "mylistJS.html";
            });
            $("body").delegate(".tzj-btn", "click", function () {
                if ($("#point-table").is(":hidden")) {
                    $(this).html('<svg t="1561903942703" class="icon" style="width:6%;height:3%;margin-bottom: -0.5vw;margin-top:-5vw" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8503" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><defs><style type="text/css"></style></defs><path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3 0.1-12.7-6.4-12.7z" p-id="8504" fill="#8a8a8a"></path></svg>');
                    $("#point-table").show();
                } else {
                    $(this).html('<svg t="1561903592109" class="icon" style="width:6%;height:3%;margin-bottom: -0.5vw;margin-top:-5vw" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7969" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><defs><style type="text/css"></style></defs><path d="M765.7 486.8L314.9 134.7c-5.3-4.1-12.9-0.4-12.9 6.3v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1c16.4-12.8 16.4-37.6 0-50.4z" p-id="7970" fill="#8a8a8a"></path></svg>');
                    $("#point-table").hide();
                }
            });
            //重新解锁
            $("body").delegate("#confirm", "click", function (e) {
                confirm("是否发起解锁？", function (bool) {
                    if (bool == true) {
                        var list = [];
                        DATA.info.UStatus = 1;
                        DATA.info.UnLockOption = $("#desc1").val();
                        if (DATA.info.UnLockOption == "") {
                            alert("请填写解锁意见！");
                            return false;
                        }
                        for (var i = 0; i < AllPart.length; i++) {
                                    list.push(AllPart[i].ID);
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
                window._eventID = 3003;
            }
            model.com.getUnTaskinfo({
                ID: model.query.id
            }, function (data) {
                DATA = data;
                model.com.getTaskinfo({
                    ID: DATA.info.LockID
                }, function (data) {
                    AllPart = data.list;
                    for (var i = 0; i < data.list.length; i++) {
                        if (data.list[i].Status == 1) {
                            data.list[i].Time = "暂无";
                        } else {
                            data.list[i].Time = data.list[i].UnLockTime;
                        }
                        data.list[i].StatusName = POINTSTATUS[data.list[i].Status];
                    }
                    $("#table3").html($com.util.template(data.list, HTML.IPT1));
                //var str = "";
                for (var i = 0; i < DATA.user.length; i++) {
                   
                    DATA.user[i].name = DATA.user[i].UserName + "(" + DATA.user[i].PositionName + ")";
                    DATA.user[i].userStatus = USERSTATUS[DATA.user[i].Status];
                    if (DATA.user[i].Status != 4) {
                        DATA.user[i].Time = "未确认";
                    } else {
                        DATA.user[i].Time = DATA.user[i].ConfirmTime;
                    }
                }
                $("#desc").val(DATA.info.LockReason);
                $("#desc1").val(DATA.info.UnLockOption);
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