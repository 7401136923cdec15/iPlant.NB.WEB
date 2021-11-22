require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'], function ($yang, $com) {


    var model,
		HTML,
		STATUS,
		COLOUR,
        wID,
        list,
        wApply,
		IsSubmit;

    IsSubmit = false;

    STATUS = ["合格", "合格", "不合格"];

    COLOUR = ["text-yellow", "text-blue", "text-red"];

    var default_id = "";

    HTML = {
        TITLE: ['<div class="ms-group clearfix" data-id="{{ID}}" data-apply="{{ApplyID}}" data-statustext="{{StatusText}}"  data-status="{{Status}}">',
				'<div class="ms-col ms-col-f" >',
			'<div class="ms-limit" >',
            '<div class="ms-title">',
			'<span class="ms-field femi-rt"> ',
			'</span> <span>{{LedgerCode}}</span>',
			'</div>',
			'<div class="ms-sub-title">',
			//'<span class="ms-field"><span class="ms-label">型号:</span>',
			//'<span class="ms-text">{{ModelNo}}</span></span>',
            '<span class="ms-field"><span class="ms-label">产线:</span>',
			'<span class="ms-text">{{LineName}}</span></span>',
            '<span class="ms-field"><span class="ms-label">车间:</span>',
			'<span class="ms-text">{{WorkShopName}}</span></span>',
			'</span>',
			'</div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field"><span class="ms-label">[备件]</span><span class="ms-label">类型:</span>',
			'<span class="ms-text">{{TypeName}}</span></span>',
			'<span class="ms-field"><span class="ms-label">人员:</span>',
			'<span class="ms-text">{{OperatorName}}</span> </span>',
			'</div>',
            '<div class="ms-sub-title">',
            '<span class="ms-field"><span class="ms-label">开始时刻:</span>',
            '<span class="ms-text">{{StartTime}}</span></span>',
            '</span>',
            '</div>',
			'</div>',
			'</div>',
			'<div class="ms-col ms-col-l">',
			'<span class="ms-status {{Color}}">{{StatusText}}</span>',
			'</div>',
			'</div>'].join(""),

        SUB_LIST: ['<li class="list-li">',
			'<div class="list-group-item"  data-id="{{ID}}">',
			'<div class="list-group-item-cell item-static item-title"  style="width:30%">',
			'<span>{{Name}}</span>',
			'</div>',
			'<div class="list-group-item-cell item-static item-time" style="width:50%">',
			'<span>{{Comment}}</span>',
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
			'<div class="m-c-head">维修项结果</div>',
			'<div class="m-c-body m-c-ring clearfix" value-list="1]=[]=[合格],[2]=[]=[不合格">',
			'<div class="w-option">',
			'<span class="w-option-content actual-result" data-value="{{Result}}">{{resultText}}</span>',
			'<div class="w-option-icon">',
			'<svg width="15px" height="26px" viewBox="0 0 15 26" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">',
			'<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="square">',
			'<g transform="translate(-510.000000, -341.000000)" stroke="#BDBDBD" stroke-width="2">',
			'<g transform="translate(517.500000, 354.000000) rotate(-360.000000) translate(-517.500000, -354.000000) translate(510.000000, 341.000000)">',
			'<path d="M13.6388889,13.7272727 L1.36111111,24.6363636"></path>',
			'<path d="M2.80555556,1.54545455 L13.6388889,13.9090909"></path></g></g></g>',
			'</svg></div> </div></div></div>',

            '<div class="m-c-panel" mode="n-select-radio">',
			'<div class="m-c-head">任务类型</div>',
			'<div class="m-c-body m-c-ring clearfix" value-list="1]=[]=[保养],[2]=[]=[维修],[3]=[]=[点检">',
			'<div class="w-option">',
			'<span class="w-option-content actual-tasktype" data-value="{{TaskType}}">{{TaskTypeText}}</span>',
			'<div class="w-option-icon">',
			'<svg width="15px" height="26px" viewBox="0 0 15 26" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">',
			'<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="square">',
			'<g transform="translate(-510.000000, -341.000000)" stroke="#BDBDBD" stroke-width="2">',
			'<g transform="translate(517.500000, 354.000000) rotate(-360.000000) translate(-517.500000, -354.000000) translate(510.000000, 341.000000)">',
			'<path d="M13.6388889,13.7272727 L1.36111111,24.6363636"></path>',
			'<path d="M2.80555556,1.54545455 L13.6388889,13.9090909"></path></g></g></g>',
			'</svg></div> </div></div></div>',

            '<div class="m-c-panel" mode="n-select-radio">',
			'<div class="m-c-head">任务来源</div>',
			'<div class="m-c-body m-c-ring clearfix" value-list="1]=[]=[DMS],[2]=[]=[MES">',
			'<div class="w-option">',
			'<span class="w-option-content actual-resource" data-value="{{Resource}}">{{ResourceText}}</span>',
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
			'<div class="m-c-head">结果备注</div>',
			'<div class="m-c-body m-c-input clearfix ">',
			'<textarea rows="2" placeholder="请填写维修项备注" class="actual-remark">{{JgComment}}</textarea>',
			'</div></div>',
			'</div>', //填表单

    
			'</li>'].join(""),

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
            },
        }
    };
    var current = {};
    PAGELIST = [];


    model = $com.Model.create({
        name: '填写维修结果',

        type: $com.Model.MAIN,

        data: {},

        configure: function () {
            this.run();
        },

        events: function () {

            $("body").delegate("#confirm", "click", function () {
                model.com.addCheck();
            });
            //split将一个字符串分割成字符串数组
            function split2Object(d) {
                var arr = [],
					data = d.split("],["),
					i = -1,
					len = data.length;
                //++i先加再计算
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
                    //unbind函数用于移除匹配元素上绑定的一个或多个事件的事件处理函数。
                    $(this).unbind("click");
                    $box.remove();
                    //移除$box这个元素
                });

                $box.find(".close").on("click", function () {
                    //off(),移除confirm上所有click方法
                    $box.find(".confirm").off("click");
                    $(this).off("click");
                    $box.remove();
                });

                // 弹出层隐藏
                $(".bindOne").on("click", function (e) {
                    //e.target,触发该事件的Dom元素
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
                        //closest() 方法返回被选元素的第一个祖先元素,(Check模块 n-select-checkbox data-type="{{standardType}})
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
                        //text-darkgrey2为css中的样式
						.addClass("text-darkgrey2");

                    $(this).unbind("click");
                    $box.remove();
                });

                $box.find(".close").on("click", function () {
                    $box.find(".confirm").off("click");
                    $(this).off("click");
                    $box.remove();
                });

                // 弹出层隐藏 （unbind移除事件处理函数 off(),移除该元素上所有click方法）
                $(".bindOne").on("click", function (e) {
                    var tar = $(e.target);

                    if (tar.hasClass("multi-select")) {
                        $box.find(".confirm").unbind("click");
                        tar.parent().remove();
                        $(this).off("click");
                    }
                });
            })
            //:not(selector)选择除stop-expand外其他所有选择器
            $(".m-card").delegate(".list-group-item:not(.stop-expand)", "click", function (e) {
                var $this = $(this),
					$expand = $this.find(".item-icon .icon"),
					//里面是否已经有表单
					IDs = $this.attr("data-id");
                //icon-arrow-expand这个选择器在Css中(transform: rotate(90deg);旋转90度)
                if ($expand.hasClass("icon-arrow-expand")) {
                    $expand.removeClass("icon-arrow-expand");
                    //siblings找同级元素
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
            model.data = {};
            model.IPTValue = [];
           
            wID =Number(model.query.id);
            wApply = model.query.aID;
            model.com.get({
                ID: model.query.id,
                ApplyID: model.query.aID,
                HasName: 1,
            }, function (data) {
                list = data.info;
                model.com.render(data.info);
                model.com.rederItemList(data);
            });
      
        },

        com: {
            get: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceRepairTask/Info",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },


            render: function (data) {

                model._data = data;
                data.StatusText = "执行中";
                data.Color = "text-yellow";
                $(".m-table").html($com.util.template(data, HTML.TITLE));
            },


            save: function (data, fn, context) {
                var d = {
                    $URI: "/DeviceRepairTask/Update",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            rederItemList: function (data) {
                var wlist = [];
                var wValue = [];
                model._list = data.result && data.result.length > 0 ? data.result : [];
                $.each(data.list, function (i, item) {
                    var iptValue = {
                        ID: 0,
                        ItemID: item.ID,
                        TaskID: wID,
                        TaskType: 0,
                        Comment: "",
                        Reason: [],
                        EditTime: $com.util.format("yyyy-MM-dd hh:mm:ss", new Date()),
                        ImageList: [],
                        Resource: 0,
                        Result: true,
                    };
                    wValue.push(iptValue);

                    _item = {
                        ID:item.ID,
                        Name: item.Name,
                        Comment: item.Comment,
                        resultText: STATUS[0],
                        resultColor: COLOUR[0],
                    }
                    wlist.push(_item);
                  
                })

                if (model._list <= 0) {
                    model._list = wValue;
                };

                $(".handle-info .list-group").html($com.util.template(wlist, HTML.SUB_LIST));

            },          
           
            //提交
            addCheck: function () {
                if (IsSubmit)
                    return false;

                var data = {
                    result: model._list,
                    data: model._data,
                }
              
                data.result = model.com.getItemValueList();

                if (!data.result && !confirm("未获取到表单数据,是否继续提交？")) {
                    return;
                }
               
                confirm("确认提交吗？", function (bool) {
                    if (bool == true) {
                        var Value = $("#count").val();
                        if (Value == "") {
                            alert("请填写备注！");
                            return false;
                        } else {
                            list.Comment = Value;
                        }
                        if(data.data.Status ==2){
                        data.data.Status = 3;
                        }
                        model.com.save(data, function (res) {
                            IsSubmit = false;
                            alert("提交成功");
                            window.location = "detail_cl_bj.html?id=" + res.info.ID + "&aID=" + wApply + "&statustext=" + "待确认" ;
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
						ID =Number($group.attr("data-id")),
						$Result = $Subgroup.find(".actual-result"),
						$JgComment = $Subgroup.find(".actual-remark"),
                        $TaskType = $Subgroup.find(".actual-tasktype"),
                        $Resource = $Subgroup.find(".actual-resource"),
						//$Inputvalue = $Subgroup.find("input.actual-value"),
						Result = Number($Result.attr("data-value")),
                        TaskType = Number($TaskType.attr("data-value")),
                        Resource = Number($Resource.attr("data-value")),

						JgComment = $JgComment.val();

                    $.each(model._list, function (i, item) {
                        if (item.ItemID != ID)
                            return true;
                        item.Comment = JgComment;
                        item.TaskType = TaskType;
                        item.Resource = Resource;
                        if (Result == 1) {
                            item.Result = true;
                        } else {
                            item.Result = false;
                        }
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