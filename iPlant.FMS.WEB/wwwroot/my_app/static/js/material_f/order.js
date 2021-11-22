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
		IsSubmit;

	IsSubmit = false;

	STOCKSTATUS = [ "合格", "报废", "回用", "工序废", "降级" ];
	STOCKSTATUS[10006] = "报废";
	STOCKSTATUS[225492] = "回用";
	STOCKSTATUS[225493] = "工序废";
	STOCKSTATUS[225494] = "降级";
	STOCKSTATUS[226962] = "合格";
	STOCKSTATUS[10000] = "合格料";
	current = "Status_Sent";

	STATUS = {
		"PointCheck_Unfinished" : "未完成",
		"PointCheck_Finished" : "已完成",
		"PointCheck_Unchecked" : "未检",
		"PointCheck_Checked" : "已检"
	};

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
		LIST2 : [ '<tr data-stockID="{{StockID}}"   data-qr="{{qr}}" data-stockLocID="{{StockLocID}}" >',
			'<td>{{D1}}</td>',
			'<td>{{D2}}</td>',
			'<td>{{D4}}</td>',
			'<td><input type="number"  data-stockID="{{StockID}}"  data-stockLocID="{{StockLocID}}" max="{{D3}}" min="0"   data-min="0"  data-max="{{D3}}"  placeholder="总数{{D3}}" readonly="readonly" /></td>',
			'</tr>' ].join(""),
		LIST3 : [ '<tr>',
			'<td>其他</td>',
			'<td></td>',
			'<td class="FQTYTd"></td>',
			'<td><input type="number"  placeholder="无法扫描" class="FQTYInput" min="0" /></td>',
			'</tr>' ].join(""),

		LIST4 : [ '<tr data-state="{{StateID}}" data-id="{{Id}}" class="tr-control">',
			'<td>{{D1}}</td>',
			'<td>{{D2}}</td>',
			'<td>{{D3}}</td>',
			'<td>{{D4}}</td>',
			'<td style="padding:3.5vw 2vw"><i class="icon icon-arrow-right icon-arrow-expand"></i></td>',
			'</tr>',
			'<tr data-state="{{StateID}}" data-id="{{Id}}" class="tr-sub">',
			'<td colspan="4" style="padding: 0vw 5vw ">',
			'<table>',
			'<thead>',
			'<tr>',
			'<th style="width: 33%;padding: 2vw 0vw;">料盒号</th>',
			'<th style="width: 33%;padding: 2vw 0vw;">剩余数</th>',
			'<th style="width: 33%;padding: 2vw 0vw;">取料总数</th>',
			'</tr>',
			'</thead>',
			'<tbody class="BoxTb">{{BoxList}}</tbody>',
			'</table>',
			'</td>',
			'</tr>' ].join(""),
		LIST5 : [ '<tr data-id="{{Id}}" data-bid="{{D1}}">',
			'<td class="BoxID"  data-state="{{State}}">{{D1}}</td>',
			'<td class="BoxCount">{{D2}}</td>',
			'<td class="TakeNum">{{D3}}</td>',
			'</tr>' ].join(""),
	//jion 将数组用什么连接在一起
	};

	KEYWORD_LIST = [
		"OrderID|订单编号",
		"WorkShopName|车间",
		"LineName|产线",
		"PartName|工序段",
		"PartPointName|工序",
		"DeviceNo|设备",
		"MaterialNo|物料号",
		"MaterialName|物料名称",
		"TaskName|圈别",
		"FQTYMargin|剩余数",
		"FQTYPlan|计划数",
		"FQTYBase|仓位计划数",
		"FQTYDone|已配料数",
		"PLOperatorName|配料员",
		"LLOperatorName|领料员"
	];

	KEYWORD_LIST2 = [
		"WorkShopName|车间",
		"LineName|产线",
		"PartName|工序段",
		"PartPointName|工序",
		"DeviceNo|设备",
		"MaterialNo|物料号",
		"MaterialName|物料名称",
		"FeedBoxID|料盒号",
		"FQTYPL|配料数",
		"PLOperatorName|配料员",
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

			$("#qr").text(model.query.qr);
		},

		events : function() {

			$(function() {
				$(".m-fixedBox").hide();
			});

			$("#back").click(function() {
				window.location = "info.html?id=" + model.query.id;
			});

			$("body").delegate("#confirm", "click", function() {
				model.com.addCheck();
			});
			$(".view-storage .m-left-area .m-btn").click(function() {
				setTimeout(function() {
					$(".view-storage").css("right", "100%");
				}, 100);
			});
			$("body").delegate("#scanBox", "click", function() {

				window.QRTEST = function(val) {

					var $this = $(".m-table-storageDetail .tbody-L .tr-sub .BoxTb tr[data-bid=" + val + "]");
					var $BoxID = $this.find(".BoxID"),
						$TakeNum = $this.find(".TakeNum"),
						$BoxCount = $this.find(".BoxCount"),
						BoxID = $BoxID.html(),
						TakeNum = $TakeNum.html(),
						BoxCount = $BoxCount.html(),
						StateText = STOCKSTATUS[Number($BoxID.attr("data-state"))];

					if (TakeNum < 1)
						TakeNum = BoxCount;


					if (BoxID == val) {
						$(".m-fixedBox").show();
						$(".m-fixedBox .scanShow .BoxID").html(BoxID);
						$(".m-fixedBox .scanShow .BoxState").html(StateText);
						$(".m-fixedBox .scanShow .BoxCount").html(BoxCount);
						$(".m-fixedBox .scanShow .TakeNum input").val(TakeNum);
					} else {
						alert("本仓位中没有此料盒！");
					}

				};
				window.JSImpl.readQRCode('QRTEST');
			})

			$("#confirmStorage").click(function() {

				var _val = 0,
					_$node = $(".view-order .m-table-storage table tbody tr");
				$.each(model._list[model._index].ItemShowList, function(mj, itemMS) {
					if (itemMS._boxList) {
						$.each(itemMS._boxList, function(si, itemS) {
							_val += itemS.d3
						});
					}
				});
				$(_$node[model._index]).find("td input").val(_val);
				var total = 0,
					$node = $("#count");
				$(".view-order .m-table-storage tr input").each(function(ij, itemIj) {
					total += Number($(itemIj).val());
				});
				$node.val(total);
				setTimeout(function() {
					$(".view-storage").css("right", "100%");
				}, 100);
			});

			$(".m-fixedBox").delegate(".scanShow .TakeNum input", "input", function(e) {
				var $this = $(this),
					$TakeNum = $this.parent(".TakeNum"),
					TakeNum = Number($this.val()),
					BoxCount = Number($TakeNum.siblings(".BoxCount").html());
				if (TakeNum < 0)
					$this.val(0);
				if (TakeNum > BoxCount)
					$this.val(BoxCount);

			});
			$("#confirmBox").click(function() {
				var $this = $(this),
					$scanShow = $this.parent("div").parent("div").siblings(".scanShow"),
					$BoxID = $scanShow.find(".BoxID"),
					$TakeNum = $scanShow.find(".TakeNum"),
					$BoxState = $scanShow.find(".BoxState"),
					BoxState = $.trim($BoxState.html()),
					BoxID = $.trim($BoxID.html()),
					TakeNum = Number($TakeNum.find("input").val()),

					IsNoError = true;

				$(".m-table-storageDetail .tr-sub .BoxTb  tr").each(function(i, item) {

					if ($.trim($(item).find(".BoxID").html()) != BoxID)
						return true;

					var $Sub = $(item).parents(".tr-sub"),
						$Control = $Sub.prev(".tr-control"),
						Mid = Number($Control.attr("data-id")),
						$NumCount = $Control.find("td").last().prev(),
						$itemNum = $(item).find(".TakeNum"),
						sid = Number($(item).attr("data-id")),
						itemNum = Number($itemNum.html()), //此料盒已取数
						val = Number($NumCount.html()), //当前取料总数
						count = Number($NumCount.prev().html()), //总数最大数   剩余数
						PlanVal = Number($NumCount.prev().prev().html());

					if (count < (val - itemNum + TakeNum) && !confirm("取料数大于仓位计划数,是否继续取料?")) {
						IsNoError = false;
						return;
					} else if ((PlanVal * 0.1 + count) < (val - itemNum + TakeNum)) {
						alert("取料数不能超出对应仓位计划数的10%!!");
						IsNoError = false;
						return;
					} else {
						$itemNum.html(TakeNum);
						$NumCount.html(val - itemNum + TakeNum);

						var _Mindex = -1,
							_Sindex = -1;
						$.each(model._list[model._index].ItemShowList, function(m, mts) {
							if (mts.id != Mid)
								return true;
							_Mindex = m;
							$.each(mts._boxList, function(n, nts) {
								if (nts.id == sid)
									_Sindex = n;
							});
						});
						model._list[model._index].ItemShowList[_Mindex].d4 = val - itemNum + TakeNum;
						model._list[model._index].ItemShowList[_Mindex]._boxList[_Sindex].d3 = TakeNum;

					}
				});
				if (IsNoError) {
					$(".m-fixedBox").hide();
					$(".m-fixedBox .scanShow .BoxID").html("");
					$(".m-fixedBox .scanShow .BoxState").html("");
					$(".m-fixedBox .scanShow .BoxCount").html("");
					$(".m-fixedBox .scanShow .TakeNum input").val("");
				}

			});


			$("#cancelBox").click(function() {
				$(".m-fixedBox").hide();
				$(".m-fixedBox .scanShow .BoxID").html("");
				$(".m-fixedBox .scanShow .BoxState").html("");
				$(".m-fixedBox .scanShow .BoxCount").html("");
				$(".m-fixedBox .scanShow .TakeNum input").val("");
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
			$(".m-table-storageDetail").delegate(".tr-sub .BoxTb tr", "click", function(e) {
				var $BoxID = $(this).find(".BoxID"),
					$TakeNum = $(this).find(".TakeNum"),
					$BoxCount = $(this).find(".BoxCount"),
					BoxID = $BoxID.html(),
					TakeNum = $TakeNum.html(),
					BoxCount = $BoxCount.html(),
					StateText = STOCKSTATUS[Number($BoxID.attr("data-state"))];

				if (TakeNum < 1)
					TakeNum = BoxCount;
				window.QRTEST = function(val) {
					//开启扫料盒二维码      val==BoxID
					if ( val==BoxID) {
						$(".m-fixedBox").show();
						$(".m-fixedBox .scanShow .BoxID").html(BoxID);
						$(".m-fixedBox .scanShow .BoxState").html(StateText);
						$(".m-fixedBox .scanShow .BoxCount").html(BoxCount);
						$(".m-fixedBox .scanShow .TakeNum input").val(TakeNum);
					} else {
						//alert("未知错误：料盒号为空");
						alert("扫描料盒与选中料盒不匹配！");
					}
				};
				window.JSImpl.readQRCode('QRTEST');


			});

			$("body .view-order").delegate(".m-table-storage tr input", "input", function() {
				var $this = $(this),
					$node = $("#count"),
					total = 0,
					max = Number($this.attr("data-max")),
					val = Number($.trim($this.val()));

				if (val < 0) {
					$this.val(0);
				}
				if (val > max) {
					$this.val(max);
				}

				$(".m-table-storage input").each(function() {
					total += Number($(this).val());
				});

				if (total > model._data.FQTYMargin) {
					val = model._data.FQTYMargin - (total - $this.val());
					$this.val(val);
					total = model._data.FQTYMargin;
				}
				$node.val(total);
				if ($this.attr("class") == "FQTYInput")
					return;

				$(".view-order .m-table-storage table tbody .FQTYTd").html(model._data.FQTYMargin - total);
				$(".view-order .m-table-storage table tbody .FQTYInput").attr("max", model._data.FQTYMargin - total);
				$(".view-order .m-table-storage table tbody .FQTYInput").attr("data-max", model._data.FQTYMargin - total);



			}).delegate(".m-table-storage tr input:not(.FQTYInput)", "click", function() {

				var $this = $(this),
					$tr = $this.parents("tr"),
					max = Number($this.attr("max")),
					qr = $tr.attr("data-qr");

				if (max <= 0) {
					alert("库存数量为" + max);
					return;
				}
				if (window.JSImpl) {
					window.QRTEST = function(val) {
						if (val == qr) {

							setTimeout(function() {
								$.each(model._list, function(i, item) {
									if (item.qr != qr)
										return true;
									for (var sj = 0; sj < item.ItemShowList.length; sj++) {
										item.ItemShowList[sj].boxList = $com.util.template(item.ItemShowList[sj]._boxList, HTML.LIST5);
									}
									$(".view-storage .m-tips .tip-content").html(qr);
									model.com.renderStorage(item.ItemShowList);
									model._index = i;
								});
								$(".view-storage").css("right", 0);
							}, 100);
						} else {

							alert("仓位不匹配");
						}
					};
					window.JSImpl.readQRCode('QRTEST');
				} else {
					setTimeout(function() {
						$.each(model._list, function(i, item) {
							if (item.qr != qr)
								return true;
							for (var sj = 0; sj < item.ItemShowList.length; sj++) {
								item.ItemShowList[sj].boxList = $com.util.template(item.ItemShowList[sj]._boxList, HTML.LIST5);
							}
							$(".view-storage .m-tips .tip-content").html(qr);
							model.com.renderStorage(item.ItemShowList);
							model._index = i;
						});
						$(".view-storage").css("right", 0);
					}, 100);
				}

			});

		},

		run : function() {
			this.com.get({
				task_id : model.query.id
			}, function(data) {

				data.info.eRPMaterialLocationList = data.list;
				data.info.locationPlanList = data.info.locationPlanList.wMSMaterialLocation;
				model.com.render(model.com.filter(data.info));

				$(".view-order .m-table-storage table tbody .FQTYTd").html(model._data.FQTYMargin);
				$(".view-order .m-table-storage table tbody .FQTYInput").attr("max", model._data.FQTYMargin);
				$(".view-order .m-table-storage table tbody .FQTYInput").attr("data-max", model._data.FQTYMargin);


			});

		},

		com : {
			get : function(data, fn, context) {
				var d = {
					$URI : "/MaterialTask/InfoDetail",
					$TYPE : "get"
				};

				function err() {
					$com.app.tip('获取失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},

			add : function(data, fn, context) {
				var d = {
					$URI : "/MaterialTask/Submit",
					$TYPE : "post"
				};

				function err() {
					$com.app.tip('提交失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},

			filter : function(data) {
				var _data = [],
					_list = [],

					_status = "";

				model._data = data;
				for (var p in data) {
					var o = KEYWORD[p];
					if (o) {
						_data[Number(o.index)] = {
							name : o.name,
							value : data[p] === "" ? "&nbsp;" : data[p]
						};
					}
				}

				$.each(data.locationPlanList, function(i, itemM) {
					var _index = -1,
						_Itemlist = [];

					_index = _list.findIndex(function(p) {
						if (itemM.LocationText == p.qr)
							return true;
						return false;
					});

					if (_index < 0) {
						_Itemlist[0] = itemM;
						_list.push({
							D1 : itemM.StockName,
							D2 : itemM.LocationName,
							D3 : 0, //itemM.fQTYKC,
							D4 : itemM.FQTYPL,
							StockID : itemM.StockID,
							StockLocID : itemM.LocationID,
							qr : itemM.LocationText,
							Itemlist : _Itemlist,
						});
					} else {
						_list[_index].D4 += itemM.FQTY;
						_list[_index].Itemlist.push(itemM);
					}

				});

				_list = model.com.filterStorage(_list);
				return {
					data : _data,
					list : _list,
				};
			},

			filter2 : function(item) {
				var _data = [],
					_list = [] /*,
				_status = item.StatusText*/ ;

				for (var p in item) {
					var o = KEYWORD2[p];
					if (o) {
						_data[Number(o.index)] = {
							name : o.name,
							value : item[p] === "" ? "&nbsp;" : item[p]
						};
					}
				}


				return {
					data : _data,
					list : _list,
				};
			},
			filterStorage : function(data) {
				var _list = [],
					_Nid = -1,
					_data = [];


				$.each(data, function(i, item) {
					var _storageList = [];
					_Nid = i;
					data[i].ItemShowList = [];
					if (!item.Itemlist)
						return true;


					_list = item.Itemlist;




					if (!_list.length) {
						alert("该仓位没有入库信息");
						return true;
					}

					$.each(model._data.eRPMaterialLocationList, function(m, itemM) {
						var _index = -1;
						$.each(_list, function(j, items) {
							if (itemM.itemID == items.ID)
								_index = j;
						})
						if (_index < 0)
							return true;

						if (data[i].D3)
							data[i].D3 += itemM.FQTYStock;
						else
							data[i].D3 = itemM.FQTYStock;

						if (!_list[_index].BoxList)
							_list[_index].BoxList = [];


						_list[_index].BoxList.push({
							ERPFlot_Text : itemM.ERPFlot_Text,
							Id : itemM.ERPFlot,
							State : itemM.StockStatus,
							D1 : itemM.FeedBoxText,
							D2 : itemM.FQTYStock,
							D3 : 0,
							FlotText : itemM.ERPFlot_Text,
							ItemID : itemM.ItemID
						});
					});

					$.each(_list, function(si, itemT) {


						data[i].ItemShowList.push({
							Id : itemT.ID,
							StateID : itemT.StockStatus,
							D1 : STOCKSTATUS[itemT.StockStatus],
							D2 : itemT.FQTYPL,
							D3 : itemT.FQTYKC,
							D4 : 0,
							_boxList : itemT.BoxList,
							boxList : $com.util.template(itemT.BoxList, HTML.LIST5)
						});
					})
					data[_Nid].ItemList = _list;
				});

				return data;

			},

			render : function(data) {
				$(".view-order .m-detail-list").append($com.util.template(data.data, HTML.LIST));
				model._list = data.list;
				$(".view-order .m-table-storage table tbody").html($com.util.template(data.list, HTML.LIST2));
			//$(".tip-content").html(data.status);
			},

			render2 : function(data) {
				$(".view-detail .m-detail-list").append($com.util.template(data.data, HTML.LIST));
			//$(".view-detail .tip-content").html(data.status);
			},
			renderStorage : function(data) {
				$(".view-storage .m-table-storageDetail table .tbody-L").html($com.util.template(data, HTML.LIST4));
			//$(".view-detail .tip-content").html(data.status);
			},

			Clone : function(obj) {
				var o;
				if (typeof obj == "object") {
					if (obj === null) {
						o = null;
					} else {
						if (obj instanceof Array) {
							o = [];
							for (var i = 0, len = obj.length; i < len; i++) {
								o.push(model.com.Clone(obj[i]));
							}
						} else {
							o = {};
							for (var j in obj) {
								o[j] = model.com.Clone(obj[j]);
							}
						}
					}
				} else {
					o = obj;
				}
				return o;
			},

			addCheck : function(e, close) {
				if (IsSubmit)
					return;
				var d = model._data,
					list = d.eRPMaterialLocationList,
					data = {
						list : [],
						data : {
							ID : 0,
							TaskID : model.query.id,
							LineID : d.LineID,
							LineName : d.LineName,
							WorkShopID : d.WorkShopID,
							WorkShopName : d.WorkShopName,
							PartID : d.PartID,
							PartName : d.PartName,
							PartPointID : d.PartPointID,
							PartPointName : d.PartPointName,
							DeviceID : d.DeviceID,
							DeviceNo : d.DeviceNo,
							MaterialNo : d.MaterialNo,
							MaterialName : d.MaterialName,
							FQTYPL : 0,
							FQTYLL : 0,
							FeedBoxID : "NoFeedBoxID",
							Status : 0,
						},
						entry_id : d.ERPEntryID
					},
					$node,
					val;

				$.each(list, function(i, item) {

					var _$node = $(".view-order .m-table-storage table tr[data-stockID=" + item.StockID + "][data-stockLocID=" + item.LocationID + "]"),
						_val,
						_max,
						_$ipt;

					if (!_$node[0]) {
						alert("无仓位信息数据失效");
						close();
						return;
					}

					if (!model._list)
						return true;
					$.each(model._list, function(mi, itemM) {
						if (!itemM.ItemShowList)
							return true;
						$.each(itemM.ItemShowList, function(mj, itemMS) {
							if (!itemMS._boxList)
								return true;
							$.each(itemMS._boxList, function(si, itemS) {
								if (itemS.ItemID != item.ItemID)
									return true;
								if (itemS.d3 <= 0)
									return true;
								var Datas = model.com.Clone(item);

								Datas.fQTY = itemS.d3;

								data.list.push(Datas);
							});
						});
					});
				});

				$node = $("#count");
				val = Number($node.val());

				data.data.fQTYPL = val;

				if (!val) {
					alert("配料数不能为0");
					return;
				}

				if (confirm("配料数：" + data.data.fQTYPL + "，请核对 ！\n提示：此单据提交后不可更改！")) {
					IsSubmit = true;
					model.com.add(data, [ function(res) {
						if (!res.info)
							res.info = data.data;
						model.com.render2(model.com.filter2(res.info));
						IsSubmit = false;
						alert("操作成功");
						setTimeout(function() {
							$(".view-detail").css("left", 0);
						}, 100);
					}, function() {
						close();
					} ]);
				} else {
					close();
				}
			}
		}
	});

	model.init();

});
//# sourceMappingURL=maps/order-4c841ff73a.js.map