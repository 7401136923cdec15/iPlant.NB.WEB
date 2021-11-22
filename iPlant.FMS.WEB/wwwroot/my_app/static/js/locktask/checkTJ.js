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
         
        IPT: ['<label class="radio-item" style="padding: 3vw 4vw 0 4vw;display:block;" for="zz{{Id}}">',
                        '<div class="m-checkbox-box">',
                           ' <input type="checkbox" {{Checked}} name="item2" data-id="{{Id}}" data-cause="{{Name}}" id="zz{{Id}}">',
                            '<label for="zz{{Id}}"></label>',
                       ' </div>',
                        '<span>{{Name}}</span>',
                    '</label>'].join(""),
        IPT1: ['<label class="radio-item" style="padding: 3vw 4vw 0 4vw;display:block;" for="zz{{Id}}">',
                       '<div class="m-checkbox-box">',
                          ' <input type="checkbox" {{Checked}} name="item3" data-id="{{Id}}" data-cause="{{Name}}" id="zz{{Id}}">',
                           '<label for="zz{{Id}}"></label>',
                      ' </div>',
                       '<span>{{Name}}</span>',
                   '</label>'].join(""),
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
                if (selected.length <= 0) {
                    alert("请选择通知对象列表");
                    return false;
                }
                if (selected1.length <= 0) {
                    alert("请选择工步列表");
                    return false;
                }
                confirm("确认提交吗？", function (bool) {
                    if(bool==true){
                        var user = [];
                        var list = [];
                        for (var i = 0; i < DATA.user.length; i++) {
                            for (var j = 0; j < selected.length; j++) {
                                if (DATA.user[i].PositionID == selected[j]) {
                                    user.push({ ID: 0, LockID: model.query.ID, UserID: DATA.user[i].WorkerID, PositionID: DATA.user[i].PositionID, Status: 1 });
                                }
                            }
                        }
                        for (var i = 0; i < DATA.list.length; i++) {
                            for (var j = 0; j < selected1.length; j++) {
                                if (DATA.list[i].PartPointID == selected1[j]) {
                                    list.push({ ID: 0, PartPointID: DATA.list[i].PartPointID, PartPointName: DATA.list[i].PartPointName, LockType: 1, Status: 1 });
                                }
                            }
                        }
                        if (list.length <= 0) {
                            alert("请填写锁定工步！");
                            return false;
                        }
                        if (user.length <= 0) {
                            alert("请填写通知对象！");
                            return false;
                        }
                        DATA.info.LockReason = $("#desc").val();
                        if (DATA.info.LockReason == "") {
                            alert("请填写锁定原因！");
                            return false;
                        }
                        DATA.info.Status = 2;
                        DATA.info.LockCount = list.length;
                        DATA.info.LockTime = new Date();
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
            //选择锁定工步
            $("body").delegate("#w-option-icon", "click", function (e) {
                var list = [];
                model.com.creatTask({
                    EventID: window._eventID, TaskLineID: model.query.lineID
                }, function (data) {
                    for (var i = 0; i < data.list.length; i++) {
                        list.push({ ID: data.list[i].PartPointID, name: data.list[i].PartPointName, GroupID: data.list[i].RouteID, GroupName: data.list[i].RouteName });
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
                        var data = [];
                        var str = "";
                        for (var j = 1; j <= p2.length; j++) {
                            str += p2[j - 1] + " ;  ";
                        }
                        selected1 = p1;
                        $("#w-option-content").text(str);
                    });
                });
            
            });
            $("body").delegate("#w-option-icon1", "click", function (e) {
                var list = [];
                model.com.creatTask({
                    EventID: window._eventID, TaskLineID: model.query.lineID
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
                EventID: window._eventID, TaskLineID: model.query.lineID
            }, function (data) {
                DATA=data;
            model.com.getTaskinfo({
                ID: model.query.id
            }, function (data) {
                DATA.info= data.info;
                $("#desc").val(DATA.info.LockReason);
                var str = "";
                var str1 = "";
                var userName = [];
                selected = [];
                selected1 = [];
                for (var i = 0; i < data.list.length; i++) {
                    selected1.push(data.list[i].PartPointID);
                    str1+= data.list[i].PartPointName + ";  ";
                }
                for (var i = 0; i < data.user.length; i++) {
                    selected.push(data.user[i].PositionID);
                    str += data.user[i].UserName + ";  ";
                }
                //for (var i = 0; i < DATA.user.length; i++) {
                //        for (var j = 0; j < selected.length; j++) {
                //            if (DATA.user[i].PositionID == selected[j]) {
                //                userName.push(DATA.user[i].WorkerName);
                //            }
                //        }
                //    }
                $("#w-option-content1").text(str);
                $("#w-option-content").text(str1);
                    model.com.getPart({
                        ID: model.query.lineID, EventID: window._eventID,
                    }, function (data) {
                        $(".m-table").html($com.util.template(data.info, HTML.LIST));
                    });
                });
            });
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
            //创建锁定任务
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
            
                 //保存锁定任务
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