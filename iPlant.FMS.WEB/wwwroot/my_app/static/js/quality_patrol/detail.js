require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/entry'], function ($yang, $com, iForm) {

    var model,
		HTML,
		STATUS,
		COLOUR,
		formModel,
         wlist,
        Slist,
		PAGELIST;

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
         //'<div class="m-c-panel" mode="n-input" >',
         //'<div class="m-c-head">巡检项结果</div>',
         //'<div class="m-c-body m-c-input clearfix">',
         //'<input class="actual-result text-darkgrey2" type="text"   readonly="readonly" data-value="{{result}}" value="{{resultText}}" ></input>',
         //'</div> </div>',
         '<div class="m-c-panel" mode="n-input" >',
         '<div class="m-c-head">实际值 {{unit}}</div>',
         '<div class="m-c-body m-c-input clearfix">',
         '<input class="actual-value" type="text" placeholder="" readonly="readonly" value="{{defalutValue}}" ></input>',
         '</div> </div>',
         '<div class="m-c-panel">',
         '<div class="m-c-head">备注</div>',
         '<div class="m-c-body m-c-input clearfix ">',
         '<textarea rows="3" placeholder="" readonly="readonly" class="actual-remark">{{remark}}</textarea>',
         '</div></div>',
         '</div>', //填表单
         '</li>'].join(""),
        ITEM: {
            Text: [
				'<div class="m-c-panel" mode="n-input" >',
				'<div class="m-c-head">实际值 {{unit}}</div>',
				'<div class="m-c-body m-c-input clearfix">',
				'<input class="actual-value" type="text" placeholder="" value="{{defaultValue}}" ></input>',
				'</div> </div>',
            ].join(""),
            Combo: [
				'<div class="m-c-panel" mode="n-select-radio">',
				'<div class="m-c-head">实际值{{unit}}</div>',
				'<div class="m-c-body m-c-ring clearfix" value-list={{sourceString}}>',
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
				'<input class="actual-value" type="number" placeholder="" value="{{defaultValue}}" ',
				'    data-type="{{standardType}}"  data-min="{{standardLeft}}"  data-max="{{standardRight}}"  data-standard="{{standardValue}}" ></input>',
				'</div> </div>',
            ].join(""),
            Check: [
				'<div class="m-c-panel " mode="n-select-checkbox" data-type="{{standardType}}"  style="{{display}}" >',
				'<div class="m-c-head">实际值{{unit}}</div>',
				'<div class="m-c-body m-c-ring clearfix" value-list={{sourceString}}>',
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
    };


    var current = {};
    PAGELIST = [];


    model = $com.Model.create({
        name: '质量巡检',

        type: $com.Model.MAIN,

        data: {},

        configure: function () {
            this.run();
        },

        events: function () {


            $(".m-card").delegate(".list-group-item:not(.stop-expand)", "click", function (e) {
                var $this = $(this),
					$expand = $this.find(".item-icon .icon"),
					//里面是否已经有表单
					IDs = $this.attr("data-id");
                if ($expand.hasClass("icon-arrow-expand")) {
                    $expand.removeClass("icon-arrow-expand");

                    $this.siblings().hide(); //ul元素消失
                } else {

                    $expand.addClass("icon-arrow-expand");
                    $this.siblings().show(); //ul显示 
                }

                e.stopPropagation(); //阻止事件冒泡
                e.preventDefault(); //preventDefault() 方法阻止元素发生默认的行为
            });


        },

        run: function () {

            model.com.get({
                EventID: window._eventID ? window._eventID : 2003,
                ID: model.query.id,
            }, function (data) {
                Slist = data.list;
                if (data.info.Result == false) {
                    $("#resultS").html("不合格");
                    $("#resultS").addClass(COLOUR[2]);
                } else {
                    $("#resultS").html("合格");
                    $("#resultS").addClass(COLOUR[1]);
                }
                model.com.render(data.info);
                model.com.rederItemList(data);
            });

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
                data.SubmitTimeText = $com.util.format("yyyy-MM-dd hh:mm:ss", data.SubmitTime);
                model._data = data;

                $("#GoodFQTY").val(data.FQTYGood);
                $("#BadFQTY").val(data.FQTYBad);

                $("#resultS").html(STATUS[data.Result]);
                $("#resultS").addClass(COLOUR[data.Result]);
                if (data.Status == 1) {
                    data.StatusText = "激活";
                    data.Color = "text-blue";
                };
                $(".m-table").html($com.util.template(data, HTML.TITLE));
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

                    //var iptValue = {
                    //    ID: 0,
                    //    IPTItemID: item.ID,
                    //    StandardID: data.standard.ID,
                    //    Value: "",
                    //    Remark: "",
                    //    Result: 1,
                    //},


                    _item = {
                        ID: item.ID,
                        Text: item.Text,
                        Standard: item.Standard,
                        remark: _value[item.ID] ? _value[item.ID].Remark : "",
                        result: _value[item.ID] ? _value[item.ID].Result : 1,
                        resultText: STATUS[_value[item.ID] ? _value[item.ID].Result : 1],
                        resultColor: COLOUR[_value[item.ID] ? _value[item.ID].Result : 1],
                        defalutValue: Slist[i].Value,
                        ItemControl: {
                            unit: item.Unit,
                            //defaultValue: item.DefaultValue,
                            defaultValueText: item.DefaultValue && item.DefaultValue.length > 0 ? item.DefaultValue : "请选择",
                            standardValue: item.StandardValue,
                            //sourceString : model.com.changeValueSource(item.valueSource),
                            standardType: item.StandardType,
                            //display: (_value[item.ID] ? _value[item.ID].Result : 1) == 2 ? "display:none;" : "",
                            standardLeft: item.StandardLeft,
                            standardRight: item.StandardRight
                        }
                    };
                    //if (!_value[item.ID] || _value[item.ID].ID <= 0) {
                    //    model._list.push(iptValue);
                    //}

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
        }
    });

    model.init();

}); //# sourceMappingURL=maps/detail-0d4b39aba7.js.map