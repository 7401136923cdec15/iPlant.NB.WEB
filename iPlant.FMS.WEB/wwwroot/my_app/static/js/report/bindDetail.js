require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {


	var model,
		HTML,
		KEYWORD,
		KEYWORD_LIST,
		STATUS,
		STATUS_Text;
	STATUS = [ "送检中", "已收检", "已检验", "待收库", "已收库", "已入库", "已驳回", "待验收", "验收中" ];

	STATUS_Text = [ "合格", "报废", "回用", "工序废", "降级" ];
	STATUS_Text[10006] = "报废";
	STATUS_Text[225492] = "回用";
	STATUS_Text[225493] = "工序废";
	STATUS_Text[225494] = "降级";
	STATUS_Text[226962] = "合格";
	
	HTML = {
		LIST : [ '<li>',
			'<label class="m-detail-title">{{name}}</label>',
			'<div class="m-detail-content">{{value}}</div>',
			'</li>' ].join(""),

		LIST3 : [ '<tr class="table-tr-s" data-bid="{{qr}}" >',
			'<td >{{qr}}</td>',
			'<td >{{StatusText}}</td>',
			'<td class="onTotal"><input type="number" min="0" style="width:48vw" placeholder="请输入数量"  readonly="true" value="{{total}}" /></td>',
			 
			'</tr>' ].join(""),
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
		"OperatorName|操作员",
		"BGTimeText|报工时间",
		"FQTY|报工总数",
		"InspectorName|收料员",
		"InspectTimeText|收料时间"
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

				window.location = "info.html?id=" + model.query.id;
			});

			$("#confirm").click(function() {

				if (data.info.detail.status == 0 || data.info.detail.status == 6) {
					window.location = "bind.html?id=" + model.query.id;
				} 

			});

		},

		run : function() {
			model._qrList = [];
			model._qr = '';
			model._total = 0;

			this.com.get({
				id : model.query.id
			}, function(data) {
				model.com.render(model.com.filter(data.info));
				$(".tip-content").html(STATUS[data.info.detail.status]);
				if (data.info.detail.status != 0 && data.info.detail.status != 6) {
					$("#confirm").hide();
				} 
 
				model._qr = data.info.detail.feedBoxID;
				var _list = model._qr.split(';');

				for (var i = 0; i < _list.length; i++) {
					var _temp = _list[i].split(':');
					if (_temp.length != 3)
						continue;
					if (isNaN(_temp[2]))
						_temp[2] = 0;
					if (isNaN(_temp[1]))
						_temp[1] = 226962;
					model._qrList.push({
						qr : _temp[0],
						status:	Number(_temp[1]),
						StatusText:STATUS_Text[	Number(_temp[1])],
						total : Number(_temp[1])
					});
					model._total += Number(_temp[1]);
				}
				model.com.renderBox(model._qrList);

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

			getNew : function(data, fn, context) {
				var d = {
					$URI : "/ReportTask/ItemInfoNew",
					$TYPE : "get"
				};

				function err() {
					$com.app.tip('获取失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},


			filter : function(data) {
				var _data = [],
					_list = [],
					_status = "";

				data.detail.BGTimeText = $com.util.format("yyyy-MM-dd hh:mm", data.detail.BGTime);
				if (data.detail.InspectTime)
					data.detail.InspectTimeText = $com.util.format("yyyy-MM-dd hh:mm", data.detail.InspectTime);
				if (data.detail.InStockTime)
					data.detail.InStockTimeText = $com.util.format("yyyy-MM-dd hh:mm", data.detail.InStockTime);


				model._data = data;

				for (var p in data.detail) {
					var o = KEYWORD[p];
					if (o) {

						_data[Number(o.index)] = {
							name : o.name,
							value : data.detail[p] === "" ? "&nbsp;" : data.detail[p]
						};
					}
				}


				return _data;
			},

			render : function(data) {
				$(".m-detail-list").append($com.util.template(data, HTML.LIST));
			},

			renderBox : function(data) {
				$(".femi-tbody-box").html($com.util.template(data, HTML.LIST3));
			}
		}
	});

	model.init();

});
//# sourceMappingURL=maps/apply-550758d159.js.map