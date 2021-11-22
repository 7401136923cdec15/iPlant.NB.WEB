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
    current = "Status_Sent";
    USERSTATUS = ["默认", "已呼叫", "已到场", "待确认", "已确认"];
   
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
            
            //撤销
            $("body").delegate("#confirm", "click", function (e) {
                confirm("是否发起撤销？", function (bool) {
                    if (bool == true) {
                        DATA.info.UStatus = 0;
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
            if (model.query.check >0) {
                $("#confirm").hide();
            }
            model.com.getUnTaskinfo({
                ID: model.query.id
            }, function (data) {
                DATA=data;
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
                    str += DATA.list[i].PartPointName + ";  ";
                }
                $("#w-option-content").text(str);
                $("#desc").val(data.info.LockReason);
                $("#desc1").val(data.info.UnLockOption);
                $("#table2").html($com.util.template(DATA.user, HTML.TABLE));
                $("#table1").html($com.util.template(data.info, HTML.LIST));
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