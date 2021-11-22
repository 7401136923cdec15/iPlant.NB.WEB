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
		STOCKSTATUS,
		CKQR;

	CKQR = "";

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
		LIST1 : [ '<li>',
			'<label class="m-detail-title">{{name}}</label>',
			'<div class="m-detail-content text-blue">{{value}}</div>',
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
			'<th style="width: 32%;padding: 2vw 0vw;">料盒号</th>',
			'<th style="width: 32%;padding: 2vw 0vw;">状态</th>',
			'<th style="width: 32%;padding: 2vw 0vw;">数量</th>',
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
			'<td class="forward-td"><i class="icon icon-forward"></i></td>',
			'</tr>' ].join(""),
	};

	KEYWORD_LIST = [
		"FQTYTotal|入库总数",
		"MaterialNo|物料号",
		"FeedBoxFQTY|料盒容量",
		"FeedBoxs|仓位容量",
	];

	KEYWORD_LIST2 = [
		"WorkShopName|车间",
		"LineName|产线",
		"OrderNo|订单号",
		"PartName|工序段",
		"ProductNo|产品规格",
		"OperatorName|操作员",
		"BGTimeText|报工时间",
		"InspectorName|检验员",
		"InspectTimeText|检验时间",
		"ReceivingClerkName|入库员",
		"InStockTimeText|入库时间",
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


			$("#back").click(function() {
				if (model.query.id) {
					window.location = "info.html?id=" + model.query.id
				}
			});
			$(".view-storage .m-table-storage").delegate(".forward-td", "click", function(e) {
				//更改料盒状态
				var $this = $(this),
					$TrS = $this.parents(".table-tr-s"),
					$TbodyS = $TrS.parents(".tbody-m"),
					$TrM = $TbodyS.parents(".table-tr-m"),
					total = Number($TrS.attr("data-total")),
					status = STOCKSTATUS[Number($TrS.attr("data-state"))],
					ID = Number($TrS.attr("data-id")),
					BoxID = $TrS.attr("data-bid"),
					Sid = $TrM.attr("data-sid");

				if (!total) {
					alert("没有料的料盒不能入库！");
					return;
				}
				
				if(Sid!=CKQR)
				{
					window.QRTEST = function(qr) {
						if (!qr) {
							alert("仓位号不能为空")
							return false;
						}
						if (qr != Sid) {
							alert("仓位号不匹配！请确认后再试")
							return false;
						} 
						CKQR=qr; 
						 
					};
					window.JSImpl.readQRCode('QRTEST');
				}
				if(Sid!=CKQR)
					return false;

				if (!confirm("料盒:" + BoxID + "\n状态:" + status + "\n数量:" + total + "\n请确定上述信息是否正确？"))
					return;

				$.each(model._data.itemEntryList.wDWEntryInStockItem, function(i, item) {
					if (ID != item.ID)
						return true;
					item.status = 5;
					model.com.add({
						data : item
					}, function(res) {
						if (res.info.ID) {
							alert("此盒料入库成功");
							$TrS.remove();
							if (!$TbodyS.find(".table-tr-s")[0]) {
								$TrM.prev(".tr-control").remove();
								$TrM.remove();
							}
							if (!$(".m-table-storage tbody").find("tr")[0]) {
								model._data.status = 5;
								model.com.submit({
									data : model._data
								}, function() {
									window.location = "info.html?id=" + model.query.id;
								});
							}
						}
						else
							alert("此料盒入库失败,请重试或联系管理员");
					});
					return false;
				});
			});

			$(".m-table-storage").delegate("tr.tr-control", "click", function(e) {
				var $this = $(this),
					$expand = $this.find("td i.icon"),
					Sid = $this.attr("data-sid"),
					$Sub = $this.next("tr.tr-sub");
				if (!$Sub[0]) {
					alert("未知错误，请重试或联系管理员");
					return;
				}
				if ($expand.hasClass("icon-arrow-expand")) {

					if (!Sid || Sid == "" || $.isEmptyObject(Sid)) {
						$expand.removeClass("icon-arrow-expand");
						$Sub.hide();
						return;
					}
					//$expand.removeClass("icon-arrow-right");
					$expand.removeClass("icon-arrow-expand");
					//$expand.addClass("icon-scan");
					$Sub.hide();


				} else {
					if (!Sid || Sid == "" || $.isEmptyObject(Sid)) {
						$Sub.show();
						$expand.addClass("icon-arrow-expand");
						return;
					}

					//					window.QRTEST = function(qr) {
					//						if (!qr) {
					//							alert("仓位号不能为空")
					//							return;
					//						}
					//						if (qr != Sid) {
					//							alert("仓位号不匹配！请确认后再试")
					//							return;
					//						}
					$Sub.show();
					//$expand.addClass("icon-arrow-right");
					$expand.addClass("icon-arrow-expand");
					//$expand.removeClass("icon-scan");
				//					};
				//					window.JSImpl.readQRCode('QRTEST');
				}
			});

		},

		run : function() {


			this.com.get({
				id : model.query.id,
				rid : model.query.rid
			}, function(data) {
				model._data = data.info;

				if (data.info2) {
					$(".m-detail-list").html($com.util.template(model.com.filterDetail(data.info2), HTML.LIST));
				}

				model.com.render(model.com.filter(data.info));

				//$(".m-table-storage").find("tr.tr-control").each(function(i, item) {
				//	$(item).click();
				//});

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

			add : function(data, fn, context) {
				var d = {
					$URI : "/ReportStore/SubmitItem",
					$TYPE : "post"
				};

				function err() {
					$com.app.tip('提交失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},
			submit : function(data, fn, context) {
				var d = {
					$URI : "/ReportStore/Submit",
					$TYPE : "post"
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

				$.each(item.itemEntryList.wDWEntryInStockItem, function(index, itemM) {

					if (itemM.status != 3)
						return true;
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
							total : itemM.FQTY
						});
						_boxListString = $com.util.template(_boxList, HTML.LIST3);
						_list.push({
							sid : itemM.LocationText,
							d1 : itemM.StockName,
							d2 : itemM.LocationName,
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
			filterDetail : function(item) {
				var _data = [];
				item.BGTimeText = $com.util.format("yyyy-MM-dd hh:mm:ss", item.BGTime);

				item.InspectTimeText = $com.util.format("yyyy-MM-dd hh:mm:ss", item.InspectTime);

				item.InStockTimeText = $com.util.format("yyyy-MM-dd hh:mm:ss", item.InStockTime);

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
			render : function(data) {
				$(".view-storage .m-detail-list").append($com.util.template(data.data, HTML.LIST));
				$(".view-storage .m-table-storage table tbody").html($com.util.template(data.list, HTML.LIST2));
			},
		}
	});

	model.init();

});
//# sourceMappingURL=maps/order-4c841ff73a.js.map