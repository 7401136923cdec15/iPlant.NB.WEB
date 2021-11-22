require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/appTools'], function ($yang, $com, $tool) {

    var model,
		HTML,
		config,
        IsSubmit,
        wlist,
        wItem,
        wLine,
        wWorkShop,
        wBusinessUnit,
        wFactory,
        selected_Type,
        selected_Item,
        selected_Line,
        selected_WorkShop,
        selected_BusinessUnit,
        selected_Factory,
        TypeID,
        ItemID,
        LineID,
        WorkShopID,
        BusinessUnitID,
        FactoryID,
        modelName,
        ledgerName,
        modelID,
        ledgerID,


    IsSubmit = false;

    selected_Type = [];
    selected_Item = [];
    selected_Line = [];
    selected_WorkShop = [];
    selected_BusinessUnit = [];
    selected_Factory = [];
    HTML = {
        TR: ['<tr class="table-tr-m" data-value="{{TypeID}}"  data-n-value="{{TypeName}}" >',
              '<td width="50%" class="ex_type_choose">{{ID}}</td>',
              '<td width="50%" class="ex_dispatch_choose">{{Name}}</td>',
           
          '</tr>'].join(""),

        DIALOGS: {
            SELECT: ['<div class="multi-box {{sid}}" style="display:block;">',
				'<div class="multi-select clearfix">',
				'<div class="multi-bg">',
				'<ul>{{list}}</ul>',
				'</div>',
				'</div>{{btn}}',
				'</div>'].join(""),
            S_CHECKBOX: ['<li>',
				'<label class="col-flex clearfix" for="S_CHECKBOX{{key}}">',
				'<div class="col-item">',
				'<span>{{value}}</span>',
				'</div>',
				'<div class="col-item">',
				'<div class="m-checkbox-box">',
				'<input type="checkbox" {{disabled}} name="CHECKBOX" data-value="{{key}}" data-name="{{value}}" id="S_CHECKBOX{{key}}">',
				'<label for="S_CHECKBOX{{key}}"></label>',
				'</div>',
				'</div>',
				'</label>',
				'</li>'].join(""),
            S_RADIO: ['<li>',
				'<label class="col-flex clearfix" for="S_RADIO{{key}}">',
				'<div class="col-item">',
				'<span>{{value}}</span>',
				'</div>',
				'<div class="col-item">',
				'<div class="m-checkbox-box">',
				'<input type="radio" {{disabled}} name="RADIO" data-value="{{key}}" data-name="{{value}}" id="S_RADIO{{key}}">',
				'<label for="S_RADIO{{key}}"></label>',
				'</div>',
				'</div>',
				'</label>',
				'</li>'].join(""),
            BTN: {
                CLOSE: ['<div class="multi-btn">',
					'<a href="javascript:;" class="btn btn-primary confirm">{{btn}}</a>',
					'</div>'].join(""),
                CONFIRM: ['<div class="multi-btn clearfix">',
					'<div class="multi-flex">',
					'<a href="javascript:;" class="btn close">取消</a>',
					'</div>',
					'<div class="multi-flex">',
					'<a href="javascript:;" class="btn btn-primary confirm">确定</a>',
					'</div>',
					'</div>'].join("")
            }
        },

    };
    var ApplyTemp = {
        ID: 0,
        ApplyNo: "",
        ModelID: 0,
        LedgerID: 0,
        TypeID: 0,
        MaintainItemOptions: [],
        ApplicantID: 0,
        ApplicantTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        TaskTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        ApproverID: 0,
        ApproverTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        MaintainerID: 0,
        ConfirmID: 0,
        ConfirmTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
        Status: 1,
        Comment: "",
        Reason: "",
        DSType: 1,
        BusinessUnitID: 0,
        WorkShopID: 0,
        LineID: 0,
        FactoryID: 0,
        BaseID:0,
    };
    model = $com.Model.create({
        name: '保养申请',

        type: $com.Model.MAIN,

        data: {},

        configure: function () {
            this.run();
        },

        events: function () {

            $("body").delegate("#commit", "click", function () {
                model._data = ApplyTemp;
                timeS = $("#start_time").val();
                modelS = $("#model").text();
                ledgerS = $("#ledger").text();
                desc = $("#desc").val;
                	if (!timeS) {
                	    alert("请选择任务时间！");
                	    return;
                	}
                	if (!modelS) {
                	    alert("请选择设备型号！");
                	    return;
                	}
                	if (!ledgerS) {
                	    alert("请选择设备编码！");
                	    return;
                	}
                	if (!desc) {
                	    alert("请填写申请备注！");
                	    return;
                	}
                	var starttime = Date.parse(new Date(timeS));
                	if (!window.JSImpl) {
                	    model._data.TaskTime = $com.util.format("yyyy-MM-dd hh:mm:ss.S", starttime);
                	    model._data.ModelID = 11;
                	    model._data.LedgerID = 4;
                	    model._data.Comment = desc;
                	    model._data.TypeID = TypeID;
                	    model._data.MaintainItemOptions = ItemID;
                	    model._data.LineID = LineID;
                	    model._data.WorkShopID = WorkShopID;
                	    model._data.BusinessUnitID = BusinessUnitID;
                	    model._data.FactoryID = FactoryID;
                	} else {
                	    model._data.TaskTime = $com.util.format("yyyy-MM-dd hh:mm:ss.S", starttime);
                	    model._data.ModelID = modelID;
                	    model._data.LedgerID = ledgerID;
                	    model._data.Comment = desc;
                	    model._data.TypeID = TypeID;
                	    model._data.MaintainItemOptions = ItemID;
                	    model._data.LineID = LineID;
                	    model._data.WorkShopID = WorkShopID;
                	    model._data.BusinessUnitID = BusinessUnitID;
                	    model._data.FactoryID = FactoryID;
                	}
                model.com.addCheck();
            });
            function split2Object(d) {
                var arr = [],
					data = d.split("],["),
					i = -1,
					len = data.length;

                while (++i < len) {
                    var _item = data[i].split("]=[]=[");
                    arr.push({
                        key: _item[0],
                        value: _item[1]
                    });
                }

                return arr;
            }

            $("#back").click(function () {
                if (window.history.length > 0) {
                    window.history.back();
                }
                else {
                    window.location = "apply.html";
                }
            });
            // 多选
            $("body").delegate(".m-c-panel[mode=n-select-checkbox] .m-c-body", "click", function (e) {
                var $self = $(this),
					list = split2Object($self.attr("value-list")),
					selected = $self.find(".w-option-content").attr("data-value"),
					str = "",
					$box = null;

                $.each(list, function (i, item) {
                    item.disabled = "";
                    str += $com.util.template(item, HTML.DIALOGS.S_CHECKBOX);
                });

                $box = $com.util.template({
                    list: str,
                    sid: "bindOne",
                    btn: $com.util.template({
                        btn: "确认"
                    }, HTML.DIALOGS.BTN.CONFIRM)
                }, HTML.DIALOGS.SELECT);

                $box = $($box);

                $("body").append($box);

                selected = selected ? selected.split(",") : [];
                $.each(selected, function (i, item) {
                    //$box.find("input[data-value="+ item  +"]").prop("checked", true);
                    $box.find("input").each(function () {
                        var $this = $(this);

                        if ($this.attr("data-value") == item) {
                            $this.prop("checked", true);
                        }
                    });
                });

                $box.find(".confirm").on("click", function () {
                    var _v = [],
						_name = [];
                    var $checked = $box.find("input:checked");

                    if ($checked.length === 0) {
                        alert("请选择");
                        return;
                    }

                    $box.find("input:checked").each(function () {
                        _v.push($(this).attr("data-value"));
                        _name.push($(this).attr("data-name"));
                    });

                    $self.find(".w-option-content")
						.attr("data-value", _v.join("],["))
						.text(_name)
						.addClass("text-darkgrey2");

                    $(this).unbind("click");
                    $box.remove();
                });

                $box.find(".close").on("click", function () {
                    $box.find(".confirm").off("click");
                    $(this).off("click");
                    $box.remove();
                });

                // 弹出层隐藏
                $(".bindOne").on("click", function (e) {
                    var tar = $(e.target);

                    if (tar.hasClass("multi-select")) {
                        $box.find(".confirm").unbind("click");
                        tar.parent().remove();
                        $(this).off("click");
                    }
                });
            });

            // 单选
            $("body").delegate(".m-c-panel[mode=n-select-radio] .m-c-body", "click", function (e) {
                var $self = $(this),
					list = split2Object($self.attr("value-list")),
					selected = $self.find(".w-option-content").attr("data-value"),
					$group_item = $self.closest(".list-group-item"),
					$result = $group_item.find(".actual-result"),

					str = "",
					$box = null;

                $.each(list, function (i, item) {
                    item.disabled = "";
                    str += $com.util.template(item, HTML.DIALOGS.S_RADIO);
                });

                $box = $com.util.template({
                    list: str,
                    sid: "bindOne",
                    btn: $com.util.template({
                        btn: "确认"
                    }, HTML.DIALOGS.BTN.CONFIRM)
                }, HTML.DIALOGS.SELECT);

                $box = $($box);

                $("body").append($box);

                selected = selected ? selected.split(",") : [];
                $.each(selected, function (i, item) {
                    //$box.find("input[data-value="+ item +"]").prop("checked", true);
                    $box.find("input").each(function () {
                        var $this = $(this);

                        if ($this.attr("data-value") == item) {
                            $this.prop("checked", true);
                        }
                    });
                });

                $box.find(".confirm").on("click", function () {
                    var _v = [],
						_name = [];
                    var $checked = $box.find("input:checked");

                    if ($checked.length === 0) {
                        alert("请选择");
                        return;
                    }

                    $box.find("input:checked").each(function () {
                        _v.push($(this).attr("data-value"));
                        _name.push($(this).attr("data-name"));
                    });



                    $self.find(".w-option-content")
						.attr("data-value", _v.join("],["))
						.text(_name)
						.addClass("text-darkgrey2");

                    $(this).unbind("click");
                    $box.remove();
                });

                $box.find(".close").on("click", function () {
                    $box.find(".confirm").off("click");
                    $(this).off("click");
                    $box.remove();
                });

                // 弹出层隐藏
                $(".bindOne").on("click", function (e) {
                    var tar = $(e.target);

                    if (tar.hasClass("multi-select")) {
                        $box.find(".confirm").unbind("click");
                        tar.parent().remove();
                        $(this).off("click");
                    }
                });
            })

            //选择保养模板
            $("body").delegate("#type", "click", function () {
                var DataTempLate = {
                    list: wlist,
                    title: "选择列表",
                    PropertyID: "ID",  //数据源ID
                    PropertyName: "Name",  //数据源名称
                    PropertyGroupName: "GroupName", //分组属性名称
                    PropertyGroupID: "GroupID",  //分组属性ID
                    mode: 1,         //1 单选 2多选
                    allowEmpty:true,//是否允许不选
                }
                // selected  已选择的数据ID 或数据ID数组
                //IDList 选择的ID数组  NameList 选择的Name数组
               
                $com.choosePage.show(DataTempLate, selected_Type, function (IDList, NameList) {
                    selected_Type = [];
                    selected_Type = IDList[0];
                    TypeID = IDList[0];
                    if (IDList.length == 0) {
                        var Type = $(".femi-select-input").val();
                        for (var i = 0; i < wlist.length; i++) {
                            if (Type = wlist[i].Name) {
                                alert("自定义保养模板出现重复，请重新定义！");
                                return false;
                            }                
                        }
                        model._Type = Type;
                    }

                    $(".w-option-contentType").val(NameList);
                })
            });

            //选择保养项
            $("body").delegate("#item", "click", function () {
                var DataTempLate = {
                    list: wItem,
                    title: "选择列表",
                    PropertyID: "ID",  //数据源ID
                    PropertyName: "Name",  //数据源名称
                    PropertyGroupName: "GroupName", //分组属性名称
                    PropertyGroupID: "GroupID",  //分组属性ID
                    mode: 2,
                    allowEmpty: true,//是否允许不选
                }
                for (var i = 0; i < wItem.length; i++) {
                    selected_Item.push(wItem[i].ID);
                }
                // selected  已选择的数据ID 或数据ID数组
                //p1 选择的ID数组  p2 选择的Name数组

                $com.choosePage.show(DataTempLate, selected_Item, function (IDList, NameList) {
                    selected_Item = [];
                    selected_Item = IDList;
                    ItemID = IDList;
                    str = "";
                    var data = [];
                   
                    for (var i = 1; i <= NameList.length; i++) {
                        data.push(NameList[i - 1]);
                        str += NameList[i - 1] + ";";
                    }
                    //for (var i = 1; i <= IDList.length; i++) {
                    //    selected_Item.push(IDList[i - 1]);
                    //}
                    if (IDList.length == 0) {
                        var Item = $(".femi-select-input").val();
                        model._Items = Item.split(";");
                        if (model._Items[model._Items.length - 1] == "") {
                            model._Items.splice(model._Items.length - 1, 1);
                        }
                        for (var i = 0; i < wItem.length; i++) {
                            for (var j = 0; j < model._Items.length; j++) {
                                if (wItem[i].Name == model._Items[j]) {
                                    alert("保养项出现重复！");
                                    return false;
                                }
                            }
                        }

                    }
                  
                    $(".w-option-contentItem").val(str);
                })
            });

            //选择产线
            $("body").delegate("#Line", "click", function () {
                var DataTempLate = {
                    list: wLine,
                    title: "选择列表",
                    PropertyID: "ID",  //数据源ID
                    PropertyName: "Name",  //数据源名称
                    PropertyGroupName: "GroupName", //分组属性名称
                    PropertyGroupID: "GroupID",  //分组属性ID
                    mode: 1,
                    allowEmpty: true,//是否允许不选
                }
                // selected  已选择的数据ID 或数据ID数组
                //p1 选择的ID数组  p2 选择的Name数组
                
                $com.choosePage.show(DataTempLate, selected_Line, function (IDList, NameList) {
                    selected_Line = [];
                    selected_Line = IDList[0];
                    LineID = IDList[0];
                    $(".w-option-contentLine").val(NameList);
                })
            });
            //选择车间
            $("body").delegate("#WorkShop", "click", function () {
                var DataTempLate = {
                    list: wWorkShop,
                    title: "选择列表",
                    PropertyID: "ID",  //数据源ID
                    PropertyName: "Name",  //数据源名称
                    PropertyGroupName: "GroupName", //分组属性名称
                    PropertyGroupID: "GroupID",  //分组属性ID
                    mode: 1,
                    allowEmpty: true,//是否允许不选
                }
                // selected  已选择的数据ID 或数据ID数组
                //p1 选择的ID数组  p2 选择的Name数组
                //selected = [];
                $com.choosePage.show(DataTempLate, selected_WorkShop, function (IDList, NameList) {
                    selected_WorkShop = [];
                    selected_WorkShop = IDList[0];
                    WorkShopID = IDList[0];
                    $(".w-option-contentWorkShop").val(NameList);
                })
            });
            //选择事业部
            $("body").delegate("#BusinessUnit", "click", function () {
                var DataTempLate = {
                    list: wBusinessUnit,
                    title: "选择列表",
                    PropertyID: "ID",  //数据源ID
                    PropertyName: "Name",  //数据源名称
                    PropertyGroupName: "GroupName", //分组属性名称
                    PropertyGroupID: "GroupID",  //分组属性ID
                    mode: 1,
                    allowEmpty: true,//是否允许不选
                }
                // selected  已选择的数据ID 或数据ID数组
                //p1 选择的ID数组  p2 选择的Name数组
                //selected = [];
                $com.choosePage.show(DataTempLate, selected_BusinessUnit, function (IDList, NameList) {
                    selected_BusinessUnit = [];
                    selected_BusinessUnit = IDList[0];
                    BusinessUnitID = IDList[0];
                    $(".w-option-contentBusinessUnit").val(NameList);
                })
            });
            //选择工厂
            $("body").delegate("#Factory", "click", function () {
                var DataTempLate = {
                    list: wFactory,
                    title: "选择列表",
                    PropertyID: "ID",  //数据源ID
                    PropertyName: "Name",  //数据源名称
                    PropertyGroupName: "GroupName", //分组属性名称
                    PropertyGroupID: "GroupID",  //分组属性ID
                    mode: 1,
                    allowEmpty: true,//是否允许不选
                }
                // selected  已选择的数据ID 或数据ID数组
                //p1 选择的ID数组  p2 选择的Name数组
                //selected = [];
                $com.choosePage.show(DataTempLate, selected_Factory, function (IDList, NameList) {
                    selected_Factory = [];
                    selected_Factory = IDList[0];
                    FactoryID = IDList[0];
                    $(".w-option-contentFactory").val(NameList);
                })
            });
            $(function () {

                var curr = new Date().getFullYear();

                $('.test_default_time').val('').scroller('destroy').scroller(
					$.extend(
						{
						    preset: 'datetime',
						    stepMinute: 5
						},
						{
						    theme: "android-ics light",
						    mode: "scroller",
						    display: "bottom",
						    lang: "zh"
						})
				);
            });
        },


        run: function () {
            model._data = {},
            model._Type = "",
            model._Items = [],

            modelID = Number(model.query.smodelID);
            ledgerID = Number(model.query.sledgerID);
            ledgerName = model.query.wstr;
            $("#ledger").html(ledgerName);
            model.com.type({
                ModelID: -1, Name: "", DSType: 1, Active: -1,
                StartTime: "2000-1-1", EndTime: "2000-1-1",
                BusinessUnitID: 0, BaseID: 0, FactoryID: 0, WorkShopID: 0, LineID: 0
            }, function (data) {
                wlist = data.list;
            });
            model.com.item({
                ModelID: -1, Name: "", DSType: 1, Active: -1,
                StartTime: "2000-1-1", EndTime: "2000-1-1",
                BusinessUnitID: 0, BaseID: 0, FactoryID: 0, WorkShopID: 0, LineID: 0
            }, function (data) {
                wItem = data.list;
            });
            model.com.Line({
                BusinessUnitID: 0, FactoryID: 0, WorkShopID: 0, OAGetType: 0
            }, function (data) {
                wLine = data.list;
            });
            model.com.WorkShop({
                BusinessUnitID: 0, FactoryID: 0, OAGetType: 0
            }, function (data) {
                wWorkShop = data.list;
            });
            model.com.BusinessUnit({
               OAGetType: 0
            }, function (data) {
                wBusinessUnit = data.list;
            });
            model.com.Factory({
                OAGetType: 0
            }, function (data) {
                wFactory = data.list;
            });
            model.com.Model({
                DeviceWorkType: 0, SupplierID: 0, ModelPropertyID: 0,
                SystemID: 0, SystemPropertyID: 0, ControllerID: 0,
                ControllerPropertyID: 0, Active: -1, SupplierModelNo: "",
                SystemVersion: "", ControllerModel: "",
            }, function (res) {
                if (window.JSImpl) {
                    var wGetlist = res.list;
                    var wModelNo = [];
                    for (var i = 0; i < wGetlist.length; i++) {
                        if (wGetlist[i].ID == modelID) {
                            wModelNo.push(wGetlist[i]);
                        }
                    }
                    modelName = wModelNo[0].ModelNo;
                    $("#model").html(modelName);
                }
            });
        
        },

        com: {
            save: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceMaintainApply/Update",
                    $TYPE: "post",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            type: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceMaintainType/All",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            item: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceMaintainItem/All",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            Line: function (data, fn, context) {
                var d = {
                    $URI: "/FMCLine/All",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            WorkShop: function (data, fn, context) {
                var d = {
                    $URI: "/FMCWorkShop/All",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            BusinessUnit: function (data, fn, context) {
                var d = {
                    $URI: "/BusinessUnit/All",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            Factory: function (data, fn, context) {
                var d = {
                    $URI: "/FMCFactory/All",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            Model: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceModel/All",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            addCheck: function () {
                if (IsSubmit)
                    return false;

                var data = {
                    data: model._data,
                    Type:model._Type,
                    Items: model._Items,
                }

           

                confirm("确认提交吗？", function (bool) {
                    if (bool == true) {
                        model.com.save(data, function (res) {
                            IsSubmit = false;
                            alert("提交成功");
                            window.location = "apply.html?id=" + res.info.ID;
                        });
                    } else {
                        return false;
                    }
                });

            },
        }
    });

    model.init();
});
//# sourceMappingURL=maps/create2-141aed9460.js.map