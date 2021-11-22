require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base' ], function($yang, $com) {

	var model,
		HTML,
		STATUS,
		COLOUR,
		RESULT,
		RESULTCOLOUR;


	STATUS = [ "未激活", "未检", "已检", "已关闭", "已超时", "待激活" ];

	RESULT = [ "未检", "合格", "不合格" ];


	RESULTCOLOUR = [ "text-grey", "text-green", "text-red" ];

	COLOUR = [ "text-grey", "text-yellow", "text-green", "text-grey", "text-red", "text-grey" ];

	HTML = {
		LIST : [ '<div class="ms-group clearfix" data-id="{{iD}}" data-check="{{status}}" data-iptType="{{taskType}}" data-iptVersion="{{moduleVersionID}}" data-no="{{deviceNo}}">',
			'<div class="ms-col ms-col-f">',
			'<div class="ms-limit"> ',
			'<div class="ms-title">',
			'<span class="ms-field femi-rt"> ',
			'<span class="ms-text ms-margin">{{workShopName}}</span>',
			'<span class="ms-text">{{lineName}}</span>',
			'</span> <span>{{partPointName}}{{times}}</span>',
			'</div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field"><span class="ms-label">设备:</span>',
			'<span class="ms-text">{{deviceNo}}</span></span>',
			'<span class="ms-field">',
			'<span class="ms-label">激活:</span> <span class="ms-text">{{activeTimeText}}</span>',
			'</span>',
			'</div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field">',
			'<span class="ms-text">{{partName}}</span></span>',
			'<span class="ms-field"><span class="ms-label">规格:</span>',
			'<span class="ms-text">{{productNo}}</span> </span>',
			'</div>',
			'</div>',
			'</div>',
			'<div class="ms-col ms-col-l">',
			'<span class="ms-status {{color}}">{{statusText}}</span>',
			'</div>',
			'</div>' ].join(""),
		LISTD : [ '<div class="ms-group clearfix" data-id="{{iD}}" data-check="{{status}}" data-iptType="{{taskType}}" data-iptVersion="{{moduleVersionID}}" data-no="{{deviceNo}}">',
			'<div class="ms-col ms-col-f">',
			'<div class="ms-limit"> ',
			'<div class="ms-title">',
			'<span class="ms-field femi-rt"> ',
			'<span class="ms-text ms-margin">{{workShopName}}</span>',
			'<span class="ms-text">{{lineName}}</span>',
			'</span> <span>{{partPointName}}</span>',
			'</div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field"><span class="ms-label">设备:</span>',
			'<span class="ms-text">{{deviceNo}}</span></span> <span class="ms-field">',
			'<span class="ms-label">提交:</span> <span class="ms-text">{{submitTimeText}}</span>',
			'</span>',
			'</div>',
			'<div class="ms-sub-title">',
			'<span class="ms-field">',
			'<span class="ms-text">{{partName}}</span></span>',
			'<span class="ms-field"><span class="ms-label">规格:</span>',
			'<span class="ms-text">{{productNo}}</span> </span>',
			'</div>',
			'</div>',
			'</div>',
			'<div class="ms-col ms-col-l">',
			'<span class="ms-status {{resultColor}}">{{resultText}}</span>',
			'</div>',
			'</div>' ].join(""),
	};

	model = $com.Model.create({
		name : 'iPlantApp',

		type : $com.Model.MAIN,

		configure : function() {
			this.run();
		},

		events : function() {


			$("#Filter").click(function() {

				if ($("#Filter").hasClass("Checking")) {
					$("#Filter").removeClass("Checking");
					$("#Filter").html("筛选");
					$(".m-table").html($com.util.template(model._showData, model._LIST));
				} else {

					if (window.JSImpl) {
						window.QRTEST = function(str) {

							if (str == null || str.length <= 3) {
								alert("扫描的二维码不正确！");
								return false;
							}
							
							var _list = [],
								_dataList = [],
								_HtmlType;

							_list = model._showData;
							_HtmlType = model._LIST;
							_dataList = FilterNo(_list, str);
							if (!_dataList || _dataList.length < 1) {
								alert("该设备未找到当前条件的任务");
								return;
							}
							$("#Filter").addClass("Checking");
							$("#Filter").html("全部");
							$(".m-table").html($com.util.template(_dataList, _HtmlType));
						};
						window.JSImpl.readQRCode('QRTEST');
					}

				}
			});

			function FilterNo(array, par) {
				var _list = [];
				$.each(array, function(i, item) {
					if (item.deviceNo && par && item.deviceNo == par)
						_list.push(item);
				});
				return _list;
			}

			$("body").delegate(".ms-group", "click", function() {
				var $this = $(this),
					id = $this.attr("data-id"),
					No = $this.attr("data-no"),
					status = Number($this.attr("data-check"));

				if (status == 2) {
					window.location = "detail.html?id=" + id;
				} else if (status == 1) {

					if (!No || No.length <= 3 || !window.JSImpl) {
						window.location = "check.html?id=" + id;
					} else {
						window.QRTEST = function(str) {
							if (str == No) {

								window.location = "check.html?id=" + id;
							} else {
								alert("此设备与任务不符，请核对！");
							}
						};
						window.JSImpl.readQRCode('QRTEST');
					}
				} else {
					alert(STATUS[status] + "任务不能操作！");
				}
			});
			$(".m-title .m-switch").delegate(".m-switch-btn:not(.active):not(.other)", "click", function() {
				var $this = $(this);

				var $sib = $this.siblings();

				$this.addClass("active");
				$sib.removeClass("active");


				$("#Filter").removeClass("Checking");
				$("#Filter").html("筛选");


				if ($this.next("a.m-switch-btn:not(.other)")[0]) {
					model._showData = model._data.list1;
					model._LIST = HTML.LIST;
					$(".m-table").html($com.util.template(model._data.list1, HTML.LIST));
				} else {
					model._showData = model._data.list2;
					model._LIST = HTML.LISTD;
					$(".m-table").html($com.util.template(model._data.list2, HTML.LISTD));
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
			if (model.query.status) {
				var $active = $(".m-title .m-switch .m-switch-btn.active:not(.other)");
				$active.removeClass("active");
				$active.next("a.m-switch-btn:not(.other)").addClass("active");
			}
			this.com.get({
				operator_id : 0,
				shift_id : _shift_id,
				type : $("#typeList").attr("data-type"),
				person_judge : _person_judge
			}, function(data) {
				model.com.render(model.com.filter(data.list));
				if (model.query.status) {
					model._showData = model._data.list2;
					model._LIST = HTML.LISTD;
					$(".m-table").html($com.util.template(model._data.list2, HTML.LISTD));
				}
			});
		},

		com : {
			get : function(data, fn, context) {
				var d = {
					$URI : "/patrol_check/all",
					$TYPE : "get"
				};

				function err() {
					$com.app.tip('获取失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},

			filter : function(data) {
				var _data = {
					list1 : [],
					list2 : []
				};
				$.each(data, function(i, item) {

					item.activeTimeText = $com.util.format("yyyy-MM-dd hh:mm", item.activeTime);
					item.submitTimeText = $com.util.format("yyyy-MM-dd hh:mm", item.submitTime);

					item.statusText = STATUS[item.status];
					item.color = COLOUR[item.status];

					item.resultColor = RESULTCOLOUR[item.result];
					item.resultText = RESULT[item.result];

					if (this.status == 2) {
						_data.list2.push(item);
					} else {
						_data.list1.push(item);
					}
				});
				return _data;
			},

			render : function(data) {
				model._data = data;
				model._showData = data.list1;
				model._LIST = HTML.LIST;
				$(".m-table").html($com.util.template(data.list1, HTML.LIST));
			}
		}
	});

	model.init();

});
//# sourceMappingURL=maps/list-935a949efd.js.map