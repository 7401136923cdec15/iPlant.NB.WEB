require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {


	var model,
		HTML,
		BGModeText,
		ShiftText,
		ShiftCOLOUR;

	ShiftText = [ "上上班次", "上班次", "本班次", "下班次", "下下班次" ];

	ShiftCOLOUR = [ "text-grey", "text-red", "text-yellow", "text-blue", "text-grey" ];

	BGModeText = [ "未知", "流转报工", "自动流转", "检验报工", "流转检验" ];
	HTML = {
		LIST : [ '<div class="ms-group clearfix" data-id="{{iD}}"  data-no="{{deviceNo}}" data-mode="{{bGMode}}"  data-shift="{{shiftStatus}}">',
			'<div class="ms-col ms-col-f" >',
			'<div class="ms-limit" >',
			'<div class="ms-title"><span class="ms-field femi-rt">',
			'<span class="ms-text ms-margin">{{workShopName}}</span>',
			'<span class="ms-text ms-margin">{{lineName}}</span>',
			'</span><span>{{partPointName}}</span></div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field">',
			'<span class="ms-label">设备:</span><span class="ms-text">{{deviceNo}}</span>',
			'</span>',
			'<span class="ms-field">',
			'<span class="ms-label">人员:</span><span class="ms-text">{{operatorName}}</span>',
			'</span>',
			'<span class="ms-field">',
			'<span class="ms-text {{shiftcolor}}">{{shiftText}}</span>',
			'</span>',
			'</div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field">',
			'<span class="ms-label">模式:</span><span class="ms-text">{{bGModeText}}</span>',
			'</span>',
			'<span class="ms-field">',
			'<span class="ms-label"></span><span class="ms-text">{{productNo}}</span>',
			'</span>',
			'</div>',
			'</div></div>',
			'<div class="ms-col ms-col-l">',
			'<span class="ms-status {{color}}">{{statusText}}</span>',
			'</div>',
			'</div>' ].join("")
	};

	model = $com.Model.create({
		name : '报工任务',

		type : $com.Model.MAIN,

		configure : function() {
			this.run();
		},

		events : function() {
			
			var FilterNo = function(array, par) {
				var _list = [];
				$.each(array, function(i, item) {
					if (item.deviceNo && par && item.deviceNo == par)
						_list.push(item);
				});
				return _list;
			};
			
			$("#Filter").click(function() {

				if ($("#Filter").hasClass("Checking")) {
					$("#Filter").removeClass("Checking");
					$("#Filter").html("筛选");
					model.com.render(model._showData);
				} else {

					if (window.JSImpl) {
						window.QRTEST = function(str) {

							if (str == null || str.length <= 3) {
								alert("扫描的二维码不正确！");
								return false;
							}
							
							var  _dataList = FilterNo(model._showData, str);
 
							if (!_dataList || _dataList.length < 1) {
								alert("该设备对应任务不存在！！！");
								return;
							}
							$("#Filter").addClass("Checking");
							$("#Filter").html("全部");
							model.com.render(_dataList);
						};
						window.JSImpl.readQRCode('QRTEST');
					}
				}
			});
			

			$("body").delegate(".ms-group", "click", function() {
				var $this = $(this),
					id = $this.attr("data-id"),
					mode = $this.attr("data-mode"),
					shift = Number($this.attr("data-shift")),
					No = $this.attr("data-no");

				if (shift <= 0 || shift > 3) {
					return;
				}

				if (!No || No.length <= 3 || !window.JSImpl) {
					window.location = "check.html?id=" + id + "&type=" + $("#typeList").attr("data-type");
				} else {

					window.QRTEST = function(str) {
						if (str == No) {
							window.location = "check.html?id=" + id + "&type=" + $("#typeList").attr("data-type");
						} else {
							alert("此设备与任务不符，请核对！");
						}
					};
					window.JSImpl.readQRCode('QRTEST');

				}

			});
		},

		run : function() {
			var _shift_id = 0;
			var _person_judge = 0;
			if (window.JSImpl) {
				_shift_id = window._shift_id;
				_person_judge = window._person_judge;
			}

			this.com.getShift({}, function(data) {
				model._ShiftArray = data.list;
				model.com.get({
					position : $("#typeList").attr("data-position"),
					shift_id : _shift_id,
					person_judge : _person_judge,
					reportAll:1
				}, function(data) {
					model._showData = model.com.filter(data.list);
					model.com.render(model._showData);
				});
			});

		},

		com : {
			get : function(data, fn, context) {
				var d = {
					$URI : "/report_task/all",
					$TYPE : "get"
				};

				function err() {
					$com.app.tip('获取失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},
			getShift : function(data, fn, context) {
				var d = {
					$URI : "/shift/all",
					$TYPE : "get"
				};

				function err() {
					$com.app.tip('获取失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},

			filter : function(data) {
				var _data = [];
				$(data).each(function(i, item) {
					item.bGModeText = BGModeText[item.bGMode];
					var _cur = new Date();

					item.shiftStatus = -1;
					$.each(model._ShiftArray, function(shift_index, shift) {
						if (shift == item.shiftID)
							item.shiftStatus = shift_index;
					});

					if (item.shiftStatus == -1) {
						item.shiftText = "未知班次";

						item.shiftcolor = "text-grey";
					} else {
						item.shiftText = ShiftText[item.shiftStatus];

						item.shiftcolor = ShiftCOLOUR[item.shiftStatus];
					}

					if (item.fQTYDone >= item.fQTYShift) {
						item.color = "text-blue";
						item.statusText = "已完成";
					} else {
						item.color = "text-yellow";
						item.statusText = "未完成";
					}
				});
				_data = data;
				return _data;
			},


			render : function(data) {
				$(".m-table").html($com.util.template(data, HTML.LIST));
			}
		}
	});

	model.init();

});
//# sourceMappingURL=maps/list-847d2ef23f.js.map