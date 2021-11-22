require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {


	//需要引用bootstrap的就添加一个url:'../static/utils/js/base/bootstrap' 参数 BS  然后先执行BS();
	//需要用动态表单的添加 '../static/utils/js/base/entry' 参数	 iForm 

	var model,
		HTML,
		STATUS,
		COLOUR,
		KEYWORD,
		KEYWORD_LIST,
		PRODUCT,
		TASK_STATUS;

	STATUS = [ "未知", "保存", "下达", "开工", "完工", "终止", "暂停" ];
	PRODUCT = [ "未知", "内圈", "外圈", "装配", "钢球", "保持架", "密封圈" ];
	COLOUR = [ "text-grey", "text-grey", "text-yellow", "text-blue", "text-green", "text-grey", "text-red" ];
	TASK_STATUS = [ "未知", "保存", "下达", "开工", "完工", "终止", "暂停" ];
	HTML = {
		LIST : [ '<li>',
			'<label class="m-detail-title">{{name}}</label>',
			'<div class="m-detail-content">{{value}}</div>',
			'</li>' ].join(""),
		ITEM : [ '<div class="ms-group clearfix" data-id="{{ID}}">',
			'<div class="ms-col ms-col-f"><div class="ms-limit">',
			'<div class="ms-title"><span class="ms-field femi-rt">',
			'<span class="ms-text ms-margin">{{StartTimeText}}</span>',
			'<span class="ms-text">{{WorkShopName}}</span>',
			'<span class="ms-text">{{LineName}}</span>',
			'</span> <span>{{PartName}}</span></div>',
			'<div class="ms-sub-title">', 
			'<span class="ms-field">',
			'<span class="ms-label">计划数:</span><span class="ms-text">{{FQTYShift}}</span>',
			'</span>',
			'<span class="ms-field">',
			'<span class="ms-label">完成数:</span><span class="ms-text">{{FQTYDone}}</span>',
			'</span>',
			'<span class="ms-field">',
			'<span class="ms-label">操作员：</span><span class="ms-text">{{OperatorName}}</span>',
			'</span>',
			'</div>',
			'</div></div>',
			'<div class="ms-col ms-col-l">',
			'<span class="ms-status {{Color}}">{{StatusText}}</span>',
			'</div>',
			'</div>' ].join("")
	};

	KEYWORD_LIST = [
		"WorkShopName|车间",
		"LineName|产线",
		"PartName|工序段",
		"OrderNo|订单号", 
		"MaterialName|物料名称",
		"MaterialNo|物料编号",
		"ProductNo|产品编号",
		"FQTYDone|完成数",
		"FQTYTotal|计划数",
		"StartTimeText|开始时间|DateTime",
		"EndTimeText|结束时间|DateTime"
	];

	KEYWORD = {};
	$.each(KEYWORD_LIST, function(i, item) {
		var detail = item.split("|");
		KEYWORD[detail[0]] = {
			index : i,
			name : detail[1],
			type : detail.length > 2 ? detail[2] : undefined
		};
	});


	model = $com.Model.create({
		name : 'iPlantApp',

		type : $com.Model.MAIN,

		configure : function() {
			this.run();
		},

		events : function() {
			$("body").delegate(".ms-group", "click", function() {
				var $this = $(this),
					id = $this.attr("data-id");
				window.location = "detail.html?tid=" + id + "&id=" + model.query.id;

				
			});
		},

		run : function() {
			this.com.get({
				id : model.query.id
			}, function(data) {
				model.com.render(model.com.filter(data.info));
			});

			this.com.getItem({
				id : model.query.id
			}, function(data) {
				model._employees=data.info;
				model.com.renderItem(model.com.filterItem(data.list));
			});
		},

		com : {
			getItem : function(data, fn, context) {
				var d = {
					$URI : "/RealOrder/TaskAll",
					$TYPE : "get"
				};

				function err() {
					$com.app.tip('获取失败，请检查网络');1
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},
			get : function(data, fn, context) {
				var d = {
					$URI : "/RealOrder/Info",
					$TYPE : "get"
				};

				function err() {
					$com.app.tip('提交失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},


			filter : function(data) {
				var _data = [],
					_status = "";

				data.StartTimeText = $com.util.format("yyyy-MM-dd hh:mm", data.StartTime);
				data.EndTimeText = $com.util.format("yyyy-MM-dd hh:mm", data.EndTime); 
				_status = STATUS[data.status];

				for (var p in data) {
					var o = KEYWORD[p];
					if (o) {
						_data[Number(o.index)] = {
							name : o.name,
							value : data[p] === "" ? "&nbsp;" : data[p]
						};
					}
				}


				return {
					data : _data,
					status : _status
				};
			},


			filterItem : function(data) {
			 

				$.each(data, function(i, item) {
					item.StartTimeText = $com.util.format("yyyy-MM-dd hh:mm", item.StartTime);
					item.EndTimeText = $com.util.format("yyyy-MM-dd hh:mm", item.EndTime);
					item.StatusText = TASK_STATUS[item.status];
					item.Color=COLOUR[item.status];
					item.OperatorName=model._employees[item.OperatorID];
				});

				return data;
			},

			render : function(data) {
				$(".m-detail-list").html($com.util.template(data.data, HTML.LIST));
				$(".tip-content").html(data.status);
			},
			renderItem : function(data) {
				$(".m-table").html($com.util.template(data, HTML.ITEM));
			}
		}
	});

	model.init();
});
//# sourceMappingURL=maps/list-565942f460.js.map