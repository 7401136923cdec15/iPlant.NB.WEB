require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {


	var model,
		HTML,
		KEYWORD,
		KEYWORD_LIST,
		IsSubmit,STATUS;
	IsSubmit = false;
	STATUS = [ "送检中", "已收检", "已检验", "待收库", "已收库", "已收料", "已驳回", "待验收", "验收中" ];

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
		"FQTY|报工数", 
		"OperatorName|操作员",
		"InspectorName|收料员", 
		"BGTimeText|报工时间",
		"InspectTimeText|收料时间", 

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
 
			 
			$("body").delegate("#repair", "click", function() {
				
				if(model._data.detail.status>0)
					return;
				 
				if(window.JSImpl){
					window.QRTEST = function(id) {
						if (!id || id.length < 5) {
							alert("此料盒不符合设置标准！请重新扫描再试！");
							return;
						}
						
						var _qrList = GetQRList(model._data.detail.feedBoxID);

						if (_qrList.indexOf(Id) >= 0) { 
							window.location="info.html?id="+model.query.id;
						}else{
							alert("扫描料盒错误！");
						} 
						 
					};
					window.JSImpl.readQRCode('QRTEST');
				}else{
					 
					window.location="info.html?id="+model.query.id;
					
				}
				 
				
			});
			
			function GetQRList(qrString) {
				var _list = qrString.split(';'),
					qrStringList = [];

				for (var i = 0; i < _list.length; i++) {
					var _temp = _list[i].split(':');
					if (_temp.length != 2)
						continue;

					qrStringList.push(_temp[0]);
				}
				return qrStringList;
			}
			//保存提交 
		},

		run : function() {

		 
				this.com.get({
					id : model.query.id
				}, function(data) {
					model.com.render(model.com.filter(data.info));
					$(".tip-content").html(STATUS[data.info.detail.status]);
					if(data.info.detail.status>0)
						$("#repair").hide();
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



 
		}
	});

	model.init();

});
//# sourceMappingURL=maps/order-07ea1bf6f7.js.map