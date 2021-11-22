require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {


	var model,
		HTML,
		KEYWORD,
		KEYWORD_LIST,
		STATUS,
		COLOUR;



	STATUS = [ "送检中", "已收检", "已检验", "待收库", "已收库", "已入库", "已驳回", "待验收", "验收中" ];

	COLOUR = [ "text-yellow", "text-blue", "text-blue", "text-grey", "text-grey", "text-grey", "text-red", "text-yellow", "text-blue" ];

	HTML = {
		LIST : [ '<li>',
			'<label class="m-detail-title">{{name}}</label>',
			'<div class="m-detail-content">{{value}}</div>',
			'</li>' ].join(""),
		LIST2 : [ '<div class="ms-group clearfix" data-id="{{id}}" data-state="{{state}}">',
			'<div class="ms-col ms-col-f"><div class="ms-limit">',
			'<div class="ms-title"><span class="ms-field femi-rt">',
			'<span class="ms-text ms-margin">{{time}}</span>',
			'</span><span>{{name}}</span></div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field">',
			'<span class="ms-label">送检数:</span><span class="ms-text">{{c1}}</span>',
			'</span>',
			'<span class="ms-field">',
			'<span class="ms-label">合格数:</span><span class="ms-text">{{c2}}</span>',
			'</span>',
			'<span class="ms-field">',
			'<span class="ms-label">不合格数:</span><span class="ms-text">{{c3}}</span>',
			'</span>',
			'</div>',
			'</div></div>',
			'<div class="ms-col ms-col-l">',
			'<span class="ms-status {{color}}">{{status}}</span>',
			'</div>',
			'</div>' ].join(""),
	};

	KEYWORD_LIST = [
		"WorkShopName|车间",
		"LineName|产线",
		"OrderNo|订单号",
		"PartName|工序段",
		"PartPointName|工序",
		"TaskName|圈别",
		"DeviceNo|设备号",
		"MaterialNo|物料号",
		"MaterialName|物料名",
		"ProductNo|产品规格",
		"FQTYShift|计划数",
		"FQTYDone|完成数",
		"FQTYParts|设备采集数",
		"OperatorName|检验员"
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
			 

			$("body").delegate(".m-table .ms-group", "click", function() {
				var $this = $(this),
					id = $this.attr("data-id");

				window.location = "orderWriteDetail.html?id=" + id;

			});

		},

		run : function() {
			this.com.get({
				position :5002,
				task_id : model.query.id
			}, function(data) {
				model.com.render(model.com.filter(data.info));
			});
			this.com.getItems({
				position :5002,
				task_id : model.query.id
			}, function(data) {
				model.com.renderItems(model.com.filterItems(data.list));
			});
		},

		com : {
			get : function(data, fn, context) {
				var d = {
					$URI : "/ReportTask/Info",
					$TYPE : "get"
				};

				function err() {
					$com.app.tip('提交失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},
			getItems : function(data, fn, context) {
				var d = {
					$URI : "/ReportTask/InfoItems",
					$TYPE : "get"
				};

				function err() {
					$com.app.tip('提交失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},

			filter : function(item) {
				var _data = [],
					_list = [],
					_status = "";


				model._data = item;
				for (var p in item) {
					var o = KEYWORD[p];
					if (o) {
						_data[Number(o.index)] = {
							name : o.name,
							value : item[p] === "" ? "&nbsp;" : item[p]
						};
					}
				}
				_status = this.StatusText;

				return {
					data : _data,
					status : _status
				};
			},
			filterItems : function(data) {
				var _data = [];
				$(data).each(function() {
					_data.push({
						LineName : this.LineName,
						WorkShopName : this.WorkShopName,
						name : this.PartPointName,
						c1 : this.FQTY,
						c2 : this.FQTYGood,
						c3 : this.FQTYBad + this.FQTYReturn + this.FQTYDownGrade + this.FQTYScrap,
						c4 : this.ProductNo,
						id : this.ID,
						time : $com.util.format("yyyy-MM-dd hh:mm:ss", this.BGTime),
						state : this.status,
						status : STATUS[this.status],
						color : COLOUR[this.status]
					});
				});

				return _data;
			},

			render : function(data) {
				$(".m-detail-list").html($com.util.template(data.data, HTML.LIST));
			},
			renderItems : function(data) {

				$(".m-table").html($com.util.template(data, HTML.LIST2));

			}
		}
	});

	model.init();

});
//# sourceMappingURL=maps/info-99f3e89c3d.js.map