require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/entry' ], function($yang, $com, iForm) {

	var model,
		HTML,
		STATUS,
		COLOUR,
		formModel,
		PAGELIST;

	STATUS = [ "未检", "合格", "不合格" ];
	COLOUR = [ "text-yellow", "text-blue", "text-red" ];

	var default_id = "";

	HTML = {
		TITLE : [
			'<div class="ms-group clearfix">',
			'<div class="ms-col ms-col-f" style="width: 100%;max-width: 100%;">',
			'<div class="ms-limit" style="width: 100%;max-width: 100% ">',
			'<div class="ms-title">',

			'<span class="ms-field femi-rt"> ',
			'<span class="ms-text ms-margin">{{workShopName}}</span>',
			'<span class="ms-text">{{lineName}}</span>',
			'</span> <span>{{partPointName}}{{times}}</span>',
			'</div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field"><span class="ms-label">设备:</span>',
			'<span class="ms-text">{{deviceNo}}</span></span> <span class="ms-field">',
			'<span class="ms-label">提交:</span> <span class="ms-text">{{submitTimeText}}</span>',
			'</span>',
			'</div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field">',
			'<span class="ms-text">{{partName}}</span></span>',
			'<span class="ms-field"><span class="ms-label">规格:</span>',
			'<span class="ms-text">{{productNo}}</span> </span>',
			'</div> ',
			'</div>',
			'</div></div>', ].join(""),

		SUB_LIST : [ '<li class="list-li">',
			'<div class="list-group-item"  data-id="{{iD}}">',
			'<div class="list-group-item-cell item-static item-title"  style="width:30%">',
			'<span>{{text}}</span>',
			'</div>',
			'<div class="list-group-item-cell item-static item-time" style="width:50%">',
			'<span>{{standard}}</span>',
			'</div>',
			'<div class="list-group-item-cell item-static item-state" style="width:15%">',
			'<span class="item-state {{resultColor}}">{{resultText}}</span>',
			'</div>',
			'<div class="list-group-item-cell item-icon" style="width:5%">',
			'<i class="icon icon-arrow-right"></i>',
			'</div>',
			'</div>',
			'<div class="list-group-sub">',
			'<div class="m-c-panel" mode="n-input" >',
			'<div class="m-c-head">巡检项结果</div>',
			'<div class="m-c-body m-c-input clearfix">',
			'<input class="actual-result text-darkgrey2" type="text"   readonly="readonly" data-value="{{result}}" value="{{resultText}}" ></input>',
			'</div> </div>',
			'<div class="m-c-panel" mode="n-input" >',
			'<div class="m-c-head">实际值 {{unit}}</div>',
			'<div class="m-c-body m-c-input clearfix">',
			'<input class="actual-value" type="text" placeholder="请输入实际值" readonly="readonly" value="{{defaultValue}}" ></input>',
			'</div> </div>',
			'<div class="m-c-panel">',
			'<div class="m-c-head">备注</div>',
			'<div class="m-c-body m-c-input clearfix ">',
			'<textarea rows="3" placeholder="请填写巡检项备注" readonly="readonly" class="actual-remark">{{remark}}</textarea>',
			'</div></div>',
			'</div>', //填表单
			'</li>' ].join(""),
	};


	var current = {};
	PAGELIST = [];


	model = $com.Model.create({
		name : 'iPlantApp',

		type : $com.Model.MAIN,

		data : {},

		configure : function() {
			this.run();
		},

		events : function() {


			$(".m-card").delegate(".list-group-item:not(.stop-expand)", "click", function(e) {
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

		run : function() {


			model.com.get({
				task_id : model.query.id,
			}, function(data) {
				model.com.render(data.info);

				model.com.rederItemList(data);
			});

		},

		com : {
			get : function(data, fn, context) {
				var d = {
					$URI : "/patrol_check/page",
					$TYPE : "get",
				};

				function err() {
					$com.app.tip('获取失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},
			render : function(data) {
				data.activeTimeText = $com.util.format("yyyy-MM-dd hh:mm:ss", data.activeTime);
				data.submitTimeText = $com.util.format("yyyy-MM-dd hh:mm:ss", data.submitTime);
				model._data = data;

				$("#GoodFQTY").val(data.goodParts);
				$("#BadFQTY").val(data.badParts);

				$("#resultS").html(STATUS[data.result]);
				$("#resultS").addClass(COLOUR[data.result]);
				$(".m-table").html($com.util.template(data, HTML.TITLE));
			},



			rederItemList : function(data) {

				if (!data.standard || data.standard.iD <= 0
					|| !data.standard.itemList || !data.standard.itemList.iPTItem)
					return false;

				var list = [],
					_value = model.com.rederValueList(data.list);

				$.each(data.standard.itemList.iPTItem, function(i, item) {
					if (!item.visiable)
						return true;

					item.standard = item.standard.replace("<", "&lt;");

					item.standard = item.standard.replace(">", "&gt;");
					var iptValue = {
							iD : 0,
							iPTItemID : item.iD,
							standardID : data.standard.iD,
							value : "",
							remark : "",
							result : 1
						},
						_item = {
							iD : item.iD,
							text : item.text,
							standard : item.standard,
							remark : _value[item.iD] ? _value[item.iD].remark : "",
							result : _value[item.iD] ? _value[item.iD].result : 1,
							resultText : STATUS[_value[item.iD] ? _value[item.iD].result : 1],
							resultColor : COLOUR[_value[item.iD] ? _value[item.iD].result : 1],
							unit : item.unit,
							defaultValue : item.defaultValue,
							standardValue : item.standardValue,
							standardType : item.standardType,
							standardLeft : item.standardLeft,
							standardRight : item.standardRight
						};

					list.push(_item);
				});



				$(".handle-info .list-group").html($com.util.template(list, HTML.SUB_LIST));

			},
			rederValueList : function(list) {
				var _data = {};
				if (!list || list.length < 1)
					return _data;

				$.each(list, function(i, item) {
					_data[item.iPTItemID] = item;
				});
				return _data;
			},
		}
	});

	model.init();

}); //# sourceMappingURL=maps/detail-0d4b39aba7.js.map