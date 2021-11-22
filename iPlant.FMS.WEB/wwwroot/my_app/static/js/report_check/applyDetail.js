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
		IsSubmit,
		TaskSTATUS;

	IsSubmit = false;

	current = "Status_Sent";


	STATUS = [ "合格", "报废", "回用", "工序废", "降级" ];
	STATUS[10006] = "报废";
	STATUS[225492] = "回用";
	STATUS[225493] = "工序废";
	STATUS[225494] = "降级";
	STATUS[226962] = "合格";

	TaskSTATUS = [ "未完成", "待收库", "收库中", "已收库", "入库中", "已入库", "已驳回", "待验收", "验收中" ];
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
		LIST1 : [ '<li>',
			'<label class="m-detail-title">{{name}}</label>',
			'<div class="m-detail-content text-blue">{{value}}</div>',
			'</li>' ].join(""),
		LIST2 : [
			'<tr data-ppid="{{ppid}}" data-state="{{state}}" class="tr-control table-tr-m">',
			/*	'<td style="padding: 2.8vw 0vw;">{{ppName}}</td>',*/
			'<td >{{status}}</td>',
			'<td class="count-m">{{count}}</td>',
			'<td class="total-m">{{takeTotal}}</td>',
			'<td><i class="icon icon-arrow-right icon-arrow-expand"></i></td>',
			'</tr>',
			'<tr data-ppid="{{ppid}}" data-state="{{state}}"  class="tr-sub table-tr-m">',
			'<td colspan="5" style="padding: 0vw 2vw 0vw 5vw ">',
			'<table class="table-small">',
			'<thead>',
			'<tr class="table-tr-s">',
			'<th style="width: 45%;padding: 2vw 0vw;">料盒号</th>',
			'<th style="width: 55%;padding: 2vw 0vw;">装盒数量</th>',
			'</tr>',
			'</thead>',
			'<tbody class="tbody-m">{{boxList}}</tbody>',
			'</table>',
			'</td>',
			'</tr>' ].join(""),

		LIST3 : [ '<tr class="table-tr-s" data-bid="{{boxID}}" >',
			'<td  rowspan="2">{{boxID}}</td>',
			'<td class="onTotal">{{onTotal}}</td>',
			'</tr>',
			'<tr class="table-tr-s" data-bid="{{boxID}}" >',
			'<td class="remarkText"><input type="text"  style="width:48vw"   value="{{RemarkText}}" /></td>',
			'</tr>' ].join(""),
	};

	KEYWORD_LIST = [
		"PartName|工序段",
		"PartPointName|工序",
		"MaterialNo|物料号",
		"MaterialName|物料名称",
		"FeedBoxFQTY|料盒容量",
		"FQTYTotal|检验总数",
		"LoadedCount|已装盒数",
		"InspectorName|检验员",
		"WareKeeperName|收料员"
	];
	KEYWORD_LIST2 = [
		"WorkShopName|车间",
		"LineName|产线",
		"OrderNo|订单号",
		"ProductNo|产品规格",
	];
	KEYWORD = {};
	KEYWORD2 = {};

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
			KEYWORD_LIST2.forEach(function(item, i) {
				var detail = item.split("|");
				KEYWORD2[detail[0]] = {
					index : i,
					name : detail[1]
				};
			});
		},

		events : function() {

			$(".m-right-area").click(function() {
				if (IsSubmit)
					return;
				if ((model._data.status == 1 || model._data.status == 0) && confirm("请确定是否撤销单据！")) {
					IsSubmit = true;
					model.com.remove({
						rid : model.query.id,
					}, [ function(res) {
						IsSubmit = false;
						alert("撤销成功");
						window.location = "orderWriteDetail.html?id=" + model.query.id;
					}, function(err) {
						IsSubmit = false;
					} ]);
				}
				else
					alert("单据已被处理，不能进行操作！");
			});

			/*$("body").delegate("#back", "click", function() {
				window.location = "store.html?id=" + model.query.id;
			});*/
			$(".m-table-storage").delegate("tr.tr-control", "click", function(e) {
				var $this = $(this),
					$expand = $this.find("td i.icon"),
					stateID = $this.attr("data-state"),
					$Sub = $this.next("tr.tr-sub");
				if (!$Sub[0]) {
					alert("未知错误，请联系上级并反馈");
					return;
				}
				if ($expand.hasClass("icon-arrow-expand")) {
					$expand.removeClass("icon-arrow-expand");
					$Sub.hide();

				} else {
					$expand.addClass("icon-arrow-expand");
					$Sub.show();
				}
			});

		},

		run : function() {
			this.com.get({
				rid : model.query.id,
				id : model.query.id_I
			}, function(data) {

				if (data.info2.BGMode == 4) {
					$(".title-form").text("流转入库单");
				}

				if (data.info.Status == 0) {

					window.location = "apply.html?id=" + model.query.id; 
					return;
				}

				if (data.info2) {
					$(".view-storage .m-detail-list").html($com.util.template(model.com.filterDetail(data.info2), HTML.LIST1));
				}
				if (data.loaded) {
					data.info.LoadedCount = data.loaded;
				}
				if (!data.info.itemList || !data.info.itemList.wDWEntryInStockItem)
					data.info.itemList = {
						wDWEntryInStockItem : []
					};
				if (!data.info.itemEntryList || !data.info.itemEntryList.wDWEntryInStockItem)
					data.info.itemEntryList = {
						wDWEntryInStockItem : []
					};

				model.com.render(model.com.filter(data.info));
				$(".m-tips .tip-content").html(TaskSTATUS[data.info.Status]);

				if (data.info.Status != 8)
					$("#DivButton").hide();
				else
					$(".m-right-area").html("");

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
				for (var p in item) {
					var o = KEYWORD[p];
					if (o) {
						_data[Number(o.index)] = {
							name : o.name,
							value : item[p] === "" ? "&nbsp;" : item[p]
						};
					}
				}
				//itemList  待入库物料列表
				$.each(item.itemList.wDWEntryInStockItem, function(i, s_item) {

					var _boxList = [],
						_boxListString = "",
						LoadedCount = 0;

					$.each(item.itemEntryList.wDWEntryInStockItem, function(e_i, e_item) {
						if (s_item.PartPointID != e_item.PartPointID || s_item.StockStatus != e_item.StockStatus)
							return true;

						LoadedCount += e_item.FQTY;
						_boxList.push({
							boxID : e_item.FlotText,
							onTotal : e_item.FQTY,
							remarkText : e_item.RemarkText
						});
					});
					s_item.LoadedCount = LoadedCount;
					_boxListString = $com.util.template(_boxList, HTML.LIST3);
					_list.push({
						ppid : s_item.PartPointID,
						ppName : s_item.PartPointName,
						state : s_item.StockStatus,
						Status : STATUS[s_item.StockStatus],
						count : s_item.FQTY,
						takeTotal : LoadedCount,
						boxList : _boxListString
					});
				});

				return {
					data : _data,
					list : _list,
				};
			},
			filterDetail : function(item) {
				var _data = [];


				for (var p in item) {
					var o = KEYWORD2[p];
					if (o) {
						_data[Number(o.index)] = {
							name : o.name,
							value : item[p] === "" ? "&nbsp;" : item[p]
						};
					}
				}

				return _data;
			},
			remove : function(data, fn, context) {
				var d = {
					$URI : "/report_store/remove",
					$TYPE : "post"
				};

				function err() {
					$com.app.tip('提交失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},


			render : function(data) {
				$(".view-storage .m-detail-list").append($com.util.template(data.data, HTML.LIST));
				$(".view-storage .m-table-storage table tbody").html($com.util.template(data.list, HTML.LIST2));
			}
		}
	});

	model.init();

});
//# sourceMappingURL=maps/order-4c841ff73a.js.map