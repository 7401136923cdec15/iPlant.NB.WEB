require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {


	var model,
		HTML,
		KEYWORD,
		KEYWORD_LIST,
		STATUS,
		IsSubmit;

	STATUS = [ "送检中", "已收检", "已检验", "待收库", "已收库", "已入库", "已驳回", "待验收", "验收中" ];

	IsSubmit = false;

	HTML = {
		LIST : [ '<li>',
			'<label class="m-detail-title">{{name}}</label>',
			'<div class="m-detail-content">{{value}}</div>',
			'</li>' ].join("")
	};

	KEYWORD_LIST = [
		"WorkShopName|车间",
		"LineName|产线",
		"OrderNo|订单号",
		"PartName|工序段",
		"PartPointName|工序",
		"MaterialNo|物料号",
		"MaterialName|物料名",
		"ProductNo|产品规格",
		"FeedBoxID|料盒号",
		"FQTY|报工数",
		"FQTYGood|合格数",
		"FQTYBad|工序废",
		"FQTYReturn|回用数",
		"FQTYDownGrade|降级数",
		"FQTYScrap|报废数",
		"LocationList|仓位号",
		"OperatorName|操作员",
		"InspectorName|检验员",
		"ReceivingClerkName|入库员",
		"BGTimeText|报工时间",
		"InspectTimeText|检验时间",
		"InStockTimeText|入库时间",
	 
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

			$(".Reject").click(function() {
				if (IsSubmit)
					return;
				if (model._data.status == 1 || model._data.status == 0) {
					IsSubmit = true;
					model._data.status = 6;
					model.com.add({
						data : model._data
					}, [ function(res) {
						IsSubmit = false;
						alert("驳回成功");
						window.location = "report.html";
					}, function(err) {
						IsSubmit = false;
					} ]);
				}
				else
					alert("单据未处于收检状态，不能进行驳回！");
			});
			$("#Check").click(function() {

				switch (model._data.status) {
				case 0:
					//修改单据状态成功后进入
					model._data.status = 1;
					model.com.add({
						data : model._data
					}, function(data) {
						window.location = "orderWriteDetail.html?id=" + model.query.id;
					});
					break;  
				default:
					window.location = "orderWriteDetail.html?id=" + model.query.id;
					break;
				}
			});

		},

		run : function() {

			this.com.get({
				id : model.query.id
			}, function(data) {

				model.com.render(model.com.filter(data.info));
			});

		},

		com : {
			get : function(data, fn, context) {
				var d = {
					$URI : "/ReportTask/ItemInfo",
					$TYPE : "get"
				};

				function err() {
					$com.app.tip('获取失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},
			add : function(data, fn, context) {

				var d = {
					$URI : "/ReportTask/Submit",
					$TYPE : "post"
				};

				function err() {
					$com.app.tip('提交失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},

			filter : function(item) {
				var _data = [],
					_status = "";



				model._data = item;
				_status = STATUS[item.status];
				item.BGTimeText = $com.util.format("yyyy-MM-dd hh:mm:ss", item.BGTime);
				if (item.InspectTime)
					item.InspectTimeText = $com.util.format("yyyy-MM-dd hh:mm:ss", item.InspectTime);

				if (item.InStockTime)
					item.InStockTimeText = $com.util.format("yyyy-MM-dd hh:mm:ss", item.InStockTime);
				

				for (var p in item) {
					var o = KEYWORD[p];

					if (o) {
						_data[Number(o.index)] = {
							name : o.name,
							value : item[p] === "" ? "&nbsp;" : item[p]
						};
					}
				}
				return {
					data : _data,
					status : _status
				};
			},

			render : function(data) {
				$("#listContent").html($com.util.template(data.data, HTML.LIST));
				$("#stateContent").html(data.status);
			}
		}
	});
	function test() {
	}
	model.init();

});
//# sourceMappingURL=maps/iDetail-ee519e261f.js.map