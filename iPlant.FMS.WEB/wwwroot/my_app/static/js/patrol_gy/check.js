require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($yang, $com) {


    var model,
		HTML,
		STATUS,
		COLOUR,
        WID,
		IsSubmit;

    IsSubmit = false;

    STATUS = ["合格", "合格", "不合格"];

    COLOUR = ["text-yellow", "text-blue", "text-red"];

    var default_id = "";

    HTML = {
        TITLE: [
			'<div class="ms-group clearfix">',
			'<div class="ms-col ms-col-f" style="width:100%;max-width: 100%>',
			'<div class="ms-limit">',
			'<div class="ms-title">',
			'<span class="ms-field femi-rt"> ',
			'<span class="ms-text ms-margin">{{WorkShopName}}</span>',
			'<span class="ms-text">{{LineName}}</span>',
			'</span> <span>{{PartPointName}}</span>',
			'</div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field"><span class="ms-label">订单号:</span>',
			'<span class="ms-text">{{OrderNo}}</span></span>',
			'</span>',
			'</div>',
            '<div class="ms-sub-title">',
			'<span class="ms-field">',
			'<span class="ms-label">激活:</span> <span class="ms-text">{{ActiveTime}}</span>',
             '<span class="ms-field"><span class="ms-label">人员:</span>',
			'<span class="ms-text">{{OperatorName}}</span> </span>',
			'</span>',
			'</div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field"><span class="ms-label">工序:</span>',
			'<span class="ms-text">{{PartName}}</span></span>',
			'<span class="ms-field"><span class="ms-label">规格:</span>',
			'<span class="ms-text">{{ProductNo}}</span> </span>',
			'</div>',
			'</div>',
			'</div>',
			//'<div class="ms-col ms-col-l">',
			//'<span class="ms-status {{Color}}">{{StatusText}}</span>',
			//'</div>',
			'</div>'].join(""),

        SUB_LIST: ['<li class="list-li">',
			'<div class="list-group-item"  data-id="{{ID}}">',
			'<div class="list-group-item-cell item-static item-title"  style="width:30%">',
			'<span>{{Text}}</span>',
			'</div>',
			'<div class="list-group-item-cell item-static item-time" style="width:50%">',
			'<span>{{Standard}}</span>',
			'</div>',
			'<div class="list-group-item-cell item-static item-state" style="width:15%">',
			'<span class="item-state {{resultColor}}">{{resultText}}</span>',
			'</div>',
			'<div class="list-group-item-cell item-icon" style="width:5%">',
			'<i class="icon icon-arrow-right"></i>',
			'</div>',
			'</div>',
			'<div class="list-group-sub">',
			'<div class="m-c-panel" mode="n-select-radio">',
			'<div class="m-c-head">巡检项结果</div>',
			'<div class="m-c-body m-c-ring clearfix" value-list="1]=[]=[合格],[2]=[]=[不合格">',
			'<div class="w-option">',
			'<span class="w-option-content actual-result" data-value="{{result}}">{{resultText}}</span>',
			'<div class="w-option-icon">',
			'<svg width="15px" height="26px" viewBox="0 0 15 26" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">',
			'<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="square">',
			'<g transform="translate(-510.000000, -341.000000)" stroke="#BDBDBD" stroke-width="2">',
			'<g transform="translate(517.500000, 354.000000) rotate(-360.000000) translate(-517.500000, -354.000000) translate(510.000000, 341.000000)">',
			'<path d="M13.6388889,13.7272727 L1.36111111,24.6363636"></path>',
			'<path d="M2.80555556,1.54545455 L13.6388889,13.9090909"></path></g></g></g>',
			'</svg></div> </div></div></div>',
			'{{ITEMControl}}',
			'<div class="m-c-panel">',
			'<div class="m-c-head">备注</div>',
			'<div class="m-c-body m-c-input clearfix ">',
			'<textarea rows="2" placeholder="请填写巡检项备注" class="actual-remark">{{remark}}</textarea>',
			'</div></div>',
			'</div>', //填表单
			'</li>'].join(""),

        ITEM: {
            Text: [
				'<div class="m-c-panel" mode="n-input" >',
				'<div class="m-c-head">实际值 {{unit}}</div>',
				'<div class="m-c-body m-c-input clearfix">',
				'<input class="actual-value" type="text" placeholder="请输入实际值" value="{{defaultValue}}" ></input>',
				'</div> </div>',
            ].join(""),
            Combo: [
				'<div class="m-c-panel" mode="n-select-radio">',
				'<div class="m-c-head">实际值{{unit}}</div>',
				'<div class="m-c-body m-c-ring clearfix" value-list={{ValueSource}}>',
				'<div class="w-option">',
				'<span class="w-option-content actual-value" data-value="{{defaultValue}}" data-standard="{{standardValue}}" >{{defaultValueText}}</span>',
				'<div class="w-option-icon">',
				'<svg width="15px" height="26px" viewBox="0 0 15 26" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">',
				'<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="square">',
				'<g transform="translate(-510.000000, -341.000000)" stroke="#BDBDBD" stroke-width="2">',
				'<g transform="translate(517.500000, 354.000000) rotate(-360.000000) translate(-517.500000, -354.000000) translate(510.000000, 341.000000)">',
				'<path d="M13.6388889,13.7272727 L1.36111111,24.6363636"></path>',
				'<path d="M2.80555556,1.54545455 L13.6388889,13.9090909"></path>',
				'</g> </g> </g> </svg>',
				'</div> </div> </div> </div>',
            ].join(""),
            Number: [
				'<div class="m-c-panel" mode="n-input" >',
				'<div class="m-c-head">实际值 {{unit}}</div>',
				'<div class="m-c-body m-c-input clearfix">',
				'<input class="actual-value" type="number" placeholder="请输入实际值" value="{{defaultValue}}" ',
				'    data-type="{{standardType}}"  data-min="{{standardLeft}}"  data-max="{{standardRight}}"  data-standard="{{standardValue}}" ></input>',
				'</div> </div>',
            ].join(""),
            Check: [
				'<div class="m-c-panel " mode="n-select-checkbox" data-type="{{standardType}}"  style="{{display}}" >',
				'<div class="m-c-head">实际值{{unit}}</div>',
				'<div class="m-c-body m-c-ring clearfix" value-list={{ValueSource}}>',
				'<div class="w-option">',
				'<span class="w-option-content actual-value" data-value="{{defaultValue}}"   data-standard="{{standardValue}}" >{{defaultValueText}}</span>',
				'<div class="w-option-icon">',
				'<svg width="15px" height="26px" viewBox="0 0 15 26" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">',
				'<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="square">',
				'<g transform="translate(-510.000000, -341.000000)" stroke="#BDBDBD" stroke-width="2">',
				'<g transform="translate(517.500000, 354.000000) rotate(-360.000000) translate(-517.500000, -354.000000) translate(510.000000, 341.000000)">',
				'<path d="M13.6388889,13.7272727 L1.36111111,24.6363636"></path>',
				'<path d="M2.80555556,1.54545455 L13.6388889,13.9090909"></path>',
				'</g> </g> </g> </svg>',
				'</div> </div> </div> </div>',
            ].join(""),
        },
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
        }
    };
    var current = {};
    PAGELIST = [];


    model = $com.Model.create({
        name: '工艺巡检',

        type: $com.Model.MAIN,

        data: {},

        configure: function () {
            this.run();
        },

        events: function () {

            $("#resultS").click(function () {
                $("#resultList").show();
            });
            $("body").delegate("#resultList #result_confirm", "click", function () {
                var $result = $("#resultList ul li input:checked"),
					status = Number($result.attr("data-value"));

                model._data.Result = status;
                $("#resultS").attr("class", COLOUR[status])
                $("#resultS").html(STATUS[status]);
                $("#resultList").hide();

            });


            $("body").delegate("#confirm", "click", function () {
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
					standard = $self.find(".w-option-content").attr("data-standard"),
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


                    if (standard) {

                        var $badReason = $self.closest(".m-c-panel[mode=n-select-radio]").next(".m-c-panel[mode=n-select-checkbox][data-type=12]");

                        if (_v.indexOf(standard) >= 0) {
                            $result.attr("data-value", 1);
                            $result.text("合格");

                            if ($badReason[0]) {
                                $badReason.hide();
                            }

                        } else {
                            $result.attr("data-value", 2);
                            $result.text("不合格");

                            if ($badReason[0]) {
                                $badReason.show();
                            }
                        }
                    }

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

            $(".m-card").delegate(".list-group-item:not(.stop-expand)", "click", function (e) {
                var $this = $(this),
					$expand = $this.find(".item-icon .icon"),
					//里面是否已经有表单
					IDs = $this.attr("data-id");
                if ($expand.hasClass("icon-arrow-expand")) {
                    $expand.removeClass("icon-arrow-expand");

                    var $Result = $this.siblings().find(".m-c-body .w-option-content.actual-result");

                    var result = Number($Result.attr("data-value"));

                    $this.find("span.item-state").html(STATUS[result]);
                    $this.find("span.item-state").attr("class", "item-state " + COLOUR[result]);

                    $this.siblings().hide(); //ul元素消失
                } else {

                    $expand.addClass("icon-arrow-expand");
                    $this.siblings().show(); //ul显示

                }

                e.stopPropagation(); //阻止事件冒泡
                e.preventDefault(); //preventDefault() 方法阻止元素发生默认的行为
            });

            $("body").delegate(".m-c-panel[mode=n-input] input.actual-value", "input", function (e) {
                var $self = $(this),
					type = Number($self.attr("data-type")),
					min = Number($self.attr("data-min")),
					max = Number($self.attr("data-max")),
					standard = $self.attr("data-standard"),
					$group_item = $self.closest(".list-group-item"),
					$result = $group_item.find(".actual-result"),
					value = Number($self.val()),
					resultValue = true;

                switch (type) {
                    case 2:
                        resultValue = value > min && min < max;
                        break;
                    case 3:
                        resultValue = value >= min && min <= max;
                        break;
                    case 4:
                        resultValue = value > min && min <= max;
                        break;
                    case 5:
                        resultValue = value >= min && min < max;
                        break;
                    case 6:
                        resultValue = value < max;
                        break;
                    case 7:
                        resultValue = value > min;
                        break;
                    case 8:
                        resultValue = value <= max;
                        break;
                    case 9:
                        resultValue = value >= min;
                        break;
                    case 10:
                        resultValue = value == max;
                        break;
                    case 0:
                    case 1:
                    default:
                        break;
                }
                if (resultValue) {
                    $result.attr("data-value", 1);
                    $result.text("合格");
                } else {
                    $result.attr("data-value", 2);
                    $result.text("不合格");
                }
            });


        },

        run: function () {
            //工序任务ID
            WID = model.query.id;
            model.data = {};
            model.IPTValue = [];

            if (model.query.no) {
                model.com.get({
                    EventID: window._eventID ? window._eventID : 3001,
                    ID: model.query.id,
                }, function (data) {
                    model.com.render(data.info);
                    model.com.rederItemList(data);
                });
            } else {
                if (!window.JSImpl) {
                    model.com.get({
                        EventID: 2003,
                        TaskStepID: model.query.id,
                        StationID: 1,
                    }, function (data) {
                        model.com.render(data.info);
                        model.com.rederItemList(data);
                    });
                } else {
                    model.com.get({
                        EventID: 2003,
                        TaskStepID: model.query.id,
                        StationID: model.query.GwID,
                    }, function (data) {
                        model.com.render(data.info);
                        model.com.rederItemList(data);
                    });
                }
               
            }

        },

        com: {
            get: function (data, fn, context) {
                var d = {
                    $URI: "/SFCTaskIPT/Info",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },


            render: function (data) {
                data.ActiveTimeText = $com.util.format("yyyy-MM-dd hh:mm:ss", data.ActiveTime);
                model._data = data;

                $("#GoodFQTY").val(data.FQTYGood);
                $("#BadFQTY").val(data.FQTYBad);

                $("#resultS").html(STATUS[data.result]);
                $("#resultS").addClass(COLOUR[data.result]);

                $(".m-table").html($com.util.template(data, HTML.TITLE));
            },


            save: function (data, fn, context) {
                var d = {
                    $URI: "/SFCTaskIPT/Update",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            rederItemList: function (data) {

                if (!data.standard || data.standard.ID <= 0 || !data.standard.ItemList)
                    return false;

                var list = [],
                	htmlTemp = HTML.ITEM.Text,
                	_value = model.com.rederValueList(data.list);


                model._list = data.list && list.length > 0 ? data.list : [];
                wlist = [];
                $.each(data.standard.ItemList, function (i, item) {

                    if (!item.Visiable)
                        return true;
                    //item.standard = item.standard.replace("<", "&lt;");

                    //item.standard = item.standard.replace(">", "&gt;");

                    var iptValue = {
                        ID: 0,
                        IPTItemID: item.ID,
                        StandardID: data.standard.ID,
                        Value: "",
                        Remark: "",
                        Result: 1,
                    },


                    _item = {
                        ID: item.ID,
                        Text: item.Text,
                        Standard: item.Standard,
                        resultText: STATUS[0],
                        resultColor: COLOUR[0],
                        Remark: _value[item.ID] ? _value[item.ID].Remark : "",
                        Result: _value[item.ID] ? _value[item.ID].Result : 1,
                        //resultText : STATUS[_value[item.ID] ? _value[item.ID].Result : 1],
                        //resultColor : COLOUR[_value[item.ID] ? _value[item.ID].Result : 1],
                        ItemControl: {
                            unit: item.Unit,
                            //defaultValue: item.DefaultValue,
                            defaultValueText: item.DefaultValue && item.DefaultValue.length > 0 ? item.DefaultValue : "请选择",
                            standardValue: item.StandardValue,
                            ValueSource: model.com.changesourceString(item.ValueSource),
                            standardType: item.StandardType,
                            //display: (_value[item.iD] ? _value[item.iD].result : 1) == 2 ? "display:none;" : "",
                            standardLeft: item.StandardLeft,
                            standardRight: item.StandardRight
                        }
                    };
                    if (!_value[item.ID] || _value[item.ID].ID <= 0) {
                        model._list.push(iptValue);
                    }

                    switch (item.StandardType) {
                        case 0:
                            htmlTemp = HTML.ITEM.Text;
                            break;
                        case 1:
                            htmlTemp = HTML.ITEM.Combo;
                            break;
                        case 2:
                        case 3:
                        case 4:
                        case 5:
                        case 6:
                        case 7:
                        case 8:
                        case 9:
                        case 10:
                            htmlTemp = HTML.ITEM.Number;
                            break;
                        case 11:
                            htmlTemp = HTML.ITEM.Check;
                            break;
                        case 12:
                            htmlTemp = HTML.ITEM.Check;
                            break;
                        default:
                            htmlTemp = HTML.ITEM.Text;
                            break;
                    }
                    _item.ITEMControl = $com.util.template(_item.ItemControl, htmlTemp);

                    wlist.push(_item);
                });

                $(".handle-info .list-group").html($com.util.template(wlist, HTML.SUB_LIST));

            },
            rederValueList: function (list) {
                var _data = {};
                if (!list || list.length < 1)
                    return _data;

                $.each(list, function (i, item) {
                    _data[item.IPTItemID] = item;
                });
                return _data;
            },

            changesourceString: function (source) {
                var ValueSource = "",
					sourceArray = [];
                if (!source || source.length < 1)
                    return ValueSource;
                $.each(source, function (i, item) {
                    sourceArray.push(item + "]=[]=[" + item);
                });
                ValueSource = sourceArray.join("],[");
                return ValueSource;
            },
            //提交
            addCheck: function () {
                if (IsSubmit)
                    return false;

                var data = {
                    result: model._list,
                    data: model._data,
                },
					goodParts = 0,
					badParts = 0;
                if ($("#Bog")[0]) {
                    if ("hide" != $("#Bog").attr("data-visiable")) {
                        goodParts = $("#GoodFQTY").val();
                        badParts = $("#BadFQTY").val();
                        if ((badParts + goodParts) <= 0) {
                            alert("检查总数需大于0");
                            return;
                        }
                    }
                }
                data.result = model.com.getItemValueList();

                if (!data.result && !confirm("未获取到表单数据,是否继续提交？")) {
                    return;
                }

                for (var i = 0; i < data.result.length; i++) {
                    if (data.result[i].Result == 0)
                        data.result[i].Result = 1;
                }

                data.data.FQTYGood = goodParts;

                data.data.FQTYBad = badParts;


      
                confirm("确认提交吗？", function (bool) {
                    if (bool == true) {
                        data.data.Status = 2;
                        if (data.data.Result == 1) {
                            data.data.Result = true;
                        } else {
                            data.data.Result = false;
                        }
                        model.com.save(data, function (res) {
                            IsSubmit = false;
                            alert("提交成功");
                            window.location = "detail.html?id=" + res.info.ID + "&wID=" + WID;
                        });
                    } else {
                        return false;
                    }
                });

            },

            getItemValueList: function () {
                if (!model._list || model._list.length < 1)
                    return [];
                $(".handle-info .list-group  li.list-li").each(function (i_li, item_li) {
                    var $li = $(item_li),
						$group = $li.children(".list-group-item"),
						$Subgroup = $li.children(".list-group-sub"),
						ID = $group.attr("data-id"),
						$Result = $Subgroup.find(".actual-result"),
						$Remark = $Subgroup.find(".actual-remark"),
						$Combovalue = $Subgroup.find("span.w-option-content.actual-value"),
						$Inputvalue = $Subgroup.find("input.actual-value"),
						Result = Number($Result.attr("data-value")),

						Remark = $Remark.val(),
						Value = "";
                    if ($Combovalue[0]) {
                        Value = $Combovalue.attr("data-value");
                    } else if ($Inputvalue[0]) {
                        Value = $Inputvalue.val();
                    }
                    $.each(model._list, function (i, item) {
                        if (item.IPTItemID != ID)
                            return true;
                        item.Remark = Remark,
						item.Value = Value;
                        item.Result = Result;

                        return false;
                    });
                });
                return model._list;
            },
        }
    });

    model.init();

});
//# sourceMappingURL=maps/detail-0d4b39aba7.js.map