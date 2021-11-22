require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {


	var model,
		HTML,
		config,
		current,
		STATUS,
		COLOUR,
		KEYWORD,
		KEYWORD_LIST,
		STATUS_Item,
		COLOUR_Item;

	current = "Status_Sent";

	STATUS = [ "未完成", "已完成" ];
	STATUS_Item = [ "待送料", "待领料", "已领料" ];
	COLOUR_Item = [ "text-yellow", "text-blue", "text-grey" ];

	HTML = {
		LIST : [ '<li>',
			'<label class="m-detail-title">{{name}}</label>',
			'<div class="m-detail-content">{{value}}</div>',
			'</li>' ].join(""),
		LIST2 : [ '<div class="ms-group clearfix" data-id="{{Id}}" data-check="{{Check}}">',
			'<div class="ms-col ms-col-f"><div class="ms-limit">',
			'<div class="ms-title">',
			'<span class="ms-field femi-rt"> ',
			'<span class="ms-text ms-margin">{{Time}}</span>',
			'</span> <span>{{Name}}</span></div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field"> <span class="ms-label"></span>',
			'<span class="ms-text">{{User}}</span>',
			'</span> <span class="ms-field"> <span class="ms-label">配料数:</span>',
			'<span class="ms-text">{{FQTYPL}}</span>',
			'</span> <span class="ms-field"> <span class="ms-label">物料号:</span>',
			'<span class="ms-text">{{MaterialNo}}</span>',
			'</span>',
			'</div>',
			'</div></div>',
			'<div class="ms-col ms-col-l">',
			'<span class="ms-status {{Color}}">{{Status}}</span>',
			'</div>',
			'</div>' ].join("")
	};

	KEYWORD_LIST = [
		"OrderID|订单编号",
		"WorkShopName|车间",
		"LineName|产线",
		"PartName|工序段",
		"PartPointName|工序",
		"DeviceNo|设备",
		"MaterialNo|物料号",
		"MaterialName|物料名称",
		"TaskName|圈别",
		"ProductNo|产品规格",
		"FQTYPlan|计划数",
		"FQTYBase|仓位计划数",
		"FQTYPL|已配料数",
		"FQTYMargin|剩余数",
		"FQTYOnsite|在线库存",
		"PLOperatorName|配料员",
		"LLOperatorName|领料员",
	];

	KEYWORD = {};

	model = $com.Model.create({
		name : 'iPlantApp',

		type : $com.Model.MAIN,

		configure : function() {
			this.run();

			KEYWORD_LIST.forEach(function(item, i) {
				var detail = item.split("|");
				KEYWORD[detail[0]] = {
					index : i,
					name : detail[1]
				};
			});
		},

		events : function() {

			$("#confirm").click(function() {
				if (model._data.FQTYMargin > 0)
					window.location = "order.html?id=" + model.query.id;
				else
					alert("配料任务已完成，无须再配料！");
			});

			$("body").delegate(".ms-group", "click", function() {
				var $this = $(this),
					id = $this.attr("data-id");

				window.location = "detail.html?id=" + id;
			});
		},

		run : function() {
			this.com.get({
				task_id : model.query.id
			}, function(data) {
				model.com.render(model.com.filter(data.info));

			});
			this.com.getItems({
				task_id : model.query.id
			}, function(data) {
				model.com.renderItems(model.com.filterItems(data.list));

			});
		},

		com : {
			get : function(data, fn, context) {
				var d = {
					$URI : "/MaterialTask/Info",
					$TYPE : "get"
				};

				function err() {
					$com.app.tip('获取失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},
			getItems : function(data, fn, context) {
				var d = {
					$URI : "/MaterialTask/InfoItems",
					$TYPE : "get"
				};

				function err() {
					$com.app.tip('获取失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},

			filter : function(data) {
				model._data = data;
				var _data = [],
					_status = "";
				if (data.MaterialMode == 1 || data.MaterialMode == "1") {
					model._Type = 1;
				} else {
					model._Type = 0;
				}

				for (var p in data) {
					var o = KEYWORD[p];
					if (o) {
						_data[Number(o.index)] = {
							name : o.name,
							value : data[p] === "" ? "&nbsp;" : data[p]
						};
					}
				}
				data.Status = data.FQTYMargin > 0 ? 0 : 1;
				_status = STATUS[data.Status];


				if (data.Status)
					$("#confirm").hide();

				return {
					data : _data,
					Status : _status
				};
			},

			filterItems : function(data) {
				var _list = [];
				$.each(data, function() {
					_list.push({
						Name : this.MaterialName,
						MaterialNo : this.MaterialNo,
						User : this.PLOperatorName ? this.PLOperatorName : this.PLOperatorID,
						FQTYPL : this.FQTYPL,
						Time : $com.util.format("yyyy-MM-dd hh:mm:ss", this.PLTime),
						Id : this.ID,
						Status : STATUS_Item[this.Status],
						Color : COLOUR_Item[this.Status]
					});
				});


				return _list;
			},

			render : function(data) {
				$(".m-detail-list").html($com.util.template(data.data, HTML.LIST));
				$(".tip-content").html(data.Status);
			},
			renderItems : function(data) {

				$(".m-table").html($com.util.template(data, HTML.LIST2));

			}
		}
	});

	model.init();

});
//# sourceMappingURL=maps/info-23f05f92e1.js.map