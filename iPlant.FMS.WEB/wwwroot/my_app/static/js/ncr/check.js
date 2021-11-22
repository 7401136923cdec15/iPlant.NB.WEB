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
    Result = ["默认", "报废", "退库", "让步接收", "返工"];
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
            //撤销
            $("body").delegate("#confirm", "click", function (e) {
                var i = $("#confirm").text();
                confirm("是否进行"+i+"？", function (bool) {
                    if (bool == true) {
                        if ($("#confirm").text() == "撤销") {
                            if (model.query.status == "已提交") {
                                DATA.info.Status = 0;
                            }
                            for (var i = 0; i < DATA.user.length; i++) {
                                DATA.user[i].Status = 0;
                            }
                            model.com.saveTask({
                                data: DATA.info, list: DATA.list, user: DATA.user
                            }, function (data) {
                                alert("提交成功");
                                window.location = "mylist.html";
                            });
                        }
                        if ($("#confirm").text() == "发起评审") {
                           
                            window.location = "checkPS.html?id="+model.query.id;
                        }
                        if ($("#confirm").text() == "撤回评审") {
                            DATA.info.Status = 4;
                            model.com.saveTask({
                                data: DATA.info, list: DATA.list, user: DATA.user
                            }, function (data) {
                                alert("提交成功");
                                window.location = "mylist.html";
                            });
                        }
                    } else {
                        return false;
                    }
                    });
            });
       
            //选择锁定工步
            $("body").delegate("#w-option-icon", "click", function (e) {
                
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
                window._eventID = 2006;
            }
            if ( model.query.status == "已到场") {
                $("#confirm").text("发起评审");
            }
            if (model.query.status == "已评审") {
                $("#confirm").text("撤回评审");
            }
            if (model.query.status != "已提交" && model.query.status != "已到场" && model.query.status != "已评审") {
                $("#confirm").hide();
            }
            model.com.getNCRInfo({
                ID: model.query.id
            }, function (data) {
                DATA = data;
                if (DATA.info.Result) {
                    $("#result").show();
                    $("#opinion").show();
                    $("#w-option-content3").text(Result[DATA.info.Result]);
                    $("#desc1").val(DATA.info.HandleOpinion);
                }
                data.info.SourceTypeName = NCRType[data.info.SourceType];
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
                  
                });
        
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