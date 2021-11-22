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
		IsSubmit;

	IsSubmit = false;
	current = "Status_Sent";

	STATUS = [ "合格", "报废", "回用", "工序废", "降级" ];
	STATUS[10006] = "报废";
	STATUS[225492] = "回用";
	STATUS[225493] = "工序废";
	STATUS[225494] = "降级";
	STATUS[226962] = "合格";

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
			'<td >{{Status}}</td>',
			'<td class="count-m">{{count}}</td>',
			'<td class="total-m">{{takeTotal}}</td>',
			'<td><i class="icon icon-arrow-right icon-arrow-expand"></i></td>',
			'</tr>',
			'<tr data-ppid="{{ppid}}" data-state="{{state}}"  class="tr-sub table-tr-m">',
			'<td colspan="5" style="padding: 0vw 2vw 0vw 5vw ">',
			'<table class="table-small">',
			'<thead>',
			'<tr class="table-tr-s">',
			'<th style="width: 48%;padding: 2vw 0vw;">料盒号</th>',
			'<th style="width: 48%;padding: 2vw 0vw;">装盒数量|备注</th>',
			'<th style="width: 5%;padding: 2vw 2vw;" class="add-th"><i class="icon icon-add"></i></th>',
			'</tr>',
			'</thead>',
			'<tbody class="tbody-m">{{boxList}}</tbody>',
			'</table>',
			'</td>',
			'</tr>' ].join(""),

		LIST3 : [ '<tr class="table-tr-s" data-bid="{{boxID}}" >',
			'<td  rowspan="2">{{boxID}}</td>',
			'<td class="onTotal"><input type="number" min="0" style="width:48vw" placeholder="请输入数量"  value="{{onTotal}}" /></td>',
			'<td class="remove-td" rowspan="2"><i class="icon icon-remove"></i></td>',
			'</tr>',
			'<tr class="table-tr-s" data-bid="{{boxID}}" >',
			'<td class="remarkText"><input type="text"  style="width:48vw"  placeholder="请输入备注" value="{{RemarkText}}" /></td>',
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


			$("body").delegate("#SubmitStorage", "click", function(e) {
				model.com.submit(e);
			});
			$("body").delegate("#SaveStorage", "click", function(e) {
				model.com.save(e);
			});


			$(".view-storage .m-table-storageDetail").delegate(".add-th", "click", function(e) {
				//添加料盒

				var $this = $(this),
					$TableS = $this.parents(".table-small"),
					$TbodyS = $TableS.find(".tbody-m"),
					$TrM = $TableS.parents(".table-tr-m"),
					ppid = Number($TrM.attr("data-ppid")),
					state = Number($TrM.attr("data-state")),
					IsReturn = false;


				window.QRTEST = function(qr) {
					if (!qr) {
						alert("料盒号不能为空")
						return;
					}


					$.each(model._data.itemEntryList.wDWEntryInStockItem, function(i_e, item_e) {

						if (item_e.flotText != qr)
							return true;
						alert("该料盒已被装料\n请用空料盒");
						IsReturn = true;
						return false;

					});
					if (IsReturn)
						return;
					var _List = [];
					_List.push({
						boxID : qr,
						onTotal : 0,
						remarkText : ""
					});
					$TbodyS.append($com.util.template(_List, HTML.LIST3));

					$.each(model._data.itemList.wDWEntryInStockItem, function(i, item) {

						if (item.PartPointID != ppid || item.StockStatus != state)
							return true;

						model._data.itemEntryList.wDWEntryInStockItem.push({
							ERPEntryID : item.ERPEntryID,
							FlotText : qr,
							FQTY : 0,
							RemarkText:item.RemarkText,
							LocationID : item.LocationID,
							LocationName : item.LocationName,
							LocationText : item.LocationText,
							MaterialNo : item.MaterialNo,
							PartPointID : item.PartPointID,
							PartPointName : item.PartPointName,
							Status : 0,
							StockCode : item.StockCode,
							StockID : item.StockID,
							StockName : item.StockName,
							StockStatus : item.StockStatus,
							TaskID : item.TaskID,
							TaskPartPointItemID : item.TaskPartPointItemID,
						});
						return false;
					});

				};
				if (window.JSImpl) {
					window.JSImpl.readQRCode('QRTEST');
				} else {
					window.QRTEST("LH-02-00002");
				}

			});

			$(".view-storage .m-table-storageDetail").delegate(".remove-td", "click", function(e) {
				//移除料盒
				var $this = $(this),
					$TrS = $this.parents(".table-tr-s"),
					$TrS2= $TrS.next(".table-tr-s"),
					val = Number($TrS.find(".onTotal input").val()),
					$TrM = $TrS.parents(".table-tr-m"),
					BoxID = $TrS.attr("data-bid"),


					ppid = Number($TrM.attr("data-ppid")),
					state = Number($TrM.attr("data-state")),

					valState = Number($TrM.prev().find(".total-m").html());

				if (val) {
					alert("请将料盒中的料清空为0后再删除料盒");
					return;
				}

				valState = valState - val;


				$.each(model._data.itemList.wDWEntryInStockItem, function(i_l, item) {

					if (item.PartPointID != ppid || item.StockStatus != state)
						return true;

					item.loadedCount = valState;

					var i = -1;
					$.each(model._data.itemEntryList.wDWEntryInStockItem, function(index, item) {
						if (item.FlotText == BoxID)
							i = index;
					});

					if (i >= 0) {
						if (model._data.itemEntryList.wDWEntryInStockItem[i].ID > 0) {

							model.com.remove({
								id : model._data.itemEntryList.wDWEntryInStockItem[i].iD
							}, function(res) {
								$TrM.prev().find(".total-m").html(valState);
								model._data.itemEntryList.wDWEntryInStockItem.splice(i, 1);
								$TrS.remove();
								$TrS2.remove();
								model._data.loadedCount -= val;
							});
						} else {
							$TrM.prev().find(".total-m").html(valState);
							model._data.itemEntryList.wDWEntryInStockItem.splice(i, 1);
							$TrS.remove();
							$TrS2.remove();
							model._data.loadedCount -= val;
						}

					} else {
						alert("该料盒未找到！");
						$TrM.prev().find(".total-m").html(valState);
						$TrS.remove();
						$TrS2.remove();
						model._data.loadedCount -= val;

					}


				});


			});

			$(".view-storage .m-table-storageDetail").delegate(".table-tr-s .onTotal input", "input", function(e) {
				//数量修改
				var $this = $(this),
					val = Number($this.val()),
					$TrS = $this.parents(".table-tr-s"),
					$TrM = $TrS.parents(".table-tr-m"),

					BoxID = $TrS.attr("data-bid"),
					ppid = Number($TrM.attr("data-ppid")),
					state = Number($TrM.attr("data-state")),
					CountState = Number($TrM.prev().find(".count-m").html()),
					valState = Number($TrM.prev().find(".total-m").html()),
					remainVal = Number($(".m-tips .tip-content").html()),
					valPrev = 0,
					valAdd = 0;

				if (val < 0)
					val = 0;
				if (val > model._data.FeedBoxFQTY)
					val = model._data.FeedBoxFQTY ;

				var index_e = -1;
				$.each(model._data.itemEntryList.wDWEntryInStockItem, function(j, itemM) {
					if (itemM.FlotText != BoxID)
						return true;
					valPrev = itemM.FQTY ;
					valAdd = val - valPrev;
					index_e = j;

				});

				if (remainVal < valAdd) {
					valAdd = remainVal;
					val = valPrev + valAdd;
				}
				if (CountState < valState + valAdd) {
					valAdd = CountState - valState;
					val = valPrev + valAdd;
				}
				valState = valState + valAdd;
				//赋值

				$.each(model._data.itemList.wDWEntryInStockItem, function(i, item) {
					if (item.PartPointID != ppid || item.StockStatus != state)
						return true;
					item.loadedCount = valState;


				});
				model._data.itemEntryList.wDWEntryInStockItem[index_e].FQTY = val;

				//					
				$TrM.prev().find(".total-m").html(valState);

				$this.val(val);
				model._data.loadedCount += (val - valPrev);

				remainVal = remainVal - valAdd;
				$(".m-tips .tip-content").html(remainVal);
			});

			$(".view-storage .m-table-storageDetail").delegate(".table-tr-s .remarkText input", "input", function(e) {
				//数量修改
				var $this = $(this),
					$TrS = $this.parents(".table-tr-s"),
					BoxID = $TrS.attr("data-bid");
 
				$.each(model._data.itemEntryList.wDWEntryInStockItem, function(j, itemM) {
					if (itemM.FlotText != BoxID)
						return true;
 
					itemM.RemarkText = $this.val();
					return false;
				});

			});



			$(".m-table-storageDetail").delegate("tr.tr-control", "click", function(e) {
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

			$("body").delegate("#back", "click", function() {
				window.location = "orderWriteDetail.html?id=" + model.query.id;
			});
		},

		run : function() {


			this.com.get({
				rid : model.query.id
			}, function(data) {
				
				if (data.info2.BGMode == 4) {
					$(".title-form").text("流转入库");
				}
				
				if (data.info2) {
					$(".view-storage .m-detail-list").html($com.util.template(model.com.filterDetail(data.info2), HTML.LIST1));
				}
				data.info.loadedCount = 0;
				if (data.loaded) {
					data.info.loadedCount = data.loaded;
				}
				if (!data.info.FeedBoxFQTY) {
					data.info.FeedBoxFQTY = 600;
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
				$(".m-tips .tip-content").html(data.info.fQTYTotal - data.info.loadedCount);
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
					$URI : "/ReportStore/SubmitAll",
					$TYPE : "post"
				};

				function err() {
					$com.app.tip('提交失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},

			remove : function(data, fn, context) {
				var d = {
					$URI : "/ReportStore/RemoveItem",
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
							RemarkText : e_item.Remark
						});
					});
					s_item.loadedCount = LoadedCount;
					_boxListString = $com.util.template(_boxList, HTML.LIST3);
					_list.push({
						ppid : s_item.PartPointID,
						ppName : s_item.PartPointName,
						state : s_item.StockStatus,
						status : STATUS[s_item.StockStatus],
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

			render : function(data) {
				$(".view-storage .m-detail-list").append($com.util.template(data.data, HTML.LIST));
				$(".view-storage .m-table-storageDetail table tbody").html($com.util.template(data.list, HTML.LIST2));
			},

			save : function(e, close) {
				if (IsSubmit)
					return;


				if (model._data.status > 0 && (model._data.status != 6 && model._data.status != 7)) {

					alert("此单据已提交不可修改！");
					return;
				}

				if (model._data.loadedCount < 1) {
					alert("未装料，不能保存！");
					return;
				}

				IsSubmit = true;
				model._data.status = 0;
				model.com.add({
					data : model._data
				}, [ function(res) {
					IsSubmit = false;
					if (res.info.iD > 0) {
						model._data = res.info;

						alert("保存成功！");
					}
					else
						alert("保存失败！");
				}, function() {
					IsSubmit = false;
				} ]);

			},
			submit : function(e, close) {
				if (IsSubmit)
					return;
				if (model._data.loadedCount != model._data.FQTYTotal) {
					alert("料未装完，不能提交！");
					return;
				}



				if (model._data.status > 0) {
					alert("此单据已提交不可重复提交！");
					return;
				}
				if (!confirm("请确定是否提交\n提示：提交后不可更改"))
					return;
				IsSubmit = true;
				model._data.status = 1;

				model.com.add({
					data : model._data
				}, [ function(res) {
					IsSubmit = false;
					if (res.info.status > 0) {
						alert("提交成功")
						window.location = "applyDetail.html?id=" + model.query.id;

					} else
						alert("提交失败！");
				}, function() {
					IsSubmit = false;
				} ]);

			}
		}
	});

	model.init();

});
//# sourceMappingURL=maps/order-4c841ff73a.js.map