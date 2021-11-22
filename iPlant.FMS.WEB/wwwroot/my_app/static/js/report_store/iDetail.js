require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {


	var model,
		HTML,
		config,
		current,
		STATUS,
		COLOUR,
		KEYWORD,
		KEYWORD2,
		KEYWORD_LIST,
		KEYWORD_LIST2,
		STOCKSTATUS;

	current = "Status_Sent";


	STATUS = [ "未完成", "待收库", "收库中", "已收库", "入库中", "已入库" ];
	STOCKSTATUS = [ "合格", "报废", "回用", "工序废", "降级" ];
	STOCKSTATUS[10006] = "报废";
	STOCKSTATUS[225492] = "回用";
	STOCKSTATUS[225493] = "工序废";
	STOCKSTATUS[225494] = "降级";
	STOCKSTATUS[226962] = "合格";

	COLOUR = {
		"PointCheck_Unfinished" : "text-red",
		"PointCheck_Finished" : "",
		"PointCheck_Unchecked" : "text-red",
		"PointCheck_Checked" : ""
	};

	HTML = {
		LIST : [ '<li>',
			'<label class="m-detail-title">{{name}}</label>',
			'<div class="m-detail-content">{{value}}</div>',
			'</li>' ].join(""),

		LIST2 : [
			'<tr data-sid="{{sid}}"  class="tr-control table-tr-m">',
			'<td style="padding: 2.8vw 0vw;">{{d1}}</td>',
			'<td >{{d2}}</td>',
			'<td >{{d3}}</td>',
			'<td >{{d4}}</td>',
			'<td><i class="icon icon-arrow-right  icon-arrow-expand"></i></td>',
			'</tr>',
			'<tr data-sid="{{sid}}"   class="tr-sub table-tr-m">',
			'<td colspan="5" style="padding: 0vw 2vw 0vw 5vw ">',
			'<table class="table-small">',
			'<thead>',
			'<tr class="table-tr-s">',
			'<th style="width: 24%;padding: 2vw 0vw;">料盒号</th>',
			'<th style="width: 22%;padding: 2vw 0vw;">状态</th>',
			'<th style="width: 22%;padding: 2vw 0vw;">数量</th>',
			'<th style="width: 26%;padding: 2vw 0vw;">明细状态</th>',
			'<th style="width: 5%;padding: 2vw 2vw;"></th>',
			'</tr>',
			'</thead>',
			'<tbody class="tbody-m">{{boxList}}</tbody>',
			'</table>',
			'</td>',
			'</tr>' ].join(""),

		LIST3 : [ '<tr class="table-tr-s" data-id="{{id}}"  data-bid="{{boxID}}"  data-state="{{state}}" data-total="{{total}}" >',
			'<td >{{boxID}}</td>',
			'<td >{{status}}</td>',
			'<td >{{total}}</td>',
			'<td >{{itemStatus}}</td>',
			'<td ></td>',
			'</tr>' ].join(""),
	};


	KEYWORD_LIST = [

		"PartName|工序段",
		"WareKeeperName|收料员",
		"MaterialNo|物料号",
		"FeedBoxFQTY|料盒容量",
		"FeedBoxs|仓位容量",
		"FQTYTotal|入库总数",
		"SubmitTimeText|创建时间",
		"InStockTimeText|入库时间",
		"InspectorName|检验员",
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

			$(".m-table-storage").delegate("tr.tr-control", "click", function(e) {
				var $this = $(this),
					$expand = $this.find("td i.icon"),
					Sid = $this.attr("data-sid"),
					$Sub = $this.next("tr.tr-sub");
				if (!$Sub[0]) {
					alert("未知错误，请联系上级并反馈");
					return;
				}
				if ($expand.hasClass("icon-arrow-expand")) {
					$expand.removeClass("icon-arrow-expand");
					$Sub.hide();
				} else {
					$Sub.show();
					$expand.addClass("icon-arrow-expand");
				}
			});

		},

		run : function() {

			this.com.get({
			    ReportID: 0,
			    ID: 5384
			}, function(data) {
				model._data = data.info;
				model.com.render(model.com.filter(data.info));
				$(".m-table-storage").find("tr.tr-control").each(function(i, item) {
					$(item).click();
				});

			});

		},

		com : {
			get : function(data, fn, context) {
				var d = {
					$URI : "/ReportStore/Info",
					$TYPE : "get"
				};

				function err() {
					$com.app.tip('获取失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},
		


			filter : function(item) {
				var _data = [],
					_list = [],

					_status = ""; 
				
				model._data = item;
				 
				item.SubmitTimeText = $com.util.format("yyyy-MM-dd hh:mm:ss", item.SubmitTime);
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

				$.each(item.ItemList, function (index, itemM) {

					var _index = -1,
						_boxList = [],
						_boxListString = "";

					$.each(_list, function(i, itemS) {
						if (itemM.locationText == itemS.sid)
							_index = i;
					})

					if (_index >= 0) {
						_list[_index]._boxList.push({
							id : itemM.ID,
							boxID : itemM.FlotText,
							state : itemM.StockStatus,
							status : STOCKSTATUS[itemM.StockStatus],
							itemStatus : STATUS[itemM.status],
							total : itemM.FQTY
						});
						_list[_index].boxList = $com.util.template(_list[_index]._boxList, HTML.LIST3);
						_list[_index].d4 += itemM.FQTY;
					} else {
						_boxList.push({
							id : itemM.ID,
							boxID : itemM.FlotText,
							state : itemM.StockStatus,
							status : STOCKSTATUS[itemM.StockStatus],
							itemStatus : STATUS[itemM.status],
							total : itemM.FQTY
						});
						_boxListString = $com.util.template(_boxList, HTML.LIST3);
						_list.push({
							sid : itemM.LocationText,
							d1 : itemM.LocationName,
							d2 : itemM.StockName,
							d3 : itemM.LocationText,
							d4 : itemM.FQTY,
							_boxList : _boxList,
							boxList : _boxListString
						});

					}
				});

				return {
					data : _data,
					list : _list,
				};
			},

			render : function(data) {
				$(".view-storage .m-detail-list").html($com.util.template(data.data, HTML.LIST));
				$(".view-storage .m-table-storage table tbody").html($com.util.template(data.list, HTML.LIST2));
			},
		}
	});

	model.init();

});
//# sourceMappingURL=maps/order-4c841ff73a.js.map