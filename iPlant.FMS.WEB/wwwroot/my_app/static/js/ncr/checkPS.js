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
        selected2,
        RESULT,
		COLOUR,
        AllUser,
        AllWorkShop,
        AllLine,
        AllPart,
		LETTER;
    selected = [];
    current = "Status_Sent";
    NCRType = ["默认", "物料不合格", "模组不合格"];
    UserStatus = ["默认", "已呼叫", "已到场", "待确认", "已确认"];
    POINTSTATUS = ["无", "锁定", "解锁"];
    HTML = {
        LIST: ['<div class="ms-group clearfix">',
                    '<div class="ms-col ms-col-f" style="width: 100%;" >',
                        '<div class=" ms-limit">',
                            '<div class="ms-title">',
                                '<span class="ms-text">{{ProductNo}}</span>',
                            '</div>',
                        '<div class="ms-sub-title">',
                        '<span class="ms-field">',
                            '<span class="ms-label">订单号:</span>',
                            '<span class="ms-text">{{OrderNo}}</span>',
                        '</span>',
                    '</div>',
                   '<div class="ms-sub-title">',
                       '<span class="ms-field">',
                           '<span class="ms-text">{{SourceTypeName}}</span>',
                            '<span class="ms-text">  </span>',
                           '<span class="ms-label">发起人:</span>',
                           '<span class="ms-text">{{OperatorName}}</span>',
                           '<span class="ms-text">  </span>',
                           '<span class="ms-text">{{WriteTime}}</span>',
                       '</span>',
                   '</div>',
                        '</div>',
                    '</div>',
                '</div>'].join(""),
        IPT: [  '<tr>',
                            '<td style="width:40%;">{{name}}</td>',
                            '<td style="width:44%;">{{Time}}</td>',
                            '<td style="width:16%;">{{StatusName}}</td>',
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
            //评审
            $("body").delegate("#confirm", "click", function (e) {
                confirm("是否提交评审？", function (bool) {
                    
                    if (bool == true) {
                        if (!RESULT) {
                            alert("请填写评审结果再尝试！");
                            return false;
                        }
                    
                        if ($("#desc1").val() == "") {
                            alert("请填写评审意见再尝试！");
                            return false;
                        }
                        DATA.info.Result = RESULT;
                        DATA.info.HandleOpinion = $("#desc1").val();
                        DATA.info.Status = 5;
                        DATA.info.WriteTime = new Date();
                        model.com.saveTask({
                            data: DATA.info, list: DATA.list, user: DATA.user
                        }, function (data) {
                            alert("提交成功");
                            window.location = "mylist.html";
                        });
                    } else {
                        return false;
                    }
                    });
            });
       
            $("body").delegate("#w-option-icon3", "click", function (e) {
                $('input:radio[name="RADIO"]').each(function () {
                    if ($(this).val() == selected2) {
                        $(this).attr("checked", true);
                    }
                });
                $(".bindOne").show();
            });
            $("body").delegate(".confirm", "click", function (e) {
                var val = $('input:radio[name="RADIO"]:checked').val();
                if (val == null) {
                    alert("请选择模组或物料再确定!");
                    $(".bindOne").hide();
                    return false;
                }
                else {
                    selected2 = val;
                    //$("#list").show();
                    if (val == 1) {
                        $("#w-option-content3").text("报废");
                        RESULT = val;
                    }
                    if (val == 2) {
                        $("#w-option-content3").text("退库");
                        RESULT = val;
                    }
                    if (val == 3) {
                        $("#w-option-content3").text("让步接收");
                        RESULT = val;
                    }
                    if (val == 4) {
                        $("#w-option-content3").text("返工");
                        RESULT = val;
                    }
                    $(".bindOne").hide();
                }
                //$(".bindOne").hide();
            });
            $("body").delegate(".close", "click", function (e) {
                $(".bindOne").hide();
            });
        },

        run: function () {

            if (window._eventID == 0) {
                window._eventID = 2006;
            }
            model.com.getNCRInfo({
                ID: model.query.id
            }, function (data) {
                DATA = data;
                var str = "";
                for (var i = 0; i < data.list.length; i++) {
                    str += data.list[i].ModuleNo + ";  ";
                }
                if (data.info.SourceType == 1) {
                    $("#head").text("物料列表");
                } else {
                    $("#head").text("模组列表");
                }
                $("#w-option-content2").text(str);
                data.info.SourceTypeName = NCRType[data.info.SourceType];
                $("#table1").html($com.util.template(data.info, HTML.LIST));
               
                $("#desc").val(DATA.info.LaunchReason);
                for (var i = 0; i < data.user.length; i++) {
                    data.user[i].name = data.user[i].UserName + "(" + data.user[i].PositionName + ")";
                    if (data.user[i].Status != 4) {
                        data.user[i].Time = "暂无";
                    } else {
                        data.user[i].Time = data.user[i].AssessTime;
                    }
                    data.user[i].StatusName = UserStatus[data.user[i].Status];
                  }
                $("#table2").html($com.util.template(data.user, HTML.IPT));
                //$("#table3").html($com.util.template(data.list, HTML.IPT1));
                  
                });
            //});
            //});
        },
        com: {
            //根据用户查锁定
            getNCRInfo: function (data, fn, context) {
                var d = {
                    $URI: "/NCRTask/Info",
                    $TYPE: "get"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }
                $com.app.ajax($.extend(d, data), fn, err, context);
            },
        
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