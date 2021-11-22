require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {


	var model,
		HTML,
		KEYWORD,
		KEYWORD_LIST,
		IsSubmit = false,
		STATUS;

	STATUS = [ "合格", "报废", "回用", "工序废", "降级" ];
	STATUS[10006] = "报废";
	STATUS[225492] = "回用";
	STATUS[225493] = "工序废";
	STATUS[225494] = "降级";
	STATUS[226962] = "合格";

	HTML = {
		LIST : [ '<li>',
			'<label class="m-detail-title">{{name}}</label>',
			'<div class="m-detail-content">{{value}}</div>',
			'</li>' ].join(""),

		LIST3 : [ '<tr class="table-tr-s" data-bid="{{qr}}" >',
			'<td >{{qr}}</td>',
			'<td >',
			'<select  class="wl_status" style="width:32vw;width: 20vw; height: 8vw; padding-left: 5.3vw; border: 1px solid #c7c7c7;">',
			'<option value="226962" {{selectG}} >合格</option>',
			'<option value="10006" {{selectB}} >报废</option>',
			'</select></td>',
			'<td class="onTotal"><input type="number" min="0"  style="width:32vw" placeholder="请输入数量"  value="{{total}}" /></td>',
			'<td class="remove-td"><i class="icon icon-remove"></i></td>',
			'</tr>' ].join(""),

		LIST4 : [ '<tr class="table-tr-s" data-bid="{{qr}}" >',
			'<td >{{qr}}</td>',
			'<td >总计</td>',
			'<td class="onTotal"><input type="number" min="0"  style="width:32vw" placeholder="请输入数量"  value="{{total}}" /></td>',
			'<td class="remove-td"><i class="icon icon-remove"></i></td>',
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
		"InspectorName|收料员",
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

				if (IsSubmit)
					return false;
				if (model._qrList && model._qrList.length > 0) {
					if (model._total && model._total > 0) {

						var _list = [];
						model._data.detail.FQTYGood = 0;
						model._data.detail.FQTYScrap = 0;
						for (var i = 0; i < model._qrList.length; i++) {
							if (model._qrList[i].status == 10006) {
								model._data.detail.FQTYScrap += model._qrList[i].total;
							} else {
								model._data.detail.FQTYGood += model._qrList[i].total;
							}
							_list.push(model._qrList[i].qr + ":" + model._qrList[i].status + ":" + model._qrList[i].total);
						}
						model._qr = _list.join(";");

						if (!confirm("报工数：" + model._total))
							return false;
						IsSubmit = true;

						model._data.detail.FeedBoxID = model._qr;
						model._data.detail.status = 0;
						model._data.detail.FQTY = model._total;
						model._data.detail.Remark = " ";
						model.com.add({
							data : model._data.detail,
						}, [ function(res) {
							IsSubmit = false;
							if (res.info.ID > 0) {
								alert("操作成功");

								if (model._data.detail.BGMode == 3 || model._data.detail.BGMode == 4) {
									window.location = "orderWrite.html?id=" + res.info.ID;
								} else {
									window.location = "bindDetail.html?id=" + res.info.ID;
								}
							} else {
								alert("操作失败");
							}
						}, function() {
							IsSubmit = false;
						} ]);



					} else {
						alert("料盒中的物料总数不能为0！");
					}
				} else {
					alert("未绑定料盒，请添加料盒！");
				}

			});


			$("#confirmAdd").click(function() {
				if (!model._qrList) {
					return false;
				}
				if (window.JSImpl) {
					window.QRTEST = function(val) {
						if (val && val.length > 5) {

							if (model._qrList.findIndex(function(element, index, array) {
									return element == val;
								}) >= 0) {
								alert("此料盒已被使用，请换一个料盒再试！");
								return false;
							}

							model._qrList.push({
								qr : val,
								total : 0,
								status : 226962,
								selectG : "Selected",
								selectB : ""
							});

							model.com.renderBox(model._qrList);
						} else {
							alert("此料盒号不符合设定标准，请重新扫描！");
						}
					};

					window.JSImpl.readQRCode('QRTEST');
				} else {

					model._qrList.push({
						qr : "LH-01-0001",
						total : 0,
						status : 226962,
						disabled : model._data.detail.BGMode != 1 ? "disabled" : "",
						selectG : "Selected",
						selectB : ""
					});
					model.com.renderBox(model._qrList);
				}

			});



			$("body .femi-tbody-box").delegate(".wl_status", "change", function(e) {

				var $this = $(this),
					$TrS = $this.parents(".table-tr-s"),
					val = Number($this.val()),
					BoxID = $TrS.attr("data-bid");


				var _index = model._qrList.findIndex(function(p) {
					if (BoxID == p.qr)
						return true;
				});

				if (_index >= 0) {
					model._qrList[_index].status = val;
					model._qrList[_index].selectB = val == 10006 ? "Selected" : "";
					model._qrList[_index].selectG = val == 226962 ? "Selected" : "";
				}

			});
			$("body .femi-tbody-box").delegate(".remove-td", "click", function(e) {
				//移除料盒
				var $this = $(this),
					$TrS = $this.parents(".table-tr-s"),
					val = Number($TrS.find(".onTotal input").val()),
					BoxID = $TrS.attr("data-bid");

				var _index = model._qrList.findIndex(function(p) {
					if (BoxID == p.qr)
						return true;
				});

				if (_index >= 0) {
					model._total -= val;
					model._qrList.splice(_index, 1);
				}

				$TrS.remove();
			});

			$("body .femi-tbody-box").delegate(".table-tr-s .onTotal input", "input", function(e) {
				//数量修改
				var $this = $(this),
					val = Number($this.val()),
					$TrS = $this.parents(".table-tr-s"),
					BoxID = $TrS.attr("data-bid");

				if (val < 0)
					val = 0;

				var _index = model._qrList.findIndex(function(p) {
					if (BoxID == p.qr)
						return true;
				});

				if (_index >= 0) {
					model._total -= model._qrList[_index].total;

					model._qrList[_index].total = val;

					model._total += val;
				}
			});

		},

		run : function() {

			model._qr = "";
			model._qrList = [];
			model._total = 0;

			if (model.query.DeviceNo) {
				this.com.getNew({
					task_id : model.query.id
				}, function(data) {

					model.com.render(model.com.filter(data.info));
				});
			} else {
				this.com.get({
					id : model.query.id
				}, function(data) {
					model.com.render(model.com.filter(data.info));

					model._qr = data.info.detail.FeedBoxID;
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
							total : Number(_temp[2]),
							status : Number(_temp[1]),
							selectG : Number(_temp[1]) == 226962 ? "Selected" : "",
							selectB : Number(_temp[1]) == 10006 ? "Selected" : ""
						});
						model._total += Number(_temp[2]);
					}
					model.com.renderBox(model._qrList);
				});
			}


			if (model._qr) {
				model._qrList = [];
				model._total = 0;
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
						total : Number(_temp[2]),
						status : Number(_temp[1]),
						selectG : Number(_temp[1]) == 226962 ? "Selected" : "",
						selectB : Number(_temp[1]) == 10006 ? "Selected" : ""
					});
					model._total += Number(_temp[2]);
				}
				model.com.renderBox(model._qrList);
			} else {
				model._qrList = [];
				model._qr = '';
				model._total = 0;
			}
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
					_list = [],
					_status = "";


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
				_status = this.StatusText;

				return {
					data : _data,
					status : _status
				};
			},

			render : function(data) {
				$(".m-detail-list").append($com.util.template(data.data, HTML.LIST));
			},

			renderBox : function(data) {

				if (model._data.detail.BGMode == 1) {
					$(".femi-tbody-box").html($com.util.template(data, HTML.LIST3));
				} else {
					$(".femi-tbody-box").html($com.util.template(data, HTML.LIST4));
				}
			}
		}
	});

	model.init();

});
//# sourceMappingURL=maps/apply-550758d159.js.map