require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {


	var model,
		HTML,
		KEYWORD,
		KEYWORD_LIST,
		IsSubmit;
	IsSubmit = false;

	HTML = {
		LIST : [ '<li>',
			'<label class="m-detail-title">{{name}}</label>',
			'<div class="m-detail-content">{{value}}</div>',
			'</li>' ].join(""),
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
		"OperatorName|操作员",
		"InspectorName|收料员",
		"BGTimeText|报工时间",
		"FQTY|报工数量"

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

			$("#back").click(function() {
				window.history.back();
			});

			$("body").delegate("#confirm", "click", function() {
				model.com.addCheck(5);
			});
			$("body").delegate("#reject", "click", function() {
				model.com.addCheck(6);
			});
			//保存提交

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
					$URI : "/ReportTask/ItemInfoDetail",
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


			filter : function(data) {
				var _data = [],
					_list = [];

				model._data = data;

				data.detail.BGTimeText = $com.util.format("yyyy-MM-dd hh:mm:ss", data.detail.BGTime);
				if (data.detail.InspectTime)
					data.detail.InspectTimeText = $com.util.format("yyyy-MM-dd hh:mm:ss", data.detail.InspectTime);

				if (data.detail.InStockTime)
					data.detail.InStockTimeText = $com.util.format("yyyy-MM-dd hh:mm:ss", data.detail.InStockTime);
				for (var p in data.detail) {
					var o = KEYWORD[p];
					if (o) {

						_data[Number(o.index)] = {
							name : o.name,
							value : data.detail[p] === "" ? "&nbsp;" : data.detail[p]
						};
					}
				}

				return {
					data : _data,
					list : _list
				};
			},

			render : function(data) {
				$(".m-c-body .m-detail-list").append($com.util.template(data.data, HTML.LIST));

			},




			addCheck : function(val) {

				if (IsSubmit)
					return;

				if (!val||(val!=5&&val!=6))
					return;

				var statusText="确认收料数量：" + model._data.detail.FQTY ;
				if(val==6) statusText="是否确定要驳回?"

				model._data.detailSubmits = [];


				if (confirm(statusText)) {
					IsSubmit = true;
					model._data.detail.InspectTime=new Date().getTime();
					model._data.detail.InStockTime=new Date().getTime();
					model._data.detail.status = val;
					model.com.add({
						data : model._data.detail,
						list : model._data.detailSubmits
					}, [ function(res) {
						IsSubmit = false;
						if (res.info.ID > 0) {
							alert("操作成功");
							window.location = "detail.html?id=" + res.info.ID;
						} else {
							alert("操作失败");
						}
					}, function() {
						IsSubmit = false;
					} ]);
				}

			}
		}
	});

	model.init();

});
//# sourceMappingURL=maps/order-07ea1bf6f7.js.map